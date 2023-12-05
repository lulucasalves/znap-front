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
        append-icon="mdi-magnify"
        @click:append="executeSearch"
        label="Pesquisar"
      />
    </div>
    <v-btn @click="create" color="#FF458D" variant="outlined"> Criar </v-btn>
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
    executeSearch() {
      if (typeof this.changeFilter === "function") {
        this.changeFilter(this.search);
      }
    },
    create() {
      this.$router.push({ name: this.routerName, params: { id: "new" } });
    },
  },
};
</script>

<style scoped>
.filter {
  display: flex;
  justify-content: space-between;
  width: 100%;
  gap: 30px;
}

.filter-div {
  display: flex;
  align-items: center;
  gap: 20px;
  width: 100%;
}

.v-input {
  max-width: 300px;
}

.v-select {
  max-width: 100px;
}
</style>
