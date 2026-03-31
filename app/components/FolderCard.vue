<template>
  <div class="bg-white rounded-xl border border-gray-200 hover:border-primary-400 hover:shadow-md transition-all group">
    <NuxtLink :to="`/folders/${folder.id}`" class="block p-5">
      <div class="flex items-start gap-4">
        <div class="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-yellow-200 transition">
          <svg class="w-7 h-7 text-yellow-600" fill="currentColor" viewBox="0 0 24 24">
            <path d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />
          </svg>
        </div>
        <div class="flex-1 min-w-0">
          <h3 class="font-bold text-gray-900 text-sm truncate">{{ folder.name }}</h3>
          <p v-if="folder.description" class="text-xs text-gray-500 mt-1 truncate">{{ folder.description }}</p>
          <p class="text-xs text-gray-400 mt-2">Created by {{ folder.createdByEmail }}</p>
        </div>
      </div>
    </NuxtLink>

    <!-- Delete button (shows on hover) -->
    <div class="px-5 pb-4 flex justify-end opacity-0 group-hover:opacity-100 transition">
      <button @click.prevent="$emit('delete', folder.id)"
        class="text-xs text-red-500 hover:text-red-700 flex items-center gap-1">
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
        Delete
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Folder } from '~/composables/useFolders'
defineProps<{ folder: Folder }>()
defineEmits(['delete'])
</script>