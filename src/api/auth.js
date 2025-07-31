import http from "@/api/http.js";

// 注册接口
export const register = (data) => {
    return http.post('/users/register', data)
}


// 登录接口
export const login = (data) => {
    return http.post('/users/login', data)
}
// 获取用户信息接口
export const getUserInfo = () => {
    return http.get('/users/me')
}

// 退出用户信息接口
export const logout = () => {
    return http.post('/users/logout')
}

// 同意用户协议接口
export const agreeToTerms = (data) => {
    return http.post('/users/terms/agree', data);
};

// 新增：获取最新协议版本接口携带认证令牌
export const getTermsVersion = () => {
    return http.get('/users/terms/latest');
};


