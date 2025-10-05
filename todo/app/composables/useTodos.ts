import type { Todo } from '~/types/todo'

export default function useToast() {
  const { todos } = useLocalStorageTodos()

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

  return {
    todos,
    addTodo,
    updateTodo,
    removeTodo,
  }
}
