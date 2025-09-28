<template>
    <UModal
        :open="isOpen"
        :title="mode === 'add' ? 'Todoを追加' : 'Todoを編集'"
        :description="mode === 'add' ? '新しいTodoを追加してください。' : '内容を更新してください。'"
        @update:open="emit('update:isOpen', $event)">

        <!-- モーダルの中身 -->
        <template #body>
            <div class="p-4 space-y-4">
            <UInput v-model="localTodo.text" placeholder="やることを入力" @keydown.ctrl.enter="submit"/>
            <USelect v-model="localTodo.status" :items="statusOptions" class="mb-2" />
            <USelect v-model="localTodo.priority" :items="priorityOptions" />
            </div>
        </template>

        <!-- ヘッダー -->
        <template #footer>
            <div class="w-full flex justify-end gap-2">
                <UButton label="キャンセル" color="neutral" @click="close" />
                <UButton
                    :label="mode === 'add' ? '追加' : '更新'"
                    color="primary"
                    @click="submit" />
            </div>
        </template>
    </UModal>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type {Todo, TodoStatus, TodoPriority} from '~/types/todo.ts'

const statusOptions: TodoStatus[] = ['未対応', '対応中', '対応完了']
const priorityOptions: TodoPriority[] = ['低', '中', '高']

const props = defineProps<{
    isOpen: boolean
    modelValue: Todo
    mode: 'add' | 'edit'
}>()

const emit = defineEmits<{
    (e: 'update:isOpen', value: boolean): void
    (e: 'submit', value: Todo): void
}>()

// ローカルコピ(入力中に親へ影響しないようにする)
const localTodo = ref({...props.modelValue})

watch(() => props.modelValue, (newVal) => {
    localTodo.value = {...newVal}
})

const submit = () => {
    if (localTodo.value.text.trim() === '') {
        return
    }

    emit('submit', {...localTodo.value})
    emit('update:isOpen', false)
}

const close = () => {
    emit('update:isOpen', false)
}
</script>