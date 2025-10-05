<template>
    <div class="flex flex-col flex-1 w-full">
        <!-- 検索エリア -->
        <div class="flex px-4 py-3.5 border-b border-accented gap-2">
            <UInput
                :model-value="getFilterValue('text')"
                class="max-w-sm"
                placeholder="内容で絞り込み..."
                @update:model-value="setFilterValue('text', $event)"
            />
            <FilterSelect 
                column-id="status"
                label="進捗状態"
                :items="['未対応', '対応中', '対応完了']"
                :table="table"
            />
            <FilterSelect 
                column-id="priority"
                label="優先度"
                :items="['低', '中', '高']"
                :table="table"
            />
        </div>

        <!-- テーブル本体 -->
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
        
        <!-- ページネーション -->
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
import FilterSelect from '~/components/FilterSelect.vue'

// 共通コンポーネント
const UButton = resolveComponent('UButton')
const UBadge = resolveComponent('UBadge')
const UDropdownMenu = resolveComponent('UDropdownMenu')

defineProps<{ todos: Todo[] }>()

const emit = defineEmits<{
  (e: 'sort', key: keyof Todo): void
  (e: 'edit', index: number): void
  (e: 'remove', index: number): void
}>()

// 状態変数
const sorting = ref([{ id: 'priority', desc: true }])
const columnFilters = ref([{ id: 'text', value: '' }])
const pagination = ref({ pageIndex: 0, pageSize: 20 })
const table = useTemplateRef('table')

// ソート/フィルターの共通ロジック
const priorityMap: Record<string, number> = { '高': 3, '中': 2,'低': 1 }
const statusMap: Record<string, number> = { '対応完了': 3, '対応中': 2, '未対応': 1 }

const getFilterValue = (key: string) => 
    (table.value?.tableApi?.getColumn(key)?.getFilterValue() as string)  || ''

const setFilterValue = (key: string, val: unknown) => {
    const col = table.value?.tableApi?.getColumn(key)
    col?.setFilterValue(val || undefined)
}

// 共通 filterFn
const arrayFilterFn = (row: Row<Todo>, columnId: string, filterValue: string[] | string) => {
    if (Array.isArray(filterValue)) {
        return filterValue.includes(row.getValue(columnId))
    }
    return row.getValue(columnId) === filterValue
}

// 共通 sortingFn
const createSortingFn = (map: Record<string, number>) => {
    return (row1: Row<Todo>, row2: Row<Todo>, columnId: string) => {
        const a = map[row1.getValue(columnId) as string] ?? 0
        const b = map[row2.getValue(columnId) as string] ?? 0
        return a - b
    }
}

// カラム定義
const columns: TableColumn<Todo>[] = [
    {
        accessorKey: 'text',
        header: '内容',
        cell: ({ row }) => { return row.getValue('text') },
    },
    {
        accessorKey: 'status',
        header: ({ column }) => createSortableHeader('進捗状態', column),
        cell: ({ row }) => {            
            const color = {
                '未対応': 'neutral' as const,
                '対応中': 'secondary' as const,
                '対応完了': 'success' as const,
            }[row.getValue('status') as string]

            return h(UBadge, {class: 'capitalize', variant: 'subtle', color }, () => row.getValue('status'))
        },
        sortingFn: createSortingFn(statusMap),
        filterFn: arrayFilterFn,
    },
    {
        accessorKey: 'priority',
        header: ({ column }) => createSortableHeader('優先度', column),
        cell: ({ row }) => {
            const color = {
                '低': 'neutral' as const,
                '中': 'warning' as const,
                '高': 'error' as const,
            }[row.getValue('priority') as string]

            return h(UBadge, {clasee: 'capitalize', variant: 'subtle', color }, () => row.getValue('priority'))
        },
        sortingFn: createSortingFn(priorityMap),
        filterFn: arrayFilterFn,   
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

// 共通関数
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

function createSortableHeader(label: string, column: any) {
    const isSorted = column.getIsSorted()
    let icon = ''
    if (isSorted) {
        icon =  isSorted === 'asc' ? 'i-lucide-arrow-up-narrow-wide' : 'i-lucide-arrow-down-wide-narrow'
    } else {
        icon = 'i-lucide-arrow-up-down'
    }

    return h(UButton, {
        color: 'neutral',
        variant: 'ghost',
        label,
        icon,
        class: '-mx-2.5',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc')
    })
}
</script>

