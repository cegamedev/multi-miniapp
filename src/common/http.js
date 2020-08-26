import axios from 'axios';
import { message } from 'ant-design-vue';
import Utils from './utils';

message.config({
  top: '80px',
});

const instance = axios.create({
  timeout: 300000,
  headers: {
    'X-Requested-With': 'XMLHttpRequest', // 设置为异步
    'Content-Type': 'application/json',
  },
  withCredentials: false,
});

// 添加请求拦截器
instance.interceptors.request.use(
  (config) => {
    console.log('req-config', config);
    const con = config;
    con.url = `${process.env.VUE_APP_API_ROOT}${config.url}`;
    con.headers.token = `suson ${localStorage.getItem('token')}`;

    if (
      ['put', 'post', 'patch'].includes(con.method)
      && con.headers['Content-Type']
      && con.headers['Content-Type'].includes('application/x-www-form-urlencoded')
    ) {
      con.data = Utils.toQueryString(con.data);
    }
    return con;
  },
  (error) => {
    console.log('req-config-err>>', error);
    return Promise.reject(error);
  },
);

// 添加响应拦截器
instance.interceptors.response.use(
  (response) => {
    console.log('res', response);
    const resData = response.data;
    const { config } = response;
    if (config.responseType === 'blob') {
      return resData;
    }
    if (!resData.success) {
      message.destroy();
      message.error(resData.msg);
    }
    return resData;
  },
  (error) => {
    console.log('res-err>>', error.response);
    const errorRes = error.response;
    const isTimeout = error.message.includes('timeout');
    const msg = isTimeout ? '接口超时' : '网络异常';
    let resData = { code: 500, msg, success: false };
    if (errorRes && [401, 500, 403].includes(errorRes.status)) {
      resData = errorRes.data;
      console.log('[401, 500, 403] data: ', resData);
      switch (resData.code) {
        case 1500:
          window.location.href = '/blank/login';
          break;
        default:
      }
    }
    message.destroy();
    message.error(resData.msg || '网络异常');
    return resData;
  },
);

function send(method, url, data, headers = {}, other = {}) {
  const reqParams = {
    method,
    url,
    headers,
    ...other,
  };

  // Only applicable for request methods 'PUT', 'POST', and 'PATCH'
  if (['put', 'post', 'patch'].includes(method)) {
    reqParams.data = data;
  } else {
    reqParams.params = data;
  }

  return instance.request(reqParams);
}

export default {
  send,
};
