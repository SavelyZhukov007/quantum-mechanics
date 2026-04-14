// Все возможные типы блоков конспекта
export type BlockType =
    | 'header'
    | 'theory'
    | 'python'
    | 'image'
    | 'animation'
    | 'exercise'
    | 'divider'

// Базовый интерфейс блока
interface BaseBlock {
    id: string
    type: BlockType
}

export interface HeaderBlock extends BaseBlock {
    type: 'header'
    content: string
    level: 1 | 2 | 3
}

export interface TheoryBlock extends BaseBlock {
    type: 'theory'
    content: string
    highlight?: boolean
}

export interface PythonBlock extends BaseBlock {
    type: 'python'
    content: string
    title: string
    description: string
}

export interface ImageBlock extends BaseBlock {
    type: 'image'
    src: string         // base64 или URL
    caption: string
    alt: string
    fit?: 'cover' | 'contain'
    borderRadius?: number
    brightness?: number
    contrast?: number
}

export interface AnimationBlock extends BaseBlock {
    type: 'animation'
    animType: 'wave' | 'particles' | 'heisenberg' | 'bloch'
    params: {
        amplitude?: number
        frequency?: number
        speed?: number
        color?: string
        count?: number
    }
    caption?: string
}

export interface ExerciseBlock extends BaseBlock {
    type: 'exercise'
    question: string
    answer: string
    explanation: string
    number?: string
}

export interface DividerBlock extends BaseBlock {
    type: 'divider'
}

// Объединённый тип
export type Block =
    | HeaderBlock
    | TheoryBlock
    | PythonBlock
    | ImageBlock
    | AnimationBlock
    | ExerciseBlock
    | DividerBlock

// Метаданные для панели добавления блоков
export interface BlockMeta {
    type: BlockType
    label: string
    icon: string
    description: string
}

export const BLOCK_REGISTRY: BlockMeta[] = [
    { type: 'header',    label: 'Заголовок',      icon: '𝐇',  description: 'H1 / H2 / H3' },
    { type: 'theory',    label: 'Теория',          icon: '📖', description: 'Текстовый блок с подсветкой' },
    { type: 'python',    label: 'Python код',      icon: '🐍', description: 'Блок кода с подсветкой синтаксиса' },
    { type: 'image',     label: 'Изображение',     icon: '🖼', description: 'Фото / рисунок с подписью' },
    { type: 'animation', label: 'Анимация',        icon: '✨', description: 'Встроенная визуализация' },
    { type: 'exercise',  label: 'Задача',          icon: '🧩', description: 'Упражнение с ответом' },
    { type: 'divider',   label: 'Разделитель',     icon: '─',  description: 'Горизонтальная черта' },
]
