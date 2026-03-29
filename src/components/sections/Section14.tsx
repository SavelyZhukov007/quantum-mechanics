import { useEffect, useRef, useState } from 'react'
import SectionHeader from '../SectionHeader'
import TheoryBlock from '../TheoryBlock'
import PythonBlock from '../PythonBlock'
import styles from './Section14.module.css'

const BORN_CODE = `import numpy as np

def born_probability(basis_state: np.ndarray, psi: np.ndarray) -> float:
    amplitude = np.dot(np.conj(basis_state), psi)
    return abs(amplitude) ** 2

def measure(psi: np.ndarray, basis: list, n_shots: int = 10000) -> dict:
    probs = [born_probability(b, psi) for b in basis]
    probs = np.array(probs) / sum(probs)
    indices = np.random.choice(len(basis), size=n_shots, p=probs)
    counts = {i: int(np.sum(indices == i)) for i in range(len(basis))}
    return counts, probs

H = np.array([1, 0], dtype=complex)
V = np.array([0, 1], dtype=complex)

psi_list = [
    ("|H⟩",      H),
    ("|+45°⟩",   np.array([1, 1]) / np.sqrt(2)),
    ("|+30°⟩",   np.array([np.cos(np.radians(30)), np.sin(np.radians(30))])),
    ("2|H⟩+i|V⟩", np.array([2, 1j]) / np.sqrt(5)),
]

print("=== Правило Борна: P(i) = |⟨vᵢ|ψ⟩|² ===")
print(f"{'Состояние':18} {'P(H)':10} {'P(V)':10} {'Частота H':12} {'Частота V':12}")
for name, psi in psi_list:
    counts, probs = measure(psi, [H, V], n_shots=100_000)
    total = sum(counts.values())
    freq_H = counts[0] / total
    freq_V = counts[1] / total
    print(f"{name:18} {probs[0]:.6f}  {probs[1]:.6f}  {freq_H:.6f}    {freq_V:.6f}")

print()
print("=== Коллапс состояния после измерения ===")
psi = np.array([1, 1], dtype=complex) / np.sqrt(2)
print(f"Начальное состояние: |+45°⟩ = (|H⟩+|V⟩)/√2")
print(f"P(H) = {born_probability(H, psi):.4f},  P(V) = {born_probability(V, psi):.4f}")
print()
print("После измерения → результат |H⟩:")
psi_after_H = H.copy()
print(f"  Новое состояние: |H⟩")
print(f"  P(H) = {born_probability(H, psi_after_H):.4f}  (повторное измерение даст H с P=1)")
print(f"  P(V) = {born_probability(V, psi_after_H):.4f}")
print()
print("После измерения → результат |V⟩:")
psi_after_V = V.copy()
print(f"  Новое состояние: |V⟩")
print(f"  P(H) = {born_probability(H, psi_after_V):.4f}")
print(f"  P(V) = {born_probability(V, psi_after_V):.4f}  (повторное измерение даст V с P=1)")`

export default function Section14() {
    return (
        <section>
            <SectionHeader number="1.4" title="Квантовые измерения" />

            <TheoryBlock>
                <p>
                    Второй постулат квантовой механики — <strong style={{ color: 'var(--accent)' }}>постулат об измерениях</strong>.
                    В классической физике измерение не влияет на систему. В квантовом мире — любое измерение изменяет квантовое состояние.
                </p>
            </TheoryBlock>

            <BornRuleViz />

            <TheoryBlock highlight>
                <p>
                    <strong>Постулат об измерениях.</strong> Всякий идеальный измерительный прибор связан
                    с некоторым ортонормальным базисом {'{' + '|vi\u27E9' + '}'} . После измерения прибор случайным образом, на одно из состояний |vᵢ⟩ (правило Борна), и система перейдёт в состояние |vᵢ⟩.
                </p>
            </TheoryBlock>

            <CollapseSimulator />

            <PythonBlock
                title="born_rule.py"
                description="Правило Борна, симуляция квантовых измерений и коллапс состояния"
                code={BORN_CODE}
            />
        </section>
    )
}

function BornRuleViz() {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [angle, setAngle] = useState(45)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')!
        let raf: number

        const draw = () => {
            const W = canvas.width, H = canvas.height
            ctx.clearRect(0, 0, W, H)

            const rad = (angle * Math.PI) / 180
            const pr_H = Math.cos(rad) ** 2
            const pr_V = Math.sin(rad) ** 2

            const cx = W * 0.35, cy = H * 0.5
            const R = Math.min(cy, cx) * 0.85

            ctx.strokeStyle = 'rgba(123,140,255,0.12)'; ctx.lineWidth = 1
            ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.stroke()
            ctx.beginPath(); ctx.moveTo(cx - R - 10, cy); ctx.lineTo(cx + R + 10, cy); ctx.stroke()
            ctx.beginPath(); ctx.moveTo(cx, cy - R - 10); ctx.lineTo(cx, cy + R + 10); ctx.stroke()

            ctx.fillStyle = 'rgba(123,140,255,0.5)'; ctx.font = '11px JetBrains Mono'; ctx.textAlign = 'center'
            ctx.fillText('|H⟩', cx + R + 18, cy + 4)
            ctx.fillText('|V⟩', cx, cy - R - 14)

            const stateX = cx + R * 0.9 * Math.cos(-rad)
            const stateY = cy + R * 0.9 * Math.sin(-rad)
            const g = ctx.createLinearGradient(cx, cy, stateX, stateY)
            g.addColorStop(0, 'rgba(224,200,122,0)'); g.addColorStop(1, 'rgba(224,200,122,1)')
            ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(stateX, stateY)
            ctx.strokeStyle = g; ctx.lineWidth = 2.5; ctx.stroke()
            ctx.beginPath(); ctx.arc(stateX, stateY, 5, 0, Math.PI * 2)
            ctx.fillStyle = '#e0c87a'; ctx.fill()
            ctx.fillStyle = '#e0c87a'; ctx.font = '13px JetBrains Mono'
            ctx.fillText('|ψ⟩', stateX + 14, stateY - 8)

            ctx.setLineDash([4, 4])
            ctx.strokeStyle = 'rgba(123,140,255,0.4)'; ctx.lineWidth = 1
            ctx.beginPath(); ctx.moveTo(stateX, stateY)
            ctx.lineTo(cx + R * 0.9 * Math.cos(-rad), cy); ctx.stroke()
            ctx.beginPath(); ctx.moveTo(stateX, stateY)
            ctx.lineTo(cx, cy + R * 0.9 * Math.sin(-rad)); ctx.stroke()
            ctx.setLineDash([])

            ctx.fillStyle = 'rgba(123,140,255,0.7)'; ctx.font = '12px JetBrains Mono'
            ctx.fillText(`cos(${angle}°)`, (stateX + cx + R * 0.9 * Math.cos(-rad)) / 2, cy + 16)
            ctx.fillStyle = 'rgba(77,217,255,0.7)'
            ctx.fillText(`sin(${angle}°)`, cx - 30, (stateY + cy + R * 0.9 * Math.sin(-rad)) / 2)

            const bx = W * 0.72
            const barW = 24, maxH = R * 1.6
            const by_base = cy + maxH / 2

            const drawBar = (x: number, val: number, color: string, label: string) => {
                ctx.fillStyle = 'rgba(255,255,255,0.05)'
                ctx.fillRect(x - barW / 2, by_base - maxH, barW, maxH)
                ctx.fillStyle = color
                ctx.fillRect(x - barW / 2, by_base - maxH * val, barW, maxH * val)
                ctx.fillStyle = color; ctx.font = '11px JetBrains Mono'; ctx.textAlign = 'center'
                ctx.fillText(label, x, by_base + 16)
                ctx.fillText(val.toFixed(3), x, by_base - maxH * val - 8)
            }

            drawBar(bx - 20, pr_H, '#7b8cff', '|H⟩')
            drawBar(bx + 20, pr_V, '#4dd9ff', '|V⟩')

            ctx.fillStyle = 'rgba(180,180,200,0.5)'; ctx.font = '11px JetBrains Mono'; ctx.textAlign = 'center'
            ctx.fillText('P = |⟨v|ψ⟩|²', bx, by_base + 34)

            raf = requestAnimationFrame(draw)
        }

        draw()
        return () => cancelAnimationFrame(raf)
    }, [angle])

    return (
        <div className={styles.bornBox}>
            <div className={styles.label}>
                <span className={styles.tag}>Интерактив</span>
                Правило Борна — вероятность результата измерения
            </div>
            <input type="range" min={0} max={90} value={angle} onChange={e => setAngle(Number(e.target.value))} className={styles.slider} />
            <div className={styles.sliderLabel}>Угол |ψ⟩: <strong style={{ color: 'var(--gold)' }}>{angle}°</strong></div>
            <canvas ref={canvasRef} width={520} height={240} className={styles.canvas} />
        </div>
    )
}

function CollapseSimulator() {
    const [psi, setPsi] = useState<[number, number]>([1, 1])
    const [result, setResult] = useState<null | 'H' | 'V'>(null)
    const [history, setHistory] = useState<string[]>([])
    const btnRef = useRef<HTMLButtonElement>(null)

    const norm = Math.sqrt(psi[0] ** 2 + psi[1] ** 2)
    const pr_H = (psi[0] / norm) ** 2
    const pr_V = (psi[1] / norm) ** 2

    const measure = () => {
        const r = Math.random() < pr_H ? 'H' : 'V'
        setResult(r)
        setHistory(h => [`→ |${r}⟩  (P=${r === 'H' ? pr_H.toFixed(3) : pr_V.toFixed(3)})`, ...h].slice(0, 8))
        if (btnRef.current) {
            btnRef.current.style.transform = 'scale(0.94)'
            setTimeout(() => { if (btnRef.current) btnRef.current.style.transform = '' }, 120)
        }
    }

    return (
        <div className={styles.collapseBox}>
            <div className={styles.label}>
                <span className={styles.tag}>Симуляция</span>
                Коллапс волновой функции после измерения
            </div>

            <div className={styles.controls}>
                <div>
                    <div className={styles.controlLabel}>A_H (амплитуда |H⟩)</div>
                    <input type="range" min={0} max={10} value={psi[0]} onChange={e => { setPsi([Number(e.target.value), psi[1]]); setResult(null) }} className={styles.slider} />
                    <span className={styles.val}>{psi[0]}</span>
                </div>
                <div>
                    <div className={styles.controlLabel}>A_V (амплитуда |V⟩)</div>
                    <input type="range" min={0} max={10} value={psi[1]} onChange={e => { setPsi([psi[0], Number(e.target.value)]); setResult(null) }} className={styles.slider} />
                    <span className={styles.val}>{psi[1]}</span>
                </div>
            </div>

            <div className={styles.stateDisplay}>
                <span>|ψ⟩ = </span>
                <span style={{ color: 'var(--accent)' }}>{psi[0]}</span>|H⟩ +&nbsp;
                <span style={{ color: 'var(--accent3)' }}>{psi[1]}</span>|V⟩&nbsp;&nbsp;
                <span style={{ color: 'var(--text-dimmer)' }}>(ненорм.)</span>
            </div>

            <div className={styles.probRow}>
                <div className={styles.probItem}>
                    <div style={{ color: 'var(--accent)' }}>P(|H⟩)</div>
                    <div className={styles.probVal}>{pr_H.toFixed(4)}</div>
                    <div className={styles.probBar} style={{ '--p': pr_H, '--c': 'var(--accent)' } as React.CSSProperties} />
                </div>
                <div className={styles.probItem}>
                    <div style={{ color: 'var(--accent3)' }}>P(|V⟩)</div>
                    <div className={styles.probVal}>{pr_V.toFixed(4)}</div>
                    <div className={styles.probBar} style={{ '--p': pr_V, '--c': 'var(--accent3)' } as React.CSSProperties} />
                </div>
            </div>

            <button ref={btnRef} className={styles.measureBtn} onClick={measure}>
                Провести измерение
            </button>

            {result && (
                <div className={styles.resultBlock} style={{ borderColor: result === 'H' ? 'var(--accent)' : 'var(--accent3)' }}>
                    <div className={styles.resultLabel}>Результат:</div>
                    <div className={styles.resultState} style={{ color: result === 'H' ? 'var(--accent)' : 'var(--accent3)' }}>
                        |{result}⟩
                    </div>
                    <div className={styles.resultAfter}>После измерения система в состоянии |{result}⟩</div>
                </div>
            )}

            {history.length > 0 && (
                <div className={styles.history}>
                    <div className={styles.historyTitle}>История измерений:</div>
                    {history.map((h, i) => (
                        <div key={i} className={styles.historyItem} style={{ opacity: 1 - i * 0.1 }}>{h}</div>
                    ))}
                </div>
            )}
        </div>
    )
}