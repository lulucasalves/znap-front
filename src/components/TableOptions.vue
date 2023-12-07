<template>
  <div class="filter">
    <div class="filter-div">
      <v-select
        :items="[15, 30, 50, 100]"
        density="compact"
        label="Max"
        :model-value="limit"
        @update:model-value="changeLimit"
      />
      <v-text-field
        clearable
        density="compact"
        v-model="search"
        label="Pesquisar"
      />
      <v-btn
        class="filter-button"
        height="40px"
        color="primary"
        variant="tonal"
        @click="changeFilterSearch"
      >
        Filtrar
      </v-btn>
    </div>
    <v-btn @click="create" color="primary" variant="outlined"> Criar </v-btn>
  </div>
</template>

<script lang="ts">
export default {
  name: "TableOptions",
  props: {
    changeFilter: Function,
    routerName: String,
    changeLimit: Function,
    limit: Number,
  },
  data() {
    return {
      search: "",
    };
  },

  methods: {
    create() {
      this.$router.push({ name: this.routerName, params: { id: "new" } });
    },
    changeFilterSearch() {
      this.changeFilter!(this.search);
    },
  },
};
</script>

<style scoped>
.filter {
  display: flex;
  align-items: end;
  flex-direction: column;
  width: 100%;
  gap: 30px;
}

.filter-div {
  display: flex;
  align-items: center;
  gap: 20px;
  width: 100%;
  flex-wrap: wrap;
}

.v-input {
  width: 200px;
}

.create-button {
  width: fit-content;
  text-align: right;
}

.filter-button {
  width: 100%;
}
</style>
