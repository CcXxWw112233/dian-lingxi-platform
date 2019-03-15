//项目归档
import {REQUEST_DOMAIN_BOARD} from "../../globalset/js/constant";
import request from "../../utils/requestAxios";

//获取动态列表
export async function getNewsDynamicList(next_id) {
  return request({
    url: `${REQUEST_DOMAIN_BOARD}/activites/${next_id || '0'}`,
    method: 'GET',
  });
}
//获取动态列表
export async function getNewsDynamicListActivity(params) {
  return request({
    url: `${REQUEST_DOMAIN_BOARD}/activity/${params.next_id}`,
    method: 'GET',
    params
  });
}
// 评论列表
export async function getCardCommentList(id) {
  return request({
    url: `${REQUEST_DOMAIN_BOARD}/card/comment/list/${id}`,
    method: 'GET',
  });
}

// 新增评论
export async function addCardNewComment(data) {
  return request({
    url: `${REQUEST_DOMAIN_BOARD}/card/comment`,
    method: 'POST',
    data
  });
}
