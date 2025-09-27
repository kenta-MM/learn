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
    
      <!-- 追加用モーダル -->
      <UModal v-model:open="isOpen" title="Todoを追加" description="新しいTodoを追加してください。">
        <!-- トリガー -->
        <template #default>
            <UButton label="登録" color="primary" />
        </template>
        <!-- モーダルの中身 -->
        <template #body>
          <div class="p-4 space-y-4">
            <UInput v-model="newTodo" placeholder="やることを入力" @keydown.ctrl.enter="addTodo"/>
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
          <UInput v-model="editTodo" placeholder="やることを入力" @keydown.ctrl.enter="updateTodo"/>
          <div class="flex justify-end gap-2">
            <UButton label="キャンセル" color="neutral" @click="isOpenEdit  = false" />
            <UButton label="更新" color="primary" @click="updateTodo" />
          </div>
        </div>
      </template>
    </UModal>

    <!-- Todo一覧 -->
    <div v-if="todos.length > 0" class="space-y-2 mt-4">
      <div 
        v-for="(todo, index) in todos"
        :key="index"
        class="p-2 border rounded flex items-center justify-between">
        <span>{{ todo }}</span>
        <!-- ボタンを横並びに -->
        <div class="flex gap-2">
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
      </div>
    </div>
    <p v-else class="text-gray-500">まだ Todo はありません。</p>
  </div>
</template>


<script setup lang="ts">
import { ref } from 'vue'

// モーダルの開閉状態
const isOpen = ref(false)

// 新規追加用
const newTodo = ref('')

// Todo一覧(メモリ上)
const todos = ref<string[]>([])

// 追加処理
const addTodo = () => {
  if (newTodo.value.trim() !== '') {
    todos.value.push(newTodo.value.trim())
    newTodo.value = ''
    isOpen.value = false
  }
}

// 削除処理
const removeTodo = (index: number) => {
  todos.value.splice(index, 1)
}

// 更新用
const isOpenEdit = ref(false)
const editIndex = ref<number | null>(null)
const editTodo = ref('')
const openEdit = (index: number) => {
  editIndex.value = index
  editTodo.value = todos.value[index]!
  isOpenEdit.value = true
}
const updateTodo = () => {
  if (editIndex.value !== null && editTodo.value.trim() !== '') {
    todos.value[editIndex.value] = editTodo.value.trim()
    editIndex.value = null
    editTodo.value = ''
    isOpenEdit.value = false
  }
}

</script>