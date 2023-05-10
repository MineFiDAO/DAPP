import axios from 'axios'
import setting from '@/settings'
import store from '@/store'
// import vui from '@/uicommon'
import { Notify } from 'vant'
const service = axios.create({
    baseURL: setting.apiurl, // url = base url + request url
    // withCredentials: true, // send cookies when cross-domain requests
    timeout: 50000 // request timeout
})


// request interceptor
service.interceptors.request.use(
    config => {
        // do something before request is sent   
        var u = store.state.user.userInfo
        
        if (store.state.user.userInfo != null) {
            config.headers['access_wid'] = u.wid
        }

        // if (config.ismyapi) {
        //     config.baseURL = setting.myapi
        //     if (store.state.user.userInfo != null) {
        //         config.headers['access_wid'] = u.wid
        //     }
        // } else {
        //     // if (store.state.user.userInfo != null) {
        //     //     config.headers['Authorization'] = u.cer
        //     // }
        //     config.baseURL = setting.apiurl
        // }

        return config
    },
    error => {
        // do something with request error
        console.log(error) // for debug
        return Promise.reject(error)
    }
)

// response interceptor
service.interceptors.response.use(
    response => {
        const res = response.data
        if (response.status == 401) {
            //run con wallet
        }
        if (response.headers["wid"]) {
            res.wid = response.headers["wid"]
        }
        return res
    },
    error => {
        console.log('err' + error) // for debug

        Notify({
            message: "网络异常，请检查网络后重试",
            type: 'danger',
            duration: 3 * 1000
        })

        if (error.toString().indexOf('Request failed with status code 401') != -1) {
            store.dispatch('user/userLogout')
            return
        }
        return Promise.reject(error)
    }
)

export default service.request