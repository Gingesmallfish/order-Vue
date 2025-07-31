import http from "@/api/http.js";

/**
 * 获取菜单列表
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const getMenuList = () => {
    return http.post('/menus/list')
}


/**
 * 搜索菜单
 * @param data 搜索参数
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const searchMenu = (searchText) => {
    return http.post('/menus/search', searchText)
}