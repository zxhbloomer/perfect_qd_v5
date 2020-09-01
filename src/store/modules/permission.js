import { asyncRoutes, asyncRoutes2 } from '@/router'
import deepcopy from 'deep-copy'
import Layout from '@/layout'

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

// 按一级路由的方式来设置，并返回
function convertToOneRouter(orignal, _path) {
  // 初始化
  let path = _path === undefined ? '' : _path + '/'
  for (const item of orignal) {
    const _meta = {
      title: item.meta_title,
      fulltitle: [item.meta_title],
      icon: item.meta_icon,
      affix: item.affix
    }
    item['meta'] = _meta
    path = path + item.path
    if (item.children && item.children.length > 0) {
      if (item.meta.fulltitle === undefined) {
        item.meta.fulltitle = []
      }
      item.meta.fulltitle.push(item.meta.title)
      findChilds(item.children, path, item, asyncRoutesConvertToOneRouter)
    } else {
      item.path = path
      if (item.meta.fulltitle === undefined) {
        item.meta.fulltitle = []
      }
      item.meta.fulltitle.push(item.meta.title)
      asyncRoutesConvertToOneRouter[0].children.push(item)
    }
  }
  return asyncRoutesConvertToOneRouter
}
// 查找子结点
function findChilds(children, _path, _parent, _childrens) {
  let path = _path === undefined ? '' : _path + '/'
  for (const _childItem of children) {
    const _meta = {
      title: _childItem.meta_title,
      fulltitle: [_childItem.meta_title],
      icon: _childItem.meta_icon,
      affix: _childItem.affix
    }
    _childItem['meta'] = _meta
    if (_childItem.children && _childItem.children.length > 0) {
      path = _path + '/' + _childItem.path
      if (_childItem.meta.fulltitle === undefined) {
        _childItem.meta.fulltitle = []
      }
      _childItem.meta.fulltitle = [..._parent.meta.fulltitle, _childItem.meta.title]
      // _childItem.meta.fulltitle.push(_childItem.meta.title)
      findChilds(_childItem.children, path, _childItem, _childrens)
    } else {
      path = _path === undefined ? '' : _path + '/'
      _childItem.path = path.endsWith('/') ? (path + _childItem.path) : (path + '/' + _childItem.path)
      if (_childItem.meta.fulltitle === undefined) {
        _childItem.meta.fulltitle = []
      }
      // _childItem.meta.fulltitle.push(_childItem.meta.title)
      _childItem.meta.fulltitle = [..._parent.meta.fulltitle, _childItem.meta.title]
      _childrens[0].children.push(_childItem)
    }
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
    // state.routes = constantRoutes.concat(routes)
  },
  // 添加顶部导航栏
  SET_TOP_NAV: (state, topNav) => {
    state.topNav = topNav
  }
}

const asyncRoutesConvertToOneRouter = [
  {
    path: '/async',
    component: Layout,
    redirect: 'noRedirect',
    children: []
  }
]

const actions = {
  /**
   * generateRoutes 该方法为vue admin 自带方法，暂时注释掉，不使用
   *
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
  */
  setRoutes({ commit }, routers) {
    // 设置到vuex中是菜单树
    commit('SET_ROUTES', routers)
  },
  /**
   * getTopNavAndRoutes，菜单设置入口点
   * @param {*} param0
   * @param {*} roles
   */
  getTopNavAndRoutes({ commit }, _data) {
    return new Promise(resolve => {
      // 定义菜单数组
      const topNavData = []
      // 此处修改，动态显示顶部导航栏
      const _topNav = _data.permission_data.user_permission_menu
      // 循环格式化菜单
      for (const item of _topNav[0].children) {
        /**
         * R: 根节点
         * T: 顶部导航栏
         * P: page
         */
        if (item.type === 'T') {
          var tmpTopNav = {
            index: item.id,
            type: item.type,
            meta: {
              icon: item.meta_icon,
              name: item.meta_title
            },
            menus: null,
            routers: item.children
          }
          var _routers = deepcopy(tmpTopNav.routers)
          const convertData = convertToOneRouter(_routers)
          tmpTopNav.menus = convertData
          topNavData.push(tmpTopNav)
        }
      }
      debugger
      // 设置到vuex中是菜单树
      commit('SET_TOP_NAV', topNavData)
      commit('SET_ROUTES', topNavData[0].routers)
      // 返回的是一级路由，设置到router中
      resolve(topNavData[0].menus)
    })
  },
  /**
   * 以下为手工代码，调试使用
   * @param {*} param0
   * @param {*} _data
   */
  getTopNavAndRoutes2({ commit }, _data) {
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
