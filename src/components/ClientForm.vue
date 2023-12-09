<template>
  <Content>
    <Title class="mb-10" :text="id ? 'Editar cliente' : 'Criar cliente'" />
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
          label="Nome do cliente"
          required
        />
        <v-text-field
          variant="filled"
          density="comfortable"
          v-model="phone"
          :rules="rules.phone"
          :counter="15"
          label="Celular do cliente"
          @input="maskPhone"
        />
      </div>
      <v-text-field
        class="mt-3"
        variant="filled"
        density="comfortable"
        type="email"
        :counter="30"
        v-model="email"
        :rules="rules.email"
        label="E-mail do cliente"
      />
      <div class="send-button">
        <v-btn
          :disabled="loading"
          :loading="loading"
          type="submit"
          color="primary"
          >{{ id === "" ? "Criar" : "Editar" }}</v-btn
        >
      </div>
    </v-form>
  </Content>
</template>

<script lang="ts">
import Title from "@/components/Title.vue";
import Content from "@/layouts/Content.vue";
import { getClient, postClient, putClient } from "@/services";
import { useToast } from "vue-toastification";

export default {
  components: { Title, Content },
  data() {
    return {
      id: "",
      name: "",
      email: "",
      phone: "",
      loading: false,

      rules: {
        name: [
          (value: string) => {
            if (value) return true;

            return "Preencha o nome do cliente.";
          },
          (value: string) => {
            if (value?.length <= 20) return true;

            return "O nome não pode possuir mais de 20 caracteres.";
          },
        ],
        phone: [
          (value: string) => {
            if (value?.length === 0 || value.length === 15) return true;

            return "Número de celular inválido!";
          },
        ],
        email: [
          (value: string) => {
            if (value?.length <= 30) return true;

            return "O e-mail não pode possuir mais de 30 caracteres!";
          },
          (value: string) => {
            if (
              (value.includes("@") && value.includes(".")) ||
              value.length === 0
            )
              return true;

            return "E-mail inválido!";
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

      await this.$refs.form
        .validate()
        .then(async ({ valid }: { valid: boolean }) => {
          if (valid) {
            this.loading = true;

            if (!this.id) {
              await postClient({
                name: this.name,
                email: this.email,
                phone: this.phone,
              })
                .then((res) => {
                  if (res.error) this.errorMessage(res.message);
                  else {
                    toast.success("Cliente criado com sucesso!", {
                      timeout: 2000,
                    });
                    this.$router.push({ name: "clients" });
                  }
                })
                .catch((error) => this.errorMessage(error.message))
                .finally(() => (this.loading = false));
            } else {
              await putClient({
                id: this.id,
                name: this.name,
                email: this.email,
                phone: this.phone,
              })
                .then((res) => {
                  if (res.error) this.errorMessage(res.message);
                  else {
                    toast.success("Cliente atualizado com sucesso!", {
                      timeout: 2000,
                    });
                    this.$router.push({ name: "clients" });
                  }
                })
                .catch((error) => this.errorMessage(error.message))
                .finally(() => (this.loading = false));
            }
          }
        });
    },
    returnTable() {
      this.$router.push({ name: "clients" });
    },
    maskPhone(value: any) {
      const numericValue = value.target.value.replace(/\D/g, "");

      if (!numericValue) {
        this.phone = "";
        return;
      }

      let maskedValue = `(${numericValue.slice(0, 2)}) ${numericValue.slice(
        2,
        7
      )}-${numericValue.slice(7, 11)}`;

      this.phone = maskedValue;
    },
  },
  async mounted() {
    const id = this.$router.currentRoute.value.params.id as string;

    if (id !== "new") {
      this.id = id;
      this.loading = true;

      const data = await getClient({ id: this.id })
        .then((res) => {
          if (res.error) this.errorMessage(res.message);
          return res;
        })
        .catch((error) => this.errorMessage(error.message))
        .finally(() => (this.loading = false));

      this.name = data.name;
      this.phone = data.phone;
      this.email = data.email;
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
