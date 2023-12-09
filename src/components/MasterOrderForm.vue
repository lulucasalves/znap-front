<template>
  <Content>
    <Title class="mb-10" :text="id ? 'Editar pedido' : 'Criar pedido'" />
    <div @click="returnTable" class="return">
      <v-icon> mdi-arrow-collapse-left </v-icon>
      <p>Voltar</p>
    </div>
    <v-form ref="form" @submit.prevent="sendData" :lazy-validation="false">
      <div class="double-input">
        <v-text-field
          variant="filled"
          density="comfortable"
          v-model="shipping"
          :rules="rules.shipping"
          :counter="20"
          label="Preço do frete"
          required
          @input="maskMoney"
        />
        <v-text-field
          variant="filled"
          density="comfortable"
          v-model="date"
          :rules="rules.date"
          :counter="20"
          label="Data do pedido"
          required
          @input="maskDate"
        />
      </div>
      <v-select
        density="comfortable"
        label="Cliente"
        v-model="client"
        :rules="rules.client"
        :items="clients"
        no-data-text="Nenhum cliente encontrada"
        required
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
import {
  getAllClients,
  getMasterOrder,
  postMasterOrder,
  putMasterOrder,
} from "@/services";
import { useToast } from "vue-toastification";
import {
  formatDateOrder,
  formatDateOrderSend,
  formatMoney,
  getCurrentDate,
  parseMoney,
} from "@/utils";
import { IGetAllClientsData } from "@/interfaces";

export default {
  components: { Title, Content },
  data() {
    return {
      id: "",
      date: "",
      shipping: "",
      client: null,
      loading: false,
      available: true,
      clients: [],
      allClients: [],
      rules: {
        date: [
          (value: string) => {
            if (value) return true;

            return "Preencha a data do pedido.";
          },
          (value: string) => {
            try {
              const [date, month, year] = value.split("/");

              const adjustedMonth = parseInt(month, 10) - 1;

              const testDate = new Date(
                parseInt(year),
                adjustedMonth,
                parseInt(date)
              );

              const validDate =
                testDate.getFullYear() == parseInt(year) &&
                testDate.getMonth() == adjustedMonth &&
                testDate.getDate() == parseInt(date);

              if (date && month && year && value.length === 10 && validDate)
                return true;
              return "Data inválida";
            } catch (err) {
              return "Data inválida";
            }
          },
        ],
        shipping: [
          (value: string) => {
            if (value) return true;

            return "Preencha o preço do frete.";
          },
          (value: string) => {
            if (!isNaN(parseMoney(value))) return true;

            return "Preço inválido.";
          },
        ],
        client: [
          (value: string) => {
            if (value) return true;

            return "É necessário adicionar um cliente para criar o pedido.";
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
      const client_id = this.allClients
        .filter((value: IGetAllClientsData) => this.client === value.name)
        .map((value: IGetAllClientsData) => value.id)[0];
      const shipping = parseMoney(this.shipping);
      const date = formatDateOrderSend(this.date);

      await this.$refs.form
        .validate()
        .then(async ({ valid }: { valid: boolean }) => {
          if (valid) {
            this.loading = true;

            if (!this.id) {
              await postMasterOrder({
                shipping,
                client_id,
                date,
              })
                .then((res) => {
                  if (res.error) this.errorMessage(res.message);
                  else {
                    toast.success("Pedido criado com sucesso!", {
                      timeout: 2000,
                    });
                    this.$router.push({
                      name: "orders",
                      params: { id: res.id },
                    });
                  }
                })
                .catch((error) => this.errorMessage(error.message))
                .finally(() => (this.loading = false));
            } else {
              await putMasterOrder({
                id: this.id,
                shipping,
                client_id,
                date,
              })
                .then((res) => {
                  if (res.error) this.errorMessage(res.message);
                  else {
                    toast.success("Pedido atualizado com sucesso!", {
                      timeout: 2000,
                    });
                    this.$router.push({ name: "master-orders" });
                  }
                })
                .catch((error) => this.errorMessage(error.message))
                .finally(() => (this.loading = false));
            }
          }
        });
    },
    returnTable() {
      this.$router.push({ name: "master-orders" });
    },
    maskMoney(value: any) {
      const numericValue = value.target.value.replace(/\D/g, "");

      if (!numericValue) {
        this.shipping = "";
        return;
      }

      const intValue = parseInt(numericValue);
      const formattedValue = new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(intValue / 100);

      this.shipping = formattedValue;
    },
    maskDate(value: any) {
      const dateValue = value.target.value.replace(/\D/g, "");

      if (!dateValue) {
        this.date = "";
        return;
      }

      const formattedDate = (date: string) => {
        const day = date.substring(0, 2);
        const month = date.substring(2, 4);
        const year = date.substring(4, 8);
        return `${day}/${month}/${year}`;
      };

      this.date = formattedDate(dateValue);
    },
  },
  async mounted() {
    const id = this.$router.currentRoute.value.params.id as string;
    const toast = useToast();
    this.loading = true;

    const dataClient = await getAllClients({
      page: 1,
      limit: 1000,
      sort: "asc",
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

    this.allClients = dataClient.data;
    this.clients = dataClient.data.map((val: IGetAllClientsData) => val.name);
    this.client = this.clients[0];
    this.date = getCurrentDate();

    if (id !== "new") {
      this.id = id;
      this.loading = true;

      const data = await getMasterOrder(this.id)
        .then((res) => {
          if (res.error) this.errorMessage(res.message);
          return res;
        })
        .catch((error) => this.errorMessage(error.message))
        .finally(() => (this.loading = false));

      this.shipping = formatMoney(data.shipping);
      this.client = dataClient.data.filter(
        (value: IGetAllClientsData) => value.id === data.client_id.id
      )[0].name;
      this.date = formatDateOrder(data.date);
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
