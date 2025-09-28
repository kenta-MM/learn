

import { ref, computed } from 'vue'
import type { Todo } from '~/types/todo'

export default function useToast() {
  const { todos } = useLocalStorageTodos()
  const sortKey = ref<keyof Todo | ''>('')
  const sortAsc = ref(true)

  const addTodo = (todo: Todo) => {
    todos.value.push(todo)
  }
  const updateTodo = (index: number, todo: Todo) => {
    todos.value[index] = { ...todo }
  }
  // 削除処理
  const removeTodo = (index: number) => {
    todos.value.splice(index, 1)
  }

  const sortBy = (key: 'text' | 'status' | 'priority') => {
    if (sortKey.value === key) {
      sortAsc.value = !sortAsc.value
    } else {
      sortKey.value = key
      sortAsc.value = true
    }
    todos.value.sort((a, b) => {
      if (a[key] < b[key]) {
        return sortAsc.value ? -1 : 1
      }
      if (a[key] > b[key]) {
        return sortAsc.value ? 1 : -1
      }
      return 0
    })
  }

  const sortedTodos = computed(() => {
    if (sortKey.value === '') {
      return todos.value
    }
    return [...todos.value].sort((a, b) => {
      const key = sortKey.value as keyof Todo
      if (a[key] < b[key]) {
        return sortAsc.value ? -1 : 1
      }
      if (a[key] > b[key]) {
        return sortAsc.value ? 1 : -1
      }
      return 0
    })
  })

  return {
    todos,
    sortKey,
    sortAsc,
    addTodo,
    updateTodo,
    removeTodo,
    sortBy,
    sortedTodos,
  }
}
