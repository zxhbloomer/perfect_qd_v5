import request from '@/utils/request'

/**
 * 查询逻辑
 * @param {*} data
 */
export function getTreeListApi(query) {
  return request({
    url: '/api/v1/permission/dept/tree/list',
    method: 'post',
    data: query
  })
}

/**
 * 查询逻辑：组织
 * @param {*} data
 */
export function getListApi(query) {
  return request({
    url: '/api/v1/permission/dept/list',
    method: 'post',
    data: query
  })
}

/**
 * 查询逻辑：获取所有的组织以及子组织数量，仅仅是数量
 * @param {*} data
 */
export function getAllOrgDataCountApi(query) {
  return request({
    url: '/api/v1/permission/dept/count',
    method: 'post',
    data: query
  })
}

/**
 * 查询逻辑：集团
 * @param {*} data
 */
export function getGroupsListApi(query) {
  return request({
    url: '/api/v1/permission/dept/groups',
    method: 'post',
    data: query
  })
}

/**
 * 查询逻辑：企业
 * @param {*} data
 */
export function getCompanyListApi(query) {
  return request({
    url: '/api/v1/permission/dept/companies',
    method: 'post',
    data: query
  })
}

/**
 * 查询逻辑：部门
 * @param {*} data
 */
export function getDeptListApi(query) {
  return request({
    url: '/api/v1/permission/dept/depts',
    method: 'post',
    data: query
  })
}

/**
 * 查询逻辑：岗位
 * @param {*} data
 */
export function getPositionListApi(query) {
  return request({
    url: '/api/v1/permission/dept/positions',
    method: 'post',
    data: query
  })
}

/**
 * 查询逻辑：获取所有员工的数据，为穿梭框服务
 * @param {*} data
 */
export function getStaffTransferListApi(query) {
  return request({
    url: '/api/v1/permission/dept/staff/transfer/list',
    method: 'post',
    data: query
  })
}

/**
 * 查询逻辑：获取所有员工的数据，为穿梭框服务
 * @param {*} data
 */
export function setStaffTransferApi(query) {
  return request({
    url: '/api/v1/permission/dept/staff/transfer/save',
    method: 'post',
    data: query
  })
}

/**
 * 查询逻辑：员工
 * @param {*} data
 */
export function getStaffListApi(query) {
  return request({
    url: '/api/v1/permission/dept/staffs',
    method: 'post',
    data: query
  })
}

/**
 * 组织架构：员工页签
 * @param {*} data
 */
export function getStaffTabListApi(data) {
  return request({
    url: '/api/v1/permission/dept/staff/list',
    method: 'post',
    data
  })
}
