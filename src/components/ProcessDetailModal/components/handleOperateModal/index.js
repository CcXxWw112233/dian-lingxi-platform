import { Modal } from 'antd'

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

// 数组去重
const arrayNonRepeatfy = arr => {
  let temp_arr = []
  let temp_id = []
  for (let i = 0; i < arr.length; i++) {
    if (!temp_id.includes(arr[i]['user_id'])) {//includes 检测数组是否有某个值
      temp_arr.push(arr[i]);
      temp_id.push(arr[i]['user_id'])
    }
  }
  return temp_arr
}

/**
* 获取流程执行人列表
* 因为这个弹窗是共用的, 所以需要从外部接收一个 principalList执行人列表
* 思路: 如果返回的 assignee_type == 1 那么表示需要获取项目列表中的成员
* @param {Array} nodes 当前弹窗中所有节点的推进人
*/
const genPrincipalListFromAssignees = (nodes = []) => {
  return nodes.reduce((acc, curr) => {
    if (curr.assignees && curr.assignees.length) { // 表示当前节点中存在推进人
      const genNewPersonList = (arr = []) => { // 得到一个新的person列表
        return arr.map(user => ({
          avatar: user.avatar,
          name: user.full_name
            ? user.full_name
            : user.name
              ? user.name
              : user.user_id
                ? user.user_id
                : '',
          user_id: user.user_id
        }));
      };
      // 执行人去重
      const newPersonList = genNewPersonList(arrayNonRepeatfy(curr.assignees));
      return [...acc, ...newPersonList.filter(i => !acc.find(a => a.name === i.name))];
    } else if (curr.assignee_type && curr.assignee_type == '1') { // 这里表示是任何人, 那么就是获取项目列表中的成员
      const newPersonList = []
      return [...acc, ...newPersonList.filter(i => !acc.find(a => a.name === i.name))];
    }
    return acc
  }, []);
};

// 渲染时、天、月
const renderTimeType = (type) => {
  let description = ''
  switch (type) {
    case 'hour':
      description = '小时'
      break;
    case 'day':
      description = '天'
      break
    case 'month':
      description = '月'
      break
    default:
      break;
  }
  return description
}

export {
  showDeleteTempleteConfirm,
  genPrincipalListFromAssignees,
  renderTimeType,
  arrayNonRepeatfy
}

