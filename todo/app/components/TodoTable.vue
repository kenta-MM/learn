<template>
    <table class="table-auto w-full border-collapse border border-gray-500 text-center">
    <thead>
        <tr>
        <th class="border border-gray-300 px-4 py-2">やること</th>
        <th class="border border-gray-300 px-4 py-2">進捗</th>
        <th @click="$emit('sort', 'priority')" class="cursol-pointer border border-gray-300 px-4 py-2">優先度
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
                <UButton size="xs" color="secondary" label="更新" @click="$emit('edit', index)" />
                <UButton size="xs" color="error" label="削除" @click="$emit('remove', index)" />
                </div>
            </td>
        </tr>
    </tbody>
    </table>
</template> 


<script setup lang="ts">
import type { Todo } from '~/types/todo'

defineProps<{
  todos: Todo[]
  sortAsc: boolean
}>()

defineEmits<{
  (e: 'sort', key: keyof Todo): void
  (e: 'edit', index: number): void
  (e: 'remove', index: number): void
}>()
</script>