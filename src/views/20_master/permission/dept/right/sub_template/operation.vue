<template>
  <div>
    <el-alert
      :title="headInfo"
      type="info"
      effect="dark"
      show-icon
      :closable="false"
    />
    <br>

    <el-table
      v-cloak
      ref="multipleTable"
      v-loading="settings.loading"
      :data="dataJson.listData"
      :element-loading-text="'正在拼命加载中...'"
      element-loading-background="rgba(255, 255, 255, 0.5)"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      :height="height"
      stripe
      border
      fit
      highlight-current-row
      style="width: 100%"
      default-expand-all
      row-key="id"
      @row-click="handleRowClick"
      @current-change="handleCurrentChange"
    >
      <el-table-column header-align="center" type="index" width="45" fixed />
      <el-table-column header-align="center" show-overflow-tooltip min-width="120" prop="name" label="菜单名称" fixed>
        <template v-slot="scope">
          <svg-icon v-if="scope.row.meta_icon" :icon-class="scope.row.meta_icon" :class="scope.row.meta_icon" />
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column header-align="center" show-overflow-tooltip min-width="50" prop="type_name" label="类型" fixed>
        <template v-slot="scope">
          <span class="menu_png">
            <em v-if="scope.row.type ===CONSTANTS.DICT_SYS_MENU_TYPE_ROOT" class="root">根结点</em>
            <em v-if="scope.row.type ===CONSTANTS.DICT_SYS_MENU_TYPE_TOPNAV" class="top_nav">顶部导航栏</em>
            <em v-if="scope.row.type ===CONSTANTS.DICT_SYS_MENU_TYPE_NODE" class="node">结点</em>
            <em v-if="scope.row.type ===CONSTANTS.DICT_SYS_MENU_TYPE_PAGE" class="page">页面</em>
            <em v-if="scope.row.is_default" class="default">默认菜单</em>
          </span>
        </template>
      </el-table-column>
      <el-table-column header-align="center" label="权限" min-width="260">
        <template v-slot="operations">
          <el-row>
            <el-col v-for="item in operations.row.function_info" :key="item.code" :span="4">
              <el-checkbox v-model="item.perms">{{ item.name }}</el-checkbox>
            </el-col>
          </el-row>
          <!-- <span v-for="item in operations.row.function_info" :key="item.code">
            <el-checkbox v-model="item.perms">{{ item.name }}</el-checkbox>
          </span> -->
        </template>
        <!-- <el-table-column
          v-for="button_column in dataJson.menu_buttons"
          :key="button_column.code"
          align="center"
          :prop="button_column.code"
          :label="button_column.name"
          min-width="100"
        >
          <template v-slot="column_lists">
            <div v-if="column_lists.row.function_info.filter(item => item.code===button_column.code)[0]">
              〇
            </div>
            <div v-else>
              -
            </div>

          </template>
          -
        </el-table-column> -->
      </el-table-column>
      <el-table-column header-align="center" label="全选" min-width="30">
        <template>
          <el-checkbox />
        </template>
      </el-table-column>
    </el-table>

  </div>
</template>

<style scoped>
  .el-alert--info.is-dark {
    background-color: #448aca;
  }
  .floatRight {
    float: right;
  }
  .floatLeft {
    float: left;
  }
  .el-form-item .el-select {
    width: 100%;
  }
  .grid-content {
    border-radius: 2px;
    min-height: 36px;
    margin-bottom: 10px;
  }
  .bg-purple-light {
    background: #e5e9f2;
  }
</style>

<script>
import '@/styles/menu_png.scss'
import { getOperationListApi } from '@/api/20_master/permission/operation/operation'
import deepCopy from 'deep-copy'

export default {
  components: { },
  directives: { },
  mixins: [],
  props: {
    height: {
      type: Number,
      default: 200
    },
    // 自己作为弹出框时的参数
    meDialogStatus: {
      type: Boolean,
      default: false
    },
    headInfo: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      dataJson: {
        // 查询使用的json
        searchForm: {
          // 查询条件
        },
        // table使用的json
        listData: null,
        // 当前表格中的索引，第几条
        rowIndex: 0
      },
      // 页面设置json
      settings: {
        // loading 状态
        loading: true,
        duration: 4000
      }
    }
  },
  computed: {
  },
  // 监听器
  watch: {
  },
  created() {
    this.initShow()
  },
  mounted() {
  },
  methods: {
    initShow() {
      // 初始化查询
      this.getDataList()
    },
    // 行点击
    handleRowClick(row) {
      this.dataJson.rowIndex = this.getRowIndex(row)
    },
    handleCurrentChange(row) {
      this.dataJson.currentJson = deepCopy(row) // copy obj
      this.dataJson.currentJson.index = this.getRowIndex(row)
    },
    // 获取行索引
    getRowIndex(row) {
      const _index = this.dataJson.listData.lastIndexOf(row)
      return _index
    },
    getDataList() {
      // 查询逻辑
      this.settings.loading = true
      this.dataJson.searchForm.root_id = 89
      getOperationListApi(this.dataJson.searchForm).then(response => {
        // 增加对象属性，columnTypeShowIcon，columnNameShowIcon
        const recorders = response.data.menu_data

        this.dataJson.listData = recorders
        this.dataJson.menu_buttons = response.data.menu_buttons
        this.dataJson.paging = response.data.menu_data
        this.dataJson.paging.records = {}
      }).finally(() => {
        this.dataJson.currentJson = undefined
        this.settings.loading = false
        this.$refs.multipleTable.setCurrentRow()
      })
    }
  }
}
</script>
