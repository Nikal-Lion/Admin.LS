<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.username"
        placeholder="姓名"
        style="width: 150px; margin-left: 10px"
        class="filter-item"
      />

      <el-button
        style="margin-left: 10px"
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
        @keyup.enter.native="keyupSubmit"
      >搜索</el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >添加</el-button>
    </div>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />
  </div>
</template>

<script>
import { UserList, updateUser } from '@/api/user'
import Pagination from '@/components/Pagination'

export default {
  name: "UserIndex",
  components: { Pagination },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      imageUrl: '',
      listQuery: {
        page: 1,
        limit: 20,
        importance: '重要性',
        title: undefined,
        type: undefined,
        sort: '+id',
        id: '',
        username: ''
      },

      importanceOptions: [
        { key: '1', display_name: '启用' },
        { key: '2', display_name: '未启用' }
      ],

      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '新增'
      },
      rules: {},
      // dialogStatus: '',
      temp: {
        id: undefined,
        username: '',
        password: ''
      }
    }
  },
  created() {
    this.getList()
    // this.keyupSubmit()
  },
  methods: {
    // keyupSubmit() {
    //   document.onkeydown = (e) => {
    //     const _key = window.event.keyCode
    //     if (_key === 13) {
    //       this.getList()
    //     }
    //   }
    // },
    getList() {
      this.listLoading = true
      UserList(this.listQuery).then((response) => {
        console.log(response)
        debugger
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        username: '',
        password: ''
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          tempData.FaceImage = ''
          updateUser(tempData).then(() => {
            const index = this.list.findIndex((v) => v.id === this.temp.id)
            this.list.splice(index, 1, this.temp)
            this.getList()
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    }
  }
}
</script>
