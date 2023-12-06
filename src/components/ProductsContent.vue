<template>
  <Content>
    <Title class="mb-10" text="Produtos" />
    <TableOptions
      router-name="product"
      :changeLimit="changeLimit"
      :limit="limit"
      :changeCategories="changeCategories"
    />
    <DeleteModal
      :active="modal"
      :change-active="changeModalState"
      :deleteAction="deleteProductAction"
      title="Tem certeza que deseja remover este produto?"
      description="Ao remover o produto, você removerá todos pedidos vinculados a
      ele!"
    />
    <v-data-table
      :items="items"
      loading-text="Buscando dados..."
      item-value="id"
      sort-desc-icon="mdi-menu-down"
      sort-asc-icon="mdi-menu-up"
      items-per-page-text="Items por página"
      :items-per-page="100"
      no-data-text="Nenhum produto encontrado"
      :loading="loading"
      :headers="headers"
      :header-props="{ 'sort-icon': 'mdi-unfold-more-horizontal' }"
      @update:options="updateTable"
    >
      <template v-slot:item.actions="{ item }">
        <div class="icons-div">
          <div @click="editItem(item.id)" class="icon-button">
            <v-icon> mdi-pencil-outline </v-icon>
          </div>
          <div @click="changeModalState(true, item.id)" class="icon-button">
            <v-icon> mdi-trash-can-outline </v-icon>
          </div>
        </div>
      </template>
      <template v-slot:bottom>
        <div class="pagination my-4">
          <v-pagination
            size="35"
            rounded="circle"
            @update:model-value="changePage"
            v-model="page"
            :length="Math.ceil(count / limit)"
          />
        </div>
      </template>
    </v-data-table>
  </Content>
</template>

<script lang="ts">
import Title from "@/components/Title.vue";
import TableOptions from "@/components/TableOptionsProducts.vue";
import DeleteModal from "@/components/DeleteModal.vue";
import Content from "@/layouts/Content.vue";
import { IGetAllProductsData } from "@/interfaces";
import { formatDate, formatMoney } from "@/utils";
import { useToast } from "vue-toastification";
import { deleteProduct, getAllProducts } from "@/services/routes";

export default {
  components: { Title, Content, TableOptions, DeleteModal },
  data() {
    return {
      loading: false,
      items: [] as IGetAllProductsData[],
      headers: [
        { title: "Nome", value: "name", sortable: true },
        { title: "Preço", value: "price", sortable: true },
        { title: "Categoria", value: "category", sortable: false },
        { title: "Status", value: "available", sortable: true },
        { title: "Última atualização", value: "updated_at", sortable: true },
        { text: "Ações", value: "actions" },
      ],
      count: 0,
      limit: 15,
      maxPages: 1,
      page: 1,
      sort: "",
      order: "",
      modal: false,
      deleteId: "",
      categories: [],
    };
  },
  methods: {
    async getData() {
      const toast = useToast();

      this.loading = true;
      const data = await getAllProducts({
        limit: this.limit,
        page: this.page,
        sort: this.sort,
        order: this.order,
        categories: this.categories,
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
        })
        .finally(() => {
          this.loading = false;
        });

      if (data) {
        this.count = data.count;
        this.limit = data.limit;
        this.maxPages = data.maxPages;
        this.page = data.page;
        this.items = data.data.map((value: IGetAllProductsData) => ({
          ...value,
          updated_at: formatDate(value.updated_at),
          price: formatMoney(value.price),
          available: value.available ? "Ativo" : "Não ativo",
          category: value.category_id.name,
        }));
      }
    },
    editItem(id: string) {
      this.$router.push({ name: "product", params: { id } });
    },
    async updateTable(target: any) {
      const proxyObject = JSON.parse(JSON.stringify(target));

      if (proxyObject.sortBy.length) {
        this.sort = proxyObject.sortBy[0].order;
        this.order = proxyObject.sortBy[0].key;
      } else {
        this.sort = "";
        this.order = "";
      }

      this.page = 1;
      await this.getData();
    },
    async changePage(page: number) {
      this.page = page;
      await this.getData();
    },
    async changeLimit(limit: number) {
      this.limit = limit;
      this.page = 1;
      await this.getData();
    },
    async changeCategories(categories: any) {
      this.categories = categories;
      await this.getData();
    },
    changeModalState(value: boolean, id: string) {
      this.modal = value;

      if (id) {
        this.deleteId = id;
      }
    },
    async deleteProductAction() {
      const toast = useToast();

      await deleteProduct(this.deleteId)
        .then((res) => {
          if (res.error)
            toast.error(res.message, {
              timeout: 3000,
            });
          else
            toast.success("Produto removido com sucesso!", {
              timeout: 2000,
            });
        })
        .catch((error) => {
          toast.error(error.message, {
            timeout: 3000,
          });
        })
        .finally(async () => {
          this.modal = false;

          await this.getData();
        });
    },
  },
  async mounted() {
    await this.getData();
  },
};
</script>

<style scoped></style>
