<template>
  <div>
    <!-- Loading overlay — sits ON TOP, doesn't hide NuxtPage -->
    <div v-if="loading"
      class="fixed inset-0 bg-white flex items-center justify-center z-[9999]">
      <div class="flex flex-col items-center gap-4">
        <svg class="animate-spin w-10 h-10 text-primary-600" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
        </svg>
        <p class="text-gray-500 text-sm">Loading...</p>
      </div>
    </div>

    <!-- Always rendered — Nuxt needs to see these -->
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
const { initAuth, loading } = useAuth()

onMounted(async () => {
  await initAuth()
})
</script>