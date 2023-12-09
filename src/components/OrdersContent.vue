<template>
  <Content>
    <Title class="mb-10" text="Detalhes do pedido" />
    <DeleteModal
      :active="modal"
      :change-active="changeModalState"
      :deleteAction="deleteOrderAction"
      title="Tem certeza que deseja remover este produto do carrinho?"
      description="Este produto será removido do pedido permanentemente!"
    />
    <div class="create-div">
      <div @click="returnTable" class="return">
        <v-icon> mdi-arrow-collapse-left </v-icon>
        <p>Voltar</p>
      </div>
      <v-btn @click="create" color="primary" variant="outlined"> Criar </v-btn>
    </div>
    <div class="d-flex w-100 justify-center" v-if="loading">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </div>
    <div v-else-if="items.orders.length" class="cards">
      <div class="card" v-for="(order, i) in items.orders" :key="order.id">
        <p class="product">#{{ i + 1 }} {{ order.product_id.name }}</p>
        <div class="card-info">
          <p>
            {{ order.price }}
          </p>
          <p>
            Quantidade: <span>{{ order.quantity }}</span>
          </p>
          <div class="icons-div">
            <div @click="editItem(order.id)" class="icon-button">
              <v-icon> mdi-pencil-outline </v-icon>
            </div>
            <div @click="changeModalState(true, order.id)" class="icon-button">
              <v-icon> mdi-trash-can-outline </v-icon>
            </div>
          </div>
        </div>
      </div>
    </div>
    <p class="d-flex w-100 justify-center" v-else-if="!items.orders.length">
      Nenhum produto encontrado...
    </p>
  </Content>
</template>

<script lang="ts">
import Title from "@/components/Title.vue";
import DeleteModal from "@/components/DeleteModal.vue";
import Content from "@/layouts/Content.vue";
import { IGetMasterOrdersData } from "@/interfaces";
import { formatMoney } from "@/utils";
import { useToast } from "vue-toastification";
import { deleteOrder, getMasterOrder } from "@/services";

export default {
  components: { Title, Content, DeleteModal },
  data() {
    return {
      loading: false,
      items: { orders: [] } as IGetMasterOrdersData,
      modal: false,
      deleteId: "",
      id: "",
    };
  },
  methods: {
    returnTable() {
      this.$router.push({ name: "master-orders" });
    },
    create() {
      this.$router.push({
        name: "order",
        params: { id: "new", master: this.items.id },
      });
    },
    async getData() {
      const toast = useToast();

      this.loading = true;
      const data = await getMasterOrder(this.id)
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
        this.items = {
          ...data,
          orders: data.orders.map((value: any) => ({
            ...value,
            price: formatMoney(value.price),
          })),
        };
      }
    },
    editItem(id: string) {
      this.$router.push({
        name: "order",
        params: { id, master: this.items.id },
      });
    },
    changeModalState(value: boolean, id: string) {
      this.modal = value;

      if (id) {
        this.deleteId = id;
      }
    },
    async deleteOrderAction() {
      const toast = useToast();

      await deleteOrder(this.deleteId)
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
    const id = this.$router.currentRoute.value.params.id as string;

    this.id = id;
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
}

.return:hover {
  opacity: 0.7;
}

.return p {
  font-size: 16px;
  font-weight: 500;
}

.cards {
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 20px;
}

.card {
  display: flex;
  border-radius: 8px;
  background: white;
  box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px,
    rgba(60, 64, 67, 0.15) 0px 2px 6px 2px;
  padding: 20px 30px;
  width: 100%;
  justify-content: space-between;
  align-items: center;
}

.product {
  font-size: 24px;
  font-weight: 500;
  word-break: break-all;
  margin-right: 10px;
}

.card-info {
  display: flex;
  align-items: center;
}

.card-info p {
  font-size: 18px;
  font-weight: 500;
  margin-right: 30px;
}

.card-info p span {
  font-weight: 400;
}

.icons-div {
  display: flex;
  align-items: center;
  gap: 15px;
}

.create-div {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 30px;
}

@media (max-width: 500px) {
  .card {
    flex-direction: column;
    gap: 5px;
  }

  .card-info {
    flex-direction: column;
    gap: 5px;
  }

  .card-info p {
    margin-right: 0;
  }
}
</style>
