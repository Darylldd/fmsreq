<template>
  <div>
    <!-- Back + Header -->
    <div class="flex items-center gap-3 mb-6">
      <NuxtLink to="/folders"
        class="w-9 h-9 flex items-center justify-center rounded-xl bg-white border border-gray-200 hover:bg-gray-50 transition">
        <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </NuxtLink>
      <div>
        <div class="flex items-center gap-2">
          <svg class="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />
          </svg>
          <h2 class="text-xl font-bold text-gray-900">{{ folderName }}</h2>
        </div>
        <p class="text-sm text-gray-500 mt-0.5">{{ files.length }} file{{ files.length !== 1 ? 's' : '' }}</p>
      </div>
    </div>

    <!-- Toolbar -->
    <div class="flex flex-wrap items-center justify-between gap-3 mb-4">
      <div class="flex items-center gap-2">
        <span class="text-sm text-gray-500">Sort by year:</span>
        <button @click="toggleSort"
          class="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition">
          <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
          </svg>
          {{ sortOrder === 'desc' ? 'Newest First' : 'Oldest First' }}
        </button>
      </div>
      <button @click="showModal = true"
        class="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Add File
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="space-y-2">
      <div v-for="i in 5" :key="i" class="h-14 bg-gray-100 rounded-xl animate-pulse" />
    </div>

    <!-- Empty -->
    <div v-else-if="files.length === 0"
      class="text-center py-20 bg-white rounded-xl border-2 border-dashed border-gray-200">
      <svg class="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      <p class="text-gray-500 font-medium">No files yet</p>
      <p class="text-gray-400 text-sm mt-1">Click "Add File" to add entries</p>
    </div>

    <!-- Files Table -->
    <div v-else class="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <table class="w-full">
        <thead>
          <tr class="bg-gray-50 border-b border-gray-200">
            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Year</th>
            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Description</th>
            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Added By</th>
            <th class="px-4 py-3 w-10"></th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <FileRow
            v-for="file in files"
            :key="file.id"
            :file="file"
            @delete="handleDeleteFile" />
        </tbody>
      </table>
    </div>

    <!-- Add File Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl shadow-xl w-full max-w-md">
        <div class="p-6 border-b">
          <h3 class="text-lg font-bold text-gray-900">Add File to {{ folderName }}</h3>
        </div>
        <div class="p-6 space-y-4">
          <div v-if="formError" class="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {{ formError }}
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Record Name <span class="text-red-500">*</span>
            </label>
            <input v-model="form.name" type="text" placeholder="e.g. bangus"
              class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-sm" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Year <span class="text-red-500">*</span>
            </label>
            <input v-model.number="form.year" type="number"
              :placeholder="currentYear.toString()" min="1900" :max="currentYear"
              class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-sm" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea v-model="form.description" rows="2" placeholder="Optional notes..."
              class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-sm resize-none" />
          </div>

          <!-- File Upload -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Attach Document <span class="text-gray-400 font-normal">(optional)</span>
            </label>
            <div
              @click="fileInput?.click()"
              @dragover.prevent
              @drop.prevent="onDrop"
              class="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:border-primary-400 hover:bg-primary-50 transition">
              <input ref="fileInput" type="file" class="hidden"
                accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg"
                @change="onFileChange" />
              <div v-if="!selectedFile">
                <svg class="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p class="text-sm text-gray-500">Click or drag & drop a file here</p>
                <p class="text-xs text-gray-400 mt-1">PDF, Word, Excel, or image</p>
              </div>
              <div v-else class="flex items-center gap-3 justify-center">
                <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <div class="text-left">
                  <p class="text-sm font-medium text-gray-900 truncate max-w-[200px]">{{ selectedFile.name }}</p>
                  <p class="text-xs text-gray-400">{{ (selectedFile.size / 1024).toFixed(1) }} KB</p>
                </div>
                <button @click.stop="selectedFile = null" class="text-red-400 hover:text-red-600 ml-2">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div v-if="uploadProgress > 0 && uploadProgress < 100" class="mt-2">
              <div class="flex justify-between text-xs text-gray-500 mb-1">
                <span>Uploading...</span>
                <span>{{ uploadProgress }}%</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-1.5">
                <div class="bg-primary-600 h-1.5 rounded-full transition-all" :style="`width: ${uploadProgress}%`" />
              </div>
            </div>
          </div>
        </div>

        <div class="p-6 border-t flex gap-3 justify-end">
          <button @click="closeModal"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition">
            Cancel
          </button>
          <button @click="handleCreate" :disabled="isCreating"
            class="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-60 rounded-xl transition flex items-center gap-2">
            <svg v-if="isCreating" class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
            {{ isCreating ? (uploadProgress > 0 ? 'Uploading...' : 'Saving...') : 'Add File' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { doc, getDoc } from 'firebase/firestore'

definePageMeta({ middleware: 'auth' })

const route = useRoute()
const folderId = route.params.id as string
const { db } = useFirebase()
const { files, loading, fetchFiles, createFile, deleteFile } = useFiles()
const { uploadFile } = useCloudinary()

const folderName = ref('...')
const sortOrder = ref<'asc' | 'desc'>('desc')
const currentYear = new Date().getFullYear()
const showModal = ref(false)
const isCreating = ref(false)
const formError = ref('')
const uploadProgress = ref(0)
const selectedFile = ref<File | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)
const form = reactive({ name: '', year: currentYear, description: '' })

// ✅ onMounted guarantees auth is ready (app.vue already waited for it)
onMounted(async () => {
  const folderDoc = await getDoc(doc(db, 'folders', folderId))
  if (folderDoc.exists()) {
    folderName.value = folderDoc.data().name
  } else {
    await navigateTo('/folders')
    return
  }
  await fetchFiles(folderId, sortOrder.value)
})

const toggleSort = async () => {
  sortOrder.value = sortOrder.value === 'desc' ? 'asc' : 'desc'
  await fetchFiles(folderId, sortOrder.value)
}

const onFileChange = (e: Event) => {
  const input = e.target as HTMLInputElement
  if (input.files?.[0]) selectedFile.value = input.files[0]
}

const onDrop = (e: DragEvent) => {
  if (e.dataTransfer?.files?.[0]) selectedFile.value = e.dataTransfer.files[0]
}

const closeModal = () => {
  showModal.value = false
  form.name = ''
  form.year = currentYear
  form.description = ''
  formError.value = ''
  selectedFile.value = null
  uploadProgress.value = 0
}

const handleCreate = async () => {
  formError.value = ''
  if (!form.name.trim()) { formError.value = 'Record name is required.'; return }
  if (!form.year || form.year < 1900 || form.year > currentYear) {
    formError.value = `Year must be between 1900 and ${currentYear}.`
    return
  }

  isCreating.value = true
  let fileUrl = '', publicId = '', fileName = ''

  if (selectedFile.value) {
    uploadProgress.value = 30
    const uploaded = await uploadFile(selectedFile.value)
    if (!uploaded) {
      formError.value = 'File upload failed. Please try again.'
      isCreating.value = false
      uploadProgress.value = 0
      return
    }
    fileUrl = uploaded.url
    publicId = uploaded.publicId
    fileName = selectedFile.value.name
    uploadProgress.value = 100
  }

  const result = await createFile(folderId, {
    name: form.name,
    year: form.year,
    description: form.description,
    fileUrl,
    publicId,
    fileName,
  })

  if (result.success) {
    closeModal()
  } else {
    formError.value = result.message || 'Failed to add file.'
  }
  isCreating.value = false
}

const handleDeleteFile = async (fileId: string) => {
  if (!confirm('Delete this file record?')) return
  await deleteFile(fileId, folderId)
}
</script>