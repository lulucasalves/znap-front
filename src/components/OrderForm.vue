<template>
  <Content>
    <Title
      class="mb-10"
      :text="id ? 'Editar produto do pedido' : 'Adicionar produto ao pedido'"
    />
    <div @click="returnTable" class="return">
      <v-icon> mdi-arrow-collapse-left </v-icon>
      <p>Voltar</p>
    </div>
    <v-form ref="form" @submit.prevent="sendData" :lazy-validation="false">
      <div class="double-input">
        <v-text-field
          variant="filled"
          density="comfortable"
          v-model="quantity"
          :rules="rules.quantity"
          :counter="3"
          label="Quantidade"
          required
        />
        <v-select
          density="comfortable"
          label="Produto"
          v-model="product"
          :rules="rules.product"
          :items="products"
          no-data-text="Nenhuma categoria encontrada"
          required
        />
      </div>
      <v-text-field
        variant="filled"
        density="comfortable"
        v-model="price"
        :rules="rules.price"
        :counter="13"
        label="Preço do produto"
        required
        @input="maskMoney"
      />
      <div class="send-button">
        <v-btn
          :disabled="loading"
          :loading="loading"
          type="submit"
          color="primary"
          >{{ id === "" ? "Criar" : "Editar" }}
        </v-btn>
      </div>
    </v-form>
  </Content>
</template>

<script lang="ts">
import Title from "@/components/Title.vue";
import Content from "@/layouts/Content.vue";
import { getAllProducts, getOrder, postOrder, putOrder } from "@/services";
import { useToast } from "vue-toastification";
import { formatMoney, parseMoney } from "@/utils";
import { IGetAllProductsData } from "@/interfaces";

export default {
  components: { Title, Content },
  data() {
    return {
      id: "",
      quantity: "1",
      price: "",
      product: null,
      loading: false,
      products: [],
      allProducts: [],
      rules: {
        quantity: [
          (value: string) => {
            if (value) return true;

            return "Preencha a quantidade de produtos.";
          },
          (value: string) => {
            if (!isNaN(parseInt(value))) return true;

            return "Quantidade inválida";
          },
          (value: string) => {
            if (value.length < 4) return true;

            return "A quantidade não pode ser maior que 999";
          },
        ],
        price: [
          (value: string) => {
            if (value) return true;

            return "Preencha o preço do produto.";
          },
          (value: string) => {
            if (!isNaN(parseMoney(value))) return true;

            return "Preço inválido.";
          },
          (value: string) => {
            if (value.length < 14) return true;

            return "O preço não pode ser maior que R$ 999.999,99";
          },
        ],
        product: [
          (value: string) => {
            if (value) return true;

            return "É necessário adicionar um produto para adicionar o produto.";
          },
        ],
      },
    };
  },
  methods: {
    errorMessage(message: string) {
      const toast = useToast();

      toast.error(message, {
        timeout: 3000,
      });
    },
    async sendData() {
      const toast = useToast();
      const price = parseMoney(this.price);
      const quantity = parseMoney(this.quantity);
      const product_id = this.allProducts
        .filter((value: IGetAllProductsData) => value.name === this.product)
        .map((value: IGetAllProductsData) => value.id)[0];

      await this.$refs.form
        .validate()
        .then(async ({ valid }: { valid: boolean }) => {
          if (valid) {
            this.loading = true;

            if (!this.id) {
              await postOrder({
                product_id,
                price,
                quantity,
                master_order_id: this.$router.currentRoute.value.params
                  .master as string,
              })
                .then((res) => {
                  if (res.error) this.errorMessage(res.message);
                  else {
                    toast.success("Produto do pedido criado com sucesso!", {
                      timeout: 2000,
                    });
                    this.$router.push({
                      name: "orders",
                      params: {
                        id: this.$router.currentRoute.value.params.master,
                      },
                    });
                  }
                })
                .catch((error) => this.errorMessage(error.message))
                .finally(() => (this.loading = false));
            } else {
              await putOrder({
                id: this.id,
                product_id,
                price,
                quantity,
              })
                .then((res) => {
                  if (res.error) this.errorMessage(res.message);
                  else {
                    toast.success("Pedido atualizado com sucesso!", {
                      timeout: 2000,
                    });
                    this.$router.push({
                      name: "orders",
                      params: {
                        id: this.$router.currentRoute.value.params.master,
                      },
                    });
                  }
                })
                .catch((error) => this.errorMessage(error.message))
                .finally(() => (this.loading = false));
            }
          }
        });
    },
    returnTable() {
      this.$router.push({
        name: "orders",
        params: { id: this.$router.currentRoute.value.params.master },
      });
    },
    maskMoney(value: any) {
      const numericValue = value.target.value.replace(/\D/g, "");

      if (!numericValue) {
        this.price = "";
        return;
      }

      const intValue = parseInt(numericValue);
      const formattedValue = new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(intValue / 100);

      this.price = formattedValue;
    },
  },

  async mounted() {
    const id = this.$router.currentRoute.value.params.id as string;
    const toast = useToast();
    this.loading = true;

    const dataProduct = await getAllProducts({
      page: 1,
      limit: 1000,
      sort: "asc",
      order: "name",
      categories: [],
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
      .finally(() => (this.loading = false));

    this.allProducts = dataProduct.data;
    this.products = dataProduct.data
      .filter((val: IGetAllProductsData) => val.available)
      .map((val: IGetAllProductsData) => val.name);

    if (id !== "new") {
      this.id = id;
      this.loading = true;

      const data = await getOrder(this.id)
        .then((res) => {
          if (res.error) this.errorMessage(res.message);
          return res;
        })
        .catch((error) => this.errorMessage(error.message))
        .finally(() => (this.loading = false));

      this.quantity = String(data.quantity);
      this.product = dataProduct.data.filter(
        (value: IGetAllProductsData) => value.id === data.product_id.id
      )[0].name;
      this.price = formatMoney(data.price);
    } else {
      this.product = this.products[0];
    }
  },
  watch: {
    product(target, last) {
      const productPrice = this.allProducts.filter(
        (value) => value.name === target
      )[0];

      if (last || !this.id) this.price = formatMoney(productPrice.price);
    },
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

.double-input {
  display: flex;
  align-items: center;
  gap: 20px;
}

.send-button {
  width: 100%;
  display: flex;
  justify-content: end;
}
</style>
