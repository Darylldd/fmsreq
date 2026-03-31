export default defineNuxtRouteMiddleware((to) => {
  const { isLoggedIn, loading } = useAuth()

  if (import.meta.server) return

  const publicRoutes = ['/login']

  if (!loading.value && !isLoggedIn.value && !publicRoutes.includes(to.path)) {
    return navigateTo('/login')
  }

  if (!loading.value && isLoggedIn.value && to.path === '/login') {
    return navigateTo('/dashboard')
  }
})