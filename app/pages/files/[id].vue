<template>
  <div>
    <!-- Print button — hidden when printing -->
    <div class="flex items-center justify-between mb-6 print:hidden">
      <div class="flex items-center gap-3">
        <button @click="$router.back()"
          class="w-9 h-9 flex items-center justify-center rounded-xl bg-white border border-gray-200 hover:bg-gray-50 transition">
          <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h2 class="text-xl font-bold text-gray-900">File Details</h2>
      </div>
      <button @click="printFile"
        class="flex items-center gap-2 px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-medium transition">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
        </svg>
        Print
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="space-y-4">
      <div class="h-40 bg-gray-100 rounded-xl animate-pulse" />
    </div>

    <!-- File Detail Card -->
    <div v-else-if="file" id="print-area">
      <!-- Print Header — only visible when printing -->
      <div class="hidden print:block mb-8 border-b-2 border-gray-800 pb-4">
        <h1 class="text-2xl font-bold text-gray-900">BFAR File Management System</h1>
        <p class="text-gray-500 text-sm">Bureau of Fisheries and Aquatic Resources</p>
        <p class="text-gray-400 text-xs mt-1">Printed on: {{ printDate }}</p>
      </div>

      <!-- Main Card -->
      <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <!-- Card Header -->
        <div class="bg-primary-900 px-6 py-5 print:bg-gray-800">
          <div class="flex items-start justify-between">
            <div>
              <div class="flex items-center gap-2 mb-1">
                <NuxtLink :to="`/folders/${file.folderId}`"
                  class="text-primary-300 text-xs hover:text-white transition print:text-gray-300 print:no-underline">
                  📁 {{ folderName }}
                </NuxtLink>
              </div>
              <h3 class="text-2xl font-bold text-white">{{ file.name }}</h3>
            </div>
            <span class="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-bold bg-white/20 text-white">
              {{ file.year }}
            </span>
          </div>
        </div>

        <!-- Details Grid -->
        <div class="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">File Name</p>
            <p class="text-gray-900 font-medium">{{ file.name }}</p>
          </div>

          <div>
            <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Year</p>
            <p class="text-gray-900 font-medium">{{ file.year }}</p>
          </div>

          <div>
            <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Folder</p>
            <p class="text-gray-900 font-medium">{{ folderName }}</p>
          </div>

          <div>
            <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Date Added</p>
            <p class="text-gray-900 font-medium">{{ formattedDate }}</p>
          </div>

          <div>
            <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Added By</p>
            <p class="text-gray-900 font-medium">{{ file.createdByEmail }}</p>
          </div>

          <div>
            <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Attached Document</p>
            <div v-if="file.fileUrl">
              <a :href="file.fileUrl" target="_blank"
                class="inline-flex items-center gap-2 text-primary-600 hover:underline text-sm font-medium print:text-gray-900">
                <svg class="w-4 h-4 print:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                {{ file.fileName || 'Download file' }}
              </a>
              <!-- Show URL when printing -->
              <p class="hidden print:block text-xs text-gray-500 break-all mt-1">{{ file.fileUrl }}</p>
            </div>
            <p v-else class="text-gray-400 text-sm">No document attached</p>
          </div>

          <div class="sm:col-span-2">
            <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Description</p>
            <p class="text-gray-900">{{ file.description || 'No description provided.' }}</p>
          </div>
        </div>
      </div>

      <!-- Print Footer -->
      <div class="hidden print:block mt-8 pt-4 border-t border-gray-300 text-xs text-gray-400 text-center">
        This document was generated from the BFAR File Management System
      </div>
    </div>

    <!-- Not found -->
    <div v-else class="text-center py-20">
      <p class="text-gray-500">File not found.</p>
      <NuxtLink to="/folders" class="text-primary-600 hover:underline text-sm mt-2 inline-block">
        Back to Folders
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { doc, getDoc } from 'firebase/firestore'
import type { FileRecord } from '~/composables/useFiles'

definePageMeta({ middleware: 'auth' })

const route = useRoute()
const fileId = route.params.id as string
const { db } = useFirebase()

const file = ref<FileRecord | null>(null)
const folderName = ref('...')
const loading = ref(true)
const printDate = new Date().toLocaleDateString('en-PH', {
  year: 'numeric', month: 'long', day: 'numeric',
  hour: '2-digit', minute: '2-digit'
})

onMounted(async () => {
  try {
    const fileDoc = await getDoc(doc(db, 'files', fileId))
    if (fileDoc.exists()) {
      file.value = { id: fileDoc.id, ...fileDoc.data() } as FileRecord

      // Fetch folder name
      const folderDoc = await getDoc(doc(db, 'folders', file.value.folderId))
      if (folderDoc.exists()) {
        folderName.value = folderDoc.data().name
      }
    }
  } catch (e) {
    console.error('Error fetching file:', e)
  } finally {
    loading.value = false
  }
})

const formattedDate = computed(() => {
  if (!file.value?.uploadDate) return '—'
  const date = file.value.uploadDate?.toDate?.() ?? new Date(file.value.uploadDate)
  return date.toLocaleDateString('en-PH', {
    year: 'numeric', month: 'long', day: 'numeric'
  })
})

const printFile = () => window.print()
</script>

<style>
@media print {
  /* Hide everything except the print area */
  body * { visibility: hidden; }
  #print-area, #print-area * { visibility: visible; }
  #print-area { position: absolute; left: 0; top: 0; width: 100%; }
}
</style>