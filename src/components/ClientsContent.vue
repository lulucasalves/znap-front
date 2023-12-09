<template>
  <Content>
    <Title class="mb-10" text="Clientes" />
    <TableOptions
      :changeFilter="changeFilter"
      router-name="client"
      :changeLimit="changeLimit"
      :limit="limit"
    />
    <DeleteModal
      :active="modal"
      :change-active="changeModalState"
      :deleteAction="deleteClientAction"
      title="Tem certeza que deseja remover este cliente?"
      description="Ao remover o cliente, você removerá todos pedidos vinculados a
      ele!"
    />
    <v-data-table
      :items="items"
      style="white-space: nowrap"
      loading-text="Buscando dados..."
      item-value="id"
      sort-desc-icon="mdi-menu-down"
      sort-asc-icon="mdi-menu-up"
      items-per-page-text="Items por página"
      :items-per-page="100"
      no-data-text="Nenhum cliente encontrado"
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
import TableOptions from "@/components/TableOptions.vue";
import DeleteModal from "@/components/DeleteModal.vue";
import Content from "@/layouts/Content.vue";
import { deleteClient, getAllClients } from "@/services";
import { IGetAllClientsData } from "@/interfaces";
import { formatDate } from "@/utils";
import { useToast } from "vue-toastification";

export default {
  components: { Title, Content, TableOptions, DeleteModal },
  data() {
    return {
      loading: false,
      items: [] as IGetAllClientsData[],
      headers: [
        { title: "Nome", value: "name", sortable: true },
        { title: "E-mail", value: "email", sortable: true },
        { title: "Celular", value: "phone", sortable: true },
        { title: "Última atualização", value: "updated_at", sortable: true },
        { text: "Ações", value: "actions" },
      ],
      count: 0,
      limit: 15,
      maxPages: 1,
      page: 1,
      filter: "",
      sort: "",
      order: "",
      modal: false,
      deleteId: "",
    };
  },
  methods: {
    async getData() {
      const toast = useToast();

      this.loading = true;
      const data = await getAllClients({
        limit: this.limit,
        page: this.page,
        sort: this.sort,
        order: this.order,
        filter: this.filter,
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
        this.items = data.data.map((value: IGetAllClientsData) => ({
          ...value,
          updated_at: formatDate(value.updated_at),
          email: value.email ?? "-",
          phone: value.phone ?? "-",
        }));
      }
    },
    editItem(id: string) {
      this.$router.push({ name: "client", params: { id } });
    },
    async changeFilter(filterValue: string) {
      this.filter = filterValue;
      this.page = 1;

      await this.getData();
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
    changeModalState(value: boolean, id: string) {
      this.modal = value;

      if (id) {
        this.deleteId = id;
      }
    },
    async deleteClientAction() {
      const toast = useToast();

      await deleteClient(this.deleteId)
        .then((res) => {
          if (res.error)
            toast.error(res.message, {
              timeout: 3000,
            });
          else
            toast.success("Cliente removido com sucesso!", {
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
.icon-button {
  padding: 5px;
  border-radius: 4px;
  background: rgba(255, 68, 142, 0.1);
  width: fit-content;
  cursor: pointer;
  transition: 0.3s;
}

.icon-button i {
  font-size: 24px;
  color: rgba(255, 68, 142, 1);
}

.icon-button:hover {
  opacity: 0.8;
}

.icons-div {
  display: flex;
  align-items: center;
  gap: 15px;
}
</style>
