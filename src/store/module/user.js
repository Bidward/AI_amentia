// import { login, logout, getUserInfo } from '@/api/user'
import { logout, getUserInfo } from '@/api/user'
import { setToken, getToken } from '@/libs/util'

export default {
  state: {
    userName: '',
    nickname: '',
    userId: '',
    avatorImgPath: '',
    token: getToken(),
    access: '',
    hasGetInfo: false,
    userpermission: {},
    menuPermission: {},
    vuexContractData: {},
    othervuexContractData: {},
    employees: []// 转正在职人员名单
  },
  mutations: {
    setEmployees (state, list) {
      state.employees = list
    },
    vuexContractData (state, vuexContractData) {
      state.vuexContractData = vuexContractData
    },
    othervuexContractData (state, othervuexContractData) {
      state.othervuexContractData = othervuexContractData
    },
    setMenupermission (state, menupermission) {
      state.menuPermission = menupermission
    },
    setUserpermission (state, permission) {
      state.userpermission = permission
    },
    setAvator (state, avatorPath) {
      state.avatorImgPath = avatorPath
    },
    setUserId (state, id) {
      state.userId = id
    },
    setUserName (state, name) {
      state.userName = name
    },
    setNickname (state, name) {
      state.nickname = name
    },
    setAccess (state, access) {
      let menuList = []
      for (let key in access) {
        if (access[key] === true) {
          menuList.push(key)
        }
      }
      state.access = menuList
    },
    setToken (state, token) {
      state.token = token
      setToken(token)
    },
    setHasGetInfo (state, status) {
      state.hasGetInfo = status
    }
  },
  actions: {
    // 登录
    handleLogin ({ commit }, { userName, password }) {
      userName = userName.trim()
      return new Promise((resolve, reject) => {
        getUserInfo({
          userName,
          password
        }).then(res => {
          const data = res.data
          commit('setToken', data.nickname)
          resolve()
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 退出登录
    handleLogOut ({ state, commit }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('setToken', '')
          commit('setAccess', [])
          commit('setUserId', undefined)
          // localStorage.token = ''
          resolve()
        }).catch(err => {
          reject(err)
        })
        // 如果你的退出登录无需请求接口，则可以直接使用下面三行代码而无需使用logout调用接口
        // commit('setToken', '')
        // commit('setAccess', [])
        // resolve()
      })
    },
    // 获取用户相关信息
    getUserInfo ({ state, commit }) {
      return new Promise((resolve, reject) => {
        try {
          getUserInfo(state.token).then(res => {
            const data = res.data
            commit('setMenupermission', data.menu)
            commit('setUserpermission', data.permission)
            commit('setAvator', data.avator)
            commit('setUserName', data.username)
            commit('setNickname', data.nickname)
            commit('setUserId', data.id)
            commit('setAccess', data.menu)
            commit('setHasGetInfo', true)
            resolve(data)
          }).catch(err => {
            reject(err)
          })
        } catch (error) {
          reject(error)
        }
      })
    }
  }
}
