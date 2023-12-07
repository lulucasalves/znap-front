<template>
  <div class="filter">
    <div class="filter-div">
      <div class="select-div">
        <v-text-field
          clearable
          density="compact"
          v-model="dateFrom"
          label="Data de"
          @input="maskDateFrom"
        />
        <v-text-field
          clearable
          density="compact"
          v-model="dateTo"
          label="Data até"
          @input="maskDateTo"
        />
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
        <v-select
          v-model="productsSelected"
          :items="products"
          no-data-text="Sem produtos disponiveis"
          density="compact"
          label="Produtos"
          multiple
          placeholder="Todos produtos"
        />
        <v-select
          v-model="clientsSelected"
          :items="clients"
          no-data-text="Sem clientes disponiveis"
          density="compact"
          label="Clientes"
          multiple
          placeholder="Todos clientes"
        />
        <v-btn
          class="filter-button"
          height="40px"
          color="primary"
          variant="tonal"
          @click="sendFilter"
        >
          Filtrar
        </v-btn>
      </div>
    </div>
    <v-btn
      class="create-button"
      @click="create"
      color="primary"
      variant="outlined"
    >
      Criar
    </v-btn>
  </div>
</template>

<script lang="ts">
import { getAllCategories, getAllProducts, getAllClients } from "@/services";
import {
  IGetAllCategoriesData,
  IGetAllClientsData,
  IGetAllProductsData,
} from "@/interfaces";
import { formatDateOrderSend } from "@/utils";

export default {
  name: "TableOptions",
  props: {
    routerName: String,
    changeLimit: Function,
    limit: Number,
    changeFilter: Function,
  },
  data() {
    return {
      categories: [],
      categoriesSelected: [],
      allCategories: [],
      products: [],
      productsSelected: [],
      allProducts: [],
      clients: [],
      clientsSelected: [],
      allClients: [],
      dateFrom: "",
      dateTo: "",
    };
  },
  methods: {
    create() {
      this.$router.push({ name: this.routerName, params: { id: "new" } });
    },
    sendFilter() {
      const getIdsCategories = this.allCategories
        .filter((value: IGetAllCategoriesData) =>
          this.categoriesSelected.includes(value.name)
        )
        .map((value: IGetAllCategoriesData) => value.id);

      const getIdsProducts = this.allProducts
        .filter((value: IGetAllProductsData) =>
          this.productsSelected.includes(value.name)
        )
        .map((value: IGetAllProductsData) => value.id);

      const getIdsClients = this.allClients
        .filter((value: IGetAllClientsData) =>
          this.clientsSelected.includes(value.name)
        )
        .map((value: IGetAllClientsData) => value.id);

      const dateFrom = formatDateOrderSend(this.dateFrom);
      const dateTo = formatDateOrderSend(this.dateTo);

      this.changeFilter!({
        categories: getIdsCategories,
        products: getIdsProducts,
        clients: getIdsClients,
        dateFrom,
        dateTo,
      });
    },
    maskDateTo(value: any) {
      const dateValue = value.target.value.replace(/\D/g, "");

      if (!dateValue) {
        this.dateTo = "";
        return;
      }

      const formattedDate = (date: string) => {
        const day = date.substring(0, 2);
        const month = date.substring(2, 4);
        const year = date.substring(4, 8);
        return `${day}/${month}/${year}`;
      };

      this.dateTo = formattedDate(dateValue);
    },
    maskDateFrom(value: any) {
      const dateValue = value.target.value.replace(/\D/g, "");

      if (!dateValue) {
        this.dateFrom = "";
        return;
      }

      const formattedDate = (date: string) => {
        const day = date.substring(0, 2);
        const month = date.substring(2, 4);
        const year = date.substring(4, 8);
        return `${day}/${month}/${year}`;
      };

      this.dateFrom = formattedDate(dateValue);
    },
  },

  async mounted() {
    const dataCategories = await getAllCategories({
      page: 1,
      limit: 1000,
      sort: "asc",
      order: "name",
      active: "true",
    });

    this.allCategories = dataCategories.data;
    this.categories = dataCategories.data.map(
      (val: IGetAllCategoriesData) => val.name
    );

    const dataProducts = await getAllProducts({
      page: 1,
      limit: 1000,
      sort: "asc",
      order: "name",
      categories: [],
    });

    this.allProducts = dataProducts.data;
    this.products = dataProducts.data.map(
      (val: IGetAllProductsData) => val.name
    );

    const dataClients = await getAllClients({
      page: 1,
      limit: 1000,
      sort: "asc",
      order: "name",
    });

    this.allClients = dataClients.data;
    this.clients = dataClients.data.map((val: IGetAllClientsData) => val.name);
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
