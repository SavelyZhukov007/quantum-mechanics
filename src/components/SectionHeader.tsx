import { useEffect, useRef } from 'react'
import anime from 'animejs'
import styles from './SectionHeader.module.css'

interface Props {
    number: string
    title: string
}

export default function SectionHeader({ number, title }: Props) {
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    anime({
                        targets: ref.current?.querySelectorAll('.sh-el'),
                        opacity: [0, 1],
                        translateX: [-20, 0],
                        delay: anime.stagger(80),
                        easing: 'easeOutExpo',
                        duration: 700,
                    })
                    observer.disconnect()
                }
            },
            { threshold: 0.3 }
        )
        if (ref.current) observer.observe(ref.current)
        return () => observer.disconnect()
    }, [])

    return (
        <div className={styles.wrapper} ref={ref}>
            <span className={`${styles.number} sh-el`}>{number}</span>
            <h2 className={`${styles.title} sh-el`}>{title}</h2>
        </div>
    )
}