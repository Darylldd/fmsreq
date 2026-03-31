<template>
  <div class="w-full max-w-md">
    <div class="bg-white rounded-2xl shadow-2xl overflow-hidden">
      <!-- Header -->
      <div class="bg-primary-900 px-8 py-8 text-center">
        <div class="w-16 h-16 bg-white/20 rounded-2xl mx-auto flex items-center justify-center mb-4">
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
        </div>
        <h1 class="text-2xl font-bold text-white">Create Account</h1>
        <p class="text-primary-300 text-sm mt-1">BFAR File Management System</p>
      </div>

      <!-- Form -->
      <div class="px-8 py-8">
        <!-- Error -->
        <div v-if="errorMsg" class="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <svg class="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clip-rule="evenodd" />
          </svg>
          <p class="text-red-700 text-sm">{{ errorMsg }}</p>
        </div>

        <!-- Success -->
        <div v-if="successMsg" class="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
          <svg class="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clip-rule="evenodd" />
          </svg>
          <p class="text-green-700 text-sm">{{ successMsg }}</p>
        </div>

        <div class="space-y-5">
          <!-- Full Name -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            <input
              v-model="form.displayName"
              type="text"
              placeholder="Juan dela Cruz"
              class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition text-sm" />
          </div>

          <!-- Office -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Office / Department</label>
            <input
              v-model="form.office"
              type="text"
              placeholder="e.g. Aquaculture Division"
              class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition text-sm" />
          </div>

          <!-- Email -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            <input
              v-model="form.email"
              type="email"
              placeholder="you@bfar.gov.ph"
              class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition text-sm" />
          </div>

          <!-- Password -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <div class="relative">
              <input
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Minimum 6 characters"
                class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition text-sm pr-12" />
              <button type="button" @click="showPassword = !showPassword"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <svg v-if="!showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Confirm Password -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
            <input
              v-model="form.confirmPassword"
              type="password"
              placeholder="Re-enter your password"
              @keyup.enter="handleRegister"
              class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition text-sm" />
          </div>

          <!-- Submit -->
          <button
            @click="handleRegister"
            :disabled="isLoading"
            class="w-full bg-primary-600 hover:bg-primary-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition flex items-center justify-center gap-2">
            <svg v-if="isLoading" class="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
            {{ isLoading ? 'Creating account...' : 'Create Account' }}
          </button>

          <!-- Back to Login -->
          <p class="text-center text-sm text-gray-500">
            Already have an account?
            <NuxtLink to="/login" class="text-primary-600 hover:underline font-medium">Sign in</NuxtLink>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'auth' })

const { register, isLoggedIn } = useAuth()

if (isLoggedIn.value) {
  await navigateTo('/dashboard')
}

const form = reactive({
  displayName: '',
  office: '',
  email: '',
  password: '',
  confirmPassword: '',
})

const errorMsg = ref('')
const successMsg = ref('')
const isLoading = ref(false)
const showPassword = ref(false)

const handleRegister = async () => {
  errorMsg.value = ''
  successMsg.value = ''

  // Validation
  if (!form.displayName || !form.office || !form.email || !form.password || !form.confirmPassword) {
    errorMsg.value = 'Please fill in all fields.'
    return
  }
  if (form.password.length < 6) {
    errorMsg.value = 'Password must be at least 6 characters.'
    return
  }
  if (form.password !== form.confirmPassword) {
    errorMsg.value = 'Passwords do not match.'
    return
  }

  isLoading.value = true
  const result = await register(form.email, form.password, form.displayName, form.office)

  if (result.success) {
    await navigateTo('/dashboard')
  } else {
    errorMsg.value = result.message || 'Registration failed.'
  }
  isLoading.value = false
}
</script>