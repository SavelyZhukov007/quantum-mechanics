import { useState, useCallback } from 'react'
import { ConstructorSidebar } from '../components/constructor/ConstructorSidebar'
import { ConstructorCanvas } from '../components/constructor/ConstructorCanvas'
import { ConstructorPreview } from '../components/constructor/ConstructorPreview'
import { ExportModal } from '../components/constructor/ExportModal'
import type { Block } from '../types/constructor'
import styles from './Constructor.module.css'

export type ViewMode = 'edit' | 'preview'

export default function Constructor() {
    const [blocks, setBlocks] = useState<Block[]>([])
    const [noteTitle, setNoteTitle] = useState('Мой конспект')
    const [viewMode, setViewMode] = useState<ViewMode>('edit')
    const [showExport, setShowExport] = useState(false)
    const [selectedId, setSelectedId] = useState<string | null>(null)

    const addBlock = useCallback((type: Block['type']) => {
        const id = crypto.randomUUID()
        const defaults: Record<Block['type'], Partial<Block>> = {
            header: { content: 'Новый заголовок', level: 2 },
            theory: { content: 'Введите текст теоретического блока...' },
            python: { content: '# Ваш код здесь\nprint("Hello, quantum world!")', title: 'script.py', description: '' },
            image: { src: '', caption: '', alt: '' },
            animation: { animType: 'wave', params: { amplitude: 50, frequency: 1, speed: 1 } },
            exercise: { question: 'Условие задачи', answer: 'Ответ', explanation: 'Пояснение' },
            divider: {},
        }
        const newBlock: Block = { id, type, ...defaults[type] } as Block
        setBlocks(prev => [...prev, newBlock])
        setSelectedId(id)
    }, [])

    const updateBlock = useCallback((id: string, updates: Partial<Block>) => {
        setBlocks(prev => prev.map(b => b.id === id ? { ...b, ...updates } : b))
    }, [])

    const deleteBlock = useCallback((id: string) => {
        setBlocks(prev => prev.filter(b => b.id !== id))
        setSelectedId(null)
    }, [])

    const moveBlock = useCallback((id: string, direction: 'up' | 'down') => {
        setBlocks(prev => {
            const idx = prev.findIndex(b => b.id === id)
            if (idx === -1) return prev
            const next = [...prev]
            const swap = direction === 'up' ? idx - 1 : idx + 1
            if (swap < 0 || swap >= next.length) return prev
            ;[next[idx], next[swap]] = [next[swap], next[idx]]
            return next
        })
    }, [])

    const duplicateBlock = useCallback((id: string) => {
        setBlocks(prev => {
            const idx = prev.findIndex(b => b.id === id)
            if (idx === -1) return prev
            const original = prev[idx]
            const copy = { ...original, id: crypto.randomUUID() }
            const next = [...prev]
            next.splice(idx + 1, 0, copy)
            return next
        })
    }, [])

    return (
        <div className={styles.root}>
            {/* Top bar */}
            <header className={styles.topbar}>
                <div className={styles.topLeft}>
                    <div className={styles.logo}>
                        <span className={styles.logoIcon}>⚡</span>
                        <span className={styles.logoText}>NoteForge</span>
                    </div>
                    <div className={styles.titleWrap}>
                        <input
                            className={styles.titleInput}
                            value={noteTitle}
                            onChange={e => setNoteTitle(e.target.value)}
                            placeholder="Название конспекта"
                        />
                    </div>
                </div>
                <div className={styles.topRight}>
                    <div className={styles.viewToggle}>
                        <button
                            className={`${styles.toggleBtn} ${viewMode === 'edit' ? styles.active : ''}`}
                            onClick={() => setViewMode('edit')}
                        >
                            ✏️ Редактор
                        </button>
                        <button
                            className={`${styles.toggleBtn} ${viewMode === 'preview' ? styles.active : ''}`}
                            onClick={() => setViewMode('preview')}
                        >
                            👁 Превью
                        </button>
                    </div>
                    <button className={styles.exportBtn} onClick={() => setShowExport(true)}>
                        Экспорт →
                    </button>
                </div>
            </header>

            <div className={styles.workspace}>
                {viewMode === 'edit' ? (
                    <>
                        {/* Left sidebar: block palette */}
                        <ConstructorSidebar onAddBlock={addBlock} />

                        {/* Main canvas */}
                        <ConstructorCanvas
                            blocks={blocks}
                            selectedId={selectedId}
                            onSelect={setSelectedId}
                            onUpdate={updateBlock}
                            onDelete={deleteBlock}
                            onMove={moveBlock}
                            onDuplicate={duplicateBlock}
                            noteTitle={noteTitle}
                        />
                    </>
                ) : (
                    <ConstructorPreview blocks={blocks} noteTitle={noteTitle} />
                )}
            </div>

            {showExport && (
                <ExportModal
                    blocks={blocks}
                    noteTitle={noteTitle}
                    onClose={() => setShowExport(false)}
                />
            )}
        </div>
    )
}
