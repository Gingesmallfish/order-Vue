import {createStore} from 'vuex'

// 创建一个新的 store 实例
const store = createStore({
    state() {
        return {
            token: localStorage.getItem('token') || '',
            userinfo: JSON.parse(localStorage.getItem('userinfo') || '{}'),
            // 添加搜索相关状态
            searchResults: null,
            isSearchMode: false
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
        // 添加搜索相关的 mutations
        SET_SEARCH_RESULTS(state, payload) {
            state.searchResults = payload
            state.isSearchMode = true
        },
        CLEAR_SEARCH_RESULTS(state) {
            state.searchResults = null
            state.isSearchMode = false
        }
    },
    actions: {
        loginSuccess({commit}, data) {
            commit('SET_AUTH_INFO', data)
        },
        logout({commit}) {
            commit('CLEAR_AUTH_INFO')
        },
    },
    getters: {
        isAuthenticated: (state) => !!state.token,
        userinfo: (state) => state.userinfo,
        token: (state) => state.token,
        // 添加搜索相关的 getters
        searchResults: (state) => state.searchResults,
        isSearchMode: (state) => state.isSearchMode
    }
})

export default store
