<template>
  <v-dialog
    :model-value="active"
    @update:model-value="changeActive"
    width="auto"
  >
    <v-card class="delete-modal">
      <v-card-title class="text-h5">
        {{ title }}
      </v-card-title>
      <p class="description">{{ description }}</p>
      <v-card-actions class="buttons-group">
        <v-btn
          color="gray"
          variant="outlined"
          @click="changeActive && changeActive(false)"
        >
          Cancelar
        </v-btn>
        <v-btn color="primary" variant="outlined" @click="deleteAction">
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

<style scoped>
.delete-modal {
  height: fit-content;
  display: flex;
  align-items: center;
  padding: 20px;
  justify-content: center;
  border-radius: 12px !important;
}

.description {
  margin: 20px 0;
}

.buttons-group{
  display: flex;
  align-items: center;
  gap: 20px;
}
</style>
