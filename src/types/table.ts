// 對齊方式
export type ColumnAlign = 'left' | 'center' | 'right'

export interface Column<T = any> {
  key: keyof T
  label: string
  width?: string
  align?: ColumnAlign
  slot?: boolean
}
