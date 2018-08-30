//项目归档
import {REQUEST_DOMAIN_BOARD} from "../../globalset/js/constant";
import request from "../../utils/requestAxios";

// 查看项目详情信息
export async function projectDetailInfo(id) {
  return request({
    url: `${REQUEST_DOMAIN_BOARD}/board/detail/${id}`,
    method: 'POST',
    data: {
      id
    }
  });
}

// 更新项目
export async function updateProject(data) {
  return request({
    url: `${REQUEST_DOMAIN_BOARD}/board`,
    method: 'PUT',
    data
  });
}

// 移出项目成员
export async function removeMenbers(data) {
  return request({
    url: `${REQUEST_DOMAIN_BOARD}/board/remove`,
    method: 'DELETE',
    data
  });
}




















































