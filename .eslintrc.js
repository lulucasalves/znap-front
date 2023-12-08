module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    "plugin:vue/vue3-essential",
    "eslint:recommended",
    "@vue/eslint-config-typescript",
  ],
  rules: {
    "vue/multi-word-component-names": "off",
    "vue/no-reserved-component-names": "off",
    "vue/valid-v-slot": "off",
    "vue/no-use-v-if-with-v-for": "off",
  },
};
