<template>
  <ClientsContent />
</template>

<script setup lang="ts">
import ClientsContent from "@/components/ClientsContent.vue";
</script>

<style scoped>
.icon-button {
  padding: 5px;
  border-radius: 4px;
  background: rgba(255, 68, 142, 0.1);
  width: fit-content;
  cursor: pointer;
  transition: 0.3s;
}

.icon-button i {
  font-size: 24px;
  color: rgba(255, 68, 142, 1);
}

.icon-button:hover {
  opacity: 0.8;
}

.icons-div {
  display: flex;
  align-items: center;
  gap: 15px;
}
</style>
