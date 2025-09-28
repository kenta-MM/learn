<template>
  <!-- TODO:うまく機能していない。 -->
   <!-- <div>
    <UButton
      label="通知テスト"
      @click="toast.add({ title: '通知OK！', description: 'これはテストです',  icon: 'i-lucide-check-circle-days',})"
    />
  </div> -->
  <div>
    <!-- 横並びにする -->
    <div class="flex gap-2">
      <UAlert 
        title="学習用サンプル"
        description="このアプリはDBに保存せず、メモリ上だけで管理されます。"
        color="neutral"
        variant="outline"
        />
      <UButton label="登録" color="primary" @click="openAdd()" />
    
      <!-- 追加用モーダル -->
      <TodoModal
        v-model:isOpen="isOpenAdd"
        :modelValue="newTodo"
        mode="add"
        @submit="addTodo"
      />
    </div> 

    <!-- 更新用モーダル -->
    <TodoModal
      v-model:isOpen="isOpenEdit"
      :modelValue="editTodo"
      mode="edit"
      @submit="updateTodo"
    />
 
    <!-- Todo一覧 -->
    <div v-if="todos.length > 0" class="space-y-2 mt-4">
      <table class="table-auto w-full border-collapse border border-gray-500 text-center">
        <thead>
          <tr>
            <th class="border border-gray-300 px-4 py-2">やること</th>
            <th class="border border-gray-300 px-4 py-2">進捗</th>
            <th @click="sortBy('priority')" class="cursol-pointer border border-gray-300 px-4 py-2">優先度
              <span>
                {{  sortAsc? '↑' : '↓' }}
              </span>
            </th>
            <th class="border border-gray-300 px-4 py-2">イベント</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(todo, index) in todos" :key="index" class="border border-gray-500">
            <td class="border border-gray-500 px-4 py-2">{{ todo.text }}</td>
            <td class="border border-gray-500 px-4 py-2">{{ todo.status }}</td>
            <td class="border border-gray-500 px-4 py-2">{{ todo.priority }}</td>
            <td class="border border-gray-500 px-4 py-2">
              <!-- ボタンを横並びに -->
              <div class="flex gap-2 justify-center">
                <UButton
                  size="xs"
                  color="secondary"
                  label="更新"
                  @click="openEdit(index)"
                />
                <UButton
                  size="xs"
                  color="error"
                  label="削除"
                  @click="removeTodo(index)"
                />
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <p v-else class="text-gray-500">まだ Todo はありません。</p>
  </div>
</template>


<script setup lang="ts">
import { ref } from 'vue'
import type { Todo } from '~/types/todo'
import { DEFAULT_TODO } from '~/types/todo'
import TodoModal from '~/components/index/TodoModal.vue'

// TODO: トースト対応
// const toast = useToast()
const sortKey = ref<keyof Todo | ''>('')
const sortAsc = ref(true)

const newTodo = ref<Todo>({ ...DEFAULT_TODO })
const editTodo = ref<Todo>({ ...DEFAULT_TODO })

// Todo一覧(メモリ上)
const { todos } = useLocalStorageTodos()

// モーダルの開閉状態
const isOpenAdd = ref(false)
const isOpenEdit = ref(false)

// 編集中のインデックス
const editIndex = ref<number | null>(null)

// 追加処理
const addTodo = (todo: Todo) => {
  todos.value.push(todo)
  newTodo.value = { ...DEFAULT_TODO }
  isOpenAdd.value = false

  // TODO:トースト通知を出す
  // toast.add({
  //   title: '保存しました！',
  //   description: '新しいTodoが追加されました。',
  //   icon: 'i-lucide-check-circle-days',
  // })
}
const updateTodo = (todo: Todo) => {
  todos.value[editIndex.value!] ={
    text: todo.text.trim(),
    status: todo.status,
    priority: todo.priority
  }
  editIndex.value = null
  isOpenEdit.value = false
}

// 削除処理
const removeTodo = (index: number) => {
  todos.value.splice(index, 1)
}

const openAdd = () => {
  isOpenAdd.value = true
}
const openEdit = (index: number) => {
  editIndex.value = index
  editTodo.value = todos.value[index]!
  isOpenEdit.value = true
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

</script>