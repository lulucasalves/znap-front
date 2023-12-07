<template>
  <Content>
    <Title class="mb-10" text="Pedidos" />
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
      v-model="selectedItems"
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
      show-select
      :header-props="{ 'sort-icon': 'mdi-unfold-more-horizontal' }"
      @update:options="updateTable"
    >
      <template v-slot:item.actions="{ item }">
        <div class="icons-div">
          <div @click="seeMore(item.id)" class="icon-button">
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
    <ReportTotal :totalValues="totalValues" />
  </Content>
</template>

<script lang="ts">
import Title from "@/components/Title.vue";
import TableOptions from "@/components/TableOptionsMasterOrders.vue";
import DeleteModal from "@/components/DeleteModal.vue";
import ReportTotal from "@/components/ReportTotal.vue";
import Content from "@/layouts/Content.vue";
import { IGetAllMasterOrdersData } from "@/interfaces";
import { formatDate, formatMoney, formatDateOrder, parseMoney } from "@/utils";
import { useToast } from "vue-toastification";
import { deleteMasterOrder, getAllMasterOrders } from "@/services";

export default {
  components: { Title, Content, TableOptions, DeleteModal, ReportTotal },
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
      selectedItems: [],
      totalValues: {},
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
        this.selectedItems = this.selectedItems.filter((value) =>
          data.data.find((valueData) => valueData.id === value)
        );

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
    seeMore(id: string) {
      this.$router.push({ name: "orders", params: { id } });
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
      dateTo,
      dateFrom,
    }: {
      products: never[];
      categories: never[];
      clients: never[];
      dateTo: string;
      dateFrom: string;
    }) {
      this.categories = categories;
      this.products = products;
      this.clients = clients;
      this.dateTo = dateTo;
      this.dateFrom = dateFrom;

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
  watch: {
    async selectedItems(target) {
      const targetData = JSON.parse(JSON.stringify(target));

      if (targetData.length) {
        const data = JSON.parse(
          JSON.stringify(
            this.items.filter((value) => targetData.includes(value.id))
          )
        );

        let totalObject = {
          averagePrice: 0,
          totalPrice: 0,
          shipping: 0,
          products: 0,
        };

        for (const item of data) {
          const averagePrice = parseMoney(item.average_price);
          const totalPrice = parseMoney(item.total_price);
          const shipping = parseMoney(item.shipping);
          const products = parseInt(item.total_quantity);

          totalObject = {
            averagePrice: averagePrice + totalObject.averagePrice,
            totalPrice: totalObject.totalPrice + totalPrice,
            shipping: shipping + totalObject.shipping,
            products: products + totalObject.products,
          };
        }

        this.totalValues = {
          averagePrice: formatMoney(totalObject.averagePrice / data.length),
          totalPrice: formatMoney(totalObject.totalPrice),
          shipping: formatMoney(totalObject.shipping),
          products: String(totalObject.products),
        };
      } else {
        this.totalValues = {};
      }
    },
  },
};
</script>

<style scoped></style>
