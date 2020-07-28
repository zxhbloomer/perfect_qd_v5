<template>
  <div>
    <el-alert
      title="当前选择部门：业务一部"
      type="success"
      effect="dark"
      :closable="false"
    />
    <br>
    <el-form
      ref="minusForm"
      :inline="true"
      :model="dataJson.searchForm"
      label-position="getLabelPosition()"
      class="floatRight"
    >
      <el-form-item label="">
        <el-input v-model.trim="dataJson.searchForm.code" clearable placeholder="集团编号" />
      </el-form-item>
      <el-form-item label="">
        <el-input v-model.trim="dataJson.searchForm.name" clearable placeholder="集团名称" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" plain icon="el-icon-search" @click="handleSearch">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button v-popover:popover type="primary" plain icon="el-icon-zoom-in">高级查询</el-button>
      </el-form-item>
    </el-form>
    <el-popover
      ref="popover"
      placement="top"
      width="420"
      title="高级查询"
      popper-class="perfect_popper"
    >
      <el-form
        :inline="true"
        :model="dataJson.searchForm"
        label-position="getLabelPosition()"
      >
        <el-form-item label="">
          <delete-type-normal v-model="dataJson.searchForm.is_del" />
        </el-form-item>
        <el-divider />
        <div style="text-align: right; margin: 0">
          <el-button type="text" @click="doResetSearch()">重置</el-button>
          <el-button type="primary" @click="handleSearch">提交</el-button>
        </div>
      </el-form>
    </el-popover>

    <el-button-group>
      <el-button type="primary" icon="el-icon-circle-plus-outline" :loading="settings.loading" @click="handleInsert">新增</el-button>
      <el-button :disabled="!settings.btnShowStatus.showUpdate" type="primary" icon="el-icon-edit-outline" :loading="settings.loading" @click="handleUpdate">修改</el-button>
      <el-button :disabled="!settings.btnShowStatus.showCopyInsert" type="primary" icon="el-icon-camera-solid" :loading="settings.loading" @click="handleCopyInsert">复制新增</el-button>
      <el-button :disabled="!settings.btnShowStatus.showUpdate" type="primary" icon="el-icon-info" :loading="settings.loading" @click="handleView">查看</el-button>
    </el-button-group>

    <el-table
      ref="multipleTable"
      v-loading="settings.loading"
      :data="dataJson.listData"
      :element-loading-text="'正在拼命加载中...'"
      element-loading-background="rgba(255, 255, 255, 0.5)"
      :height="settings.tableHeight"
      stripe
      border
      fit
      highlight-current-row
      :default-sort="{prop: 'u_time', order: 'descending'}"
      style="width: 100%"
      @row-click="handleRowClick"
      @row-dblclick="handleRowDbClick"
      @current-change="handleCurrentChange"
      @sort-change="handleSortChange"
      @selection-change="handleSelectionChange"
    >
      <el-table-column v-if="!meDialogStatus" type="selection" width="45" prop="id" />
      <!-- <el-table-column type="index" width="45" label="No" /> -->
      <el-table-column
        label="No"
        type="index"
        width="50"
        align="center"
      >
        <template v-slot="scope">
          <span>{{ (dataJson.searchForm.pageCondition.current - 1) * dataJson.searchForm.pageCondition.size + scope.$index + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="!meDialogStatus" header-align="center" show-overflow-tooltip sortable="custom" min-width="130" :sort-orders="settings.sortOrders" prop="parent_group_simple_name" label="上级集团" />
      <el-table-column header-align="center" show-overflow-tooltip sortable="custom" min-width="150" :sort-orders="settings.sortOrders" prop="name" label="集团名称" />
      <el-table-column header-align="center" show-overflow-tooltip sortable="custom" min-width="140" :sort-orders="settings.sortOrders" prop="simple_name" label="集团简称" />
      <el-table-column header-align="center" show-overflow-tooltip sortable="custom" min-width="130" :sort-orders="settings.sortOrders" prop="code" label="集团编号" />
      <!-- <el-table-column header-align="center" show-overflow-tooltip min-width="150" prop="descr" label="说明" /> -->
      <el-table-column header-align="center" min-width="60" :sort-orders="settings.sortOrders" label="删除">
        <template v-slot:header>
          <span>
            删除
            <el-tooltip
              class="item"
              effect="dark"
              placement="bottom"
            >
              <div slot="content">
                删除状态提示：<br>
                绿色：未删除  <br>
                红色：已删除
              </div>
              <svg-icon icon-class="perfect-icon-question1_btn" style="margin-left: 5px" />
            </el-tooltip>
          </span>
        </template>
        <template v-slot="scope">
          <el-tooltip :content="scope.row.is_del === 'false' ? '删除状态：已删除' : '删除状态：未删除' " placement="top" :open-delay="500">
            <el-switch
              v-model="scope.row.is_del"
              active-color="#ff4949"
              inactive-color="#13ce66"
              :active-value="true"
              :inactive-value="false"
              :width="30"
              :disabled="meDialogStatus"
              @change="handleDel(scope.row)"
            />
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column header-align="center" show-overflow-tooltip sortable="custom" min-width="80" :sort-orders="settings.sortOrders" prop="u_name" label="更新人" />
      <el-table-column header-align="center" show-overflow-tooltip sortable="custom" min-width="180" :sort-orders="settings.sortOrders" prop="u_time" label="更新时间">
        <template v-slot="scope">
          {{ formatDateTime(scope.row.u_time) }}
        </template>
      </el-table-column>
    </el-table>
    <pagination ref="minusPaging" :total="dataJson.paging.total" :page.sync="dataJson.paging.current" :limit.sync="dataJson.paging.size" @pagination="getDataList" />

    <iframe id="refIframe" ref="refIframe" scrolling="no" frameborder="0" style="display:none" name="refIframe">x</iframe>
  </div>
</template>

<style scoped>
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
<style >
  .el-input-group__append_select{
    color: #FFFFFF;
    background-color: #1890ff;
    border-color: #1890ff;
  }
  .el-input-group__append_reset{
    color: #FFFFFF;
    background-color: #F56C6C;
    border-color: #F56C6C;
  }
</style>

<script>
import '@/styles/org_png.scss'
import elDragDialog from '@/directive/el-drag-dialog'
import { getListApi } from '@/api/20_master/org/org'
import deepCopy from 'deep-copy'
import DeleteTypeNormal from '@/components/00_dict/select/SelectDeleteTypeNormal'
import Pagination from '@/components/Pagination'

export default {
  components: { Pagination, DeleteTypeNormal },
  directives: { elDragDialog },
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
    }
  },
  data() {
    return {
      dataJson: {
        // 级联选择器数据
        cascader: {
          data: null,
          value: ''
        },
        // 查询使用的json
        searchForm: {
          // 翻页条件
          pageCondition: deepCopy(this.PARAMETERS.PAGE_CONDITION),
          // 查询条件
          name: '',
          code: '',
          visible: 'null',
          is_del: '0' // 未删除
        },
        // 分页控件的json
        paging: deepCopy(this.PARAMETERS.PAGE_JSON),
        // table使用的json
        listData: null,
        // 单条数据 json的，初始化原始数据
        tempJsonOriginal: {
          id: undefined,
          name: '',
          code: '',
          descr: '',
          dbversion: 0
        },
        // 单条数据 json
        currentJson: null,
        // 当前表格中的索引，第几条
        rowIndex: 0,
        // 当前选中的行（checkbox）
        multipleSelection: []
      },
      // 页面设置json
      settings: {
        // 按钮状态
        btnShowStatus: {
          showUpdate: false,
          showCopyInsert: false,
          showExport: false
        },
        // loading 状态
        listLoading: true,
        duration: 4000
      }
    }
  },
  computed: {
  },
  // 监听器
  watch: {
    // 选中的数据，使得导出按钮可用，否则就不可使用
    'dataJson.multipleSelection': {
      handler(newVal, oldVal) {
        if (newVal.length > 0) {
          this.settings.btnShowStatus.showExport = true
        } else {
          this.settings.btnShowStatus.showExport = false
        }
      }
    },
    // 当前行的选中
    'dataJson.currentJson': {
      handler(newVal, oldVal) {
        if (this.dataJson.currentJson.id !== undefined) {
          // this.settings.btnShowStatus.doInsert = true
          this.settings.btnShowStatus.showUpdate = true
          this.settings.btnShowStatus.showCopyInsert = true
          this.settings.btnShowStatus.showExport = true
        } else {
          // this.settings.btnShowStatus.doInsert = false
          this.settings.btnShowStatus.showUpdate = false
          this.settings.btnShowStatus.showCopyInsert = false
          this.settings.btnShowStatus.showExport = false
        }
      },
      deep: true
    }
  },
  created() {
    // 作为独立页面，通过route路由打开时
    this.$options.name = this.$route.name
    this.initShow()
  },
  mounted() {
    // 描绘完成
    this.$on(this.EMITS.EMIT_ORG_CHANGE, _data => {
      this.getDataList(_data)
    })
  },
  methods: {
    initShow() {
      // 初始化查询
      this.getDataList()
      // 数据初始化
      this.dataJson.tempJson = Object.assign({}, this.dataJson.tempJsonOriginal)
    },
    // 下拉选项控件事件
    handleSelectChange(val) {
    },
    // 获取行索引
    getRowIndex(row) {
      const _index = this.dataJson.listData.lastIndexOf(row)
      return _index
    },
    // 行点击
    handleRowClick(row) {
      this.dataJson.tempJson = Object.assign({}, row) // copy obj
      this.dataJson.rowIndex = this.getRowIndex(row)
    },
    // 行双点击，仅在dialog中有效
    handleRowDbClick(row) {
      this.dataJson.tempJson = Object.assign({}, row) // copy obj
      this.dataJson.rowIndex = this.getRowIndex(row)
      if (this.meDialogSetting.dialogStatus) {
        this.$emit('rowDbClick', this.dataJson.tempJson)
      }
    },
    handleSearch() {
      // 查询
      this.dataJson.searchForm.pageCondition.current = 1
      this.dataJson.paging.current = 1
      this.getDataList()
      // 清空选择
      this.dataJson.multipleSelection = []
      this.$refs.multipleTable.clearSelection()
      this.dataJson.currentJson.id = undefined
    },
    handleRowUpdate(row, _rowIndex) {
      // 修改
      this.dataJson.tempJson = Object.assign({}, row) // copy obj
      this.dataJson.rowIndex = _rowIndex
      this.popSettingsData.dialogStatus = this.PARAMETERS.STATUS_UPDATE
      this.popSettingsData.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataSubmitForm'].clearValidate()
      })
    },
    handleCurrentChange(row) {
      this.dataJson.currentJson = Object.assign({}, row) // copy obj
      this.dataJson.currentJson.index = this.getRowIndex(row)
      this.dataJson.tempJsonOriginal = Object.assign({}, row) // copy obj

      // 设置dialog的返回
      this.$store.dispatch('popUpSearchDialog/selectedDataJson', Object.assign({}, row))
    },
    getDataList(val) {
      // 通知兄弟组件
      this.$off(this.EMITS.EMIT_ORG_CHANGE_LOADING)
      this.$emit(this.EMITS.EMIT_ORG_CHANGE_LOADING)
      // 查询逻辑
      this.settings.listLoading = true
      this.dataJson.searchForm = Object.assign({}, val)
      getListApi(this.dataJson.searchForm).then(response => {
        const recorders = response.data
        const newRecorders = recorders.map(v => {
          return { ...v, columnTypeShowIcon: false, columnNameShowIcon: false }
        })
        this.dataJson.listData = newRecorders
        // 通知兄弟组件
        this.$off(this.EMITS.EMIT_ORG_CHANGE_LOADING_OK)
        this.$emit(this.EMITS.EMIT_ORG_CHANGE_LOADING_OK)
      }).finally(() => {
        this.settings.listLoading = false
      })
    },
    // 获取row-key
    getRowKeys(row) {
      return row.id
    },
    // table选择框
    handleSelectionChange(arr) {
      arr.forEach(function(val, index, arr) {
        // console.log(val, index, arr)
      })
      this.dataJson.multipleSelection = arr
    },
    renderHeaderIsDel: function(h, { column }) {
      return (
        <span>{column.label}
          <el-tooltip
            class='item'
            effect='dark'
            placement='bottom'
          >
            <div slot='content'>
            可见状态提示：<br/>
            绿色：可见  <br/>
            红色：不可见
            </div>
            <svg-icon icon-class='perfect-icon-question1_btn' style='margin-left: 5px'/>
          </el-tooltip>
        </span>
      )
    },
    handleSortChange(column) {
      // 服务器端排序
      if (column.order === 'ascending') {
        this.dataJson.searchForm.pageCondition.sort = column.prop
      } else if (column.order === 'descending') {
        this.dataJson.searchForm.pageCondition.sort = '-' + column.prop
      }
      this.getDataList()
    },
    handleInsert() {

    },
    handleUpdate() {

    },
    handleCopyInsert() {

    },
    handleView() {

    }

  }
}
</script>
