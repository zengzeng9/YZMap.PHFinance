import axios from 'axios'
import config from '@/commons/config.js'
import {
  Message,
  Loading
} from 'element-ui'

// 重新定向到登录界面
const redirectAuthorization = (code) => {
  window.sessionStorage.clear()
  window.$app.$router.push({
    name: 'map-authorization',
    query: { code }
  })
}

const httpRequest = (options) => {
  axios.defaults.withCredentials = true
  options.method = options.method || 'post'
  options.loader = typeof options.loader !== 'undefined' ? options.loader : true
  options.data = options.data || {}
  let loadingInstance
  const service = axios.create({
    baseURL: `${config.host}${config.api}`,
    timeout: 15000 // 请求超时时间,
  })
  // 请求拦截器
  service.interceptors.request.use(
    config => {
      config.loader = typeof config.loader !== 'undefined' ? config.loader : true
      if (config.loader) {
        loadingInstance = Loading.service({
          lock: true,
          target: '.map-parent',
          text: '数据加载中...',
          spinner: 'el-icon-loading',
          background: 'rgba(255, 255, 255, 0.6)'
        })
      }
      //config.headers['Authorization']='Bearer f242d4dd-2b94-44c4-b74e-f00788c97c69'
      config.headers['Authorization']=sessionStorage.getItem('authorization')
      // 在请求发送之前做一些处理
      return config
    },
    error => {
      // 发送失败
      loadingInstance && loadingInstance.close()
      Promise.reject(error)
    }
  )

  // 响应拦截器
  service.interceptors.response.use(
    response => {
      loadingInstance && loadingInstance.close()
      const data = response.data
      const { status } = data
      if (status === undefined) {
        return data
      } else {
        // 0：失败 1:成功 2： 3： 4：登录过期
        switch (status) {
          case '0':
            Message({
              message: `${data.msg}`,
              duration: 2000,
              showClose: true,
              type: 'error',
              customClass: 'middle'
            })
            return data
          case '1':
            return data
          case '2':
            return data
          case '3':
            return data
          case '4':
            return data
          case '5':
            return data
          case '-1':
            return data
          case '6':
            Message({
              message: '登录信息过期，请重新登录',
              type: 'fail',
              duration: 2000
            })
            redirectAuthorization(status)
            break
          case '7':
            Message({
              message: '用户无权限操作',
              type: 'fail',
              duration: 2000
            })
            redirectAuthorization(status)
            break
          default:
            // 不是正确的 code
            // errorCreate(`${data.msg}`)
            break
        }
      }
    },
    error => {
      loadingInstance && loadingInstance.close()
      if (error && error.response) {
        switch (error.response.status) {
          case 400:
            error.message = '请求错误'
            break
          case 401:
            redirectAuthorization(error.response.status)
            error.message = '未授权，请登录'
            break
          case 403:
            error.message = '拒绝访问'
            break
          case 404:
            error.message = `请求地址出错`
            break
          case 408:
            error.message = '请求超时'
            break
          case 420:
            redirectAuthorization(error.response.status)
            error.message = '您的账号在别处登录！'
            break
          case 500:
            error.message = '服务出错，请联系管理员'
            break
          case 501:
            error.message = '服务未实现'
            break
          case 502:
            error.message = '网关错误'
            break
          case 503:
            error.message = '服务不可用'
            break
          case 504:
            error.message = '网关超时'
            break
          case 505:
            error.message = 'HTTP版本不受支持'
            break
          default:
            break
        }
      }
      return Promise.reject(error)
    }
  )
  return service(options)
}
export default httpRequest
