<script setup>
import { ref, defineEmits, defineProps } from 'vue'

const emit = defineEmits(['predict'])
const props = defineProps({
  loading: Boolean
})

const t = ref(60) // 默认时间 60 分钟
const x = ref(0.0025) // 默认空间位置 (cm), 例如纤维的中心

const submitForm = () => {
  emit('predict', { t: t.value, x: x.value })
}
</script>

<template>
  <form @submit.prevent="submitForm" class="p-6 border border-gray-200 rounded-lg shadow-sm bg-gray-50">
    <div class="mb-4">
      <label for="time" class="block text-gray-700 text-sm font-bold mb-2">时间 (t, 分钟):</label>
      <input
        type="number"
        id="time"
        v-model.number="t"
        required
        min="0"
        max="120"
        step="0.1"
        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
      />
      <p class="text-gray-500 text-xs mt-1">输入染整过程的时间，范围在 0 到 120 分钟之间。</p>
    </div>

    <div class="mb-6">
      <label for="position" class="block text-gray-700 text-sm font-bold mb-2">纤维内位置 (x, 厘米):</label>
      <input
        type="number"
        id="position"
        v-model.number="x"
        required
        min="0"
        max="0.005"
        step="0.0001"
        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
      />
      <p class="text-gray-500 text-xs mt-1">输入染料在纤维内部的位置，范围在 0 (表面) 到 0.005 (中心) 厘米之间。</p>
    </div>

    <div class="flex items-center justify-center">
      <button
        type="submit"
        :disabled="props.loading"
        class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out"
        :class="{ 'opacity-50 cursor-not-allowed': props.loading }"
      >
        {{ props.loading ? '预测中...' : '开始预测' }}
      </button>
    </div>
  </form>
</template>

<style scoped>
/* 可以添加组件的特定样式 */
</style>
