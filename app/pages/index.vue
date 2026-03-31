<script setup lang="ts">
// Root page — redirect based on auth
const { isLoggedIn } = useAuth()
await navigateTo(isLoggedIn.value ? '/dashboard' : '/login')
</script>
