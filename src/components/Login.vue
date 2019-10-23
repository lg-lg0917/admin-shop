<template>
  <div class="login">
    <el-form ref="Form" :rules="rules" :model="form"  label-width="80px" status-icon>
      <img class="logo" src="../assets/01.jpg" alt />
      <el-form-item label="用户名" prop="username">
        <el-input placeholder="请输入用户名" v-model="form.username" ></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input type="password" placeholder="请输入密码" v-model="form.password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="login" class="loginButton" type="primary">登录</el-button>
        <!-- ref` 属性配合 `$refs` 可以获取 dom 元素 (或者 vue组件实例)
        // 步骤:
      // 1. 给需要获取的元素, 添加上 ref 属性
      // 2. 只要给元素加上了 ref 属性, 将来通过 this.$refs 就可以获取到该元素的引用
       -->
        <el-button @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  data () {
    return {
      form: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 12, message: '长度在 3 到 12 个字符', trigger: ['change', 'biur'] }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 6, message: '长度在 3 到 6 个字符', trigger: ['change', 'biur'] }
        ]
      }
    }
  },
  methods: {
    onSubmit () {
      console.log('submit!')
    },
    resetForm () {
      this.$refs.Form.resetFields()
    },
    login () {
      this.$refs.Form.validate(boolean => {
        console.log(boolean)
        if (!boolean) return
        axios.post('http://localhost:8888/api/private/v1/login', this.form).then(res => {
          const { meta } = res.data
          if (meta.status === 200) {
            console.log(meta.msg)
            this.$message({
              type: 'success',
              message: meta.msg
              // center: true
            })
            this.$router.push('/index')
          } else {
            this.$message({
              type: 'error',
              message: meta.msg
              // center: true
            })
          }
        })
      })
    }
  }
}
</script>

<style lang="scss">
.login {
  background-color: #2d434c;
  width: 100%;
  height: 100%;
  overflow: hidden;

  .el-form {
    background-color: #fff;
    width: 400px;
    padding: 20px;
    padding-top: 70px;
    border-radius: 20px;
    margin: 0 auto;
    margin-top: 200px;
    position: relative;

    .logo {
      width: 100px;
      height: 100px;
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      top: -60px;
      border-radius: 50%;
      border: 5px solid #fff;
    }
    .loginButton {
      margin-right: 70px;
    }
  }
}
</style>
