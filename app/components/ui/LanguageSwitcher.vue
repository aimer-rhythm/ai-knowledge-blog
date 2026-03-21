<script setup lang="ts">
const { locale, locales, setLocale } = useI18n()

const availableLocales = computed(() => {
  return locales.value.filter(i => i.code !== locale.value)
})
</script>

<template>
  <div class="flex items-center gap-2">
    <button
      v-for="lang in locales"
      :key="lang.code"
      type="button"
      class="px-2 py-1 text-xs font-medium rounded-md transition-all duration-200"
      :class="[
        locale === lang.code
          ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100'
          : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-900'
      ]"
      @click="setLocale(lang.code)"
    >
      {{ lang.name }}
    </button>
  </div>
</template>
