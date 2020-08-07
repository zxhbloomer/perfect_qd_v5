import request from '@/utils/request'

/**
   * 获取操作清单
   * @param {*} data
   */
export function getOperationListApi(data) {
  return request({
    url: '/api/v1/permission/operation/dept/list',
    method: 'post',
    data
  })
}

/**
   * 复制选中的菜单
   * @param {*} data
   */
export function setSystemMenuData2PermissionDataApi(data) {
  return request({
    url: '/api/v1/permission/operation/dept/set_permission_menu_data',
    method: 'post',
    data
  })
}
