<template>
  <Content>
    <Title class="mb-10" text="Detalhes do pedido" />
    <div @click="returnTable" class="return">
      <v-icon> mdi-arrow-collapse-left </v-icon>
      <p>Voltar</p>
    </div>
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
import { deleteMasterOrder, getAllMasterOrders } from "@/services";

export default {
  components: { Title, Content, TableOptions, DeleteModal },
  data() {
    return {
      loading: false,
      items: [] as IGetAllMasterOrdersData[],
      modal: false,
      deleteId: "",
    };
  },
  methods: {
    returnTable() {
      this.$router.push({ name: "master-orders" });
    },
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

<style scoped>
.return {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  width: fit-content;
  color: #ff458d;
  font-size: 14px;
  transition: 0.3s;
  margin-bottom: 30px;
}

.return:hover {
  opacity: 0.7;
}

.return p {
  font-size: 16px;
  font-weight: 500;
}
</style>
