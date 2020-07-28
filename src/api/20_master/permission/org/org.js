import request from '@/utils/request'

/**
 * 查询逻辑
 * @param {*} data
 */
export function getTreeListApi(query) {
  return request({
    url: '/api/v1/permission/org/tree/list',
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
    url: '/api/v1/permission/org/list',
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
    url: '/api/v1/permission/org/count',
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
    url: '/api/v1/permission/org/groups',
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
    url: '/api/v1/permission/org/companies',
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
    url: '/api/v1/permission/org/depts',
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
    url: '/api/v1/permission/org/positions',
    method: 'post',
    data: query
  })
}
