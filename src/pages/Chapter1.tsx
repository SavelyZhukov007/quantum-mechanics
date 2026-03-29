import { useEffect, useRef } from 'react'
import anime from 'animejs'
import Section11 from '../components/sections/Section11'
import Section12 from '../components/sections/Section12'
import Section13 from '../components/sections/Section13'
import Section14 from '../components/sections/Section14'
import styles from './Chapter1.module.css'

export default function Chapter1() {
    const headerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        anime({
            targets: '.header-char',
            opacity: [0, 1],
            translateY: [30, 0],
            delay: anime.stagger(40),
            easing: 'easeOutExpo',
            duration: 900,
        })
        anime({
            targets: '.header-sub',
            opacity: [0, 1],
            translateY: [15, 0],
            delay: 600,
            easing: 'easeOutExpo',
            duration: 800,
        })
        anime({
            targets: '.section-block',
            opacity: [0, 1],
            translateY: [40, 0],
            delay: anime.stagger(120, { start: 400 }),
            easing: 'easeOutExpo',
            duration: 900,
        })
    }, [])

    const title = "Квантовые Постулаты"
    return (
        <div className={styles.page}>
            <div className={styles.particles}>
                {Array.from({ length: 30 }).map((_, i) => (
                    <ParticleDot key={i} index={i} />
                ))}
            </div>

            <header className={styles.header} ref={headerRef}>
                <div className={styles.chapterLabel}>Глава 1</div>
                <h1 className={styles.title}>
                    {title.split('').map((ch, i) => (
                        <span key={i} className="header-char" style={{ display: 'inline-block', whiteSpace: ch === ' ' ? 'pre' : 'normal' }}>
                            {ch}
                        </span>
                    ))}
                </h1>
                <p className={`${styles.epigraph} header-sub`}>
                    <em>А дальше — стоп.<br />А дальше, извини, стена.</em>
                </p>
                <div className={`${styles.headerLine} header-sub`} />
            </header>

            <main className={styles.main}>
                <div className="section-block"><Section11 /></div>
                <div className="section-block"><Section12 /></div>
                <div className="section-block"><Section13 /></div>
                <div className="section-block"><Section14 /></div>
            </main>

            <footer className={styles.footer}>
                <span>Отличная квантовая механика — Львовский</span>
            </footer>
        </div>
    )
}

function ParticleDot({ index }: { index: number }) {
    const ref = useRef<HTMLDivElement>(null)
    useEffect(() => {
        const el = ref.current
        if (!el) return
        anime({
            targets: el,
            translateX: () => anime.random(-120, 120),
            translateY: () => anime.random(-120, 120),
            opacity: [0, anime.random(0.15, 0.55), 0],
            scale: [0, anime.random(0.5, 1.5), 0],
            duration: () => anime.random(3000, 7000),
            delay: index * 200,
            loop: true,
            easing: 'easeInOutSine',
        })
    }, [index])

    const x = Math.random() * 100
    const y = Math.random() * 100
    const size = Math.random() * 3 + 1

    return (
        <div
            ref={ref}
            style={{
                position: 'absolute',
                left: `${x}%`,
                top: `${y}%`,
                width: size,
                height: size,
                borderRadius: '50%',
                background: index % 3 === 0 ? 'var(--accent)' : index % 3 === 1 ? 'var(--accent3)' : 'var(--accent2)',
                opacity: 0,
                pointerEvents: 'none',
            }}
        />
    )
}