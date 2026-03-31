<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <div>
        <h2 class="text-xl font-bold text-gray-900">Folders</h2>
        <p class="text-sm text-gray-500 mt-1">{{ folders.length }} folder{{ folders.length !== 1 ? 's' : '' }}</p>
      </div>
      <button @click="showModal = true"
        class="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        New Folder
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div v-for="i in 6" :key="i" class="bg-gray-100 rounded-xl h-28 animate-pulse" />
    </div>

    <!-- Empty -->
    <div v-else-if="folders.length === 0"
      class="text-center py-20 bg-white rounded-xl border-2 border-dashed border-gray-200">
      <svg class="w-12 h-12 text-gray-300 mx-auto mb-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />
      </svg>
      <p class="text-gray-500 font-medium">No folders yet</p>
      <p class="text-gray-400 text-sm mt-1">Click "New Folder" to get started</p>
    </div>

    <!-- Folders Grid -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <FolderCard
        v-for="folder in folders"
        :key="folder.id"
        :folder="folder"
        @delete="handleDelete" />
    </div>

    <!-- Create Folder Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl shadow-xl w-full max-w-md">
        <div class="p-6 border-b">
          <h3 class="text-lg font-bold text-gray-900">Create New Folder</h3>
        </div>
        <div class="p-6 space-y-4">
          <div v-if="formError" class="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {{ formError }}
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Folder Name <span class="text-red-500">*</span>
            </label>
            <input v-model="form.name" type="text" placeholder="e.g. FINGERLINGS"
              class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-sm uppercase" />
            <p class="text-xs text-gray-400 mt-1">Saved in uppercase automatically</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea v-model="form.description" rows="3" placeholder="Optional description..."
              class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-sm resize-none" />
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
            {{ isCreating ? 'Creating...' : 'Create Folder' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const { folders, loading, fetchFolders, createFolder, deleteFolder } = useFolders()
const showModal = ref(false)
const isCreating = ref(false)
const formError = ref('')
const form = reactive({ name: '', description: '' })

// ✅ onMounted — auth is guaranteed ready by app.vue
onMounted(async () => {
  await fetchFolders()
})

const closeModal = () => {
  showModal.value = false
  form.name = ''
  form.description = ''
  formError.value = ''
}

const handleCreate = async () => {
  formError.value = ''
  if (!form.name.trim()) { formError.value = 'Folder name is required.'; return }
  isCreating.value = true
  const result = await createFolder(form.name, form.description)
  if (result.success) { closeModal() }
  else { formError.value = result.message || 'Failed to create folder.' }
  isCreating.value = false
}

const handleDelete = async (id: string) => {
  if (!confirm('Delete this folder?')) return
  await deleteFolder(id)
}
</script>