<template>
  <div>
    <!-- 横並びにする -->
    <div class="flex gap-2">
      <UAlert 
        title="学習用サンプル"
        description="このアプリはDBに保存せず、メモリ上だけで管理されます。"
        color="neutral"
        variant="outline"
        />
      <UButton label="登録" color="primary" @click="isOpenAdd = true" />
    
      <!-- 追加用モーダル -->
      <TodoModal
        v-model:isOpen="isOpenAdd"
        :modelValue="newTodo"
        mode="add"
        @submit="handleAdd"
      />
    </div> 

    <!-- 更新用モーダル -->
    <TodoModal
      v-model:isOpen="isOpenEdit"
      :modelValue="editTodo"
      mode="edit"
      @submit="handleUpdate"
    />
 
    <TodoTable
      v-if="todos.length"
      :todos="sortedTodos"
      :sortAsc="sortAsc"
      @sort="sortBy"
      @edit="openEdit"
      @remove="handleRemove"
    />
    <div v-if="todos.length > 0" class="space-y-2 mt-4">
   
    </div>
    <p v-else class="text-gray-500">まだ Todo はありません。</p>
  </div>
</template>


<script setup lang="ts">
import { ref } from 'vue'
import type { Todo } from '~/types/todo'
import { DEFAULT_TODO } from '~/types/todo'
import useTodos from '~/composables/useTodos'
import TodoModal from '~/components/TodoModal.vue'
import TodoTable from '~/components/TodoTable.vue'
import { useToast } from '#imports'

const toast = useToast()
const { todos, sortAsc, sortBy, sortedTodos, addTodo, updateTodo, removeTodo } = useTodos()  

const isOpenAdd = ref(false)
const isOpenEdit = ref(false)
const newTodo = ref<Todo>({ ...DEFAULT_TODO })
const editTodo = ref<Todo>({ ...DEFAULT_TODO })
const editIndex = ref<number | null>(null)

const handleAdd  = (todo: Todo) => {
  addTodo(todo)
  newTodo.value = { ...DEFAULT_TODO }
  isOpenAdd.value = false
  toast.add({title: '成功しました！', description: 'TODOを追加しました。',})
}

const handleUpdate  = (todo: Todo) => {
  if (editIndex.value === null) {
    return
  }
  updateTodo(editIndex.value, todo)
  toast.add({title: '成功しました！', description: 'TODOを更新しました。',})
  isOpenEdit.value = false
  editIndex.value = null
}

const handleRemove = (index: number) => {
  removeTodo(index)
  toast.add({title: '成功しました！', description: 'TODOを削除しました。',})
}

const openEdit = (index: number) => {
  editIndex.value = index
  editTodo.value = todos.value[index]!
  isOpenEdit.value = true
}
</script>