import { message } from 'antd';
import axios from 'axios'
import Cookies from 'js-cookie'
import _ from "lodash";
import {REQUEST_DOMAIN_WORK_BENCH, REQUEST_DOMAIN_ABOUT_PROJECT} from "../globalset/js/constant";
import { Base64 } from 'js-base64';
import { reRefreshToken } from './oauth'
function messageLoading(url) {
  return (
    message.loading('加载中...', 0)
  )
}
axios.interceptors.request.use(
  config => {
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

export default function request(options = {}, elseSet = {}) {
  const { isNotLoading } = elseSet
  const {
    url = '',
    headers = {},
    method = "post",
    params = {},
    data = {},
  } = options;

  let loading = !isNotLoading ? messageLoading(url) : ''
  let header = Object.assign({}, headers)
  const Authorization = Cookies.get('Authorization')
  const refreshToken = Cookies.get('refreshToken')

  header['Authorization'] = Authorization//refreshToken
  header['refreshToken'] = refreshToken
  header['OrganizationId'] = localStorage.getItem('OrganizationId') || '0'
  header['BoardId'] = localStorage.getItem('storageCurrentOperateBoardId') || '0'//当前操作项目的项目id

  if(data['_organization_id'] || params['_organization_id']) {
    header['OrganizationId'] = data['_organization_id'] || params['_organization_id']
  }

  // header['baseInfo'] = {
  //   organizationId: localStorage.getItem('OrganizationId') || '0',
  //   boardId: localStorage.getItem('storageCurrentOperateBoardId') || '0',
  //   contentDataType:'card',
  //   contentDataId  :'7657665646576547654',
  //   aboutBoardOrganizationId: localStorage.getItem('aboutBoardOrganizationId') || '0' ,
  // }
  // 请求头BaseInfo base64加密
  const header_BaseInfo = Object.assign({
      organizationId: localStorage.getItem('OrganizationId') || '0',
      boardId: localStorage.getItem('storageCurrentOperateBoardId') || '0',
      aboutBoardOrganizationId: localStorage.getItem('aboutBoardOrganizationId') || '0' ,
  }, headers['BaseInfo'])
  const header_baseInfo_str = JSON.stringify(header_BaseInfo)
  header['BaseInfo'] = Base64.encode(header_baseInfo_str)

  return new Promise((resolve, reject) => {
    axios({
      ...{
        url,
        headers: {...header, ...headers},
        method,
        params: {
          ...params, 
          // ...new_param
        },
        data: {
          ...data,
          // ...new_param
        },
        timeout: 60000,
      }
    })
      .then(res => {
        setTimeout(loading,0);

        resolve(res.data);
      })
      .catch((error, e) => {
        setTimeout(loading,0);

        if (_.has(error, "response.status")) {
          switch (error.response.status) {
            case 401:
              reRefreshToken({
                refreshToken: Cookies.get('refreshToken'),
                accessToken: Cookies.get('Authorization')
              })
              break
            default:
              break
          }
        } else {
          message.error('系统繁忙，请稍后重试！')
        }
      })
  })
}


