<template>
  <div>
    <el-page-header
      @back="
        () => {
          this.$router.go(-1);
        }
      "
      :content="this.$route.params.id ? '编辑用户' : '新建用户'"
    >
    </el-page-header>
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item label="用户名" prop="username">
        <el-input v-model="ruleForm.username"></el-input>
      </el-form-item>

      <el-form-item label="密码" prop="pass">
        <el-input
          type="password"
          v-model="ruleForm.pass"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="checkPass">
        <el-input
          type="password"
          v-model="ruleForm.checkPass"
          autocomplete="off"
        ></el-input>
      </el-form-item>

      <el-form-item label="权限" prop="role">
        <el-radio v-model="ruleForm.role" :label="0">超级管理员</el-radio>
        <el-radio v-model="ruleForm.role" :label="1">发帖员</el-radio>
      </el-form-item>

      <el-form-item>
        <el-button
          type="primary"
          v-loading.fullscreen.lock="fullscreenLoading"
          @click="submitForm('ruleForm')"
          >{{ this.$route.params.id ? "立即保存" : "立即创建" }}</el-button
        >
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    let validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.ruleForm.checkPass !== "") {
          this.$refs.ruleForm.validateField("checkPass");
        }
        callback();
      }
    };
    let validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.ruleForm.pass) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      fullscreenLoading: false,
      ruleForm: {
        username: "",
        role: 1,
        pass: "",
        checkPass: ""
      },
      rules: {
        pass: [{ required: true, validator: validatePass, trigger: "blur" }],
        checkPass: [
          { required: true, validator: validatePass2, trigger: "blur" }
        ],
        username: [
          { required: true, message: "请输入用户名称", trigger: "blur" }
        ],
        role: [{ required: true, message: "请选择权限", trigger: "change" }]
      }
    };
  },
  methods: {
    async createUser() {
      this.fullscreenLoading = true;
      const res = await this.$axios.post("/create/user", this.ruleForm);
      this.fullscreenLoading = false;
      if (res.data.err_code === 0) {
        this.$message({
          message: "账户创建成功",
          type: "success"
        });
        this.$router.push("/userlist");
      } else if (res.data.err_code === 2) {
        this.$message.error("用户已存在");
      } else {
        this.$message.error("出现错误");
      }
    },
    async editUser() {
      this.fullscreenLoading = true;
      const res = await this.$axios.post(
        `/edit/user/${this.$route.params.id}`,
        this.ruleForm
      );
      this.fullscreenLoading = false;
      if (res.data.err_code === 0) {
        this.$message({
          message: "账户创建成功",
          type: "success"
        });
        this.$router.push("/userlist");
      } else {
        this.$message.error("出现错误");
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.$route.params.id) {
            this.editUser();
          } else {
            this.createUser();
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    async fetch() {
      const res = await this.$axios.post("/detailed/user", {
        id: this.$route.params.id
      });
      this.ruleForm.username = res.data[0].username;
      this.ruleForm.role = res.data[0].role;
    }
  },
  created() {
    if (this.$route.params.id) {
      this.fetch();
    }
  }
};
</script>

<style>
.el-page-header {
  margin-bottom: 30px;
}
</style>
