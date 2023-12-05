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
        component: () => import("@/views/Clients.vue"),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
