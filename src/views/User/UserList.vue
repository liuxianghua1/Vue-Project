<template>
  <div>
    <el-page-header
      @back="
        () => {
          this.$router.go(-1);
        }
      "
      content="用户列表"
    >
    </el-page-header>
    <el-input
      class="search"
      v-model="search.username"
      clearable
      style="width: 250px;margin-right: 20px;margin-bottom: 20px;"
      prefix-icon="el-icon-search"
      placeholder="输入用户姓名搜索"
    />
    <el-table v-loading="loading" :data="tableData" style="width: 100%">
      <el-table-column
        label="序号"
        type="index"
        :index="table_index"
        show-ov
        erflow-tooltip
        width="50"
      ></el-table-column>
      <el-table-column prop="id" label="id"> </el-table-column>
      <el-table-column prop="username" label="用户名"> </el-table-column>
      <el-table-column prop="role" label="权限">
        <template slot-scope="scope">
          <el-tag type="success">{{
            scope.row.role == 0 ? "超级管理员" : "发帖员"
          }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="100">
        <template slot-scope="scope">
          <el-button type="text" @click="edituser(scope.row)" size="small"
            >编辑</el-button
          >
          <el-button type="text" @click="remove(scope.row)" size="small"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <div class="block">
      <el-pagination
        :current-page.sync="pagination.page_index"
        @current-change="handleCurrentChange"
        :page-size="pagination.page_size"
        layout="total, prev, pager, next, jumper"
        style="margin-top: 20px;text-align: center;"
        :total="pagination.total"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
let _ = require("lodash");
export default {
  data() {
    return {
      tableData: [],
      loading: true,
      pagination: {
        total: 0,
        page_size: 10,
        page_index: 0
      },
      search: {
        username: ""
      }
    };
  },
  methods: {
    edituser(row) {
      this.$router.push(`/edituser/${row.id}`);
    },
    async remove(row) {
      this.$confirm(`确定要删除"${row.username}"`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "error"
      })
        .then(async () => {
          const res = await this.$axios.get(`/delete/user/${row.id}`);
          if (res.data.err_code == 0) {
            this.$message({
              type: "success",
              message: "删除成功!"
            });
            this.fetch();
          } else {
            this.$message({
              type: "error",
              message: "删除失败,请联系管理员!"
            });
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    table_index(index) {
      return (
        (this.pagination.page_index - 1) * this.pagination.page_size + index + 1
      );
    },
    async fetch(username, page) {
      username = username || "";
      page = page || 1;
      const res = await this.$axios.post("/select/user", {
        page,
        username
      });
      this.tableData = res.data;
      this.loading = false;
      const count = await this.$axios.get("/select/userCount");
      this.pagination.total = count.data[0].userCount;
    },
    async handleCurrentChange(page) {
      this.fetch("", page);
    },
    usernameSearch: _.debounce(function(username) {
      this.fetch(username);
    }, 1000)
  },
  created() {
    this.fetch();
  },
  watch: {
    "search.username": function(val) {
      this.usernameSearch(val);
    }
  }
};
</script>

<style>
/* .search {
  
} */
</style>
