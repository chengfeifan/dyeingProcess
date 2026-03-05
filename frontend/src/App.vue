<script setup>
import { ref } from 'vue'
import PredictionForm from './components/PredictionForm.vue'
import PredictionResult from './components/PredictionResult.vue'
import ConcentrationChart from './components/ConcentrationChart.vue'

const predictionData = ref(null)
const error = ref(null)
const loading = ref(false)

const handlePredict = async (params) => {
  loading.value = true
  error.value = null
  predictionData.value = null

  try {
    const response = await fetch('http://localhost:8000/predict', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.detail || '未知错误')
    }

    predictionData.value = await response.json()
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="container mx-auto p-4 bg-white shadow-lg rounded-lg max-w-4xl">
    <h1 class="text-4xl font-bold text-center text-blue-800 mb-8">染整颜色在线预测</h1>

    <PredictionForm @predict="handlePredict" :loading="loading" class="mb-8" />

    <div v-if="loading" class="text-center text-blue-600 text-lg">
      正在进行预测...
    </div>

    <div v-if="error" class="text-center text-red-600 text-lg mb-8">
      错误: {{ error }}
    </div>

    <div v-if="predictionData && !loading && !error">
      <PredictionResult :data="predictionData" class="mb-8" />
      <ConcentrationChart :data="predictionData" />
    </div>
  </div>
</template>

<style scoped>
/* 可以添加 App.vue 的特定样式 */
</style>
