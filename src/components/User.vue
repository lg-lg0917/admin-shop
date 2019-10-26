<template>
  <div class="users">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索 -->
    <el-input placeholder="请输入内容" v-model="query" class="input-with-select">
      <el-button @click="searchUser" slot="append" icon="el-icon-search"></el-button>
    </el-input>
    <el-button class="addBtn" type="success" plain>添加用户</el-button>

    <el-table :data="userList">
      <el-table-column prop="username" label="姓名"></el-table-column>
      <el-table-column prop="email" label="邮箱"></el-table-column>
      <el-table-column prop="mobile" label="电话"></el-table-column>
      <el-table-column label="用户状态">
        <!-- 通过 作用域插槽 可以获取到 row, column, $index 和 store 的数据 -->
        <!-- row指的是一行的数据 -->
        <template v-slot:default="obj">
          <!-- {{ obj.row }} -->
          <!-- {{ obj.row.mg_state }} -->
          <el-switch
            @change="changeSte(obj.row.id,obj.row.mg_state)"
            v-model="obj.row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template v-slot:default="obj">
          <el-button plain size="small" icon="el-icon-edit" type="primary"></el-button>
          <el-button
            @click="delUser(obj.row.id)"
            plain
            size="small"
            icon="el-icon-delete"
            type="danger"
          ></el-button>
          <el-button plain size="small" icon="el-icon-check" type="success">分配角色</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <!--
      @size-change="handleSizeChange"  每页条数变化 每页2条 => 每页4条
      @current-change="handleCurrentChange" 当前页变化 当前第2页 => 第3页

      :current-page 当前页
      :page-sizes 可供选择的每页条数
      :page-size  当前每页条数
      layout 展示的功能控件
    -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[2, 4, 6, 8]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
  </div>
</template>

<script>
// 发ajax
export default {
  // 在页面渲染之前将数据添加到位
  created () {
    this.getUserlist()
  },
  methods: {

    async getUserlist () {
      // 发送ajax获取数据，存储到userlist中
      // axios.post(url,data,config).then(..).catch(...)  data 值的是需要再请求体中的数据
      const { meta, data } = await this.$axios
        .get('users', {
          params: {
            query: this.query,
            pagesize: this.pagesize,
            pagenum: this.pagenum
          }
        })
      if (meta.status === 200) {
        this.userList = data.users
        this.total = data.total
      } else {
        this.$message.error(meta.msg)
      }
    },

    handleSizeChange (val) {
      // console.log(`每页 ${val} 条`)
      this.pagesize = val
      this.pagesize = 1
      this.getUserlist()
    },
    handleCurrentChange (val) {
      // console.log(`当前页: ${val}`)
      this.pagenum = val
      this.getUserlist()
    },
    async delUser (id) {
      try {
        await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          type: 'warning'
        })
        const { meta } = await this.$axios.delete(`users/${id}`)
        if (meta.status === 200) {
          this.$message.success('删除成功')
          if (this.userList.length === 1 && this.pagenum > 1) {
            this.pagenum--
          }
          this.getUserlist()
        } else {
          this.$message.error(meta.msg)
        }
      } catch (e) {
        console.log(e)
      }
    },
    // delUser (id) {
    //   this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
    //     type: 'warning'
    //   }).then(() => {
    //     this.$axios.delete(`users/${id}`).then(res => {
    //       const { meta } = res
    //       if (meta.status === 200) {
    //         this.$message.success('删除成功')
    //         if (this.userList.length === 1 && this.pagenum > 1) {
    //           this.pagenum--
    //         }
    //         this.getUserlist()
    //       } else {
    //         this.$message.error(meta.msg)
    //       }
    //     })
    //   })
    // },
    searchUser () {
      this.pagenum = 1
      this.getUserlist()
    },

    async changeSte (id, flag) {
      const { meta } = await this.$axios.put(`users/${id}/state/${flag}`)
      if (meta.status === 200) {
        this.$message.success(meta.msg)
      } else {
        this.$message.error(meta.msg)
      }
    }
    // changeSte (id, flag) {
    //   console.log(flag)
    //   console.log(id)
    //   this.$axios.put(`users/${id}/state/${flag}`).then(res => {
    //     console.log(res)
    //     const { meta } = res
    //     if (meta.status === 200) {
    //       this.$message.success(meta.msg)
    //     } else {
    //       this.$message.error(meta.msg)
    //     }
    //   })
    // }
  },
  data () {
    return {
      userList: [],
      query: '', // 搜索条件
      pagenum: 1, // 当前页
      pagesize: 2, // 每页条数
      total: 0
    }
  }
}
</script>

<style lang="scss" scoped>
.users {
  .el-breadcrumb {
    height: 40px;
    line-height: 40px;
    border-bottom: 1px solid #ccc;
    margin-bottom: 10px;
  }
  .input-with-select {
    width: 300px;
    margin-bottom: 10px;
  }
  .addBtn {
    margin-left: 10px;
  }
}
</style>
