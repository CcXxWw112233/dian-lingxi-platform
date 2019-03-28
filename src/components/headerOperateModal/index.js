import React from 'react'
import {
  Modal,
  Button
} from 'antd'

const confirm = Modal.confirm

const showConfirm = (processEnd) => {
  confirm({
    title: '确认要中止这个流程吗？',
    content: '流程中止后支持重新发起，原流程将无法继续进行。',
    zIndex: 100000,
    onOk() {
      processEnd()
    },
    onCancel() {
      console.log('Cancel');
    },
  });
}

const showDeleteConfirm = (processDelete) => {
  confirm({
    title: '确认要移入回收站吗？',
    content: '可以在“项目>更多”选项中进入回收站进行恢复或彻底删除操作。',
    okText: 'Yes',
    okType: 'danger',
    cancelText: 'No',
    zIndex: 100000,
    onOk() {
      processDelete()
    },
    onCancel() {
      console.log('Cancel');
      
    },
  });
}

export {
  showConfirm,
  showDeleteConfirm
}