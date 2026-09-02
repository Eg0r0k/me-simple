<template>
  <div class="flex-1 flex flex-col overflow-hidden p-8">
    <h1 class="text-3xl font-heading tracking-widest uppercase mb-8">Projects</h1>
    <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <div v-for="project in projects" :key="project.title" class="p-6 bg-card/50 backdrop-blur-sm ring-1 ring-foreground/20">
        <h2 class="text-lg font-semibold tracking-wider mb-2">{{ project.title }}</h2>
        <p class="text-sm text-muted-foreground tracking-normal">{{ project.description }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const projects = [
  { title: "Audiogram", description: "A modern music player with advanced audio features" },
  { title: "Portfolio", description: "Personal website showcasing creative work" },
  { title: "Shader Lab", description: "Experimental WebGL shader playground" },
]
</script>
