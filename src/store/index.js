import Vue from 'vue'
import Vuex from 'vuex'
import { setStorage, getStorage, removeStorage } from '@/utils/localStorage'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userInfo: getStorage('virgo_user') ? getStorage('virgo_user') : null
  },
  mutations: {
    // 保留用户登录信息
    changeUser (state, data) {
      setStorage('virgo_user', data)
      state.userInfo = data
    },
    // 退出账号
    outLogin (state, data) {
      // 删除本地存储
      removeStorage('virgo_user')
      state.userInfo = null
    }
  },
  actions: {
  },
  modules: {
  }
})
