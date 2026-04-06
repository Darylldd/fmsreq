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

const printFile = () => {
  if (!file.value) return

  const content = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${file.value.name} - BFAR File Management</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: Arial, sans-serif; padding: 40px; color: #111; }
        .header { border-bottom: 2px solid #1e3a8a; padding-bottom: 16px; margin-bottom: 24px; }
        .header h1 { font-size: 20px; color: #1e3a8a; }
        .header p { font-size: 12px; color: #666; margin-top: 4px; }
        .title-section { background: #1e3a8a; color: white; padding: 20px; border-radius: 8px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: flex-start; }
        .title-section h2 { font-size: 22px; }
        .folder-label { font-size: 11px; color: #93c5fd; margin-bottom: 4px; }
        .year-badge { background: rgba(255,255,255,0.2); padding: 4px 12px; border-radius: 20px; font-size: 14px; font-weight: bold; }
        .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 24px; }
        .field { border-bottom: 1px solid #e5e7eb; padding-bottom: 12px; }
        .field-label { font-size: 10px; font-weight: bold; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px; }
        .field-value { font-size: 14px; color: #111; }
        .description { grid-column: 1 / -1; }
        .file-url { font-size: 10px; color: #666; word-break: break-all; margin-top: 4px; }
        .footer { margin-top: 40px; padding-top: 12px; border-top: 1px solid #e5e7eb; font-size: 11px; color: #9ca3af; text-align: center; }
        .print-date { font-size: 11px; color: #9ca3af; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>BFAR File Management System</h1>
        <p>Bureau of Fisheries and Aquatic Resources</p>
        <p class="print-date">Printed on: ${new Date().toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
      </div>

      <div class="title-section">
        <div>
          <p class="folder-label">📁 ${folderName.value}</p>
          <h2>${file.value.name}</h2>
        </div>
        <span class="year-badge">${file.value.year}</span>
      </div>

      <div class="grid">
        <div class="field">
          <p class="field-label">File Name</p>
          <p class="field-value">${file.value.name}</p>
        </div>
        <div class="field">
          <p class="field-label">Year</p>
          <p class="field-value">${file.value.year}</p>
        </div>
        <div class="field">
          <p class="field-label">Folder</p>
          <p class="field-value">${folderName.value}</p>
        </div>
        <div class="field">
          <p class="field-label">Date Added</p>
          <p class="field-value">${formattedDate.value}</p>
        </div>
        <div class="field">
          <p class="field-label">Added By</p>
          <p class="field-value">${file.value.createdByEmail}</p>
        </div>
        <div class="field">
          <p class="field-label">Attached Document</p>
          <p class="field-value">${file.value.fileName || 'No document attached'}</p>
          ${file.value.fileUrl ? `<p class="file-url">${file.value.fileUrl}</p>` : ''}
        </div>
        <div class="field description">
          <p class="field-label">Description</p>
          <p class="field-value">${file.value.description || 'No description provided.'}</p>
        </div>
      </div>

      <div class="footer">
        This document was generated from the BFAR File Management System
      </div>
    </body>
    </html>
  `

  const printWindow = window.open('', '_blank', 'width=800,height=600')
  if (!printWindow) {
    alert('Please allow popups for this site to enable printing.')
    return
  }
  printWindow.document.write(content)
  printWindow.document.close()
  printWindow.focus()
  setTimeout(() => {
    printWindow.print()
    printWindow.close()
  }, 500)
}
</script>

