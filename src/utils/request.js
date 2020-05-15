import axios from 'axios'
import {Message} from 'element-ui';
import router from '../router'
import db from '../utils/sessionStorage'
import * as config from '../utils/config'

//axios.defaults.withCredentials = true;
axios.interceptors.request.use(
    config => {
        if (db.get("token")) { // 判断是否存在token，如果存在的话，则每个http header都加上token
            config.headers[db.get("header")] = db.get("token");
        }
        return config;
    },
    err => {
        return Promise.reject(err);
    }
);
axios.interceptors.response.use(success => {
    window.console.log("suucess=>" + success.data)
    return success.data;
}, error => {
    // window.console.log("error=>"+error.response.data);
    if (error.response.status == 403) {
        Message.error({message: error.response.data.message})
    } else if (error.response.status == 401) {
        // 防止重复弹出消息

        Message.error({message: error.response.data.message})
        db.remove("LOGINFLAG")

        router.replace('/');
    } else {
        if (error.response.data.message) {
            Message.error({message: error.response.data.message})
        } else {
            Message.error({message: '未知错误!'})
        }
    }
    return error.response;
})

let base = config.baseApi;

export const postQueryRequest = (url, params) => {
    let apiUrl = `${base}${url}`;
    apiUrl = getApiUrl(apiUrl, params);
    // 请求
    return axios({
        method: 'post',
        url: apiUrl,
        data: params
    })
}

export const postKeyValueRequest = (url, params) => {
    return axios({
        method: 'post',
        url: `${base}${url}`,
        data: params,
        transformRequest: [function (data) {
            let ret = '';
            for (let i in data) {
                ret += encodeURIComponent(i) + '=' + encodeURIComponent(data[i]) + '&'
            }
            return ret;
        }],
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });
}
export const postRequest = (url, params) => {
    return axios({
        method: 'post',
        url: `${base}${url}`,
        data: params
    })
}
export const putRequest = (url, params) => {
    return axios({
        method: 'put',
        url: `${base}${url}`,
        data: params
    })
}
export const getRequest = (url, params) => {
    let apiUrl = `${base}${url}`;
    apiUrl = getApiUrl(apiUrl, params);
    // 请求
    return axios({
        method: 'get',
        url: apiUrl,
        data: params
    })
}
export const deleteRequest = (url, params) => {
    let apiUrl = `${base}${url}`;
    apiUrl = getApiUrl(apiUrl, params);
    return axios({
        method: 'delete',
        url: apiUrl,
        data: params
    })
}

// 处理参数转换
function getApiUrl(url, params) {
    let apiUrl = url;
    let i = 0;
    for (const key in params) {
        if (params.hasOwnProperty(key)) {
            const value = params[key];
            const param = key + "=" + value;
            let s = '?';
            if (i > 0) {
                s = '&';
            }
            apiUrl = apiUrl + s + param;
            i++;
        }
    }
    return apiUrl;
}