<template>
  <header class="bg-primary-900 text-white shadow-lg">
    <div class="container mx-auto px-4 max-w-7xl">
      <div class="flex items-center justify-between h-16">
        <!-- Logo / Title -->
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 bg-white/20 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />
            </svg>
          </div>
          <div>
            <h1 class="font-bold text-sm leading-tight">BFAR File Management</h1>
            <p class="text-primary-200 text-xs">Bureau of Fisheries</p>
          </div>
        </div>

        <!-- User Info + Logout -->
        <div class="flex items-center gap-4">
          <div class="text-right hidden sm:block">
            <p class="text-sm font-medium">{{ user?.email }}</p>
            <p class="text-xs text-primary-300">
              <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
                :class="isORD ? 'bg-yellow-400 text-yellow-900' : 'bg-primary-700 text-primary-200'">
                {{ userRole ?? 'User' }}
              </span>
            </p>
          </div>
          <button
            @click="logout"
            class="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition text-sm">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" />
            </svg>
            Logout
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
const { user, userRole, isORD, logout } = useAuth()
</script>