import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    component: () => import("@/layouts/Default.vue"),
    children: [
      {
        path: "",
        name: "clients",
        component: () => import("@/views/Clients.vue"),
      },
    ],
  },
  {
    path: "/client/:id",
    component: () => import("@/layouts/Default.vue"),
    children: [
      {
        path: "",
        name: "client",
        component: () => import("@/views/ClientForm.vue"),
      },
    ],
  },
  {
    path: "/categories",
    component: () => import("@/layouts/Default.vue"),
    children: [
      {
        path: "",
        name: "categories",
        component: () => import("@/views/Categories.vue"),
      },
    ],
  },
  {
    path: "/category/:id",
    component: () => import("@/layouts/Default.vue"),
    children: [
      {
        path: "",
        name: "category",
        component: () => import("@/views/CategoryForm.vue"),
      },
    ],
  },
  {
    path: "/products",
    component: () => import("@/layouts/Default.vue"),
    children: [
      {
        path: "",
        name: "products",
        component: () => import("@/views/Products.vue"),
      },
    ],
  },
  {
    path: "/product/:id",
    component: () => import("@/layouts/Default.vue"),
    children: [
      {
        path: "",
        name: "product",
        component: () => import("@/views/ProductForm.vue"),
      },
    ],
  },
  {
    path: "/master-orders",
    component: () => import("@/layouts/Default.vue"),
    children: [
      {
        path: "",
        name: "master-orders",
        component: () => import("@/views/MasterOrders.vue"),
      },
    ],
  },
  {
    path: "/master-order/:id",
    component: () => import("@/layouts/Default.vue"),
    children: [
      {
        path: "",
        name: "master-order",
        component: () => import("@/views/MasterOrderForm.vue"),
      },
    ],
  },
  {
    path: "/orders/:id",
    component: () => import("@/layouts/Default.vue"),
    children: [
      {
        path: "",
        name: "orders",
        component: () => import("@/views/Orders.vue"),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
