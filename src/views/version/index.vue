<template>
  <div>
    <el-form
      ref="dataForm"
      :rules="rules"
      :model="query"
      inline
      label-width="100px"
      style="margin: 10px"
    >
      <el-form-item label="版本名称" prop="versionName">
        <el-input
          v-model="query.versionName"
          @keyup.enter.native="getList"
          clearable
      /></el-form-item>
      <el-form-item label="设备类型" prop="type">
        <el-select v-model="query.type" placeholder="请选择设备类型" clearable>
          <el-option
            v-for="item in [
              { label: '全部', value: '' },
              { label: 'iOS', value: '0' },
              { label: '安卓', value: '1' },
            ]"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getList">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
      style="width: 98%; margin: 12px"
    >
      <el-table-column label="版本号" prop="VersionName" width="180">
      </el-table-column>
      <el-table-column label="设备类型">
        <template slot-scope="scope">
          <span>{{ scope.row.Type | typeShow }}</span>
        </template>
      </el-table-column>
      <el-table-column label="包大小" width="120">
        <template slot-scope="scope">
          <span>{{ (scope.row.Size / 1024 / 1024).toFixed(3) || 0 }}MB</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间">
        <template slot-scope="scope">
          <span>{{ (scope.row.CreateTime || "1669801199934") | format }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { formatTime } from "@/utils/index";
const defaultList = [
  {
    VersionName: "4.1.8",
    Type: 0,
    Size: 15_012_006,
    CreateTime: 1669800870459,
  },
  {
    VersionName: "4.1.7",
    Type: 0,
    Size: 14_265_696,
    CreateTime: 1669800870459,
  },
  {
    VersionName: "4.1.7",
    Type: 1,
    Size: 10,
    CreateTime: 1669800870459,
  },
  {
    VersionName: "4.1.6",
    Type: 0,
    Size: 10,
    CreateTime: 1669800870459,
  },
  {
    VersionName: "4.1.6",
    Type: 1,
    Size: 10,
    CreateTime: 1669800870459,
  },
];
export default {
  name: "VersionHome",
  filters: {
    typeShow(type) {
      switch (Number(type)) {
        case 0:
          return "iOS";
        case 1:
          return "安卓";
        default:
          return "其他";
      }
    },
    format(input) {
      return formatTime(input);
    },
  },
  data() {
    return {
      listLoading: false,
      query: {
        versionName: "",
        type: "",
        c: 1,
        ps: 10,
      },
      list: defaultList,
      rules: {},
    };
  },
  created() {
    this.listLoading = true;
  },
  mounted() {
    // debugger;
    console.log("version index");
    this.listLoading = false;
  },
  methods: {
    getList() {
      this.listLoading = true;
      let _query = this.query;
      this.list = this.list.filter((item) => {
        if (_query.type) {
          return item.Type == _query.type;
        }
        if (_query.versionName) {
          let idx = item.VersionName.indexOf(_query.versionName);
          console.log("idx :>> ", idx, "item", item);
          return idx > -1;
        }
      });
      this.listLoading = false;
    },
  },
};
</script>
<style lang="less" scoped>
</style>