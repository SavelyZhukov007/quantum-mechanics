import { BLOCK_REGISTRY } from '../../types/constructor'
import type { Block } from '../../types/constructor'
import styles from './ConstructorSidebar.module.css'

interface Props {
    onAddBlock: (type: Block['type']) => void
}

export function ConstructorSidebar({ onAddBlock }: Props) {
    return (
        <aside className={styles.sidebar}>
            <div className={styles.sidebarTitle}>
                <span>Блоки</span>
            </div>
            <div className={styles.blockList}>
                {BLOCK_REGISTRY.map(meta => (
                    <button
                        key={meta.type}
                        className={styles.blockItem}
                        onClick={() => onAddBlock(meta.type)}
                        title={meta.description}
                    >
                        <span className={styles.blockIcon}>{meta.icon}</span>
                        <div className={styles.blockInfo}>
                            <span className={styles.blockLabel}>{meta.label}</span>
                            <span className={styles.blockDesc}>{meta.description}</span>
                        </div>
                        <span className={styles.addIcon}>+</span>
                    </button>
                ))}
            </div>

            <div className={styles.hint}>
                <p>Нажмите на блок чтобы добавить его в конспект</p>
            </div>
        </aside>
    )
}
