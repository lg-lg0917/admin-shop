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
    <el-button @click="showUser" class="addBtn" type="success" plain>添加用户</el-button>
    <!-- 列表 -->
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
          <el-button
            @click="showEidt(obj.row)"
            plain
            size="small"
            icon="el-icon-edit"
            type="primary"
          ></el-button>
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

    <!-- 添加用户 -->
    <el-dialog @close="closeDialog" title="添加用户" :visible.sync="dialogVisible" width="40%">
      <el-form ref="form" :rules="rules" :model="form" label-width="80px" status-icon>
        <el-form-item label="用户名" prop="username">
          <el-input placeholder="请输入用户名" v-model="form.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input placeholder="请输入密码" type="password" v-model="form.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input placeholder="请输入邮箱" v-model="form.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input placeholder="请输入手机" v-model="form.mobile"></el-input>
        </el-form-item>
      </el-form>
      <template v-slot:footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button @click="addUser" type="primary">确 定</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 修改用户 -->
    <el-dialog title="修改用户" :visible.sync="editVisible" width="40%">
      <el-form :rules="rules" ref="editform" :model="editform" label-width="80px">
        <el-form-item label="用户名" >
          <el-tag type="info"> {{editform.username}}</el-tag>
          </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input placeholder="请输入邮箱" v-model="editform.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input placeholder="请输入手机s" v-model="editform.mobile"></el-input>
        </el-form-item>
      </el-form>
      <template v-slot:footer>
        <span class="dialog-footer">
          <el-button @click="editVisible = false"  >取 消</el-button>
          <el-button @click="edituser" type="primary">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
// 发ajax
export default {
  // 在页面渲染之前将数据添加到位
  created () {
    this.getUserList()
  },
  data () {
    return {
      userList: [],
      query: '', // 搜索条件
      pagenum: 1, // 当前页
      pagesize: 2, // 每页条数
      total: 0,
      dialogVisible: false,
      rules: {
        username: [
          {
            required: true,
            message: '请输入用户名',
            trigger: ['change', 'biur']
          },
          {
            min: 3,
            max: 12,
            message: '长度在 3 到 12 个字符',
            trigger: ['change', 'biur']
          }
        ],
        password: [
          {
            required: true,
            message: '请输入密码',
            trigger: ['change', 'biur']
          },
          {
            min: 3,
            max: 6,
            message: '长度在 3 到 6 个字符',
            trigger: ['change', 'biur']
          }
        ],
        email: [
          {
            type: 'email',
            message: '请输入正确的邮箱',
            trigger: ['change', 'biur']
          }
        ],
        mobile: [
          {
            pattern: /^1[3-9]\d{9}$/,
            message: '请输入正确的十一位手机号',
            trigger: ['change', 'biur']
          }
        ]
      },
      form: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      editVisible: false,
      editform: {
        id: '',
        username: '', // 用户名用于展示的
        email: '',
        mobile: ''
      }
    }
  },
  methods: {
    async getUserList () {
      // 发送ajax获取数据，存储到userlist中
      // axios.post(url,data,config).then(..).catch(...)  data 值的是需要再请求体中的数据
      const { meta, data } = await this.$axios.get('users', {
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
      this.getUserList()
    },
    handleCurrentChange (val) {
      // console.log(`当前页: ${val}`)
      this.pagenum = val
      this.getUserList()
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
    searchUser () {
      this.pagenum = 1
      this.getUserList()
    },

    async changeSte (id, flag) {
      const { meta } = await this.$axios.put(`users/${id}/state/${flag}`)
      if (meta.status === 200) {
        this.$message.success(meta.msg)
      } else {
        this.$message.error(meta.msg)
      }
    },
    showUser () {
      this.dialogVisible = true
    },
    async addUser () {
      try {
        // 先校验后发送ajax
        await this.$refs.form.validate()
        // 发送ajax
        const { meta } = await this.$axios.post('users', this.form)
        if (meta.status === 201) {
          this.$message.success(meta.msg)
          // 关闭对话框
          this.dialogVisible = false
          // 更新当前页成最后一页  15/5
          // 需要先让total+1再计算总页数才是对的 改变页数
          this.total++
          this.pagenum = Math.ceil(this.total / this.pagesize)
          // 渲染最后一页
          this.getUserList()
        } else {
          this.$message.error(meta.msg)
        }
      } catch (e) {
        console.log(e)
      }
    },
    closeDialog () {
      this.$refs.form.resetFields() // 重置方法
    },
    showEidt (row) {
      this.editVisible = true
      console.log(row)
      this.editform.id = row.id
      this.editform.username = row.username
      this.editform.email = row.email
      this.editform.mobile = row.mobile
    },
    async edituser () {
      try {
        // 先校验, 发送修改的ajax
        await this.$refs.editform.validate()
        const { id, email, mobile } = this.editform
        const { meta } = await this.$axios.put(`users/${id}`, { email, mobile })
        if (meta.status === 200) {
          this.$message.success(meta.msg)
          this.editVisible = false
          this.getUserList()
        } else {
          this.$message.error(meta.msg)
        }
      } catch (e) {
        console.log(e)
      }
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
