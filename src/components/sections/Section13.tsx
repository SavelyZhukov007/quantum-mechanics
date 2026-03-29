import { useEffect, useRef, useState } from 'react'
import SectionHeader from '../SectionHeader'
import TheoryBlock from '../TheoryBlock'
import PythonBlock from '../PythonBlock'
import styles from './Section13.module.css'

const POLARIZATION_CODE = `import numpy as np

H = np.array([1, 0], dtype=complex)
V = np.array([0, 1], dtype=complex)

states = {
    '|H⟩':    np.array([1, 0], dtype=complex),
    '|V⟩':    np.array([0, 1], dtype=complex),
    '|+45°⟩': np.array([1, 1], dtype=complex) / np.sqrt(2),
    '|-45°⟩': np.array([1, -1], dtype=complex) / np.sqrt(2),
    '|R⟩':    np.array([1, 1j], dtype=complex) / np.sqrt(2),
    '|L⟩':    np.array([1, -1j], dtype=complex) / np.sqrt(2),
}

def inner_product(a, b):
    return np.dot(np.conj(a), b)

def probability(state_in, basis_state):
    return abs(inner_product(basis_state, state_in))**2

print("=== Таблица поляризационных состояний ===")
print(f"{'Состояние':10} {'|H-компонент|²':16} {'|V-компонент|²':16} {'Сумма':8}")
for name, psi in states.items():
    p_H = probability(psi, H)
    p_V = probability(psi, V)
    print(f"{name:10} {p_H:16.4f} {p_V:16.4f} {p_H+p_V:8.4f}")

print()
print("=== Ортогональность базисных пар ===")
pairs = [('|H⟩','|V⟩'), ('|+45°⟩','|-45°⟩'), ('|R⟩','|L⟩')]
for n1, n2 in pairs:
    ip = inner_product(states[n1], states[n2])
    print(f"  ⟨{n1}|{n2}⟩ = {ip:.4f} — {'ортогональны ✓' if abs(ip) < 1e-10 else 'НЕ ортогональны'}")

print()
print("=== Разложение |+30°⟩ по трём базисам ===")
psi = np.array([np.cos(np.radians(30)), np.sin(np.radians(30))], dtype=complex)
for (n1, n2), basis in zip([('|H⟩','|V⟩'),('|+45°⟩','|-45°⟩'),('|R⟩','|L⟩')],
                            [(H,V),(states['|+45°⟩'],states['|-45°⟩']),(states['|R⟩'],states['|L⟩'])]):
    c1, c2 = inner_product(basis[0], psi), inner_product(basis[1], psi)
    ip = inner_product(psi, psi)
    print(f"  Базис {{{n1},{n2}}}: |c1|²={abs(c1)**2:.4f}, |c2|²={abs(c2)**2:.4f}, сумма={abs(c1)**2+abs(c2)**2:.4f}")`

export default function Section13() {
    return (
        <section>
            <SectionHeader number="1.3" title="Поляризация фотона" />

            <TheoryBlock>
                <p>
                    Поляризация фотона — простейшая квантовая система: гильбертово пространство размерностью всего <strong style={{ color: 'var(--accent)' }}>два</strong>.
                    Горизонтальное |H⟩ и вертикальное |V⟩ состояния — ортонормальный базис.
                </p>
                <p>
                    Любое поляризационное состояние фотона записывается как линейная комбинация базисных: |ψ⟩ = A_H e^(iφ_H)|H⟩ + A_V e^(iφ_V)|V⟩.
                    Это реализация <em>квантового бита (кубита)</em> — базовой единицы квантовой информации.
                </p>
            </TheoryBlock>

            <PolarizationTable />
            <PBS_Simulator />

            <PythonBlock
                title="photon_polarization.py"
                description="Таблица поляризационных состояний, ортогональность базисов, разложение произвольного состояния"
                code={POLARIZATION_CODE}
            />
        </section>
    )
}

const STATES: { name: string; label: string; angle: number; color: string; circular?: boolean; phase?: number }[] = [
    { name: '|H⟩', label: 'Горизонт.', angle: 0, color: '#7b8cff' },
    { name: '|V⟩', label: 'Вертикальн.', angle: 90, color: '#4dd9ff' },
    { name: '|+45°⟩', label: '+45°', angle: 45, color: '#4dffb0' },
    { name: '|-45°⟩', label: '−45°', angle: -45, color: '#b06fff' },
    { name: '|R⟩', label: 'Правая круг.', angle: 0, color: '#e0c87a', circular: true, phase: 1 },
    { name: '|L⟩', label: 'Левая круг.', angle: 0, color: '#ff8c69', circular: true, phase: -1 },
]

function PolarizationTable() {
    const [selected, setSelected] = useState(0)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const frameRef = useRef(0)
    const rafRef = useRef<number>(0)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')!
        const W = canvas.width, H = canvas.height
        const cx = W / 2, cy = H / 2
        const R = Math.min(W, H) * 0.38

        const st = STATES[selected]

        const animate = () => {
            ctx.clearRect(0, 0, W, H)
            const t = frameRef.current * 0.04
            frameRef.current++

            ctx.strokeStyle = 'rgba(123,140,255,0.1)'
            ctx.lineWidth = 1
            ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.stroke()
            ctx.beginPath(); ctx.moveTo(cx - R - 10, cy); ctx.lineTo(cx + R + 10, cy); ctx.stroke()
            ctx.beginPath(); ctx.moveTo(cx, cy - R - 10); ctx.lineTo(cx, cy + R + 10); ctx.stroke()

            ctx.fillStyle = 'rgba(123,140,255,0.4)'; ctx.font = '11px JetBrains Mono'
            ctx.textAlign = 'center'; ctx.fillText('H', cx + R + 18, cy + 4)
            ctx.fillText('V', cx, cy - R - 16)

            if (st.circular) {
                const trail = 60
                for (let i = 0; i < trail; i++) {
                    const tt = t - i * 0.05
                    const ex = cx + R * 0.75 * Math.cos(tt * st.phase!)
                    const ey = cy + R * 0.75 * Math.sin(tt)
                    ctx.beginPath(); ctx.arc(ex, ey, 2.5, 0, Math.PI * 2)
                    ctx.fillStyle = `${st.color}${Math.round((1 - i / trail) * 180).toString(16).padStart(2, '0')}`
                    ctx.fill()
                }
                const ex = cx + R * 0.75 * Math.cos(t * st.phase!)
                const ey = cy + R * 0.75 * Math.sin(t)
                ctx.beginPath(); ctx.arc(ex, ey, 6, 0, Math.PI * 2)
                ctx.fillStyle = st.color; ctx.fill()
                ctx.shadowBlur = 16; ctx.shadowColor = st.color; ctx.fill(); ctx.shadowBlur = 0
            } else {
                const rad = (st.angle * Math.PI) / 180
                const osc = Math.cos(t)
                const ex = cx + R * 0.85 * Math.cos(rad) * osc
                const ey = cy - R * 0.85 * Math.sin(rad) * osc

                const trail = 40
                for (let i = 0; i < trail; i++) {
                    const tt = t - i * 0.05
                    const tx = cx + R * 0.85 * Math.cos(rad) * Math.cos(tt)
                    const ty = cy - R * 0.85 * Math.sin(rad) * Math.cos(tt)
                    ctx.beginPath(); ctx.arc(tx, ty, 2, 0, Math.PI * 2)
                    ctx.fillStyle = `${st.color}${Math.round((1 - i / trail) * 150).toString(16).padStart(2, '0')}`
                    ctx.fill()
                }

                ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(ex, ey)
                ctx.strokeStyle = st.color; ctx.lineWidth = 2.5; ctx.stroke()
                ctx.beginPath(); ctx.moveTo(cx, cy)
                ctx.lineTo(cx - (ex - cx), cy - (ey - cy))
                ctx.strokeStyle = `${st.color}80`; ctx.lineWidth = 1.5; ctx.stroke()

                ctx.beginPath(); ctx.arc(ex, ey, 5, 0, Math.PI * 2)
                ctx.fillStyle = st.color; ctx.fill()
                ctx.shadowBlur = 14; ctx.shadowColor = st.color; ctx.fill(); ctx.shadowBlur = 0
            }

            ctx.fillStyle = st.color; ctx.font = 'bold 16px Crimson Pro'
            ctx.textAlign = 'center'; ctx.fillText(st.name, cx, H - 16)

            rafRef.current = requestAnimationFrame(animate)
        }

        rafRef.current = requestAnimationFrame(animate)
        return () => cancelAnimationFrame(rafRef.current)
    }, [selected])

    return (
        <div className={styles.polTable}>
            <div className={styles.polLabel}>
                <span className={styles.tag}>Интерактив</span>
                Выберите поляризационное состояние
            </div>
            <div className={styles.polLayout}>
                <div className={styles.stateList}>
                    {STATES.map((s, i) => (
                        <button
                            key={i}
                            className={`${styles.stateBtn} ${selected === i ? styles.active : ''}`}
                            style={{ '--c': s.color } as React.CSSProperties}
                            onClick={() => setSelected(i)}
                        >
                            <span className={styles.stateName}>{s.name}</span>
                            <span className={styles.stateLabel}>{s.label}</span>
                        </button>
                    ))}
                </div>
                <canvas ref={canvasRef} width={280} height={280} className={styles.polCanvas} />
            </div>
        </div>
    )
}

function PBS_Simulator() {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [angle, setAngle] = useState(45)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')!
        let frame = 0
        let raf: number

        const draw = () => {
            const W = canvas.width, H = canvas.height
            ctx.clearRect(0, 0, W, H)

            const rad = (angle * Math.PI) / 180
            const pr_H = Math.cos(rad) ** 2
            const pr_V = Math.sin(rad) ** 2

            const t = frame * 0.05

            const photonX = (t * 60) % (W * 0.45) + W * 0.05
            const photonY = H * 0.5

            ctx.beginPath()
            ctx.arc(photonX, photonY, 7, 0, Math.PI * 2)
            ctx.fillStyle = '#e0c87a'
            ctx.fill()
            ctx.shadowBlur = 14; ctx.shadowColor = '#e0c87a'; ctx.fill(); ctx.shadowBlur = 0

            const arrowLen = 18
            ctx.beginPath()
            ctx.moveTo(photonX - arrowLen * Math.cos(rad), photonY - arrowLen * Math.sin(rad))
            ctx.lineTo(photonX + arrowLen * Math.cos(rad), photonY + arrowLen * Math.sin(rad))
            ctx.strokeStyle = '#e0c87a80'; ctx.lineWidth = 2; ctx.stroke()

            const pbsX = W * 0.5, pbsY = H * 0.5
            const pbsSize = 34
            ctx.save()
            ctx.translate(pbsX, pbsY)
            ctx.rotate(Math.PI / 4)
            ctx.fillStyle = 'rgba(123,140,255,0.15)'
            ctx.strokeStyle = 'rgba(123,140,255,0.6)'
            ctx.lineWidth = 1.5
            ctx.fillRect(-pbsSize / 2, -pbsSize / 2, pbsSize, pbsSize)
            ctx.strokeRect(-pbsSize / 2, -pbsSize / 2, pbsSize, pbsSize)
            ctx.restore()

            ctx.fillStyle = 'rgba(123,140,255,0.5)'; ctx.font = '10px JetBrains Mono'; ctx.textAlign = 'center'
            ctx.fillText('PBS', pbsX, pbsY + pbsSize + 14)

            const transmitted = photonX > pbsX
            if (transmitted) {
                const px = pbsX + (photonX - pbsX)
                if (Math.random() < pr_H) {
                    ctx.beginPath(); ctx.arc(px, photonY, 5, 0, Math.PI * 2)
                    ctx.fillStyle = '#7b8cff'; ctx.fill()
                    ctx.shadowBlur = 10; ctx.shadowColor = '#7b8cff'; ctx.fill(); ctx.shadowBlur = 0
                }
            }

            ctx.fillStyle = 'rgba(150,150,200,0.5)'; ctx.font = '11px JetBrains Mono'
            ctx.textAlign = 'left'
            ctx.fillText(`|ψ⟩ = cos(${angle}°)|H⟩ + sin(${angle}°)|V⟩`, 12, 20)
            ctx.fillText(`P(H) = cos²(${angle}°) = ${pr_H.toFixed(3)}`, 12, 38)
            ctx.fillText(`P(V) = sin²(${angle}°) = ${pr_V.toFixed(3)}`, 12, 56)

            const barW = 120, barH = 12, barX = W - barW - 16
            ctx.fillStyle = 'rgba(123,140,255,0.2)'
            ctx.fillRect(barX, 20, barW, barH)
            ctx.fillStyle = '#7b8cff'
            ctx.fillRect(barX, 20, barW * pr_H, barH)
            ctx.fillStyle = 'rgba(77,217,255,0.2)'
            ctx.fillRect(barX, 40, barW, barH)
            ctx.fillStyle = '#4dd9ff'
            ctx.fillRect(barX, 40, barW * pr_V, barH)

            ctx.fillStyle = '#7b8cff'; ctx.font = '10px JetBrains Mono'
            ctx.textAlign = 'right'; ctx.fillText('|H⟩', barX - 6, 31)
            ctx.fillStyle = '#4dd9ff'; ctx.fillText('|V⟩', barX - 6, 51)

            frame++
            raf = requestAnimationFrame(draw)
        }

        draw()
        return () => cancelAnimationFrame(raf)
    }, [angle])

    return (
        <div className={styles.pbsBox}>
            <div className={styles.polLabel}>
                <span className={styles.tag}>Симуляция</span>
                PBS — поляризующий светоделитель. Угол поляризации фотона
            </div>
            <input
                type="range" min={0} max={90} value={angle}
                onChange={e => setAngle(Number(e.target.value))}
                className={styles.slider}
            />
            <div className={styles.sliderLabel}>
                Угол поляризации: <strong style={{ color: 'var(--gold)' }}>{angle}°</strong>
            </div>
            <canvas ref={canvasRef} width={600} height={100} className={styles.pbsCanvas} />
        </div>
    )
}