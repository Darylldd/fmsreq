<template>
  <tr class="hover:bg-gray-50 group">
    <td class="px-4 py-3">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
          <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <div>
          <NuxtLink :to="`/files/${file.id}`"
            class="font-medium text-gray-900 text-sm hover:text-primary-600 transition">
            {{ file.name }}
          </NuxtLink>
          <a v-if="file.fileUrl" :href="file.fileUrl" target="_blank"
            class="text-xs text-primary-600 hover:underline flex items-center gap-1 mt-0.5">
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            {{ file.fileName || 'Download' }}
          </a>
        </div>
      </div>
    </td>
    <td class="px-4 py-3">
      <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-primary-100 text-primary-800">
        {{ file.year }}
      </span>
    </td>
    <td class="px-4 py-3 text-sm text-gray-500 max-w-xs truncate">{{ file.description || '—' }}</td>
    <td class="px-4 py-3 text-xs text-gray-400">{{ file.createdByEmail }}</td>
    <td class="px-4 py-3 flex items-center gap-3 justify-end">
      <NuxtLink :to="`/files/${file.id}`"
        class="opacity-0 group-hover:opacity-100 transition text-xs text-primary-600 hover:underline font-medium">
        View
      </NuxtLink>
      <button @click="$emit('delete', file.id)"
        class="opacity-0 group-hover:opacity-100 transition text-red-500 hover:text-red-700">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </td>
  </tr>
</template>

<script setup lang="ts">
import type { FileRecord } from '~/composables/useFiles'
defineProps<{ file: FileRecord }>()
defineEmits(['delete'])
</script>