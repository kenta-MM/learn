<template>
    <div class="flex flex-col items-center">
        <div class="grid grid-cols-8 gap-1">
            <div
                v-for="(cell, index) in boardFlat"
                :key="index"
                class="w-12 h-12 bg-green-600 flex items-center justify-center cursor-pointer"
                @click="placeStone(Math.floor(index / 8), index % 8)">
                <div
                    v-if="cell"
                    class="rounded-full w-10 h-10"
                    :class="cell === 'black' ? 'bg-black': 'bg-white'"
                >
                </div>
            </div>
        </div>
    </div>
    <p class="mt-4">Turn: {{ turn }}</p>
</template>



<script setup lang="ts">
import {ref, computed } from 'vue'

// 8x8のボードを初期化
const board = ref<string[][]>(
     Array.from({ length: 8 }, () => Array.from({ length: 8 }, () => '' ))
)

// 初期配置
board.value[3]![3] = 'white'
board.value[3]![4] = 'black'
board.value[4]![3] = 'black'
board.value[4]![4] = 'white'

// todo:確認用
console.log(board.value)

const turn = ref<'black' | 'white'>('black')

// ボードを１次元にして表示用にする
const boardFlat = computed(() => board.value.flat())

// 方向ベクトル
const directions: [number, number][] = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
    [1, 1],
    [1, -1],
    [-1, 1],
    [-1, -1]
]

// 石を置く処理
const placeStone = (row: number, col: number) => {
    if (board.value[row]![col] !== '') {
        return
    }

    let flipped = false
    for (const [dx, dy] of directions){
        const stones: [number, number][] = []
        let r = row + dy
        let c = col + dx
        while (r >= 0 && r < 8 && c >= 0 && c < 8) {
        const cell = board.value[r]![c]
        if (!cell) break
        if (cell === turn.value) {
            if (stones.length > 0) {
            stones.forEach(([sr, sc]) => (board.value[sr]![sc] = turn.value))
            flipped = true
            }
            break
        } else {
            stones.push([r, c])
        }
        r += dy
        c += dx
        }
    }

    if (flipped) {
        board.value[row]![col] = turn.value
        turn.value = turn.value === 'black' ? 'white' : 'black'
  }
    
}
</script>

<style>
body {
    background: #2d2d2d;
}
</style>