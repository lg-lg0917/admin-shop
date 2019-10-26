<template>
  <div class="index">
    <el-container class="index">
      <el-header>
        <div class="logo">
          <img src="../assets/logo.png" alt />
        </div>
        <div class="title">
          <h1>电商后台管理系统</h1>
        </div>
        <div class="logout">
          欢迎光临~
          <a @click="logout" href="javascript:;">退出</a>
        </div>
      </el-header>
      <el-container>
        <!-- 左侧 -->
        <el-aside width="200px">
          <el-menu
            router
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#ffd04b"
            unique-opened
          >
            <el-submenu index="1">
              <!-- 标题 -->
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>用户管理</span>
              </template>
              <!-- 展开的内容 -->
              <el-menu-item index="user">
                <i class="el-icon-menu"></i>
                <span slot="title">用户列表</span>
              </el-menu-item>

            </el-submenu>
             <el-submenu index="2">
              <!-- 标题 -->
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>权限管理</span>
              </template>
              <!-- 展开的内容 -->
              <el-menu-item index="roles">
                <i class="el-icon-menu"></i>
                <span slot="title">角色列表</span>
              </el-menu-item>
              <el-menu-item index="rights">
                <i class="el-icon-menu"></i>
                <span slot="title">权限列表</span>
              </el-menu-item>

            </el-submenu>
          </el-menu>
        </el-aside>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  methods: {
    logout () {
      this.$confirm('亲，确定退出本系统么？', '温馨提示', {
        type: 'warning'
      })
        .then(() => {
          localStorage.removeItem('token')
          this.$router.push('/login')
        })
        .catch(e => {})
      // localStorage.removeItem('token')
      // this.$router.push('/login')
    }
  }
}
</script>

<style lang="scss" scoped>
.index {
  height: 100%;
  .el-header {
    background-color: #d8d8d8;
    display: flex;
    .logo {
      width: 180px;
      img {
        height: 40px;
        margin: 10px;
      }
    }
    .title {
      flex: 1;
      text-align: center;
      margin-top: 10px;
    }
    .logout {
      width: 180px;
      text-align: right;
      line-height: 60px;
      font-weight: 700;
      a {
        color: orange;
      }
    }
  }

  .el-aside {
    background-color: #545c64;
    .el-menu{
      border: none;
    }
  }

  .el-main {
    background-color: #e9eef3;
  }
}
</style>
