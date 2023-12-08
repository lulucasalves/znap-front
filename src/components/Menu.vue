<template>
  <v-app-bar app class="pl-5" elevation="0" border>
    <div :class="{ 'znap-div': true, mobile: $vuetify.display.mdAndDown }">
      <template v-if="$vuetify.display.mdAndDown">
        <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      </template>

      <img
        src="https://znap.com.br/wp-content/themes/znap/images/logos/logo-positiva.png"
      />
    </div>
  </v-app-bar>
  <v-navigation-drawer app v-model="drawer" v-model:mini-variant="mini">
    <v-list class="mt-5">
      <v-list-item-group>
        <v-list-item
          class="pt-3 pb-3"
          color="primary"
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
      drawer: true,
      mini: false,
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
          to: "/master-orders",
          active: ["master-orders", "orders", "order", "master-order"],
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

.v-list-item__overlay {
  background: blue;
}

.znap-div {
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
}

.znap-div img {
  height: 30px;
}

.mobile {
  padding: 0px;
}
</style>
