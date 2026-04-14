import { useState, useEffect, useRef } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import type { Block, HeaderBlock, TheoryBlock, PythonBlock, ImageBlock, AnimationBlock, ExerciseBlock } from '../../types/constructor'
import styles from './ConstructorPreview.module.css'

interface Props {
    blocks: Block[]
    noteTitle: string
}

// Превью полностью использует те же компоненты, что и финальный конспект
// (TheoryBlock, PythonBlock, SectionHeader из существующего проекта)
// Здесь — независимые реализации, стилизованные под тот же дизайн

export function ConstructorPreview({ blocks, noteTitle }: Props) {
    return (
        <div className={styles.preview}>
            <div className={styles.inner}>
                <header className={styles.pageHeader}>
                    <h1 className={styles.pageTitle}>{noteTitle || 'Без названия'}</h1>
                    <div className={styles.headerLine} />
                </header>

                {blocks.length === 0 ? (
                    <div className={styles.empty}>Нет блоков для отображения</div>
                ) : (
                    <div className={styles.blocks}>
                        {blocks.map(block => (
                            <PreviewBlock key={block.id} block={block} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

function PreviewBlock({ block }: { block: Block }) {
    switch (block.type) {
        case 'header': return <PreviewHeader block={block} />
        case 'theory': return <PreviewTheory block={block} />
        case 'python': return <PreviewPython block={block} />
        case 'image': return <PreviewImage block={block} />
        case 'animation': return <PreviewAnimation block={block} />
        case 'exercise': return <PreviewExercise block={block} />
        case 'divider': return <hr className={styles.divider} />
        default: return null
    }
}

function PreviewHeader({ block }: { block: HeaderBlock }) {
    const Tag = `h${block.level}` as 'h1' | 'h2' | 'h3'
    return <Tag className={styles[`h${block.level}`]}>{block.content}</Tag>
}

// Простой inline Markdown: **bold**, _italic_, `code`
function renderMarkdown(text: string) {
    const parts = text.split(/(\*\*[^*]+\*\*|_[^_]+_|`[^`]+`)/g)
    return parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**'))
            return <strong key={i} style={{ color: 'var(--accent)' }}>{part.slice(2, -2)}</strong>
        if (part.startsWith('_') && part.endsWith('_'))
            return <em key={i}>{part.slice(1, -1)}</em>
        if (part.startsWith('`') && part.endsWith('`'))
            return <code key={i} style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent3)', background: 'rgba(77,217,255,0.1)', padding: '0 4px', borderRadius: 4 }}>{part.slice(1, -1)}</code>
        return part
    })
}

function PreviewTheory({ block }: { block: TheoryBlock }) {
    return (
        <div className={`${styles.theory} ${block.highlight ? styles.theoryHighlight : ''}`}>
            {block.content.split('\n\n').map((para, i) => (
                <p key={i}>{renderMarkdown(para)}</p>
            ))}
        </div>
    )
}

function PreviewPython({ block }: { block: PythonBlock }) {
    const [copied, setCopied] = useState(false)

    return (
        <div className={styles.pythonBlock}>
            <div className={styles.pythonHeader}>
                <div className={styles.dots}>
                    <span style={{ background: '#ff5f57' }} />
                    <span style={{ background: '#febc2e' }} />
                    <span style={{ background: '#28c840' }} />
                </div>
                <span className={styles.langTag}>Python</span>
                {block.title && <span className={styles.pythonTitle}>{block.title}</span>}
                <button
                    className={styles.copyBtn}
                    onClick={() => { navigator.clipboard.writeText(block.content); setCopied(true); setTimeout(() => setCopied(false), 2000) }}
                >
                    {copied ? '✓ Скопировано' : 'Копировать'}
                </button>
            </div>
            {block.description && <p className={styles.pythonDesc}>{block.description}</p>}
            <SyntaxHighlighter
                language="python"
                style={vscDarkPlus}
                customStyle={{ margin: 0, padding: '20px 24px', background: 'transparent', fontSize: 13, fontFamily: 'var(--font-mono)', lineHeight: 1.7 }}
                showLineNumbers
                lineNumberStyle={{ color: 'rgba(150,150,180,0.3)', minWidth: '2.5em' }}
            >
                {block.content}
            </SyntaxHighlighter>
        </div>
    )
}

function PreviewImage({ block }: { block: ImageBlock }) {
    if (!block.src) return (
        <div className={styles.imageMissing}>⚠ Изображение не загружено</div>
    )
    return (
        <figure className={styles.imageFigure}>
            <img
                src={block.src}
                alt={block.alt}
                className={styles.image}
                style={{
                    objectFit: block.fit ?? 'cover',
                    borderRadius: block.borderRadius ?? 8,
                    filter: `brightness(${block.brightness ?? 100}%) contrast(${block.contrast ?? 100}%)`,
                }}
            />
            {block.caption && <figcaption className={styles.figcaption}>{block.caption}</figcaption>}
        </figure>
    )
}

// Анимации для превью (те же что в оригинальном проекте)
function PreviewAnimation({ block }: { block: AnimationBlock }) {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')!
        const W = canvas.width, H = canvas.height
        let frame = 0
        let raf: number
        const p = block.params

        const draw = () => {
            ctx.clearRect(0, 0, W, H)
            const t = frame * 0.03 * (p.speed ?? 1)
            const amp = ((p.amplitude ?? 50) / 100) * (H * 0.4)

            if (block.animType === 'wave') {
                // Несколько волн с разными фазами
                for (let w = 0; w < 3; w++) {
                    ctx.beginPath()
                    for (let x = 0; x < W; x++) {
                        const y = H / 2 + amp * Math.sin((x / W) * Math.PI * (4 + w) + t + w * 1.2)
                        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
                    }
                    ctx.strokeStyle = ['rgba(123,140,255,0.8)', 'rgba(176,111,255,0.5)', 'rgba(77,217,255,0.3)'][w]
                    ctx.lineWidth = 2 - w * 0.5
                    ctx.stroke()
                }
            } else if (block.animType === 'particles') {
                const count = p.count ?? 30
                for (let i = 0; i < count; i++) {
                    const px = (Math.sin(t * 0.7 + i * 1.3) * 0.5 + 0.5) * W
                    const py = (Math.cos(t * 0.5 + i * 0.9) * 0.5 + 0.5) * H
                    const r = 2 + Math.sin(t + i) * 1.5
                    ctx.beginPath(); ctx.arc(px, py, r, 0, Math.PI * 2)
                    ctx.fillStyle = ['#7b8cff', '#b06fff', '#4dd9ff', '#4dffb0'][i % 4]
                    ctx.fill()
                }
            } else if (block.animType === 'heisenberg') {
                for (let i = 0; i < 3; i++) {
                    const sx = 30 + 20 * Math.sin(t + i * 2.1)
                    const sp = 1 / (sx * 0.012)
                    const cx = W * 0.25 + i * (W * 0.25), cy = H * 0.5
                    const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, sx)
                    g.addColorStop(0, 'rgba(123,140,255,0.85)'); g.addColorStop(1, 'rgba(123,140,255,0)')
                    ctx.beginPath(); ctx.ellipse(cx, cy, sx, Math.max(2, sp * 1.5), 0, 0, Math.PI * 2)
                    ctx.fillStyle = g; ctx.fill()
                    ctx.beginPath(); ctx.arc(cx, cy, 3, 0, Math.PI * 2)
                    ctx.fillStyle = '#4dffb0'; ctx.fill()
                    ctx.font = '10px JetBrains Mono'; ctx.fillStyle = 'rgba(200,200,220,0.5)'; ctx.textAlign = 'center'
                    ctx.fillText('σₓ·σₚ ≥ ℏ/2', cx, cy + Math.max(2, sp * 1.5) + 18)
                }
            } else if (block.animType === 'bloch') {
                const cx = W / 2, cy = H / 2, R = Math.min(W, H) * 0.38
                ctx.strokeStyle = 'rgba(123,140,255,0.15)'; ctx.lineWidth = 1
                ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.stroke()
                ctx.beginPath(); ctx.moveTo(cx - R - 10, cy); ctx.lineTo(cx + R + 10, cy); ctx.stroke()
                ctx.beginPath(); ctx.moveTo(cx, cy - R - 10); ctx.lineTo(cx, cy + R + 10); ctx.stroke()
                const sx = cx + R * 0.85 * Math.sin(t * 0.6) * Math.cos(t * 0.4)
                const sy = cy + R * 0.85 * Math.cos(t * 0.6)
                const grad = ctx.createLinearGradient(cx, cy, sx, sy)
                grad.addColorStop(0, 'rgba(176,111,255,0)'); grad.addColorStop(1, 'rgba(176,111,255,0.9)')
                ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(sx, sy)
                ctx.strokeStyle = grad; ctx.lineWidth = 2.5; ctx.stroke()
                ctx.beginPath(); ctx.arc(sx, sy, 6, 0, Math.PI * 2)
                ctx.fillStyle = '#b06fff'; ctx.fill()
                ctx.shadowBlur = 12; ctx.shadowColor = '#b06fff'; ctx.fill(); ctx.shadowBlur = 0
                ctx.fillStyle = 'rgba(176,111,255,0.9)'; ctx.font = '12px JetBrains Mono'; ctx.textAlign = 'left'
                ctx.fillText('|ψ⟩', sx + 14, sy)
            }

            frame++
            raf = requestAnimationFrame(draw)
        }
        draw()
        return () => cancelAnimationFrame(raf)
    }, [block.animType, block.params])

    return (
        <div className={styles.animBlock}>
            <div className={styles.animTag}>Анимация</div>
            <canvas ref={canvasRef} width={700} height={200} className={styles.animCanvas} />
            {block.caption && <p className={styles.animCaption}>{block.caption}</p>}
        </div>
    )
}

function PreviewExercise({ block }: { block: ExerciseBlock }) {
    const [shown, setShown] = useState(false)
    return (
        <div className={styles.exercise}>
            <div className={styles.exHeader}>
                <span className={styles.exNum}>Упражнение {block.number ?? ''}</span>
            </div>
            <p className={styles.exText}>{block.question}</p>
            <button className={styles.exBtn} onClick={() => setShown(s => !s)}>
                {shown ? 'Скрыть решение' : 'Показать решение'}
            </button>
            {shown && (
                <div className={styles.exAnswer}>
                    <strong style={{ color: 'var(--green)' }}>{block.answer}</strong>
                    <p style={{ marginTop: 6, fontSize: 13, fontFamily: 'var(--font-mono)', color: 'var(--text-dim)' }}>{block.explanation}</p>
                </div>
            )}
        </div>
    )
}
