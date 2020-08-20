'use strict'

import { Loading } from 'element-ui'

// exports.install = function(Vue, options) {

export default {
  install(Vue, options) {
  /** 获取页面的size */
    Vue.prototype.getSize = function() {
      return this.$store.getters.size
    }
    /** 对齐 */
    Vue.prototype.getLabelPosition = function() {
      return 'right'
    }
    /** 弹出错误框
   *
   * element-ui定义
   *
  Vue.prototype.$loading = Loading.service;
  Vue.prototype.$msgbox = MessageBox;
  Vue.prototype.$alert = MessageBox.alert;
  Vue.prototype.$confirm = MessageBox.confirm;
  Vue.prototype.$prompt = MessageBox.prompt;
  Vue.prototype.$notify = Notification;
  Vue.prototype.$message = Message;

   *
   *
   */
    /**
   * 显示错误的信息
   */
    Vue.prototype.showErrorMsg = function(message, error) {
      let showMsg = message
      if (JSON.stringify(error) !== '{}') {
        showMsg = showMsg + ' : ' + error
      }
      new Vue().$msgbox({
        title: '错误',
        message: showMsg,
        showCancelButton: false,
        confirmButtonText: '确定',
        type: 'error'
      }).then(function() {
        return
      }).catch(function() {
        return
      })
    }
    /** 弹出Alert 警告 */
    Vue.prototype.showErrorMsgAlert = function(message) {
      new Vue().$message({
        message: message,
        type: 'error',
        duration: 8 * 1000
      })
    }

    /** 截取字符串 */
    Vue.prototype.truncateString = function(str, num) {
      return str.length > num ? str.slice(0, num > 3 ? num - 3 : num) + '...' : str
    }

    /** loading打开 */
    Vue.prototype.showLoading = function(msg) {
      Loading.service({ fullscreen: true, text: msg, lock: true, background: 'rgba(255, 255, 255, 0.7)' })
    }

    /** loading关闭 */
    Vue.prototype.closeLoading = function() {
      Loading.service().close()
    }

    /** format currency：货币格式化----https://www.icode9.com/content-4-187747.html */
    Vue.prototype.formatCurrency = function(data, decimal = false, decimalDigits = 2, currency = 'CNY') {
      return data.toLocaleString('zh-CN', {
        style: 'currency',
        currency,
        minimumFractionDigits: decimal ? decimalDigits : 0
      })
    }

    /** 数字格式化 */
    Vue.prototype.formatNumber = function(data, decimal = false, decimalDigits = 2) {
      return data.toLocaleString('zh-CN', {
        style: 'decimal',
        minimumFractionDigits: decimalDigits ? 2 : 0
      })
    }
    /** 百分比格式化 */
    Vue.prototype.formatPercent = function(data, decimal = false, decimalDigits = 2) {
      return data.toLocaleString('zh-CN', {
        style: 'percent',
        minimumFractionDigits: decimalDigits ? 2 : 0
      })
    }
    /** 日期格式化----https://github.com/tolking/blog/blob/cd9e1dd3024f19529434a6e1f59a2192d5020119/blog/posts/toLocaleString.md
   * date.toLocaleString('zh-CN', { dateStyle: 'long' })  // "2019年12月6日"
   * date.toLocaleString('zh-CN', { hour12: false }) // "2019/12/6 11:35:00"
   */
    Vue.prototype.formatDate = function(data, type = 1) {
      let rtn
      const _date = new Date(Date.parse(data))
      switch (type) {
        case 1:
          var _year = _date.toLocaleString('zh-CN', { year: 'numeric' })
          var _month = _date.toLocaleString('zh-CN', { month: '2-digit' })
          var _day = _date.toLocaleString('zh-CN', { day: '2-digit' })
          rtn = _year + _month + _day
          break
        case 2:
          var options = { year: 'numeric', month: '2-digit', day: '2-digit' }
          rtn = _date.toLocaleString('zh-CN', options)
          break
        default:
          rtn = _date.toLocaleString('zh-CN', { dateStyle: 'long' })
          break
      }
      return rtn
    }
    Vue.prototype.formatTime = function(data) {
      const _date = new Date(Date.parse(data))
      return _date.toLocaleTimeString('en-US', { hour12: false })
    }
    Vue.prototype.formatDateTime = function(data, type = 1) {
      return this.formatDate(data, type) + ' ' + this.formatTime(data)
    }

    /**
     * 递归查找json中的值
     * @param {*} obj json对象
     * @param {*} key json中的field
     * @param {*} val json中的value
     * @param {*} ignoreSubObject 忽略json中子对象object，暂且支持子对象忽略
     */
    Vue.prototype.getJsonObjects = function(obj, key, val, ignoreSubObject) {
      var objects = []
      for (var i in obj) {
        if (!obj.hasOwnProperty(i)) {
          continue
        }
        if (typeof obj[i] === 'object') {
          if (i === ignoreSubObject && obj[i].length > 0) {
            // 忽略子对象
            continue
          } else {
            if (i === key && obj[i].length > 0) {
              objects = [...obj[i]]
            }
            objects = objects.concat(Vue.prototype.getJsonObjects(obj[i], key, val, ignoreSubObject))
          }
        } else {
          // if key matches and value matches or if key matches and value is not passed (eliminating the case where key matches but passed value does not)
          if (i === key && obj[i] === val || i === key && val === '') { //
            objects.push(obj)
          } else if (obj[i] === val && key === '') {
          // only add if the object is not already in the array
            if (objects.lastIndexOf(obj) === -1) {
              objects.push(obj)
            }
          }
        }
      }
      return objects
    }

    /**
     * 递归设置json中的值
     * @param {*} obj json对象
     * @param {*} key json中的field
     * @param {*} val json中的value
     * @param {*} ignoreSubObject 忽略json中子对象object，暂且支持子对象忽略
     */
    Vue.prototype.setFieldValue2JsonObjects = function(obj, key, val, ignoreSubObject) {
      for (var i in obj) {
        if (!obj.hasOwnProperty(i)) {
          continue
        }
        if (typeof obj[i] === 'object') {
          if (i === ignoreSubObject && obj[i].length > 0) {
            continue
          } else {
            Vue.prototype.setFieldValue2JsonObjects(obj[i], key, val, ignoreSubObject)
          }
        } else {
          // 递归找到元素后设置值
          if (i === key) {
            obj[i] = val
          }
        }
      }
    }
  }
}
