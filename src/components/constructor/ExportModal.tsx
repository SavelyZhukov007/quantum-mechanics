import { useState } from 'react'
import type { Block } from '../../types/constructor'
import { generateProjectFiles } from '../../utils/generateProject'
import styles from './ExportModal.module.css'

interface Props {
    blocks: Block[]
    noteTitle: string
    onClose: () => void
}

type ExportStep = 'idle' | 'generating' | 'done' | 'error'

export function ExportModal({ blocks, noteTitle, onClose }: Props) {
    const [step, setStep] = useState<ExportStep>('idle')
    const [errorMsg, setErrorMsg] = useState('')

    // md5 реализация (простая, без библиотеки)
    const slugify = (s: string) => s.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9а-яё-]/gi, '').slice(0, 40)

    const handleExport = async () => {
        if (blocks.length === 0) {
            setErrorMsg('Добавьте хотя бы один блок перед экспортом')
            setStep('error')
            return
        }

        setStep('generating')
        setErrorMsg('')

        try {
            // Генерируем ZIP-архив с проектом в браузере
            const { default: JSZip } = await import('jszip')
            const zip = new JSZip()

            const projectName = slugify(noteTitle) || 'my-note'
            // md5 от названия (используем crypto API для браузера)
            const encoder = new TextEncoder()
            const data = encoder.encode(noteTitle)
            const hashBuffer = await crypto.subtle.digest('SHA-256', data)
            const hashArray = Array.from(new Uint8Array(hashBuffer))
            const folderName = hashArray.slice(0, 8).map(b => b.toString(16).padStart(2, '0')).join('')

            const files = generateProjectFiles(blocks, noteTitle, projectName)

            const root = zip.folder(folderName)!

            for (const [path, content] of Object.entries(files)) {
                if (typeof content === 'string') {
                    root.file(path, content)
                } else {
                    // base64 данные (для картинок)
                    const [, b64] = (content as string).split(',')
                    root.file(path, b64, { base64: true })
                }
            }

            // Сохраняем JSON конспекта
            root.file('note-data.json', JSON.stringify({ title: noteTitle, blocks }, null, 2))

            const blob = await zip.generateAsync({ type: 'blob' })
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `${folderName}.zip`
            a.click()
            URL.revokeObjectURL(url)

            setStep('done')
        } catch (e) {
            console.error(e)
            setErrorMsg('Ошибка при генерации: ' + String(e))
            setStep('error')
        }
    }

    return (
        <div className={styles.overlay} onClick={e => { if (e.target === e.currentTarget) onClose() }}>
            <div className={styles.modal}>
                <button className={styles.close} onClick={onClose}>✕</button>

                <h2 className={styles.title}>Экспорт конспекта</h2>

                {step === 'idle' && (
                    <>
                        <div className={styles.info}>
                            <div className={styles.infoRow}>
                                <span>Название:</span>
                                <strong>{noteTitle}</strong>
                            </div>
                            <div className={styles.infoRow}>
                                <span>Блоков:</span>
                                <strong>{blocks.length}</strong>
                            </div>
                        </div>

                        <div className={styles.description}>
                            <p>Будет создан ZIP-архив, содержащий готовый React+Vite проект:</p>
                            <ul>
                                <li>📁 Папка названа по SHA-256 от названия конспекта</li>
                                <li>⚛️ React + Vite + TypeScript</li>
                                <li>📦 Всё скомпилируется в <code>index.html</code> (singlefile)</li>
                                <li>🗜 Картинки сжаты плагином vite-plugin-imagemin</li>
                                <li>💾 Исходные данные конспекта в <code>note-data.json</code></li>
                            </ul>
                            <p className={styles.commandHint}>
                                После распаковки: <code>npm i && npm run build</code>
                            </p>
                        </div>

                        <button className={styles.exportBtn} onClick={handleExport}>
                            ⬇ Скачать проект (ZIP)
                        </button>
                    </>
                )}

                {step === 'generating' && (
                    <div className={styles.loading}>
                        <div className={styles.spinner} />
                        <p>Генерируем файлы проекта...</p>
                    </div>
                )}

                {step === 'done' && (
                    <div className={styles.success}>
                        <div className={styles.successIcon}>✅</div>
                        <p>Архив скачан!</p>
                        <p className={styles.successSub}>Распакуйте ZIP, перейдите в папку и выполните:</p>
                        <code className={styles.code}>npm install && npm run build</code>
                        <p className={styles.successSub}>Готовый сайт будет в папке <code>build/</code></p>
                        <button className={styles.closeBtn} onClick={onClose}>Закрыть</button>
                    </div>
                )}

                {step === 'error' && (
                    <div className={styles.error}>
                        <p>❌ {errorMsg}</p>
                        <button className={styles.retryBtn} onClick={() => setStep('idle')}>← Назад</button>
                    </div>
                )}
            </div>
        </div>
    )
}
