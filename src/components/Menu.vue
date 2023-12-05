<template>
  <v-navigation-drawer app>
    <div
      :class="{
        'znap-div': true,
      }"
    >
      <img
        src="https://znap.com.br/wp-content/themes/znap/images/logos/logo-positiva.png"
      />
    </div>
    <v-list class="mt-5">
      <v-list-item-group>
        <v-list-item
          class="pt-3 pb-3"
          color="#FF458D"
          :active="item.active.includes(String(router))"
          v-for="item in menuItems"
          :key="item.title"
          :to="item.to"
        >
          <v-list-item-content class="list-content">
            <v-list-item-icon>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </v-navigation-drawer>
</template>

<script lang="ts">
export default {
  data() {
    return {
      menuItems: [
        {
          title: "Clientes",
          icon: "mdi-account-group-outline",
          to: "/",
          active: ["clients", "client"],
        },
        {
          title: "Produtos",
          icon: "mdi-package-variant",
          to: "/products",
          active: ["products", "product"],
        },
        {
          title: "Categorias",
          icon: "mdi-list-box-outline",
          to: "/categories",
          active: ["categories", "category"],
        },
        {
          title: "Pedidos",
          icon: "mdi-truck-fast-outline",
          to: "/orders",
          active: ["orders", "order", "master-order"],
        },
      ],
      router: this.$router.currentRoute.value.name,
    };
  },
  watch: {
    $route(value) {
      this.router = value.name;
    },
  },
};
</script>

<style scoped>
.list-content {
  display: flex;
  align-items: center;
  gap: 15px;
}

.znap-div {
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.05);
}

.znap-div img {
  height: 50px;
}

.v-list-item__overlay {
  background: blue;
}
</style>
