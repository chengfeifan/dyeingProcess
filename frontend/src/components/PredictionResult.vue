<script setup>
import { defineProps, computed } from 'vue'

const props = defineProps({
  data: Object // 包含 C_bath_pred, C_fiber_pred, t, x
})

const formattedData = computed(() => {
  if (!props.data) return null
  return {
    time: props.data.t.toFixed(2),
    position: props.data.x.toFixed(4),
    cBath: props.data.C_bath_pred.toFixed(4),
    cFiber: props.data.C_fiber_pred.toFixed(4),
  }
})
</script>

<template>
  <div v-if="formattedData" class="bg-white p-6 border border-green-200 rounded-lg shadow-md">
    <h2 class="text-2xl font-semibold text-green-700 mb-4">预测结果</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-800">
      <div>
        <p class="font-medium">预测时间 (t):</p>
        <p class="text-lg">{{ formattedData.time }} 分钟</p>
      </div>
      <div>
        <p class="font-medium">纤维内位置 (x):</p>
        <p class="text-lg">{{ formattedData.position }} 厘米</p>
      </div>
      <div>
        <p class="font-medium">染浴浓度预测 (C_bath_pred):</p>
        <p class="text-lg text-blue-600 font-bold">{{ formattedData.cBath }} g/L</p>
      </div>
      <div>
        <p class="font-medium">纤维浓度预测 (C_fiber_pred):</p>
        <p class="text-lg text-purple-600 font-bold">{{ formattedData.cFiber }} g/cm³ 纤维</p>
      </div>
    </div>
    <p class="text-gray-600 text-sm mt-4">这些数据是基于 PINNs 模型对染整过程中染料浓度的预测。</p>
  </div>
</template>

<style scoped>
/* 可以添加组件的特定样式 */
</style>
