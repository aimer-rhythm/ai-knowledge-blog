<script setup lang="ts">
</script>

<template>
  <div class="min-h-screen flex flex-col relative selection:bg-primary-500/30">
    <!-- Global Background Pattern -->
    <div class="fixed inset-0 pointer-events-none z-[-1] bg-white dark:bg-zinc-950">
      <div class="absolute inset-0 bg-dot-pattern opacity-40"></div>
    </div>
    
    <LayoutAppHeader />
    
    <main class="flex-1 relative z-0">
      <slot />
    </main>
    
    <LayoutAppFooter />
  </div>
</template>
