import request from '../../utils/requestAxios'
import { REQUEST_DOMAIN_WORK_BENCH } from '../../globalset/js/constant'
// import {REQUEST_DOMAIN, REQUEST_DOMAIN_BOARD, REQUEST_DOMAIN_WORK_BENCH, REQUEST_DOMAIN_ARTICLE, WE_APP_ID, REQUEST_DOMAIN_FLOWS, REQUEST_DOMAIN_TEAM_SHOW} from '../../globalset/js/constant'
// import Cookies from 'js-cookie'
// import { getGlobalData } from '../../utils/businessFunction';


// 获取临时文件数据（项目交流-上传的临时文件）
export async function getTemporaryFileData(data) {
    return request({
      url: `${REQUEST_DOMAIN_WORK_BENCH}/temporary_file`,
      method: 'POST',
      data: {
        ...data,
      }
    })
}

// 删除临时文件数据（项目交流-上传的临时文件）
export async function removeTemporaryFileData(data) {
  return request({
    url: `${REQUEST_DOMAIN_WORK_BENCH}/remove_temporary_file`,
    method: 'POST',
    data: {
      ...data,
    }
  })
}