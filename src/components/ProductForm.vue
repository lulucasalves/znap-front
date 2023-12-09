<template>
  <Content>
    <Title class="mb-10" :text="id ? 'Editar produto' : 'Criar produto'" />
    <div @click="returnTable" class="return">
      <v-icon> mdi-arrow-collapse-left </v-icon>
      <p>Voltar</p>
    </div>
    <v-form ref="form" @submit.prevent="sendData" :lazy-validation="false">
      <div class="double-input">
        <v-text-field
          variant="filled"
          density="comfortable"
          v-model="name"
          :rules="rules.name"
          :counter="20"
          label="Nome do produto"
          required
        />
        <v-switch
          color="primary"
          v-model="available"
          :label="`Status ${available ? 'Disponível' : 'Não disponível'}`"
        />
      </div>
      <div class="double-input">
        <v-text-field
          variant="filled"
          density="comfortable"
          v-model="price"
          :rules="rules.price"
          :counter="20"
          label="Preço do produto"
          required
          @input="maskMoney"
        />
        <v-select
          density="comfortable"
          label="Categoria"
          v-model="category"
          :rule="rules.category"
          :items="categories"
          no-data-text="Nenhuma categoria encontrada"
          required
        />
      </div>
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
import {
  getAllCategories,
  getProduct,
  postProduct,
  putProduct,
} from "@/services";
import { useToast } from "vue-toastification";
import { formatMoney, parseMoney } from "@/utils";
import { IGetAllCategoriesData } from "@/interfaces";

export default {
  components: { Title, Content },
  data() {
    return {
      id: "",
      name: "",
      price: "",
      category: null,
      loading: false,
      available: true,
      categories: [],
      allCategories: [],
      rules: {
        name: [
          (value: string) => {
            if (value) return true;

            return "Preencha o nome do produto.";
          },
          (value: string) => {
            if (value?.length <= 20) return true;

            return "O nome não pode possuir mais de 20 caracteres.";
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
        ],
        category: [
          (value: string) => {
            if (value) return true;

            return "É necessário adicionar uma categoria para criar o produto.";
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
      const category_id = this.allCategories
        .filter((value: IGetAllCategoriesData) => this.category === value.name)
        .map((value: IGetAllCategoriesData) => value.id)[0];
      const price = parseMoney(this.price);

      await this.$refs.form
        .validate()
        .then(async ({ valid }: { valid: boolean }) => {
          if (valid) {
            this.loading = true;

            if (!this.id) {
              await postProduct({
                name: this.name,
                available: this.available,
                price,
                category_id,
              })
                .then((res) => {
                  if (res.error) this.errorMessage(res.message);
                  else {
                    toast.success("Produto criado com sucesso!", {
                      timeout: 2000,
                    });
                    this.$router.push({ name: "products" });
                  }
                })
                .catch((error) => this.errorMessage(error.message))
                .finally(() => (this.loading = false));
            } else {
              await putProduct({
                id: this.id,
                name: this.name,
                available: this.available,
                price,
                category_id,
              })
                .then((res) => {
                  if (res.error) this.errorMessage(res.message);
                  else {
                    toast.success("Produto atualizado com sucesso!", {
                      timeout: 2000,
                    });
                    this.$router.push({ name: "products" });
                  }
                })
                .catch((error) => this.errorMessage(error.message))
                .finally(() => (this.loading = false));
            }
          }
        });
    },
    returnTable() {
      this.$router.push({ name: "products" });
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

    const dataCategory = await getAllCategories({
      page: 1,
      limit: 1000,
      sort: "asc",
      active: "true",
      order: "name",
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

    this.allCategories = dataCategory.data;
    this.categories = dataCategory.data
      .filter((val: IGetAllCategoriesData) => val.available)
      .map((val: IGetAllCategoriesData) => val.name);
    this.category = this.categories[0];

    if (id !== "new") {
      this.id = id;
      this.loading = true;

      const data = await getProduct({ id: this.id })
        .then((res) => {
          if (res.error) this.errorMessage(res.message);
          return res;
        })
        .catch((error) => this.errorMessage(error.message))
        .finally(() => (this.loading = false));

      this.name = data.name;
      this.available = data.available;
      this.price = formatMoney(data.price);
      this.category = dataCategory.data.filter(
        (value: IGetAllCategoriesData) => value.id === data.category_id.id
      )[0].name;
    }
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
