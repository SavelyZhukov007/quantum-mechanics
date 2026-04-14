import { useState, useEffect, useRef } from "react";
import type {
  Block,
  HeaderBlock,
  TheoryBlock,
  PythonBlock,
  ImageBlock,
  AnimationBlock,
  ExerciseBlock,
} from "../../types/constructor";
import styles from "./BlockEditor.module.css";

interface Props {
  block: Block;
  isSelected: boolean;
  isFirst: boolean;
  isLast: boolean;
  onSelect: () => void;
  onUpdate: (updates: Partial<Block>) => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDuplicate: () => void;
}

export function BlockEditor({
  block,
  isSelected,
  isFirst,
  isLast,
  onSelect,
  onUpdate,
  onDelete,
  onMoveUp,
  onMoveDown,
  onDuplicate,
}: Props) {
  return (
    <div
      className={`${styles.wrapper} ${isSelected ? styles.selected : ""}`}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
    >
      {/* Тулбар блока — появляется при выделении */}
      {isSelected && (
        <div className={styles.toolbar}>
          <span className={styles.blockTypeTag}>
            {BLOCK_LABELS[block.type]}
          </span>
          <div className={styles.toolbarActions}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onMoveUp();
              }}
              disabled={isFirst}
              title="Вверх"
            >
              ↑
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onMoveDown();
              }}
              disabled={isLast}
              title="Вниз"
            >
              ↓
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDuplicate();
              }}
              title="Дублировать"
            >
              ⎘
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              title="Удалить"
              className={styles.deleteBtn}
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Тело редактора */}
      <div className={styles.body}>
        {block.type === "header" && (
          <HeaderEditor block={block} onUpdate={onUpdate} />
        )}
        {block.type === "theory" && (
          <TheoryEditor block={block} onUpdate={onUpdate} />
        )}
        {block.type === "python" && (
          <PythonEditor block={block} onUpdate={onUpdate} />
        )}
        {block.type === "image" && (
          <ImageEditor block={block} onUpdate={onUpdate} />
        )}
        {block.type === "animation" && (
          <AnimationEditor block={block} onUpdate={onUpdate} />
        )}
        {block.type === "exercise" && (
          <ExerciseEditor block={block} onUpdate={onUpdate} />
        )}
        {block.type === "divider" && <div className={styles.divider} />}
      </div>
    </div>
  );
}

const BLOCK_LABELS: Record<Block["type"], string> = {
  header: "Заголовок",
  theory: "Теория",
  python: "Python",
  image: "Изображение",
  animation: "Анимация",
  exercise: "Задача",
  divider: "Разделитель",
};

// ───────────────────────────── Редакторы блоков ─────────────────────────────

function HeaderEditor({
  block,
  onUpdate,
}: {
  block: HeaderBlock;
  onUpdate: (u: Partial<Block>) => void;
}) {
  return (
    <div className={styles.headerEditor}>
      <div className={styles.row}>
        <label>Уровень:</label>
        <select
          value={block.level}
          onChange={(e) =>
            onUpdate({ level: Number(e.target.value) as 1 | 2 | 3 })
          }
        >
          <option value={1}>H1 — Главный</option>
          <option value={2}>H2 — Раздел</option>
          <option value={3}>H3 — Подраздел</option>
        </select>
      </div>
      <input
        className={styles.headerInput}
        value={block.content}
        onChange={(e) => onUpdate({ content: e.target.value })}
        placeholder="Текст заголовка..."
        style={{
          fontSize: block.level === 1 ? 26 : block.level === 2 ? 20 : 16,
        }}
      />
    </div>
  );
}

function TheoryEditor({
  block,
  onUpdate,
}: {
  block: TheoryBlock;
  onUpdate: (u: Partial<Block>) => void;
}) {
  return (
    <div className={styles.theoryEditor}>
      <div className={styles.row}>
        <label>
          <input
            type="checkbox"
            checked={!!block.highlight}
            onChange={(e) => onUpdate({ highlight: e.target.checked })}
          />
          &nbsp;Выделенный блок (яркая рамка)
        </label>
      </div>
      <textarea
        className={styles.textarea}
        value={block.content}
        onChange={(e) => onUpdate({ content: e.target.value })}
        placeholder="Введите текст теории. Поддерживается **жирный**, _курсив_, `код`..."
        rows={5}
      />
      <div className={styles.hint}>
        Поддерживается базовый Markdown: **жирный**, _курсив_, `код`
      </div>
    </div>
  );
}

function PythonEditor({
  block,
  onUpdate,
}: {
  block: PythonBlock;
  onUpdate: (u: Partial<Block>) => void;
}) {
  return (
    <div className={styles.pythonEditor}>
      <div className={styles.rowDouble}>
        <div className={styles.field}>
          <label>Имя файла</label>
          <input
            value={block.title}
            onChange={(e) => onUpdate({ title: e.target.value })}
            placeholder="script.py"
          />
        </div>
        <div className={styles.field}>
          <label>Описание</label>
          <input
            value={block.description}
            onChange={(e) => onUpdate({ description: e.target.value })}
            placeholder="Краткое описание..."
          />
        </div>
      </div>
      <textarea
        className={`${styles.textarea} ${styles.monotextarea}`}
        value={block.content}
        onChange={(e) => onUpdate({ content: e.target.value })}
        placeholder="# Ваш Python код здесь..."
        rows={10}
        spellCheck={false}
      />
    </div>
  );
}

function ImageEditor({
  block,
  onUpdate,
}: {
  block: ImageBlock;
  onUpdate: (u: Partial<Block>) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => onUpdate({ src: ev.target?.result as string });
    reader.readAsDataURL(file);
  };

  return (
    <div className={styles.imageEditor}>
      {/* Превью */}
      {block.src ? (
        <div
          className={styles.imagePreviewWrap}
          style={{
            filter: `brightness(${block.brightness ?? 100}%) contrast(${block.contrast ?? 100}%)`,
          }}
        >
          <img
            src={block.src}
            alt={block.alt}
            className={styles.imagePreview}
            style={{
              objectFit: block.fit ?? "cover",
              borderRadius: block.borderRadius ?? 8,
            }}
          />
        </div>
      ) : (
        <div
          className={styles.imagePlaceholder}
          onClick={() => fileRef.current?.click()}
        >
          <span>🖼</span>
          <span>Нажмите чтобы загрузить изображение</span>
        </div>
      )}

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleFile}
      />

      <div className={styles.imageControls}>
        <button
          className={styles.uploadBtn}
          onClick={() => fileRef.current?.click()}
        >
          {block.src ? "↺ Заменить" : "↑ Загрузить"}
        </button>
        {block.src && (
          <button
            className={styles.clearBtn}
            onClick={() => onUpdate({ src: "" })}
          >
            ✕
          </button>
        )}
      </div>

      <div className={styles.rowDouble}>
        <div className={styles.field}>
          <label>Подпись</label>
          <input
            value={block.caption}
            onChange={(e) => onUpdate({ caption: e.target.value })}
            placeholder="Подпись к изображению..."
          />
        </div>
        <div className={styles.field}>
          <label>Alt-текст</label>
          <input
            value={block.alt}
            onChange={(e) => onUpdate({ alt: e.target.value })}
            placeholder="Описание для доступности..."
          />
        </div>
      </div>

      <div className={styles.rowDouble}>
        <div className={styles.field}>
          <label>Отображение</label>
          <select
            value={block.fit ?? "cover"}
            onChange={(e) =>
              onUpdate({ fit: e.target.value as "cover" | "contain" })
            }
          >
            <option value="cover">Cover (обрезать)</option>
            <option value="contain">Contain (вписать)</option>
          </select>
        </div>
        <div className={styles.field}>
          <label>Скругление: {block.borderRadius ?? 8}px</label>
          <input
            type="range"
            min={0}
            max={40}
            value={block.borderRadius ?? 8}
            onChange={(e) => onUpdate({ borderRadius: Number(e.target.value) })}
          />
        </div>
      </div>

      <div className={styles.rowDouble}>
        <div className={styles.field}>
          <label>Яркость: {block.brightness ?? 100}%</label>
          <input
            type="range"
            min={50}
            max={150}
            value={block.brightness ?? 100}
            onChange={(e) => onUpdate({ brightness: Number(e.target.value) })}
          />
        </div>
        <div className={styles.field}>
          <label>Контраст: {block.contrast ?? 100}%</label>
          <input
            type="range"
            min={50}
            max={150}
            value={block.contrast ?? 100}
            onChange={(e) => onUpdate({ contrast: Number(e.target.value) })}
          />
        </div>
      </div>
    </div>
  );
}

const ANIM_TYPES = [
  { value: "wave", label: "Волна" },
  { value: "particles", label: "Частицы" },
  { value: "heisenberg", label: "Неопределённость" },
  { value: "bloch", label: "Сфера Блоха" },
];

function AnimationEditor({
  block,
  onUpdate,
}: {
  block: AnimationBlock;
  onUpdate: (u: Partial<Block>) => void;
}) {
  const p = block.params;

  return (
    <div className={styles.animEditor}>
      <div className={styles.row}>
        <label>Тип анимации</label>
        <select
          value={block.animType}
          onChange={(e) =>
            onUpdate({ animType: e.target.value as AnimationBlock["animType"] })
          }
        >
          {ANIM_TYPES.map((a) => (
            <option key={a.value} value={a.value}>
              {a.label}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.animPreview}>
        <AnimPreview type={block.animType} params={p} />
      </div>

      <div className={styles.rowDouble}>
        <div className={styles.field}>
          <label>Амплитуда: {p.amplitude ?? 50}</label>
          <input
            type="range"
            min={10}
            max={100}
            value={p.amplitude ?? 50}
            onChange={(e) =>
              onUpdate({ params: { ...p, amplitude: Number(e.target.value) } })
            }
          />
        </div>
        <div className={styles.field}>
          <label>Скорость: {p.speed ?? 1}</label>
          <input
            type="range"
            min={1}
            max={5}
            step={0.5}
            value={p.speed ?? 1}
            onChange={(e) =>
              onUpdate({ params: { ...p, speed: Number(e.target.value) } })
            }
          />
        </div>
      </div>

      <div className={styles.field}>
        <label>Подпись</label>
        <input
          value={block.caption ?? ""}
          onChange={(e) => onUpdate({ caption: e.target.value })}
          placeholder="Подпись под анимацией..."
        />
      </div>
    </div>
  );
}

// Мини-превью анимации в редакторе

function AnimPreview({
  type,
  params,
}: {
  type: AnimationBlock["animType"];
  params: AnimationBlock["params"];
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const W = canvas.width,
      H = canvas.height;
    let frame = 0;
    let raf: number;

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      const t = frame * 0.04 * (params.speed ?? 1);
      const amp = ((params.amplitude ?? 50) / 100) * (H * 0.4);

      if (type === "wave") {
        ctx.beginPath();
        for (let x = 0; x < W; x++) {
          const y = H / 2 + amp * Math.sin((x / W) * Math.PI * 4 + t);
          x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.strokeStyle = "#7b8cff";
        ctx.lineWidth = 2;
        ctx.stroke();
      } else if (type === "particles") {
        for (let i = 0; i < 20; i++) {
          const px = (Math.sin(t * 0.7 + i * 1.3) * 0.5 + 0.5) * W;
          const py = (Math.cos(t * 0.5 + i * 0.9) * 0.5 + 0.5) * H;
          ctx.beginPath();
          ctx.arc(px, py, 3, 0, Math.PI * 2);
          ctx.fillStyle =
            i % 3 === 0 ? "#7b8cff" : i % 3 === 1 ? "#b06fff" : "#4dd9ff";
          ctx.fill();
        }
      } else if (type === "heisenberg") {
        for (let i = 0; i < 3; i++) {
          const sx = 20 + 15 * Math.sin(t + i * 2.1);
          const sp = 1 / (sx * 0.015);
          const cx = W * (0.2 + i * 0.3),
            cy = H * 0.5;
          const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, sx);
          g.addColorStop(0, "rgba(123,140,255,0.8)");
          g.addColorStop(1, "rgba(123,140,255,0)");
          ctx.beginPath();
          ctx.ellipse(cx, cy, sx, Math.max(2, sp * 1.5), 0, 0, Math.PI * 2);
          ctx.fillStyle = g;
          ctx.fill();
        }
      } else if (type === "bloch") {
        const cx = W / 2,
          cy = H / 2,
          R = Math.min(W, H) * 0.35;
        ctx.strokeStyle = "rgba(123,140,255,0.2)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(cx, cy, R, 0, Math.PI * 2);
        ctx.stroke();
        const sx = cx + R * 0.8 * Math.sin(t * 0.7) * Math.cos(t * 0.4);
        const sy = cy + R * 0.8 * Math.cos(t * 0.7);
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(sx, sy);
        ctx.strokeStyle = "#b06fff";
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(sx, sy, 5, 0, Math.PI * 2);
        ctx.fillStyle = "#b06fff";
        ctx.fill();
      }

      frame++;
      raf = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(raf);
  }, [type, params]);

  return (
    <canvas
      ref={canvasRef}
      width={400}
      height={120}
      className={styles.animCanvas}
    />
  );
}

function ExerciseEditor({
  block,
  onUpdate,
}: {
  block: ExerciseBlock;
  onUpdate: (u: Partial<Block>) => void;
}) {
  return (
    <div className={styles.exerciseEditor}>
      <div className={styles.rowDouble}>
        <div className={styles.field}>
          <label>Номер задачи</label>
          <input
            value={block.number ?? ""}
            onChange={(e) => onUpdate({ number: e.target.value })}
            placeholder="1.1"
          />
        </div>
      </div>
      <div className={styles.field}>
        <label>Условие</label>
        <textarea
          value={block.question}
          onChange={(e) => onUpdate({ question: e.target.value })}
          placeholder="Условие задачи..."
          rows={3}
          className={styles.textarea}
        />
      </div>
      <div className={styles.rowDouble}>
        <div className={styles.field}>
          <label>Ответ</label>
          <input
            value={block.answer}
            onChange={(e) => onUpdate({ answer: e.target.value })}
            placeholder="Ответ..."
          />
        </div>
      </div>
      <div className={styles.field}>
        <label>Пояснение</label>
        <textarea
          value={block.explanation}
          onChange={(e) => onUpdate({ explanation: e.target.value })}
          placeholder="Подробное объяснение решения..."
          rows={3}
          className={styles.textarea}
        />
      </div>
    </div>
  );
}
