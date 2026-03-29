import { useEffect, useRef, useState } from 'react'
import SectionHeader from '../SectionHeader'
import TheoryBlock from '../TheoryBlock'
import PythonBlock from '../PythonBlock'
import styles from './Section12.module.css'
const HILBERT_CODE = `import numpy as np

def inner_product(v1: np.ndarray, v2: np.ndarray) -> complex:
    return np.dot(np.conj(v1), v2)

def norm(v: np.ndarray) -> float:
    return float(np.sqrt(inner_product(v, v).real))

def normalize(v: np.ndarray) -> np.ndarray:
    return v / norm(v)

def are_orthogonal(v1: np.ndarray, v2: np.ndarray, tol: float = 1e-10) -> bool:
    return abs(inner_product(v1, v2)) < tol

H = np.array([1, 0], dtype=complex)
V = np.array([0, 1], dtype=complex)

cat_alive = H.copy()
cat_dead  = V.copy()

superposition = normalize(2 * cat_alive + 1j * cat_dead)

print("=== Постулат гильбертова пространства ===")
print(f"  |H⟩ = {H}")
print(f"  |V⟩ = {V}")
print(f"  |H⟩ и |V⟩ ортогональны: {are_orthogonal(H, V)}")
print(f"  |H⟩ нормирован: {abs(norm(H) - 1) < 1e-10}")
print()

N = 1 / np.sqrt(np.dot(np.conj(2*cat_alive + 1j*cat_dead), 2*cat_alive + 1j*cat_dead).real)
psi_schrodinger = N * (2 * cat_alive + 1j * cat_dead)
print("=== Кошка Шрёдингера ===")
print(f"  |ψ⟩ = N·(2|жив⟩ + i|мёртв⟩)")
print(f"  Нормировочный множитель N = {N:.6f}")
print(f"  Проверка нормировки ⟨ψ|ψ⟩ = {inner_product(psi_schrodinger, psi_schrodinger).real:.6f}")
print()

print("=== Вероятности квантового измерения ===")
pr_alive = abs(inner_product(cat_alive, psi_schrodinger))**2
pr_dead  = abs(inner_product(cat_dead,  psi_schrodinger))**2
print(f"  P(жив)   = |⟨жив|ψ⟩|² = {pr_alive:.4f}")
print(f"  P(мёртв) = |⟨мёртв|ψ⟩|² = {pr_dead:.4f}")
print(f"  Сумма = {pr_alive + pr_dead:.6f} (должна быть 1.0)")

theta = np.linspace(0, 2*np.pi, 7, endpoint=False)
print()
print("=== Ортонормальность линейно поляризованных состояний ===")
for i, t1 in enumerate(theta[:3]):
    for j, t2 in enumerate(theta[:3]):
        state1 = np.array([np.cos(t1), np.sin(t1)])
        state2 = np.array([np.cos(t2), np.sin(t2)])
        ip = inner_product(state1, state2)
        print(f"  ⟨{int(np.degrees(t1))}°|{int(np.degrees(t2))}°⟩ = {ip.real:+.4f}")`

export default function Section12() {
    return (
        <section>
            <SectionHeader number="1.2" title="Постулат гильбертова пространства" />

            <TheoryBlock>
                <p>
                    Возможные состояния физической системы образуют <strong style={{ color: 'var(--accent)' }}>гильбертово пространство</strong> над полем комплексных чисел.
                    Несовместимые квантовые состояния соответствуют ортогональным векторам; все физические состояния — нормированы.
                </p>
            </TheoryBlock>

            <HilbertSpaceViz />

            <TheoryBlock>
                <p>
                    <em>Физическая система</em> — объект или степень свободы, изучаемая независимо от остальных.
                    Для атома: движение как целого и движение электронов вокруг ядра — две разные физические системы.
                </p>
                <p>
                    Суперпозиция состояний — не математическая абстракция, а реальное физическое явление.
                    Кошка Шрёдингера в состоянии (|жив⟩ + |мёртв⟩)/√2 — это физически другой объект, чем случайная смесь двух классических состояний.
                </p>
            </TheoryBlock>

            <ExerciseBlock
                number="1.1"
                text="Найдите нормировочный множитель N состояния кошки Шрёдингера |ψ⟩ = N[2|жива⟩ + i|мертва⟩], гарантирующий, что |ψ⟩ — физическое состояние."
                answer="N = 1/√5"
                explanation="⟨ψ|ψ⟩ = N²(4⟨жив|жив⟩ + 1⟨мёрт|мёрт⟩) = N²·5 = 1 → N = 1/√5 ≈ 0.4472"
            />

            <PythonBlock
                title="hilbert_space.py"
                description="Вычисление скалярных произведений, нормировки и ортогональности в гильбертовом пространстве"
                code={HILBERT_CODE}
            />
        </section>
    )
}

function HilbertSpaceViz() {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')!
        let frame = 0
        let raf: number

        const draw = () => {
            const W = canvas.width, H = canvas.height
            ctx.clearRect(0, 0, W, H)
            const t = frame * 0.018

            const cx = W * 0.5, cy = H * 0.5
            const R = Math.min(W, H) * 0.36

            ctx.strokeStyle = 'rgba(123,140,255,0.12)'
            ctx.lineWidth = 1
            ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.stroke()
            ctx.beginPath(); ctx.arc(cx, cy, R * 0.5, 0, Math.PI * 2); ctx.stroke()

            const drawAxis = (angle: number, label: string, color: string) => {
                const ex = cx + R * Math.cos(angle), ey = cy + R * Math.sin(angle)
                ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(ex, ey)
                ctx.strokeStyle = color; ctx.lineWidth = 1.5; ctx.stroke()
                ctx.fillStyle = color; ctx.font = '12px JetBrains Mono'; ctx.textAlign = 'center'
                ctx.fillText(label, cx + (R + 20) * Math.cos(angle), cy + (R + 20) * Math.sin(angle))
                ctx.beginPath(); ctx.arc(ex, ey, 4, 0, Math.PI * 2); ctx.fillStyle = color; ctx.fill()
            }

            drawAxis(-Math.PI / 2, '|H⟩', 'rgba(123,140,255,0.8)')
            drawAxis(Math.PI / 2, '|V⟩', 'rgba(77,217,255,0.8)')

            const stateAngle = -Math.PI / 2 + t * 0.4
            const stateX = cx + R * 0.85 * Math.cos(stateAngle)
            const stateY = cy + R * 0.85 * Math.sin(stateAngle)

            const grad = ctx.createLinearGradient(cx, cy, stateX, stateY)
            grad.addColorStop(0, 'rgba(176,111,255,0)')
            grad.addColorStop(1, 'rgba(176,111,255,0.9)')
            ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(stateX, stateY)
            ctx.strokeStyle = grad; ctx.lineWidth = 2.5; ctx.stroke()

            ctx.beginPath(); ctx.arc(stateX, stateY, 6, 0, Math.PI * 2)
            ctx.fillStyle = 'var(--accent2)'; ctx.fill()
            ctx.shadowBlur = 12; ctx.shadowColor = 'var(--accent2)'; ctx.fill(); ctx.shadowBlur = 0

            ctx.fillStyle = 'rgba(176,111,255,0.9)'; ctx.font = '12px JetBrains Mono'
            ctx.fillText('|ψ⟩', stateX + 14, stateY)

            // const projH_x = cx + R * 0.85 * Math.cos(stateAngle) * Math.cos(-Math.PI / 2 - (-Math.PI / 2)) * Math.cos(stateAngle - (-Math.PI / 2))
            const pH = Math.cos(stateAngle - (-Math.PI / 2))
            const pV = Math.sin(stateAngle - (-Math.PI / 2))

            ctx.setLineDash([4, 4])
            ctx.strokeStyle = 'rgba(123,140,255,0.35)'; ctx.lineWidth = 1
            ctx.beginPath()
            ctx.moveTo(stateX, stateY)
            ctx.lineTo(cx + R * 0.85 * pH * Math.cos(-Math.PI / 2), cy + R * 0.85 * pH * Math.sin(-Math.PI / 2))
            ctx.stroke()
            ctx.beginPath()
            ctx.moveTo(stateX, stateY)
            ctx.lineTo(cx + R * 0.85 * pV * Math.cos(Math.PI / 2), cy + R * 0.85 * pV * Math.sin(Math.PI / 2))
            ctx.stroke()
            ctx.setLineDash([])

            const AH = Math.abs(pH), AV = Math.abs(pV)
            ctx.fillStyle = 'rgba(180,180,220,0.5)'; ctx.font = '11px JetBrains Mono'; ctx.textAlign = 'left'
            ctx.fillText(`A_H = ${AH.toFixed(2)}, A_V = ${AV.toFixed(2)}`, 12, H - 16)
            ctx.fillText(`|A_H|² + |A_V|² = ${(AH * AH + AV * AV).toFixed(2)}`, 12, H - 32)

            frame++
            raf = requestAnimationFrame(draw)
        }

        draw()
        return () => cancelAnimationFrame(raf)
    }, [])

    return (
        <div className={styles.vizBox}>
            <div className={styles.vizLabel}>
                <span className={styles.vizTag}>Анимация</span>
                Вектор состояния |ψ⟩ во 2D гильбертовом пространстве — базис {'{'} |H⟩, |V⟩ {'}'}
            </div>
            <canvas ref={canvasRef} width={500} height={280} className={styles.canvas} />
            <p className={styles.caption}>Любое состояние фотона — суперпозиция |H⟩ и |V⟩. Штриховые линии — проекции на базисные векторы.</p>
        </div>
    )
}

function ExerciseBlock({ number, text, answer, explanation }: { number: string; text: string; answer: string; explanation: string }) {
    const [shown, setShown] = useState(false)
    return (
        <div className={styles.exercise}>
            <div className={styles.exHeader}>
                <span className={styles.exNum}>Упражнение {number}</span>
            </div>
            <p className={styles.exText}>{text}</p>
            <button className={styles.exBtn} onClick={() => setShown(s => !s)}>
                {shown ? 'Скрыть решение' : 'Показать решение'}
            </button>
            {shown && (
                <div className={styles.exAnswer}>
                    <strong style={{ color: 'var(--green)' }}>{answer}</strong>
                    <p style={{ marginTop: 6, fontSize: 13, fontFamily: 'var(--font-mono)', color: 'var(--text-dim)' }}>{explanation}</p>
                </div>
            )}
        </div>
    )
}