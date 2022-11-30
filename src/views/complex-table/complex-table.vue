<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input placeholder="biaoti" v-model="listQuery.biaoti" style="width: 200px" class="filter-item" />

      <el-select
        v-model="listQuery.importance"
        placeholder="title"
        clearable
        style="width: 90px; margin-left: 10px"
        class="filter-item"
      >
        <el-option
          v-for="item in importanceOptions"
          :key="item"
          :label="item"
          :value="item"
        />
      </el-select>

      <el-select
        v-model="listQuery.type"
        placeholder="类型"
        clearable
        class="filter-item"
        style="width: 130px; margin-left: 10px"
      >
        <el-option
          v-for="item in calendarTypeOptions"
          :key="item.key"
          :label="item.display_name + '(' + item.key + ')'"
          :value="item.key"
        />
      </el-select>

      <el-select
        v-model="listQuery.sort"
        style="width: 140px; margin-left: 10px"
        class="filter-item"
        @change="handleFilter"
      >
        <el-option
          v-for="item in sortOptions"
          :key="item.key"
          :label="item.label"
          :value="item.key"
        />
      </el-select>

      <el-button
        style="margin-left: 10px"
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
        >搜索</el-button
      >
      <el-button
        class="filter-item"
        style="margin-left: 10px"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
        >添加</el-button
      >
      <el-button class="filter-item" type="primary" icon="el-icon-download"
        >导出</el-button
      >
      <el-checkbox class="filter-item" style="margin-left: 15px"
        >审核人</el-checkbox
      >
    </div>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="100px"
        style="width: 400px; margin-left: 50px"
      >
        <!-- <el-form-item label="1111" prop="type">
          <el-select
            v-model="temp.type"
            class="filter-item"
            placeholder="Please select"
          >
            <el-option
              v-for="item in calendarTypeOptions"
              :key="item.key"
              :label="item.display_name"
              :value="item.key"
            />
          </el-select>
        </el-form-item> -->
        <el-form-item label="PersonID" prop="PersonID">
          <el-input v-model="temp.PersonID" />
        </el-form-item>

        <el-form-item label="时间" prop="PassTime">
          <el-date-picker
            v-model="temp.PassTime"
            type="datetime"
            placeholder="Please pick a date"
          />
        </el-form-item>
        <el-form-item label="姓名" prop="PersonName">
          <el-input v-model="temp.PersonName" />
        </el-form-item>
        <!-- <el-form-item label="444">
          <el-select
            v-model="temp.status"
            class="filter-item"
            placeholder="Please select"
          >
            <el-option
              v-for="item in statusOptions"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item> -->
        <el-form-item label="方向" prop="InAndOut">
          <el-input v-model="temp.InAndOut" />
        </el-form-item>
        <!-- <el-form-item label="评分">
          <el-rate
            v-model="temp.importance"
            :colors="['#99A9BF', '#F7BA2A', '#FF9900']"
            :max="3"
            style="margin-top: 8px"
          />
        </el-form-item> -->
        <!-- <el-form-item label="666">
          <el-input
            v-model="temp.remark"
            :autosize="{ minRows: 2, maxRows: 4 }"
            type="textarea"
            placeholder="Please input"
          />
        </el-form-item> -->
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button
          type="primary"
          @click="dialogStatus === 'create' ? createData() : updateData()"
          >保存</el-button
        >
      </div>
    </el-dialog>

    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
      style="width: 100%; margin-top: 20px"
    >
      <el-table-column align="center" label="ID" width="95">
        <template slot-scope="scope">{{ scope.row.id }}</template>
      </el-table-column>
      <el-table-column label="PersonID">
        <template slot-scope="scope">{{ scope.row.PersonID }}</template>
      </el-table-column>
      <el-table-column label="PersonName" width="110" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.PersonName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="InAndOut" width="110" align="center">
        <template slot-scope="scope">{{ scope.row.InAndOut }}</template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="created_at"
        label="PassTime"
        width="200"
      >
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.PassTime }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" prop="adda" label="操作">
        <template slot-scope="{ row, $index }">
          <el-button type="primary" size="mini" @click="handleCreate"
            >新增</el-button
          >
          <el-button size="mini" type="success" @click="handleUpdate(row)"
            >编辑</el-button
          >
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(row, $index)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

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
import { fetchList } from '@/api/table'
import { createArticle, updateArticle, delArticle } from '@/api/article'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import { title } from '@/settings'

const calendarTypeOptions = [
  { key: 'CN', display_name: 'China' },
  { key: 'US', display_name: 'USA' },
  { key: 'JP', display_name: 'Japan' },
  { key: 'EU', display_name: 'Eurozone' },
]
const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  components: { Pagination },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger',
      }
      return statusMap[status]
    },
    typeFilter(type) {
      return calendarTypeKeyValue[type]
    },
  },
  data() {
    return {
      list: null,
      total: 0,
     // biaoti: "标题",
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        importance: '重要性',
        title: undefined,
        type: undefined,
        sort: '+id',
        biaoti: '132',
      },

      importanceOptions: [1, 2, 3],
      calendarTypeOptions,
      sortOptions: [
        { label: 'ID Ascending', key: '+id' },
        { label: 'ID Descending', key: '-id' },
      ],

      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '新增',
      },
      rules: {
        type: [
          { required: true, message: 'type is required', trigger: 'change' },
        ],
        timestamp: [
          {
            type: 'date',
            required: true,
            message: 'timestamp is required',
            trigger: 'change',
          },
        ],
        title: [
          { required: true, message: 'title is required', trigger: 'blur' },
        ],
      },
      dialogStatus: '',
      temp: {
        id: undefined,
        PersonID: 1,
        PersonName: '',
        PassTime: new Date(),
        InAndOut: '',
      },
      statusOptions: ['published', 'draft', 'deleted'],
    }
  },
  created() {
    this.getList()
  },
  methods: {
    // fetchData() {
    //   this.listLoading = true;
    //   getList().then((response) => {
    //     console.log("response.data==========================");
    //     console.log("1111data:" + response[0].PersonName);
    //     this.list = response;
    //     // const items = data.items

    //     this.listLoading = false;
    //   });
    // },
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then((response) => {
        this.list = response
        this.total = response[0].total

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        PersonID: 1,
        PersonName: '',
        PassTime: new Date(),
        InAndOut: '',
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
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          // this.temp.PersonID = parseInt(Math.random() * 100) + 1024 // mock a id
          // this.temp.author = 'vue-element-admin'
          createArticle(this.temp).then(() => {
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000,
            })
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.timestamp = new Date(this.temp.PassTime)
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
          tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updateArticle(tempData).then(() => {
            const index = this.list.findIndex((v) => v.id === this.temp.id)
            this.list.splice(index, 1, this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000,
            })
          })
        }
      })
    },
    handleDelete(row, index) {
      delArticle(row).then(() => {
        //  const index = this.list.findIndex((v) => v.id === this.temp.id);
        //  this.list.splice(index, 1, this.temp);
        //  this.dialogFormVisible = false;
        this.$notify({
          title: '成功',
          message: '删除成功',
          type: 'success',
          duration: 2000,
        })
        this.list.splice(index, 1)
      })
    },
  },
}
</script>
