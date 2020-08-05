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
