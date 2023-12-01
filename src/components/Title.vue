<template>
  <p>{{ text }}</p>
</template>

<script>
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
