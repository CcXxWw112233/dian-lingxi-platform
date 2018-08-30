//项目归档
import {REQUEST_DOMAIN_BOARD} from "../../globalset/js/constant";
import request from "../../utils/requestAxios";

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
    url: `${REQUEST_DOMAIN_BOARD}/card${id}`,
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

// 完成任务
export async function completeTask(data) {
  return request({
    url: `${REQUEST_DOMAIN_BOARD}/card/realize`,
    method: 'POST',
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
