import {createStore} from 'vuex'

// 创建一个新的 store 实例
const store = createStore({
    state() {
        return {
            token: localStorage.getItem('token') || '',
            userinfo: JSON.parse(localStorage.getItem('userinfo') || '{}'),
            // 搜索相关状态
            searchResults: null, // 存储搜索结果
            isSearchMode: false // 标记是否处于搜索模式
        }
    },
    mutations: {
        SET_AUTH_INFO(state, data) {
            // 适配不同的数据结构
            const token = data.accessToken || data.token || ''
            const userinfo = data.user || data.userinfo || {}

            state.token = token
            state.userinfo = userinfo

            // 只有当值存在时才存储到 localStorage
            if (token) {
                localStorage.setItem('token', token)
            }
            if (Object.keys(userinfo).length > 0) {
                localStorage.setItem('userinfo', JSON.stringify(userinfo))
            }
        },
        CLEAR_AUTH_INFO(state) {
            state.token = ''
            state.userinfo = {}
            localStorage.removeItem('token')
            localStorage.removeItem('userinfo')
        },
        // 新增：设置搜索结果
        SET_SEARCH_RESULTS(state, payload) {
            state.searchResults = payload
            state.isSearchMode = true // 进入搜索模式
        },
        // 新增：清除搜索状态
        CLEAR_SEARCH_RESULTS(state) {
            state.searchResults = null
            state.isSearchMode = false // 退出搜索模式
        },


    },
    actions: {
        loginSuccess({commit}, data) {
            commit('SET_AUTH_INFO', data)
        },
        logout({commit}) {
            commit('CLEAR_AUTH_INFO')
        },
        // 添加搜索相关的 actions
        setSearchResults({ commit }, payload) {
            commit('SET_SEARCH_RESULTS', payload)
        },
        clearSearchResults({ commit }) {
            commit('CLEAR_SEARCH_RESULTS')
        }
    },
    getters: {
        isAuthenticated: (state) => !!state.token,
        userinfo: (state) => state.userinfo,
        token: (state) => state.token,
        // 新增：获取搜索结果
        searchResults: (state) => state.searchResults,
        // 新增：判断是否为搜索模式
        isSearchMode: (state) => state.isSearchMode
    }
})

export default store
