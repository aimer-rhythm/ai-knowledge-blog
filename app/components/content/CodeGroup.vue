<script setup lang="ts">
const activeIndex = ref(0)
const tabLabels = ref<string[]>([])
const tabContainer = ref<HTMLElement | null>(null)

function extractLabels() {
  if (!tabContainer.value) return

  const wrapper = tabContainer.value.querySelector(':scope > div')
  const target = wrapper || tabContainer.value
  const codeBlocks = target.querySelectorAll(':scope > pre')
  const labels: string[] = []

  codeBlocks.forEach((block, index) => {
    const filename = block.getAttribute('filename')
      || block.getAttribute('data-filename')
      || block.querySelector('.filename')?.textContent?.trim()
      || block.querySelector('code')?.getAttribute('data-language')
      || block.querySelector('code')?.className?.match(/language-(\w+)/)?.[1]
      || `Tab ${index + 1}`

    labels.push(filename)
  })

  if (labels.length > 0) {
    tabLabels.value = labels
  }

  showActiveBlock(0)
}

function showActiveBlock(index: number) {
  if (!tabContainer.value) return

  const wrapper = tabContainer.value.querySelector(':scope > div')
  const target = wrapper || tabContainer.value
  const blocks = target.querySelectorAll(':scope > pre')

  blocks.forEach((block, i) => {
    ;(block as HTMLElement).style.display = i === index ? 'block' : 'none'
  })
}

function switchTab(index: number) {
  activeIndex.value = index
  showActiveBlock(index)
}

onMounted(() => {
  nextTick(() => {
    extractLabels()
  })
})
</script>

<template>
  <div class="code-group my-4 overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800">
    <!-- Tab bar -->
    <div
      v-if="tabLabels.length > 1"
      class="flex border-b border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900"
    >
      <button
        v-for="(label, index) in tabLabels"
        :key="index"
        class="relative px-4 py-2 text-sm font-medium transition-colors"
        :class="
          index === activeIndex
            ? 'text-primary-600 dark:text-primary-400'
            : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
        "
        @click="switchTab(index)"
      >
        {{ label }}
        <span
          v-if="index === activeIndex"
          class="absolute inset-x-0 bottom-0 h-0.5 bg-primary-600 dark:bg-primary-400"
        />
      </button>
    </div>

    <!-- Content panels -->
    <div ref="tabContainer" class="code-group-content">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.code-group-content :deep(pre) {
  margin: 0 !important;
  border: none !important;
  border-radius: 0 !important;
}
</style>
