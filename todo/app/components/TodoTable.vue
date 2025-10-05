<template>
    <div class="flex flex-col flex-1 w-full">
        <div class="flex px-4 py-3.5 border-b border-accented">
            <UInput
                :model-value="table?.tableApi?.getColumn('text')?.getFilterValue() as string"
                class="max-w-sm"
                placeholder="Filter texts..."
                @update:model-value="table?.tableApi?.getColumn('text')?.setFilterValue($event)"
            />
            <USelectMenu
                :v-model="table?.tableApi?.getColumn('status')?.getFilterValue() as string"
                class="w-40"
                :items="['未対応', '対応中', '対応完了']"
                multiple
                placeholder="進捗状態"
                @update:model-value="(val: string[]) => {
                    const col = table?.tableApi?.getColumn('status')
                    col?.setFilterValue(val.length > 0 ? val : undefined)
                }"
            />
            <USelectMenu
                :v-model="table?.tableApi?.getColumn('priority')?.getFilterValue() as string"
                class="w-40"
                :items="['低', '中', '高']"
                multiple
                placeholder="優先度"
                @update:model-value="(val: string[]) => {
                    const col = table?.tableApi?.getColumn('priority')
                    col?.setFilterValue(val.length > 0 ? val : undefined)
                }"
            />            
        </div>
        <div class="w-full space-y-4 pb-4">
            <UTable
                ref="table"
                v-model:column-filters="columnFilters"
                v-model:sorting="sorting"
                v-model:pagination="pagination"
                sticky
                :data="todos"
                :columns="columns"
                :pagination-options="{
                    getPaginationRowModel: getPaginationRowModel()
                }"
                class="flex-1 max-h-[624px]"
            />
        </div>
        
        <div class="flex justify-center border-t border-default pt-4">
            <UPagination
                :default-page="(table?.tableApi?.getState().pagination.pageIndex || 0) + 1"
                :items-per-page="table?.tableApi?.getState().pagination.pageSize"
                :total="table?.tableApi?.getFilteredRowModel().rows.length"
                @update:page="(p) => table?.tableApi?.setPageIndex(p - 1)"
            />
        </div>
    </div>
</template> 


<script setup lang="ts">
import type { Todo } from '~/types/todo'
import type { TableColumn } from '@nuxt/ui';
import type { Row } from '@tanstack/vue-table';
import { getPaginationRowModel } from '@tanstack/vue-table';

const UButton = resolveComponent('UButton')
const UBadge = resolveComponent('UBadge')
const UDropdownMenu = resolveComponent('UDropdownMenu')

defineProps<{
  todos: Todo[]
}>()

const emit = defineEmits<{
  (e: 'sort', key: keyof Todo): void
  (e: 'edit', index: number): void
  (e: 'remove', index: number): void
}>()

// ソートの初期状態
const sorting = ref([
    {
        id: 'priority',
        desc: true
    },
])

const columnFilters = ref([
    {
        id: 'text',
        value: ''
    }
])

const pagination = ref({
        pageIndex: 0,
        pageSize: 20
    }
)

const table = useTemplateRef('table')

const priorityMap: Record<string, number> = {
    '高': 3,
    '中': 2,
    '低': 1,
}

const statusMap: Record<string, number> = {
    '対応完了': 3,
    '対応中': 2,
    '未対応': 1,
}

const columns: TableColumn<Todo>[] = [
    {
        accessorKey: 'text',
        header: '内容',
        cell: ({ row }) => { return row.getValue('text') }
    },
    {
        accessorKey: 'status',
        header: ({ column }) => {
            const isSorted = column.getIsSorted()

            return h(UButton, {
                color: 'neutral',
                variant: 'ghost',
                label: '進捗状態',
                icon: isSorted
                    ? isSorted === 'asc'
                        ? 'i-lucide-arrow-up-narrow-wide'
                        : 'i-lucide-arrow-down-wide-narrow'
                    : 'i-lucide-arrow-up-down',
                class: '-mx-2.5',
                onClick: () => column.toggleSorting(column.getIsSorted() === 'asc')
            })
        },
        cell: ({ row }) => {            
            const color = {
                '未対応': 'neutral' as const,
                '対応中': 'secondary' as const,
                '対応完了': 'success' as const,
            }[row.getValue('status') as string]

            return h(UBadge, {clasee: 'capitalize', variant: 'subtle', color }, () => row.getValue('status'))
        },
        sortingFn: (row1, row2, columnId) => {
            const a = statusMap[row1.getValue(columnId) as string] ?? 0
            const b = statusMap[row2.getValue(columnId) as string] ?? 0
            return a - b
        },
        filterFn: (row, columnId, filterValue: string[] | string) => {
            if (Array.isArray(filterValue)) {
                return filterValue.includes(row.getValue(columnId))
            }
            return row.getValue(columnId) === filterValue
        },
    },
    {
        accessorKey: 'priority',
        header: ({ column }) => {
            const isSorted = column.getIsSorted()

            return h(UButton, {
                color: 'neutral',
                variant: 'ghost',
                label: '優先度',
                icon: isSorted
                    ? isSorted === 'asc'
                        ? 'i-lucide-arrow-up-narrow-wide'
                        : 'i-lucide-arrow-down-wide-narrow'
                    : 'i-lucide-arrow-up-down',
                class: '-mx-2.5',
                onClick: () => column.toggleSorting(column.getIsSorted() === 'asc')
            })
        },
        cell: ({ row }) => {
            const color = {
                '低': 'neutral' as const,
                '中': 'warning' as const,
                '高': 'error' as const,
            }[row.getValue('priority') as string]

            return h(UBadge, {clasee: 'capitalize', variant: 'subtle', color }, () => row.getValue('priority'))
        },
        sortingFn: (row1, row2, columnId) => {
            const a = priorityMap[row1.getValue(columnId) as string] ?? 0
            const b = priorityMap[row2.getValue(columnId) as string] ?? 0
            return a - b
        },
        filterFn: (row, columnId, filterValue: string[] | string) => {
            if (Array.isArray(filterValue)) {
                return filterValue.includes(row.getValue(columnId))
            }
            return row.getValue(columnId) === filterValue
        },        
    },
    {
        id: 'actions',
        cell: ({ row }) => {
            return h(
                'div',
                { class: 'text-right' },
                h(
                    UDropdownMenu,
                    {
                        content: {
                            align: 'end',
                        },
                        items: getRowItems(row),
                        'aria-label': 'Action dropdown'
                    },
                    () => h(
                        UButton, {
                            icon: 'i-lucide-ellipsis-vertical',
                            color: 'neutral',
                            variant: 'ghost',
                            class: 'ml-auto',
                            'aria-label': 'Actions dropdown',
                        }
                    )
                )
            )
        }
    }
]

function getRowItems(row: Row<Todo>){
    return [
        {
            type: 'label',
            label: 'actions',
        },
        {
            label: '修正',
            icon: 'i-heroicons-pencil-square',
            onSelect: () => emit('edit', row.index),
        },
        {
            label: '削除',
            icon: 'i-heroicons-trash',
            onSelect: () => emit('remove', row.index),
        },
    ]
}

</script>