import type { Block } from '../types/constructor'

/**
 * Генерирует все файлы финального React+Vite проекта с конспектом.
 * Возвращает объект { 'путь/к/файлу': 'содержимое' }
 */
export function generateProjectFiles(
    blocks: Block[],
    noteTitle: string,
    projectName: string
): Record<string, string> {
    const files: Record<string, string> = {}

    // package.json — с vite-plugin-singlefile и imagemin
    files['package.json'] = JSON.stringify({
        name: projectName,
        private: true,
        version: '1.0.0',
        type: 'module',
        scripts: {
            dev: 'vite',
            build: 'tsc -b && vite build',
            preview: 'vite preview',
        },
        dependencies: {
            react: '^19.0.0',
            'react-dom': '^19.0.0',
            'react-syntax-highlighter': '^16.1.1',
            animejs: '^3.2.2',
        },
        devDependencies: {
            '@vitejs/plugin-react': '^6.0.0',
            '@types/react': '^19.0.0',
            '@types/react-dom': '^19.0.0',
            '@types/react-syntax-highlighter': '^15.5.13',
            typescript: '~5.9.0',
            vite: '^8.0.0',
            'vite-plugin-singlefile': '^2.0.0',    // ← собирает в один HTML
            'vite-plugin-imagemin': '^0.6.1',       // ← сжимает фото без потери качества
        },
    }, null, 2)

    // tsconfig.json
    files['tsconfig.json'] = JSON.stringify({
        files: [],
        references: [{ path: './tsconfig.app.json' }, { path: './tsconfig.node.json' }],
    }, null, 2)

    files['tsconfig.app.json'] = JSON.stringify({
        compilerOptions: {
            target: 'ES2020',
            useDefineForClassFields: true,
            lib: ['ES2020', 'DOM', 'DOM.Iterable'],
            module: 'ESNext',
            skipLibCheck: true,
            moduleResolution: 'bundler',
            allowImportingTsExtensions: true,
            isolatedModules: true,
            moduleDetection: 'force',
            noEmit: true,
            jsx: 'react-jsx',
            strict: true,
        },
        include: ['src'],
    }, null, 2)

    files['tsconfig.node.json'] = JSON.stringify({
        compilerOptions: {
            target: 'ES2022',
            lib: ['ES2023'],
            module: 'ESNext',
            moduleResolution: 'bundler',
            skipLibCheck: true,
        },
        include: ['vite.config.ts'],
    }, null, 2)

    // vite.config.ts — КЛЮЧЕВОЙ ФАЙЛ
    // viteSingleFile — всё (JS, CSS, шрифты) inline в один HTML
    // viteImagemin — сжимает картинки при сборке
    files['vite.config.ts'] = `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile'
import viteImagemin from 'vite-plugin-imagemin'

export default defineConfig({
  plugins: [
    react(),
    // ВАЖНО: viteSingleFile должен идти ПОСЛЕ react()
    // Он встраивает весь JS/CSS в index.html как <script> и <style>
    viteSingleFile(),
    // Сжимает PNG/JPG/WebP без потери качества при сборке
    viteImagemin({
      gifsicle: { optimizationLevel: 7 },
      optipng: { optimizationLevel: 7 },
      mozjpeg: { quality: 80 },
      webp: { quality: 80 },
    }),
  ],
  build: {
    outDir: 'build',
    emptyOutDir: true,
    // Отключаем хеширование имён файлов (index.html остаётся index.html)
    // Если хочешь назвать как проект — переименуй после сборки
    rollupOptions: {
      output: {
        // Отключаем хеши в именах
        entryFileNames: 'assets/[name].js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name].[ext]',
      },
    },
  },
})
`

    // index.html — название = имя проекта (не хешированное)
    files['index.html'] = `<!doctype html>
<html lang="ru">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${noteTitle}</title>
    <!-- Шрифты -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600&family=Crimson+Pro:ital,wght@0,400;0,600;1,400&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`

    // src/main.tsx
    files['src/main.tsx'] = `import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Note from './Note'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Note />
  </StrictMode>,
)
`

    // src/index.css — те же CSS-переменные что в оригинальном проекте
    files['src/index.css'] = `:root {
  --bg: #0a0a0f;
  --bg-card: #0f0f1a;
  --bg-card2: #13131f;
  --border: rgba(100, 120, 200, 0.12);
  --border-bright: rgba(120, 150, 255, 0.25);
  --text: #e8e8f0;
  --text-dim: #8888aa;
  --text-dimmer: #55556a;
  --accent: #7b8cff;
  --accent2: #b06fff;
  --accent3: #4dd9ff;
  --gold: #e0c87a;
  --green: #4dffb0;
  --radius: 12px;
  --font-body: 'Manrope', sans-serif;
  --font-serif: 'Crimson Pro', serif;
  --font-mono: 'JetBrains Mono', monospace;
}
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; }
body {
  background: var(--bg);
  color: var(--text);
  font-family: var(--font-body);
  font-size: 15px;
  line-height: 1.75;
  -webkit-font-smoothing: antialiased;
}
::-webkit-scrollbar { width: 5px; }
::-webkit-scrollbar-track { background: var(--bg); }
::-webkit-scrollbar-thumb { background: var(--border-bright); border-radius: 99px; }
`

    // Генерируем сам конспект как React-компонент
    files['src/Note.tsx'] = generateNoteComponent(blocks, noteTitle)

    return files
}

/**
 * Генерирует React-компонент конспекта из массива блоков.
 * Использует те же компоненты что в оригинальном проекте.
 */
function generateNoteComponent(blocks: Block[], noteTitle: string): string {
    // Сериализуем блоки в JSON для embed в компонент
    const blocksJson = JSON.stringify(blocks, null, 2)
        .replace(/</g, '\\u003c')  // экранируем чтобы не сломать JSX

    return `import { useState, useEffect, useRef } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'

// Данные конспекта (сгенерировано автоматически)
const NOTE_TITLE = ${JSON.stringify(noteTitle)}
const BLOCKS = ${blocksJson}

export default function Note() {
  return (
    <div style={{ minHeight: '100vh', maxWidth: 900, margin: '0 auto', padding: '60px 40px 80px' }}>
      <header style={{ marginBottom: 48 }}>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2rem,4vw,3.2rem)', fontWeight: 600, color: 'var(--text)', letterSpacing: '0.04em', marginBottom: 20 }}>
          {NOTE_TITLE}
        </h1>
        <div style={{ height: 1, background: 'linear-gradient(90deg, var(--accent), var(--accent2), transparent)', opacity: 0.4 }} />
      </header>

      <main style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
        {BLOCKS.map((block: any) => <Block key={block.id} block={block} />)}
      </main>
    </div>
  )
}

function Block({ block }: { block: any }) {
  switch (block.type) {
    case 'header':    return <NoteHeader block={block} />
    case 'theory':    return <NoteTheory block={block} />
    case 'python':    return <NotePython block={block} />
    case 'image':     return <NoteImage block={block} />
    case 'animation': return <NoteAnimation block={block} />
    case 'exercise':  return <NoteExercise block={block} />
    case 'divider':   return <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '8px 0' }} />
    default:          return null
  }
}

function NoteHeader({ block }: { block: any }) {
  const sizes: Record<number,string> = { 1: '2.2rem', 2: '1.5rem', 3: '1.15rem' }
  const Tag = \`h\${block.level}\` as any
  return <Tag style={{ fontFamily: 'var(--font-serif)', fontSize: sizes[block.level], fontWeight: 600, color: 'var(--text)', marginBottom: 8 }}>{block.content}</Tag>
}

function renderMd(text: string) {
  return text.split(/(\\*\\*[^*]+\\*\\*|_[^_]+_|\`[^\`]+\`)/g).map((p: string, i: number) => {
    if (p.startsWith('**') && p.endsWith('**')) return <strong key={i} style={{color:'var(--accent)'}}>{p.slice(2,-2)}</strong>
    if (p.startsWith('_') && p.endsWith('_')) return <em key={i}>{p.slice(1,-1)}</em>
    if (p.startsWith('\`') && p.endsWith('\`')) return <code key={i} style={{fontFamily:'var(--font-mono)',color:'var(--accent3)',background:'rgba(77,217,255,0.1)',padding:'0 4px',borderRadius:4}}>{p.slice(1,-1)}</code>
    return p
  })
}

function NoteTheory({ block }: { block: any }) {
  return (
    <div style={{ background: block.highlight ? 'rgba(123,140,255,0.07)' : 'var(--bg-card)', border: \`1px solid \${block.highlight ? 'var(--border-bright)' : 'var(--border)'}\`, borderRadius: 'var(--radius)', padding: '20px 24px', color: 'var(--text)' }}>
      {block.content.split('\\n\\n').map((p: string, i: number) => <p key={i} style={{marginBottom: 12}}>{renderMd(p)}</p>)}
    </div>
  )
}

function NotePython({ block }: { block: any }) {
  const [copied, setCopied] = useState(false)
  return (
    <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', padding: '10px 16px', borderBottom: '1px solid var(--border)', gap: 8 }}>
        <div style={{ display: 'flex', gap: 6 }}>
          {['#ff5f57','#febc2e','#28c840'].map(c => <span key={c} style={{ width: 12, height: 12, borderRadius: '50%', background: c, display: 'block' }} />)}
        </div>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--accent)', marginLeft: 8 }}>Python</span>
        {block.title && <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-dim)' }}>{block.title}</span>}
        <button onClick={() => { navigator.clipboard.writeText(block.content); setCopied(true); setTimeout(()=>setCopied(false),2000) }}
          style={{ marginLeft: 'auto', background: 'rgba(123,140,255,0.1)', border: '1px solid var(--border)', borderRadius: 6, color: 'var(--text-dim)', padding: '3px 10px', cursor: 'pointer', fontSize: 12, fontFamily: 'var(--font-body)' }}>
          {copied ? '✓ Скопировано' : 'Копировать'}
        </button>
      </div>
      {block.description && <p style={{ padding: '8px 16px', fontSize: 12, color: 'var(--text-dim)', borderBottom: '1px solid var(--border)' }}>{block.description}</p>}
      <SyntaxHighlighter language="python" style={vscDarkPlus} customStyle={{ margin: 0, padding: '20px 24px', background: 'transparent', fontSize: 13, fontFamily: 'var(--font-mono)', lineHeight: 1.7 }} showLineNumbers lineNumberStyle={{ color: 'rgba(150,150,180,0.3)', minWidth: '2.5em' }}>
        {block.content}
      </SyntaxHighlighter>
    </div>
  )
}

function NoteImage({ block }: { block: any }) {
  if (!block.src) return null
  return (
    <figure style={{ margin: 0 }}>
      <img src={block.src} alt={block.alt} style={{ width: '100%', maxHeight: 400, objectFit: block.fit ?? 'cover', borderRadius: block.borderRadius ?? 8, filter: \`brightness(\${block.brightness ?? 100}%) contrast(\${block.contrast ?? 100}%)\` }} />
      {block.caption && <figcaption style={{ textAlign: 'center', fontSize: 13, color: 'var(--text-dim)', fontStyle: 'italic', marginTop: 8 }}>{block.caption}</figcaption>}
    </figure>
  )
}

function NoteAnimation({ block }: { block: any }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return
    const ctx = canvas.getContext('2d')!
    const W = canvas.width, H = canvas.height
    let frame = 0, raf: number
    const p = block.params
    const draw = () => {
      ctx.clearRect(0, 0, W, H)
      const t = frame * 0.03 * (p.speed ?? 1)
      const amp = ((p.amplitude ?? 50) / 100) * (H * 0.4)
      if (block.animType === 'wave') {
        for (let w = 0; w < 3; w++) {
          ctx.beginPath()
          for (let x = 0; x < W; x++) { const y = H/2 + amp * Math.sin((x/W)*Math.PI*(4+w)+t+w*1.2); x===0?ctx.moveTo(x,y):ctx.lineTo(x,y) }
          ctx.strokeStyle = ['rgba(123,140,255,0.8)','rgba(176,111,255,0.5)','rgba(77,217,255,0.3)'][w]; ctx.lineWidth = 2-w*0.5; ctx.stroke()
        }
      } else if (block.animType === 'particles') {
        for (let i = 0; i < 30; i++) {
          const px=(Math.sin(t*0.7+i*1.3)*0.5+0.5)*W, py=(Math.cos(t*0.5+i*0.9)*0.5+0.5)*H
          ctx.beginPath(); ctx.arc(px,py,3,0,Math.PI*2); ctx.fillStyle=['#7b8cff','#b06fff','#4dd9ff','#4dffb0'][i%4]; ctx.fill()
        }
      } else if (block.animType === 'heisenberg') {
        for (let i=0;i<3;i++) { const sx=30+20*Math.sin(t+i*2.1),sp=1/(sx*0.012),cx=W*0.25+i*(W*0.25),cy=H*0.5; const g=ctx.createRadialGradient(cx,cy,0,cx,cy,sx); g.addColorStop(0,'rgba(123,140,255,0.85)'); g.addColorStop(1,'rgba(123,140,255,0)'); ctx.beginPath(); ctx.ellipse(cx,cy,sx,Math.max(2,sp*1.5),0,0,Math.PI*2); ctx.fillStyle=g; ctx.fill() }
      } else if (block.animType === 'bloch') {
        const cx=W/2,cy=H/2,R=Math.min(W,H)*0.38; ctx.strokeStyle='rgba(123,140,255,0.15)'; ctx.lineWidth=1; ctx.beginPath(); ctx.arc(cx,cy,R,0,Math.PI*2); ctx.stroke()
        const sx=cx+R*0.85*Math.sin(t*0.6)*Math.cos(t*0.4),sy=cy+R*0.85*Math.cos(t*0.6)
        ctx.beginPath(); ctx.moveTo(cx,cy); ctx.lineTo(sx,sy); ctx.strokeStyle='#b06fff'; ctx.lineWidth=2.5; ctx.stroke()
        ctx.beginPath(); ctx.arc(sx,sy,6,0,Math.PI*2); ctx.fillStyle='#b06fff'; ctx.fill()
      }
      frame++; raf=requestAnimationFrame(draw)
    }
    draw(); return ()=>cancelAnimationFrame(raf)
  }, [])
  return (
    <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden', padding: '16px' }}>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--accent)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 8, display: 'block' }}>Анимация</span>
      <canvas ref={canvasRef} width={700} height={200} style={{ width: '100%', borderRadius: 8 }} />
      {block.caption && <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--text-dim)', marginTop: 8 }}>{block.caption}</p>}
    </div>
  )
}

function NoteExercise({ block }: { block: any }) {
  const [shown, setShown] = useState(false)
  return (
    <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '20px 24px' }}>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--accent)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 12 }}>Упражнение {block.number ?? ''}</div>
      <p style={{ marginBottom: 16, color: 'var(--text)' }}>{block.question}</p>
      <button onClick={()=>setShown(s=>!s)} style={{ background: 'rgba(123,140,255,0.1)', border: '1px solid var(--border-bright)', borderRadius: 8, color: 'var(--accent)', padding: '8px 18px', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: 13 }}>
        {shown ? 'Скрыть решение' : 'Показать решение'}
      </button>
      {shown && (
        <div style={{ marginTop: 16, padding: '12px 16px', background: 'rgba(77,255,176,0.05)', border: '1px solid rgba(77,255,176,0.2)', borderRadius: 8 }}>
          <strong style={{ color: 'var(--green)' }}>{block.answer}</strong>
          <p style={{ marginTop: 6, fontSize: 13, fontFamily: 'var(--font-mono)', color: 'var(--text-dim)' }}>{block.explanation}</p>
        </div>
      )}
    </div>
  )
}
`
}
