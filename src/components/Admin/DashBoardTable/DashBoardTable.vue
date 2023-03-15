<template>
  <div class="dashboard-table">
    <el-table :data="tableData" style="width: 100%" table-layout="auto">
      <el-table-column fixed prop="id" label="Id" />
      <el-table-column prop="name" label="Name" />
      <el-table-column prop="state" label="State" />
      <el-table-column prop="city" label="City" />
      <el-table-column prop="image" label="Image" align="center">
        <el-table-column prop="poster" label="Poster" />
        <el-table-column prop="backdrop" label="Backdrop" />
      </el-table-column>
      <el-table-column fixed="right" label="Operations">
        <template #default>
          <el-button link type="primary" size="small" @click="handleClick"
            >Detail
          </el-button>
          <el-button link type="primary" size="small">Edit</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { ref } from 'vue';

export default {
  setup() {
    const tableData = ref([]);

    return {
      tableData,
    };
  },
};
</script>

<style lang="scss" scoped src="./DashBoardTable.scss"></style>
