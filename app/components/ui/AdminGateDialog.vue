<script setup lang="ts">
const { t } = useI18n()
const { isUnlocked, login, logout } = usePrivateAuth()

const isOpen = ref(false)
const inputKey = ref('')
const hasError = ref(false)
const isLoading = ref(false)
const inputRef = ref<HTMLInputElement | null>(null)

function open() {
  isOpen.value = true
  inputKey.value = ''
  hasError.value = false
  nextTick(() => {
    inputRef.value?.focus()
  })
}

function close() {
  isOpen.value = false
  inputKey.value = ''
  hasError.value = false
}

defineExpose({ open, close })

async function handleVerify() {
  if (!inputKey.value || isLoading.value) return

  isLoading.value = true
  hasError.value = false

  const success = await login(inputKey.value)
  if (success) {
    window.location.href = '/'
  } else {
    hasError.value = true
    inputKey.value = ''
    isLoading.value = false
    nextTick(() => inputRef.value?.focus())
  }
}

async function handleLogout() {
  isLoading.value = true
  await logout()
  window.location.href = '/'
}

watch(isOpen, (val) => {
  if (val) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isOpen"
        class="fixed inset-0 z-[100] flex items-start justify-center pt-[20vh] px-4"
      >
        <!-- Backdrop -->
        <div
          class="absolute inset-0 bg-zinc-900/40 dark:bg-black/40 backdrop-blur-md"
          @click="close"
        />

        <!-- Dialog -->
        <Transition
          appear
          enter-active-class="transition duration-300 ease-out"
          enter-from-class="opacity-0 scale-95 translate-y-4"
          enter-to-class="opacity-100 scale-100 translate-y-0"
          leave-active-class="transition duration-200 ease-in"
          leave-from-class="opacity-100 scale-100 translate-y-0"
          leave-to-class="opacity-0 scale-95 translate-y-4"
        >
          <div
            v-if="isOpen"
            class="relative w-full max-w-sm bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl shadow-zinc-900/10 dark:shadow-black/40 border border-zinc-200/60 dark:border-zinc-800/60 overflow-hidden p-6 text-center"
            @keydown.escape="close"
          >
            <div class="mb-6">
              <svg
                class="w-12 h-12 mx-auto text-zinc-300 dark:text-zinc-600"
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

            <template v-if="!isUnlocked">
              <h2 class="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
                {{ t('adminGate.title') }}
              </h2>
              <p class="text-sm text-zinc-500 dark:text-zinc-400 mb-6">
                {{ t('adminGate.description') }}
              </p>

              <form class="space-y-4" @submit.prevent="handleVerify">
                <input
                  ref="inputRef"
                  v-model="inputKey"
                  type="password"
                  :placeholder="t('adminGate.placeholder')"
                  :disabled="isLoading"
                  class="w-full px-4 py-2.5 rounded-xl border text-sm bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 outline-none transition-colors focus:ring-2 focus:ring-primary-500/50 disabled:opacity-50"
                  :class="hasError ? 'border-red-400 dark:border-red-500' : 'border-zinc-200 dark:border-zinc-700'"
                  @input="hasError = false"
                >
                <p
                  v-if="hasError"
                  class="text-xs text-red-500 dark:text-red-400"
                >
                  {{ t('adminGate.error') }}
                </p>
                <button
                  type="submit"
                  :disabled="isLoading"
                  class="w-full px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-primary-500 hover:bg-primary-600 transition-colors disabled:opacity-50"
                >
                  {{ isLoading ? t('adminGate.verifying') : t('adminGate.submit') }}
                </button>
              </form>
            </template>

            <template v-else>
              <h2 class="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
                {{ t('adminGate.logout') }}
              </h2>
              <p class="text-sm text-zinc-500 dark:text-zinc-400 mb-6">
                You are currently logged in as administrator.
              </p>
              <button
                :disabled="isLoading"
                class="w-full px-4 py-2.5 rounded-xl text-sm font-semibold text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors disabled:opacity-50"
                @click="handleLogout"
              >
                {{ t('adminGate.logout') }}
              </button>
            </template>

            <button
              type="button"
              class="mt-4 text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
              @click="close"
            >
              {{ t('search.close') }}
            </button>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>
