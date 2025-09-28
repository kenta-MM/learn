// composables/useLocalStorageTodos.ts
import { ref, watch, onMounted } from 'vue'
import type { Todo } from '~/types/todo'

export function useLocalStorageTodos() {
  const todos = ref<Todo[]>([])

  onMounted(() => {
    const saved = localStorage.getItem('todos')
    if (saved) {
      todos.value = JSON.parse(saved)
    }
  })

  watch(todos, (newTodos) => {
    localStorage.setItem('todos', JSON.stringify(newTodos))
  }, { deep: true })

  return { todos }
}
