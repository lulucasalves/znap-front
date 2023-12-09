<template>
  <div v-if="totalValues.totalPrice" class="report-div">
    <div class="report">
      <table>
        <thead>
          <tr>
            <th>Valor total</th>
            <th>Preço médio</th>
            <th>Frete total</th>
            <th>Número de produtos</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{{ totalValues.totalPrice }}</td>
            <td>{{ totalValues.averagePrice }}</td>
            <td>{{ totalValues.shipping }}</td>
            <td>{{ totalValues.products }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  title: "ReportTotal",
  props: ["totalValues"],
};
</script>

<style scoped>
.report {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 70px;
  border-radius: 8px;
  background: white;
  box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px,
    rgba(60, 64, 67, 0.15) 0px 2px 6px 2px;
  padding: 0 20px;
  transition: 0.3s;
  animation: showReport 0.5s forwards;
  white-space: nowrap;
  overflow-x: scroll;
}

@keyframes showReport {
  0% {
    margin-top: 100px;
    opacity: 0;
  }

  100% {
    margin-top: 50px;
    opacity: 1;
  }
}

.double {
  display: flex;
  align-items: center;
  gap: 10px;
}

table {
  width: 100%;
}

tr {
  width: 100%;
}

td,
th {
  text-align: center;
  width: 25%;
  min-width: 120px;
}
</style>
