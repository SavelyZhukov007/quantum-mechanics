import { useEffect, useRef } from 'react'
// import anime from 'animejs'
import SectionHeader from '../SectionHeader'
import TheoryBlock from '../TheoryBlock'
import PythonBlock from '../PythonBlock'
import styles from './Section11.module.css'

const HEISENBERG_CODE = `import numpy as np
import matplotlib.pyplot as plt

hbar = 1.0545718e-34

sigma_x_vals = np.logspace(-20, 0, 500)
sigma_p_min = hbar / (2 * sigma_x_vals)

fig, axes = plt.subplots(1, 2, figsize=(12, 5))
fig.patch.set_facecolor('#0a0a0f')
for ax in axes:
    ax.set_facecolor('#0f0f1a')

axes[0].loglog(sigma_x_vals, sigma_p_min, color='#7b8cff', linewidth=2)
axes[0].axvline(1e-10, color='#4dffb0', linestyle='--', alpha=0.7, label='Атом (~1Å)')
axes[0].axvline(1e-30, color='#ff6b6b', linestyle='--', alpha=0.7, label='Электрон (~1e-30 м)')
axes[0].set_xlabel('σ_x (м)', color='#8888aa')
axes[0].set_ylabel('σ_p минимальная (кг·м/с)', color='#8888aa')
axes[0].set_title('Принцип неопределённости Гейзенберга', color='#e8e8f0')
axes[0].legend(facecolor='#13131f', edgecolor='#333', labelcolor='#e8e8f0')
axes[0].tick_params(colors='#8888aa')
axes[0].grid(True, alpha=0.15)

m_macro = 1.0
m_electron = 9.109e-31
sigma_x = np.logspace(-35, 0, 500)
sigma_p_macro = hbar / (2 * sigma_x)
sigma_v_macro = sigma_p_macro / m_macro
sigma_v_electron = sigma_p_macro / m_electron

axes[1].loglog(sigma_x, sigma_v_macro, color='#b06fff', linewidth=2, label='Макрообъект (1 кг)')
axes[1].loglog(sigma_x, sigma_v_electron, color='#4dd9ff', linewidth=2, label='Электрон')
axes[1].axhline(1e-17, color='#e0c87a', linestyle=':', alpha=0.7, label='Предел измерений')
axes[1].set_xlabel('σ_x (м)', color='#8888aa')
axes[1].set_ylabel('σ_v минимальная (м/с)', color='#8888aa')
axes[1].set_title('Неопределённость скорости vs координаты', color='#e8e8f0')
axes[1].legend(facecolor='#13131f', edgecolor='#333', labelcolor='#e8e8f0')
axes[1].tick_params(colors='#8888aa')
axes[1].grid(True, alpha=0.15)

plt.tight_layout()
plt.savefig('heisenberg.png', dpi=150, bbox_inches='tight', facecolor='#0a0a0f')
plt.show()

sigma_x_macro = 1e-17
sigma_p_macro_val = hbar / (2 * sigma_x_macro)
sigma_v_macro_val = sigma_p_macro_val / 1.0

sigma_x_electron = 1e-10
sigma_p_electron = hbar / (2 * sigma_x_electron)
sigma_v_electron_val = sigma_p_electron / m_electron

print(f"Макрообъект: σ_x={sigma_x_macro:.0e} м → σ_v={sigma_v_macro_val:.2e} м/с")
print(f"Электрон:    σ_x={sigma_x_electron:.0e} м → σ_v={sigma_v_electron_val:.2e} м/с")
print(f"σ_x·σ_p = ℏ/2 = {hbar/2:.3e} Дж·с ✓")`

export default function Section11() {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')!
        let frame = 0
        let raf: number

        const draw = () => {
            const W = canvas.width
            const H = canvas.height
            ctx.clearRect(0, 0, W, H)

            const t = frame * 0.025

            for (let i = 0; i < 3; i++) {
                const sigma_x = 30 + 20 * Math.sin(t + i * 2.1)
                const sigma_p = 1 / (sigma_x * 0.012)
                const cx = W * 0.25 + i * (W * 0.25)
                const cy = H * 0.5

                const gradX = ctx.createRadialGradient(cx, cy, 0, cx, cy, sigma_x)
                gradX.addColorStop(0, `rgba(123, 140, 255, 0.85)`)
                gradX.addColorStop(0.5, `rgba(123, 140, 255, 0.25)`)
                gradX.addColorStop(1, `rgba(123, 140, 255, 0)`)

                ctx.beginPath()
                ctx.ellipse(cx, cy, sigma_x, sigma_p * 1.5, 0, 0, Math.PI * 2)
                ctx.fillStyle = gradX
                ctx.fill()

                ctx.beginPath()
                ctx.ellipse(cx, cy, 3, 3, 0, 0, Math.PI * 2)
                ctx.fillStyle = '#4dffb0'
                ctx.fill()

                ctx.font = '10px JetBrains Mono'
                ctx.fillStyle = 'rgba(200,200,220,0.5)'
                ctx.textAlign = 'center'
                ctx.fillText(`σₓ·σₚ ≥ ℏ/2`, cx, cy + sigma_p * 1.5 + 18)
            }

            ctx.strokeStyle = 'rgba(123,140,255,0.08)'
            ctx.lineWidth = 1
            for (let x = 0; x < W; x += 40) {
                ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke()
            }
            for (let y = 0; y < H; y += 40) {
                ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke()
            }

            frame++
            raf = requestAnimationFrame(draw)
        }

        draw()
        return () => cancelAnimationFrame(raf)
    }, [])

    return (
        <section>
            <SectionHeader number="1.1" title="Предмет квантовой механики" />

            <TheoryBlock>
                <p>
                    Квантовая механика — это не описание конкретного класса физических явлений,
                    а <strong style={{ color: 'var(--accent)' }}>универсальная теоретическая основа</strong>, применимая во всех областях физики.
                    Подобно операционной системе компьютера, она обеспечивает базу для построения любых физических теорий.
                </p>
                <p>
                    Квантовый подход имеет смысл лишь для <em>микроскопических</em> физических систем.
                    Поведение макроскопических тел с высокой точностью описывается классической механикой — более простой и интуитивной.
                </p>
            </TheoryBlock>

            <div className={styles.heisenbergViz}>
                <div className={styles.vizLabel}>
                    <span className={styles.vizTag}>Анимация</span>
                    Принцип неопределённости Гейзенберга: <code>ΔpΔx ≥ ℏ/2</code>
                </div>
                <canvas
                    ref={canvasRef}
                    width={700}
                    height={180}
                    className={styles.canvas}
                />
                <p className={styles.vizCaption}>
                    Каждая «капля» — квантовое состояние частицы. Чем точнее координата (σₓ меньше) — тем размытее импульс (σₚ больше). Их произведение не может быть меньше ℏ/2.
                </p>
            </div>

            <HeisenbergInteractive />

            <TheoryBlock>
                <p>
                    Для макрообъекта массой ~1 кг измерить координату с точностью 10⁻¹⁷ м означало бы неопределённость скорости ~5·10⁻¹⁸ м/с — экспериментально недостижимо.
                    Для электрона (масса ~10⁻³⁰ кг) при координатной точности 10⁻¹⁰ м неопределённость скорости составит ~5·10⁻⁵ м²/с — уже значимо.
                </p>
            </TheoryBlock>

            <PythonBlock
                title="heisenberg_uncertainty.py"
                description="Визуализация принципа неопределённости Гейзенберга для макро- и микроскопических объектов"
                code={HEISENBERG_CODE}
            />
        </section>
    )
}

function HeisenbergInteractive() {
    const knobRef = useRef<HTMLDivElement>(null)
    const xBarRef = useRef<HTMLDivElement>(null)
    const pBarRef = useRef<HTMLDivElement>(null)
    const xValRef = useRef<HTMLSpanElement>(null)
    const pValRef = useRef<HTMLSpanElement>(null)

    const dragging = useRef(false)
    const sigma_x = useRef(50)

    const update = (val: number) => {
        const clamp = Math.max(5, Math.min(95, val))
        sigma_x.current = clamp
        const sigma_p = (100 - clamp + 5)
        if (knobRef.current) knobRef.current.style.left = `calc(${clamp}% - 10px)`
        if (xBarRef.current) xBarRef.current.style.width = `${clamp}%`
        if (pBarRef.current) pBarRef.current.style.width = `${sigma_p}%`
        if (xValRef.current) xValRef.current.textContent = `σₓ = ${(clamp * 0.01).toFixed(2)} нм`
        if (pValRef.current) pValRef.current.textContent = `σₚ = ${(sigma_p * 0.01).toFixed(2)} · ℏ/нм`
    }

    const onMouseDown = () => { dragging.current = true }
    const onMouseMove = (e: MouseEvent) => {
        if (!dragging.current) return
        const track = document.getElementById('heis-track')
        if (!track) return
        const rect = track.getBoundingClientRect()
        const pct = ((e.clientX - rect.left) / rect.width) * 100
        update(pct)
    }
    const onMouseUp = () => { dragging.current = false }

    useEffect(() => {
        window.addEventListener('mousemove', onMouseMove)
        window.addEventListener('mouseup', onMouseUp)
        update(50)
        return () => {
            window.removeEventListener('mousemove', onMouseMove)
            window.removeEventListener('mouseup', onMouseUp)
        }
    }, [])

    return (
        <div className={styles.interactive}>
            <div className={styles.interactiveTitle}>
                <span className={styles.vizTag}>Интерактив</span>
                Перетащите ползунок — наблюдайте за компромиссом неопределённостей
            </div>
            <div className={styles.trackWrap} id="heis-track">
                <div className={styles.track} />
                <div ref={knobRef} className={styles.knob} onMouseDown={onMouseDown} />
            </div>
            <div className={styles.bars}>
                <div className={styles.barRow}>
                    <span className={styles.barLabel}>Координата</span>
                    <div className={styles.barBg}>
                        <div ref={xBarRef} className={styles.barFill} style={{ background: 'var(--accent)' }} />
                    </div>
                    <span ref={xValRef} className={styles.barVal} />
                </div>
                <div className={styles.barRow}>
                    <span className={styles.barLabel}>Импульс</span>
                    <div className={styles.barBg}>
                        <div ref={pBarRef} className={styles.barFill} style={{ background: 'var(--accent2)' }} />
                    </div>
                    <span ref={pValRef} className={styles.barVal} />
                </div>
            </div>
            <p className={styles.constraint}>σₓ · σₚ ≥ ℏ/2 — всегда</p>
        </div>
    )
}