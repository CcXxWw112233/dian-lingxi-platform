import {REQUEST_DOMAIN, PROJECTS_API} from "@/globalset/js/constant";
import request from "@/utils/requestAxios";

// 新用户默认创建组织和用户的接口
export async function createDefaultOrg(data) {
  return request({
    url: `${REQUEST_DOMAIN}/organization/default`,
    method: "POST",
    data
  })
}

// 生成项目相关小程序二维码
export async function generateBoardCode(data) {
  return request({
    url: `${REQUEST_DOMAIN}/mini/QRCode/board/${data.id}`,
    method: "POST",
    data
  })
}

//邀请成员加入组织
export async function inviteMemberJoinOrg(data) {
  return request({
    url: `${REQUEST_DOMAIN}/organization/invite`,
    method: "PUT",
    data
  })
}

// 邀请成员加入项目 (只加入项目, 需配合其他接口一起使用)
export async function inviteMemberJoinBoard(data) {
  return request({
    url: `${PROJECTS_API}/board/join`,
    method: "POST",
    data
  })
}