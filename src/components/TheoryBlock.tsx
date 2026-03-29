import styles from './TheoryBlock.module.css'

interface Props {
    children: React.ReactNode
    highlight?: boolean
}

export default function TheoryBlock({ children, highlight }: Props) {
    return (
        <div className={`${styles.block} ${highlight ? styles.highlight : ''}`}>
            {children}
        </div>
    )
}