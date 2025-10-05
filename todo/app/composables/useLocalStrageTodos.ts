// composables/useLocalStorageTodos.ts
import { ref, watch, onMounted } from 'vue'
import type { Todo, TodoStatus, TodoPriority } from '~/types/todo'

export function useLocalStorageTodos() {
  const todos = ref<Todo[]>([])

  // 候補値を「タプル」として固定（T[number] で安全に取得できる）
  const STATUSES = ['未対応', '対応中', '対応完了'] as const satisfies readonly TodoStatus[]
  const PRIORITIES = ['高', '中', '低'] as const satisfies readonly TodoPriority[]

  // 配列から1つ取り出す（[]インデックスを使う。at() は使わない）
  const pickOne = <T extends readonly unknown[]>(arr: T): T[number] =>
    arr[Math.floor(Math.random() * arr.length)] as T[number]

  // 100件のテストデータを作成
  function generateTestTodos(count: number): Todo[] {
    const list: Todo[] = []
    for (let i = 1; i <= count; i++) {
      list.push({
        text: `サンプルタスク ${i}`,
        status: pickOne(STATUSES),    // → TodoStatus 型
        priority: pickOne(PRIORITIES) // → TodoPriority 型
      })
    }
    return list
  }

  onMounted(() => {
    const saved = localStorage.getItem('todos')
    if (saved) {
      todos.value = JSON.parse(saved)
      todos.value = generateTestTodos(100)
    } else {
      todos.value = generateTestTodos(100)
      localStorage.setItem('todos', JSON.stringify(todos.value))
    }
  })

  watch(
    todos,
    (newTodos) => {
      localStorage.setItem('todos', JSON.stringify(newTodos))
    },
    { deep: true }
  )

  return { todos }
}
