<template>
  <p>{{ text }}</p>
</template>

<script lang="ts">
export default {
  props: ["text"],
};
</script>

<style scoped>
p {
  font-size: 32px;
  font-weight: 500;
}
</style>
