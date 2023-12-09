<template>
  <Content>
    <Title class="mb-10" :text="id ? 'Editar categoria' : 'Criar categoria'" />
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
          label="Nome da categoria"
          required
        />
        <v-switch
          color="primary"
          v-model="available"
          :label="`Status ${available ? 'Disponível' : 'Não disponível'}`"
        ></v-switch>
      </div>
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
import { getCategory, postCategory, putCategory } from "@/services";
import { useToast } from "vue-toastification";

export default {
  components: { Title, Content },
  data() {
    return {
      id: "",
      name: "",
      loading: false,
      available: true,
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
              await postCategory({
                name: this.name,
                available: this.available,
              })
                .then((res) => {
                  if (res.error) this.errorMessage(res.message);
                  else {
                    toast.success("Categoria criada com sucesso!", {
                      timeout: 2000,
                    });
                    this.$router.push({ name: "categories" });
                  }
                })
                .catch((error) => this.errorMessage(error.message))
                .finally(() => (this.loading = false));
            } else {
              await putCategory({
                id: this.id,
                name: this.name,
                available: this.available,
              })
                .then((res) => {
                  if (res.error) this.errorMessage(res.message);
                  else {
                    toast.success("Categoria atualizada com sucesso!", {
                      timeout: 2000,
                    });
                    this.$router.push({ name: "categories" });
                  }
                })
                .catch((error) => this.errorMessage(error.message))
                .finally(() => (this.loading = false));
            }
          }
        });
    },
    returnTable() {
      this.$router.push({ name: "categories" });
    },
  },
  async mounted() {
    const id = this.$router.currentRoute.value.params.id as string;

    if (id !== "new") {
      this.id = id;
      this.loading = true;

      const data = await getCategory({ id: this.id })
        .then((res) => {
          if (res.error) this.errorMessage(res.message);
          return res;
        })
        .catch((error) => this.errorMessage(error.message))
        .finally(() => (this.loading = false));

      this.name = data.name;
      this.available = data.available;
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
