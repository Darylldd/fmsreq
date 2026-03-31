
<template>
  <div class="flex flex-wrap gap-3">
    <!-- Keyword -->
    <div class="relative flex-1 min-w-[200px]">
      <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
        fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <input
        v-model="keyword"
        type="text"
        placeholder="Search by name, folder, description..."
        @keyup.enter="emit('search', keyword, yearFilter)"
        class="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-sm" />
    </div>

    <!-- Year filter -->
    <input
      v-model.number="yearFilter"
      type="number"
      placeholder="Year"
      :max="currentYear"
      min="1900"
      class="w-28 px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-sm" />

    <!-- Search button -->
    <button
      @click="emit('search', keyword, yearFilter || null)"
      class="flex items-center gap-2 px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-medium transition">
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      Search
    </button>

    <!-- Clear -->
    <button v-if="keyword || yearFilter"
      @click="handleClear"
      class="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl text-sm font-medium transition">
      Clear
    </button>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  search: [keyword: string, year: number | null]
  clear: []
}>()

const keyword = ref('')
const yearFilter = ref<number | null>(null)
const currentYear = new Date().getFullYear()

const handleClear = () => {
  keyword.value = ''
  yearFilter.value = null
  emit('clear')
}
</script>