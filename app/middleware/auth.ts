export default defineNuxtRouteMiddleware((to) => {
  const { isLoggedIn, loading } = useAuth()

  if (import.meta.server) return

  const publicRoutes = ['/login', '/register']

  // Wait for auth to finish loading
  if (loading.value) return

  if (!isLoggedIn.value && !publicRoutes.includes(to.path)) {
    return navigateTo('/login')
  }

  if (isLoggedIn.value && publicRoutes.includes(to.path)) {
    return navigateTo('/dashboard')
  }
})