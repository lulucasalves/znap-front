<template>
  <div class="filter">
    <div class="filter-div">
      <div class="select-div">
        <v-select
          :items="[15, 30, 50, 100]"
          density="compact"
          label="Max"
          :model-value="limit"
          @update:model-value="changeLimit"
        />
        <v-select
          v-model="categoriesSelected"
          :items="categories"
          no-data-text="Sem categorias disponiveis"
          density="compact"
          label="Categorias"
          multiple
          placeholder="Todas categorias"
        />
        <v-btn
          class="filter-button"
          height="40px"
          color="primary"
          variant="tonal"
          @click="categoriesSend"
        >
          Filtrar
        </v-btn>
      </div>
    </div>
    <v-btn @click="create" color="primary" variant="outlined"> Criar </v-btn>
  </div>
</template>

<script lang="ts">
import { getAllCategories } from "@/services";
import { useToast } from "vue-toastification";
import { IGetAllCategoriesData } from "@/interfaces";

export default {
  name: "TableOptions",
  props: {
    routerName: String,
    changeLimit: Function,
    limit: Number,
    changeCategories: Function,
  },
  data() {
    return { categories: [], categoriesSelected: [], allCategories: [] };
  },
  methods: {
    create() {
      this.$router.push({ name: this.routerName, params: { id: "new" } });
    },
    categoriesSend() {
      const getIds = this.allCategories
        .filter((value: IGetAllCategoriesData) =>
          this.categoriesSelected.includes(value.name)
        )
        .map((value: IGetAllCategoriesData) => value.id);

      this.changeCategories!(getIds);
    },
  },
  async mounted() {
    const toast = useToast();

    const data = await getAllCategories({
      page: 1,
      limit: 1000,
      sort: "asc",
      order: "name",
      active: "true",
    })
      .then((res) => {
        if (res.error)
          toast.error(res.message, {
            timeout: 3000,
          });

        return res;
      })
      .catch((error) => {
        toast.error(error.message, {
          timeout: 3000,
        });
      });

    this.allCategories = data.data;
    this.categories = data.data.map((val: IGetAllCategoriesData) => val.name);
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
}

.v-input {
  width: 200px;
}

.v-select:first-child {
  width: 100px;
}

.select-div {
  width: 100%;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.create-button {
  width: fit-content;
  text-align: right;
}

.filter-button {
  width: 100%;
}
</style>
