import { asyncRoutes, asyncRoutes2, convertToOneRouter, constantRoutes } from '@/router'
import deepcopy from 'deep-copy'

// import { constantRoutes } from '@/router'

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

const state = {
  // 顶部导航栏
  topNav: [],
  // 当前激活的菜单
  routes: [],
  addRoutes: []
}

const mutations = {
  // 添加当前路由
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  },
  // 添加顶部导航栏
  SET_TOP_NAV: (state, topNav) => {
    state.topNav = topNav
  }
}

const actions = {
  generateRoutes({ commit }, roles) {
    return new Promise(resolve => {
      // let accessedRoutes
      // if (roles.includes('admin')) {
      //   accessedRoutes = asyncRoutes || []
      // } else {
      //   accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
      // }
      // commit('SET_ROUTES', accessedRoutes)
      // resolve(accessedRoutes)
      // 获取动态路由
      let accessedRoutes
      if (roles.includes('admin')) {
        accessedRoutes = asyncRoutes || []
      } else {
        accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
      }
      var accessedRoutesCopy = deepcopy(asyncRoutes)
      const ar = convertToOneRouter(accessedRoutesCopy)
      // 设置到vuex中是菜单树
      commit('SET_ROUTES', accessedRoutes)
      // 返回的是一级路由，设置到router中
      resolve(ar)
    })
  },
  setRoutes({ commit }, routers) {
    // 设置到vuex中是菜单树
    commit('SET_ROUTES', routers)
  },
  // 获取路由
  getTopNavAndRoutes({ commit }, roles) {
    return new Promise(resolve => {
      // TODO 此处修改，调试顶部导航栏
      const _topNav = [
        {
          index: '1',
          type: 'T',
          meta: {
            icon: '系统管理',
            name: '工作台'
          },
          menus: null,
          routers: asyncRoutes
        },
        {
          index: '2',
          type: 'T',
          meta: {
            icon: 'syscode',
            name: '业务管理'
          },
          menus: null,
          routers: asyncRoutes2
        },
        {
          index: '3',
          type: 'T',
          meta: {
            icon: 'syscode',
            name: '业务管理a'
          },
          menus: null,
          routers: asyncRoutes
        }
      ]

      // 循环格式化菜单
      for (const item of _topNav) {
        if (item.type === 'T') {
          var _routers = deepcopy(item.routers)
          const convertData = convertToOneRouter(_routers)
          item.menus = convertData
        }
      }
      // 设置到vuex中是菜单树
      commit('SET_TOP_NAV', _topNav)
      commit('SET_ROUTES', _topNav[0].routers)
      // 返回的是一级路由，设置到router中
      resolve(_topNav[0].menus)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
