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
    
      <!-- 追加用モーダル -->
      <UModal v-model:open="isOpen" title="Todoを追加" description="新しいTodoを追加してください。">
        <!-- トリガー -->
        <template #default>
            <UButton label="登録" color="primary" />
        </template>
        <!-- モーダルの中身 -->
        <template #body>
          <div class="p-4 space-y-4">
            <UInput v-model="newTodo.text" placeholder="やることを入力" @keydown.ctrl.enter="addTodo"/>
            <USelect v-model="newTodo.status" :items="statusOptions" class="mb-2" />
            <USelect v-model="newTodo.priority" :items="priorityOptions" />
            <div class="flex justify-end gap-2">
              <UButton label="キャンセル" color="neutral" @click="isOpen = false" />
              <UButton label="追加" color="primary" @click="addTodo" />
            </div>
          </div>
        </template>
      </UModal>
    </div> 

    <!-- 更新用モーダル -->
    <UModal v-model:open="isOpenEdit" title="Todoを更新" description="内容を更新してください。">
      <!-- モーダルの中身 -->
      <template #body>
        <div class="p-4 space-y-4">
          <UInput v-model="editTodo.text" placeholder="やることを入力" @keydown.ctrl.enter="updateTodo"/>
          <USelect v-model="editTodo.status" :items="statusOptions" class="mb-2" />
          <USelect v-model="editTodo.priority" :items="priorityOptions" />
          <div class="flex justify-end gap-2">
            <UButton label="キャンセル" color="neutral" @click="isOpenEdit  = false" />
            <UButton label="更新" color="primary" @click="updateTodo" />
          </div>
        </div>
      </template>
    </UModal>

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

// TODO: トースト対応
// const toast = useToast()
const sortKey = ref<keyof Todo | ''>('')
const sortAsc = ref(true)

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

// モーダルの開閉状態
const isOpen = ref(false)

// todoインタフェース
type TodoStatus = '未対応' | '対応中' | '対応完了'
type TodoPriority = '低' | '中' | '高'
const statusOptions: TodoStatus[] = ['未対応', '対応中', '対応完了']
const priorityOptions: TodoPriority[] = ['低', '中', '高']

interface Todo {
  text: string
  status: TodoStatus
  priority: TodoPriority
}

// 新規追加用
const newTodo = ref<Todo>({
  text: '',
  status: '未対応',
  priority: '低'
})
// Todo一覧(メモリ上)
const todos = ref<Todo[]>([])

// 起動時に読み込み
onMounted(() => {
  const saved = localStorage.getItem('todos')
  if (saved) {
    todos.value = JSON.parse(saved)
  }
})

// 変更があったら保存
watch(todos, (newTodos) => {
  localStorage.setItem('todos', JSON.stringify(newTodos))
}, { deep: true })

// 追加処理
const addTodo = () => {
  if (newTodo.value === null) {
    return
  }
  if (newTodo.value.text.trim() === '') {
    return
  }
  todos.value.push({
    text: newTodo.value.text.trim(),
    status: newTodo.value.status,
    priority: newTodo.value.priority
  })
  newTodo.value = {
    text: '',
    status: '未対応',
    priority: '低'
  }
  isOpen.value = false

  // TODO:トースト通知を出す
  // toast.add({
  //   title: '保存しました！',
  //   description: '新しいTodoが追加されました。',
  //   icon: 'i-lucide-check-circle-days',
  // })
}

// 削除処理
const removeTodo = (index: number) => {
  todos.value.splice(index, 1)
}

// 更新用
const isOpenEdit = ref(false)
const editIndex = ref<number | null>(null)
const editTodo = ref<Todo>({
  text: '',
  status: '未対応',
  priority: '低'
})
const openEdit = (index: number) => {
  editIndex.value = index
  editTodo.value = todos.value[index]!
  isOpenEdit.value = true
}
const updateTodo = () => {
  if (editTodo.value === null) {
    return
  }
  // バリデーションを追加する。
  if (editTodo.value.text.trim() === '') {
    return
  }

  todos.value[editIndex.value!] ={
    text: editTodo.value.text.trim(),
    status: editTodo.value.status,
    priority: editTodo.value.priority
  }
    editIndex.value = null
    newTodo.value = {
    text: '',
    status: '未対応',
    priority: '低'
  }
    isOpenEdit.value = false
}

</script>