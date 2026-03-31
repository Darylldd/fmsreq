<template>
  <div class="min-h-screen flex flex-col">
    <AppHeader />
    <main class="flex-1 container mx-auto px-4 py-6 max-w-7xl">
      <slot />
    </main>
    <footer class="bg-white border-t py-4 text-center text-sm text-gray-500">
      BFAR File Management System © {{ new Date().getFullYear() }}
    </footer>
  </div>
</template>