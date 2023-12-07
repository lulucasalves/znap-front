<template>
  <Content>
    <Title class="mb-10" text="Detalhes do pedido" />
    <TableOptions
      router-name="master-order"
      :changeLimit="changeLimit"
      :limit="limit"
      :changeFilter="changeFilter"
    />
    <DeleteModal
      :active="modal"
      :change-active="changeModalState"
      :deleteAction="deleteMasterOrderAction"
      title="Tem certeza que deseja remover este pedido?"
      description="Ao remover o pedido, você removerá todos produtos no carrinho de compras vinculados a
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
            <p>Mais detalhes</p>
          </div>
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
import TableOptions from "@/components/TableOptionsMasterOrders.vue";
import DeleteModal from "@/components/DeleteModal.vue";
import Content from "@/layouts/Content.vue";
import { IGetAllMasterOrdersData } from "@/interfaces";
import { formatDate, formatMoney, formatDateOrder } from "@/utils";
import { useToast } from "vue-toastification";
import {
  deleteMasterOrder,
  deleteProduct,
  getAllMasterOrders,
} from "@/services";

export default {
  components: { Title, Content, TableOptions, DeleteModal },
  data() {
    return {
      loading: false,
      items: [] as IGetAllMasterOrdersData[],
      headers: [
        { title: "Cliente", value: "client", sortable: false },
        { title: "Produtos", value: "total_quantity", sortable: true },
        { title: "Frete", value: "shipping", sortable: true },
        { title: "Preço total", value: "total_price", sortable: true },
        { title: "Preço médio", value: "average_price", sortable: true },
        { title: "Data do pedido", value: "date", sortable: true },
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
      clients: [],
      products: [],
      dateTo: "",
      dateFrom: "",
    };
  },
  methods: {
    async getData() {
      const toast = useToast();

      this.loading = true;
      const data = await getAllMasterOrders({
        limit: this.limit,
        page: this.page,
        sort: this.sort,
        order: this.order,
        categories: this.categories,
        clients: this.clients,
        dateFrom: this.dateFrom,
        dateTo: this.dateTo,
        products: this.products,
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
        this.items = data.data.map((value: IGetAllMasterOrdersData) => ({
          ...value,
          updated_at: formatDate(value.updated_at),
          total_price: formatMoney(parseFloat(value.total_price)),
          average_price: formatMoney(parseFloat(value.average_price)),
          shipping: formatMoney(value.shipping),
          client: value.client.name,
          total_quantity: !value.total_quantity ? "0" : value.total_quantity,
          date: formatDateOrder(value.date),
        }));
      }
    },
    editItem(id: string) {
      this.$router.push({ name: "master-order", params: { id } });
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
    async changeFilter({
      categories,
      products,
      clients,
    }: {
      products: never[];
      categories: never[];
      clients: never[];
    }) {
      this.categories = categories;
      this.products = products;
      this.clients = clients;

      await this.getData();
    },

    changeModalState(value: boolean, id: string) {
      this.modal = value;

      if (id) {
        this.deleteId = id;
      }
    },
    async deleteMasterOrderAction() {
      const toast = useToast();

      await deleteMasterOrder(this.deleteId)
        .then((res) => {
          if (res.error)
            toast.error(res.message, {
              timeout: 3000,
            });
          else
            toast.success("Pedido removido com sucesso!", {
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
