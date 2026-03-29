import { useState } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import styles from './PythonBlock.module.css'

interface Props {
    code: string
    title?: string
    description?: string
}

export default function PythonBlock({ code, title, description }: Props) {
    const [copied, setCopied] = useState(false)

    const handleCopy = () => {
        navigator.clipboard.writeText(code)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className={styles.wrapper}>
            <div className={styles.header}>
                <div className={styles.headerLeft}>
                    <div className={styles.dots}>
                        <span style={{ background: '#ff5f57' }} />
                        <span style={{ background: '#febc2e' }} />
                        <span style={{ background: '#28c840' }} />
                    </div>
                    <span className={styles.lang}>Python</span>
                    {title && <span className={styles.title}>{title}</span>}
                </div>
                <button className={styles.copyBtn} onClick={handleCopy}>
                    {copied ? '✓ Скопировано' : 'Копировать'}
                </button>
            </div>
            {description && <p className={styles.description}>{description}</p>}
            <div className={styles.code}>
                <SyntaxHighlighter
                    language="python"
                    style={vscDarkPlus}
                    customStyle={{
                        margin: 0,
                        padding: '20px 24px',
                        background: 'transparent',
                        fontSize: '13px',
                        fontFamily: 'var(--font-mono)',
                        lineHeight: '1.7',
                    }}
                    showLineNumbers
                    lineNumberStyle={{ color: 'rgba(150,150,180,0.3)', minWidth: '2.5em' }}
                >
                    {code}
                </SyntaxHighlighter>
            </div>
        </div>
    )
}   