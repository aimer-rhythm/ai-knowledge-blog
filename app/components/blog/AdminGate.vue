<script setup lang="ts">
const { t } = useI18n()
const { login } = usePrivateAuth()

const inputKey = ref('')
const hasError = ref(false)
const isLoading = ref(false)
const inputRef = ref<HTMLInputElement | null>(null)

onMounted(() => {
  nextTick(() => inputRef.value?.focus())
})

async function verify() {
  if (!inputKey.value || isLoading.value) return

  isLoading.value = true
  hasError.value = false

  const success = await login(inputKey.value)
  if (!success) {
    hasError.value = true
    inputKey.value = ''
    isLoading.value = false
    nextTick(() => inputRef.value?.focus())
  }
}
</script>

<template>
  <div class="flex items-center justify-center min-h-[60vh]">
    <div class="w-full max-w-sm mx-auto text-center">
      <div class="mb-6">
        <svg
          class="w-16 h-16 mx-auto text-zinc-300 dark:text-zinc-600"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      </div>
      <h2 class="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
        {{ t('adminGate.title') }}
      </h2>
      <p class="text-sm text-zinc-500 dark:text-zinc-400 mb-8">
        {{ t('adminGate.description') }}
      </p>
      <form class="space-y-4" @submit.prevent="verify">
        <input
          ref="inputRef"
          v-model="inputKey"
          type="password"
          :placeholder="t('adminGate.placeholder')"
          :disabled="isLoading"
          class="w-full px-4 py-3 rounded-xl border text-sm bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 outline-none transition-colors focus:ring-2 focus:ring-primary-500/50 disabled:opacity-50"
          :class="hasError ? 'border-red-400 dark:border-red-500' : 'border-zinc-200 dark:border-zinc-700'"
          @input="hasError = false"
        >
        <p
          v-if="hasError"
          class="text-sm text-red-500 dark:text-red-400"
        >
          {{ t('adminGate.error') }}
        </p>
        <button
          type="submit"
          :disabled="isLoading"
          class="w-full px-4 py-3 rounded-xl text-sm font-semibold text-white bg-primary-500 hover:bg-primary-600 transition-colors disabled:opacity-50"
        >
          {{ isLoading ? t('adminGate.verifying') : t('adminGate.submit') }}
        </button>
      </form>
    </div>
  </div>
</template>
