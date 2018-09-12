//项目归档
import {REQUEST_DOMAIN_BOARD} from "../../globalset/js/constant";
import request from "../../utils/requestAxios";

//文件列表包括文件夹
export async function getFileList(params) {
  return request({
    url: `${REQUEST_DOMAIN_BOARD}/file`,
    method: 'GET',
    params,
  });
}

// 复制文件到某一个文件夹
export async function fileCopy(data) {
  return request({
    url: `${REQUEST_DOMAIN_BOARD}/file/copy`,
    method: 'PUT',
    data,
  });
}

//文件下载
export async function fileDownload(params) {
  return request({
    url: `${REQUEST_DOMAIN_BOARD}/file/download`,
    method: 'GET',
    params,
  });
}

// 把文件文件夹 放入回收站
export async function fileRemove(data) {
  return request({
    url: `${REQUEST_DOMAIN_BOARD}/file/remove`,
    method: 'POST',
    data,
  });
}
// 把文件文件夹 移入到某一个文件夹
export async function fileMove(data) {
  return request({
    url: `${REQUEST_DOMAIN_BOARD}/file/remove`,
    method: 'PUT',
    data,
  });
}

// 文件上传
export async function fileUpload(data) {
  return request({
    url: `${REQUEST_DOMAIN_BOARD}/file/upload`,
    method: 'PUT',
    data,
  });
}

//文件版本列表
export async function fileVersionist(params) {
  return request({
    url: `${REQUEST_DOMAIN_BOARD}/file/version_list`,
    method: 'GET',
    params,
  });
}

//回收站列表
export async function recycleBinList(params) {
  return request({
    url: `${REQUEST_DOMAIN_BOARD}/recycle_bin`,
    method: 'GET',
    params,
  });
}

//删除文件/文件夹
export async function deleteFile(data) {
  return request({
    url: `${REQUEST_DOMAIN_BOARD}/recycle_bin`,
    method: 'POST',
    data,
  });
}
//还原文件/文件夹
export async function restoreFile(data) {
  return request({
    url: `${REQUEST_DOMAIN_BOARD}/recycle_bin/restore`,
    method: 'POST',
    data,
  });
}


//文件夹树形列表
export async function getFolderList(params) {
  return request({
    url: `${REQUEST_DOMAIN_BOARD}/folder`,
    method: 'GET',
    params,
  });
}
//新建文件夹
export async function addNewFolder(data) {
  return request({
    url: `${REQUEST_DOMAIN_BOARD}/folder`,
    method: 'POST',
    data,
  });
}
//更新文件夹
export async function updateFolder(data) {
  return request({
    url: `${REQUEST_DOMAIN_BOARD}/folder`,
    method: 'PUT',
    data,
  });
}
