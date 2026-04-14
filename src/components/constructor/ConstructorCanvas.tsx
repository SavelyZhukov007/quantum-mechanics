import type { Block } from '../../types/constructor'
import { BlockEditor } from './BlockEditor'
import styles from './ConstructorCanvas.module.css'

interface Props {
    blocks: Block[]
    selectedId: string | null
    noteTitle: string
    onSelect: (id: string | null) => void
    onUpdate: (id: string, updates: Partial<Omit<Block, "id" | "type">>) => void
    onDelete: (id: string) => void
    onMove: (id: string, direction: 'up' | 'down') => void
    onDuplicate: (id: string) => void
}

export function ConstructorCanvas({
    blocks, selectedId, noteTitle, onSelect, onUpdate, onDelete, onMove, onDuplicate
}: Props) {
    return (
        <main
            className={styles.canvas}
            onClick={e => { if (e.target === e.currentTarget) onSelect(null) }}
        >
            {blocks.length === 0 ? (
                <div className={styles.empty}>
                    <div className={styles.emptyIcon}>📄</div>
                    <div className={styles.emptyTitle}>Конспект пуст</div>
                    <div className={styles.emptyDesc}>
                        Нажмите на блок в левой панели, чтобы добавить его
                    </div>
                </div>
            ) : (
                <div className={styles.blockList}>
                    {/* Превью заголовка страницы */}
                    <div className={styles.pageTitle}>{noteTitle}</div>

                    {blocks.map((block, idx) => (
                        <BlockEditor
                            key={block.id}
                            block={block}
                            isSelected={selectedId === block.id}
                            isFirst={idx === 0}
                            isLast={idx === blocks.length - 1}
                            onSelect={() => onSelect(block.id)}
                            onUpdate={updates => onUpdate(block.id, updates)}
                            onDelete={() => onDelete(block.id)}
                            onMoveUp={() => onMove(block.id, 'up')}
                            onMoveDown={() => onMove(block.id, 'down')}
                            onDuplicate={() => onDuplicate(block.id)}
                        />
                    ))}
                </div>
            )}
        </main>
    )
}
