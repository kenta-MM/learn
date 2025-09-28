// Todoの進捗状態
export type TodoStatus = '未対応' | '対応中' | '対応完了'

// 優先度
export type TodoPriority =  '低' | '中' | '高'

// Todo全体の型
export interface Todo {
    text: string
    status: TodoStatus
    priority: TodoPriority
}

// 初期値
export const DEFAULT_TODO: Todo = {
    text: '',
    status: '未対応',
    priority: '低'
}