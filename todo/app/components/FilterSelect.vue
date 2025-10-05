<template>
    <USelectMenu
        :model-value="table?.tableApi?.getColumn(columnId)?.getFilterValue()"
        :items="items"
        multiple
        class="w-40"
        :placeholder="label"
        @update:model-value="handleUpdate"
    />
</template>

<script setup lang="ts">
const props = defineProps<{
    columnId: string
    label: string
    items: string[]
    table: any
}>()

const handleUpdate = (val: string[]) => {
    const col = props.table?.tableApi?.getColumn(props.columnId)
    col?.setFilterValue(val.length > 0 ? val : undefined)
}
</script>