<script setup lang="ts">
const slots = useSlots()
</script>

<template>
  <div class="min-h-screen flex flex-col relative selection:bg-primary-500/30">
    <!-- Global Background Pattern -->
    <div class="fixed inset-0 pointer-events-none z-[-1] bg-white dark:bg-zinc-950">
      <div class="absolute inset-0 bg-dot-pattern opacity-40"></div>
    </div>
    
    <LayoutAppHeader />
    <main class="flex-1 relative z-0">
      <div class="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-16">
        <div class="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_240px] xl:grid-cols-[260px_minmax(0,1fr)_220px] gap-6 lg:gap-8 xl:gap-10">
          <aside class="hidden xl:block relative">
            <div class="sticky top-28">
              <LayoutAppSidebar v-if="slots.navigation">
                <slot name="navigation" />
              </LayoutAppSidebar>
            </div>
          </aside>

          <article class="min-w-0 bg-white/60 dark:bg-zinc-950/60 backdrop-blur-xl rounded-[2.5rem] p-6 sm:p-10 lg:p-14 border border-zinc-200/50 dark:border-zinc-800/50 shadow-sm">
            <div v-if="slots.navigation" class="mb-10 xl:hidden">
              <LayoutAppSidebar>
                <slot name="navigation" />
              </LayoutAppSidebar>
            </div>
            <div class="max-w-4xl mx-auto">
              <slot />
            </div>
          </article>

          <aside class="hidden lg:block relative">
            <div class="sticky top-28">
              <LayoutAppSidebar>
                <slot name="sidebar" />
              </LayoutAppSidebar>
            </div>
          </aside>
        </div>
      </div>
    </main>
    <LayoutAppFooter />
  </div>
</template>
