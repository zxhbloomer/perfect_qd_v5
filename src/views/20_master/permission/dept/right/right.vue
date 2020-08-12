<template>
  <div>
    <el-tabs v-model="settings.tabs.activeName" @tab-click="handleTabsClick">
      <el-tab-pane name="main" :style="{height: height + 'px'}" style="overflow-y:auto;overflow-x:hidden;" :disabled="dataJson.tab.show">
        <template slot="label">权限列表</template>
        <permission-template :height="height - 142" />
      </el-tab-pane>
      <el-tab-pane v-if="dataJson.tab.show" name="edit_permission" :style="{height: height + 'px'}" style="overflow-y:auto;overflow-x:hidden;">
        <template slot="label">{{ dataJson.tab.name }}</template>
        <operation-template :height="height - 42" :head-info="dataJson.operation_head_info" />
      </el-tab-pane>
    </el-tabs>

  </div>
</template>

<style scoped>
  .floatRight {
    float: right;
  }
  .floatLeft {
    float: left;
  }
  .el-form-item .el-cascader {
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
  .el-alert--info.is-light{
    background: #eee;
  }
  .corner {
    position: absolute;
    top: 0px;
    border: 0;
    right: 0;
  }
</style>
<style >
  .buttonSearch{
    color: #FFFFFF;
    background-color: #1890ff;
    border-color: #1890ff;
  }
  .buttonReset{
    color: #FFFFFF;
    background-color: #F56C6C;
    border-color: #F56C6C;
  }
</style>
<script>
import elDragDialog from '@/directive/el-drag-dialog'
import permissionTemplate from '../right/sub_template/permission'
import operationTemplate from '../right/sub_template/operation'

export default {
  components: { permissionTemplate, operationTemplate },
  directives: { elDragDialog },
  props: {
    height: {
      type: Number,
      default: 200
    }
  },
  data() {
    return {
      dataJson: {
        // 左侧树的数据
        leftTreeData: null,
        tab: {
          show: false,
          name: ''
        },
        operation_head_info: ''
      },
      // 页面设置json
      settings: {
        tabs: {
          activeName: 'main'
        },
        // loading 状态
        loading: true,
        duration: 4000
      }
    }
  },
  // 监听器
  watch: {
  },
  mounted() {
    // 描绘完成
    this.$on(this.EMITS.EMIT_PERMISSION_DEPT_CHANGE, _data => {
      this.dataJson.leftTreeData = _data
    })
    // 开始编辑操作权限时，接收兄弟消息，激活新tab开始编辑权限操作
    this.$on(this.EMITS.EMIT_PERMISSION_DEPT_PERMISSION_EDIT, _data => {
      this.dataJson.tab = _data.operate_tab_info
      this.settings.tabs.activeName = 'edit_permission'
      this.dataJson.operation_head_info = _data.operate_tab_header_info.info
    })
  },
  created() {
  },
  methods: {
    handleTabsClick(tab, event) {
      // console.log(tab, event)
    }
  }
}
</script>
