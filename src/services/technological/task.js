//项目归档
import {REQUEST_DOMAIN_BOARD} from "../../globalset/js/constant";
import request from "../../utils/requestAxios";
import { func } from "prop-types";

//新增任务分组
export async function addTaskGroup(data) {
  return request({
    url: `${REQUEST_DOMAIN_BOARD}/card/lists`,
    method: 'POST',
    data,
  });
}
//更新任务分组
export async function updateTaskGroup(data) {
  return request({
    url: `${REQUEST_DOMAIN_BOARD}/card/lists`,
    method: 'PUT',
    data,
  });
}
//删除任务分组
export async function deleteTaskGroup(data) {
  return request({
    url: `${REQUEST_DOMAIN_BOARD}/card/lists/${data.id}`,
    method: 'DELETE',
    data,
  });
}
// 任务列表
export async function getTaskGroupList(params) {
  return request({
    url: `${REQUEST_DOMAIN_BOARD}/card`,
    method: 'GET',
    params,
  });
}

// 新增任务
export async function addTask(data) {
  return request({
    url: `${REQUEST_DOMAIN_BOARD}/card`,
    method: 'POST',
    data,
  });
}

// 更新任务
export async function updateTask(data) {
  return request({
    url: `${REQUEST_DOMAIN_BOARD}/card`,
    method: 'PUT',
    data,
  });
}

// 删除任务
export async function deleteTask(id) {
  return request({
    url: `${REQUEST_DOMAIN_BOARD}/card/${id}`,
    method: 'DELETE',
    data: {
      id
    },
  });
}

// r任务归档
export async function archivedTask(data) {
  return request({
    url: `${REQUEST_DOMAIN_BOARD}/card/archived`,
    method: 'PUT',
    data,
  });
}

// 改变任务类型
export async function changeTaskType(data) {
  return request({
    url: `${REQUEST_DOMAIN_BOARD}/card/change`,
    method: 'PUT',
    data,
  });
}

// 新增子任务
export async function addChirldTask(data) {
  return request({
    url: `${REQUEST_DOMAIN_BOARD}/card/child`,
    method: 'POST',
    data,
  });
}

// 添加任务执行人
export async function addTaskExecutor(data) {
  return request({
    url: `${REQUEST_DOMAIN_BOARD}/card/executor`,
    method: 'POST',
    data,
  });
}
// 移出任务执行人
export async function removeTaskExecutor(data) {
  return request({
    url: `${REQUEST_DOMAIN_BOARD}/card/executor`,
    method: 'DELETE',
    data,
  });
}


// 完成任务
export async function completeTask(data) {
  return request({
    url: `${REQUEST_DOMAIN_BOARD}/card/realize`,
    method: 'PUT',
    data,
  });
}

// 添加任务标签
export async function addTaskTag(data) {
  return request({
    url: `${REQUEST_DOMAIN_BOARD}/card/label`,
    method: 'POST',
    data,
  });
}

// 移除任务标签
export async function removeTaskTag(data) {
  return request({
    url: `${REQUEST_DOMAIN_BOARD}/card/label`,
    method: 'DELETE',
    data,
  });
}

// 移出项目成员
export async function removeProjectMenbers(data) {
  return request({
    url: `${REQUEST_DOMAIN_BOARD}/board/remove`,
    method: 'DELETE',
    data,
  });
}


// 评论列表
export async function getCardCommentList(id) {
  return request({
    url: `${REQUEST_DOMAIN_BOARD}/card/comment/list/${id}`,
    method: 'GET',
  });
}
// 


// 新增评论
export async function addCardNewComment(data) {
  return request({
    url: `${REQUEST_DOMAIN_BOARD}/card/comment`,
    method: 'POST',
    data
  });
}
// s删除评论
export async function deleteCardNewComment(data) {
  return request({
    url: `${REQUEST_DOMAIN_BOARD}/card/comment/${data.id}`,
    method: 'DELETE',
    data
  });
}

//获取项目分组列表
export async function getProjectGoupList() {
  return request({
    url: `${REQUEST_DOMAIN_BOARD}/board/card_lists`,
    method: 'GET',
  });
}

//删除任务文件
export async function deleteTaskFile(data) {
  return request({
    url: `${REQUEST_DOMAIN_BOARD}/card/attachment/${data.attachment_id}`,
    method: 'DELETE',
    data
  });
}


//标签----------------------------
//获取项目标签列表
export async function getBoardTagList(params) {
  return request({
    url: `${REQUEST_DOMAIN_BOARD}/label`,
    method: 'GET',
    params
  });
}
//更新项目标签
export async function updateBoardTag(data) {
  return request({
    url: `${REQUEST_DOMAIN_BOARD}/label`,
    method: 'PUT',
    data
  });
}

//置顶项目标签
export async function toTopBoardTag(data) {
  return request({
    url: `${REQUEST_DOMAIN_BOARD}/label/top`,
    method: 'PUT',
    data
  });
}

//删除项目标签
export async function deleteBoardTag(data) {
  return request({
    url: `${REQUEST_DOMAIN_BOARD}/label/${data.id}`,
    method: 'DELETE',
    data
  });
}

//查询任务详情
export async function getCardDetail(params) {
  return request({
    url: `${REQUEST_DOMAIN_BOARD}/card/detail/${params.id}`,
    method: 'GET',
    params
  });
}

//取消关联
export async function deleteRelation(id) {
  return request({
    url: `${REQUEST_DOMAIN_BOARD}/content_link/${id}`,
    method: 'DELETE'
  })
}

//查看关联者下面关联的内容
export async function getRelations(params) {
  return request({
    url: `${REQUEST_DOMAIN_BOARD}/content_link`,
    method: 'GET',
    params
  });
}
//加入关联
export async function JoinRelation(data) {
  return request({
    url: `${REQUEST_DOMAIN_BOARD}/content_link`,
    method: 'POST',
    data
  });
}
//输入连接获取连接相关列表
export async function getLinkList(params) {
  return request({
    url: `${REQUEST_DOMAIN_BOARD}/content_link/url_load`,
    method: 'GET',
    params
  }, {isNotLoading: true});
}
//取消关联
export async function cancelRelation(data) {
  return request({
    url: `${REQUEST_DOMAIN_BOARD}/content_link/${data.id}`,
    method: 'DELETE',
    data
  });
}
//加载关联内容（前）
export async function getRelationsSelectionPre(params) {
  return request({
    url: `${REQUEST_DOMAIN_BOARD}/content_link/prefix`,
    method: 'GET',
    params
  }, {isNotLoading: true});
}
//加载关联内容（后）
export async function getRelationsSelectionSub(params) {
  return request({
    url: `${REQUEST_DOMAIN_BOARD}/content_link/subfix`,
    method: 'GET',
    params
  }, {isNotLoading: true});
}

// 所有动态
export async function getCardCommentListAll(params) {
  return request({
    url: `${REQUEST_DOMAIN_BOARD}/card/comment`,
    method: 'GET',
    params
  })
}