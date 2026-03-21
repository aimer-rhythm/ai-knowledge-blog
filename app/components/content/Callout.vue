<script setup lang="ts">
const { t } = useI18n()

const props = withDefaults(
  defineProps<{
    type?: 'tip' | 'warning' | 'info' | 'danger'
  }>(),
  {
    type: 'info',
  }
)

const styles: Record<string, { border: string; bg: string; icon: string; title: string }> = {
  info: {
    border: 'border-l-blue-500',
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    icon: 'text-blue-500',
    title: t('callout.info'),
  },
  tip: {
    border: 'border-l-emerald-500',
    bg: 'bg-emerald-50 dark:bg-emerald-900/20',
    icon: 'text-emerald-500',
    title: t('callout.tip'),
  },
  warning: {
    border: 'border-l-amber-500',
    bg: 'bg-amber-50 dark:bg-amber-900/20',
    icon: 'text-amber-500',
    title: t('callout.warning'),
  },
  danger: {
    border: 'border-l-red-500',
    bg: 'bg-red-50 dark:bg-red-900/20',
    icon: 'text-red-500',
    title: t('callout.danger'),
  },
}

const currentStyle = computed(() => styles[props.type]!)
</script>

<template>
  <div
    class="my-4 rounded-r-lg border-l-4 p-4"
    :class="[currentStyle.border, currentStyle.bg]"
    role="alert"
  >
    <div class="mb-2 flex items-center gap-2">
      <!-- Info icon -->
      <svg
        v-if="props.type === 'info'"
        class="h-5 w-5"
        :class="currentStyle.icon"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>

      <!-- Tip icon (lightbulb) -->
      <svg
        v-if="props.type === 'tip'"
        class="h-5 w-5"
        :class="currentStyle.icon"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
        />
      </svg>

      <!-- Warning icon -->
      <svg
        v-if="props.type === 'warning'"
        class="h-5 w-5"
        :class="currentStyle.icon"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        />
      </svg>

      <!-- Danger icon -->
      <svg
        v-if="props.type === 'danger'"
        class="h-5 w-5"
        :class="currentStyle.icon"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>

      <span
        class="text-sm font-semibold"
        :class="currentStyle.icon"
      >
        {{ currentStyle.title }}
      </span>
    </div>

    <div class="text-sm text-gray-700 dark:text-gray-300 [&>p]:mb-0">
      <slot />
    </div>
  </div>
</template>
