<template>
  <div>
    <!-- Header -->
    <div class="mb-6">
      <h2 class="text-xl font-bold text-gray-900">Search Files</h2>
      <p class="text-sm text-gray-500 mt-1">Search across all folders</p>
    </div>

    <!-- Search Bar -->
    <div class="bg-white rounded-xl border border-gray-200 p-4 mb-6">
      <SearchBar @search="handleSearch" @clear="handleClear" />
    </div>

    <!-- Loading -->
    <div v-if="loading" class="space-y-2">
      <div v-for="i in 5" :key="i" class="h-16 bg-gray-100 rounded-xl animate-pulse" />
    </div>

    <!-- No results -->
    <div v-else-if="searched && results.length === 0"
      class="text-center py-20 bg-white rounded-xl border-2 border-dashed border-gray-200">
      <svg class="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <p class="text-gray-500 font-medium">No files found</p>
      <p class="text-gray-400 text-sm mt-1">Try a different keyword or year</p>
    </div>

    <!-- Prompt -->
    <div v-else-if="!searched"
      class="text-center py-20 bg-white rounded-xl border-2 border-dashed border-gray-200">
      <svg class="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <p class="text-gray-500 font-medium">Enter a keyword to search</p>
      <p class="text-gray-400 text-sm mt-1">Search by file name, folder, year, or description</p>
    </div>

    <!-- Results -->
    <div v-else>
      <p class="text-sm text-gray-500 mb-3">{{ results.length }} result{{ results.length !== 1 ? 's' : '' }} found</p>
      <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table class="w-full">
          <thead>
            <tr class="bg-gray-50 border-b border-gray-200">
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">File Name</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Folder</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Year</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Description</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Added By</th>
              <th class="px-4 py-3 w-20"></th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="file in results" :key="file.id" class="hover:bg-gray-50">
              <td class="px-4 py-3">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <span class="font-medium text-gray-900 text-sm">{{ file.name }}</span>
                </div>
              </td>
              <td class="px-4 py-3">
                <NuxtLink :to="`/folders/${file.folderId}`"
                  class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-yellow-50 text-yellow-700 text-xs font-medium hover:bg-yellow-100 transition">
                  <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />
                  </svg>
                  {{ file.folderName }}
                </NuxtLink>
              </td>
              <td class="px-4 py-3">
                <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-primary-100 text-primary-800">
                  {{ file.year }}
                </span>
              </td>
              <td class="px-4 py-3 text-sm text-gray-500 max-w-xs truncate">{{ file.description || '—' }}</td>
              <td class="px-4 py-3 text-xs text-gray-400">{{ file.createdByEmail }}</td>
              <td class="px-4 py-3">
                <NuxtLink :to="`/files/${file.id}`"
                  class="text-xs text-primary-600 hover:underline font-medium">
                  View
                </NuxtLink>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const { results, loading, searched, search, clearSearch } = useSearch()

const handleSearch = async (keyword: string, year: number | null) => {
  await search(keyword, year)
}

const handleClear = () => clearSearch()
</script>