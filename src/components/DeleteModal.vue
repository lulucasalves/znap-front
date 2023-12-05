<template>
  <v-dialog
    :model-value="active"
    @update:model-value="changeActive"
    width="auto"
  >
    <v-card>
      <v-card-title class="text-h5">
        {{ title }}
      </v-card-title>
      <v-card-text>{{ description }}</v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="green-darken-1"
          variant="text"
          @click="changeActive && changeActive(false)"
        >
          Cancelar
        </v-btn>
        <v-btn color="green-darken-1" variant="text" @click="deleteAction">
          Remover
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
export default {
  props: {
    active: Boolean,
    changeActive: Function,
    id: String,
    title: String,
    description: String,
    deleteAction: Function,
  },
};
</script>

<style scoped></style>
