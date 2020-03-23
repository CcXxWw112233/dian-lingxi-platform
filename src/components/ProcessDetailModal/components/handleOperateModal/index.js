import { PROJECT_FLOWS_FLOW_ABORT, NOT_HAS_PERMISION_COMFIRN, MESSAGE_DURATION_TIME } from '../../../../globalset/js/constant'
import { checkIsHasPermissionInBoard } from '../../../../utils/businessFunction'
import { Modal,message } from 'antd'

// 渲染删除模板信息confirm
const showDeleteTempleteConfirm = (processTempleteDelete) => {
  const modal = Modal.confirm();
  modal.update({
    title: '删除模板',
    content: '确认删除该模板吗？',
    // zIndex: 1110,
    okText: '确认',
    cancelText: '取消',
    // getContainer: () => document.getElementById('org_managementContainer'),
    onOk: () => {
      processTempleteDelete()
    },
    onCancel: () => {
      modal.destroy();
    }
  });
}

export {
  showDeleteTempleteConfirm
}