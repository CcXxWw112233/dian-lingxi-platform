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

/**
 * 获取都是ID的执行人数组
 * @param {*} type 
 */
const transformNewAssigneesToString = (item) => {
  if (!!!item) return []
  let tempItem
  if (item instanceof Array) {
    tempItem = [...item]
  } else {
    tempItem = new Array(item)
  }
  return tempItem.reduce((acc, curr) => {
    if (curr.assignee_type == '2' && curr.assignees && curr.assignees.length) {
      const genNewPersonList = (arr = []) => { // 得到一个新的person列表
        let temp = []
        arr.map(user => {
          temp.push(user.id)
        });
        return temp
      };
      // 执行人去重
      const newPersonList = genNewPersonList(curr.assignees);
      return [...new Set([...acc, ...newPersonList])];
    } else if (!curr.assignee_type || curr.assignee_type == '1') {
      const newPersonList = []
      return [...newPersonList]
    }
    return acc
  }, [])
}

/**
 * 获取都是ID的抄送人列表
 * @param {*} type 
 */

const transformNewRecipientsToString = (item) => {
  if (!!!item) return []
  let tempItem
  if (item instanceof Array) {
    tempItem = [...item]
  } else {
    tempItem = new Array(item)
  }
  return tempItem.reduce((acc, curr) => {
    if (curr.cc_type == '1' && curr.recipients && curr.recipients.length) {
      const genNewPersonList = (arr = []) => { // 得到一个新的person列表
        let temp = []
        arr.map(user => {
          temp.push(user.id)
        });
        return temp
      };
      // 执行人去重
      const newPersonList = genNewPersonList(curr.recipients);
      return [...new Set([...acc, ...newPersonList])];
    } else if (!curr.cc_type || curr.cc_type == '0') {
      const newPersonList = []
      return [...newPersonList]
    }
    return acc
  }, [])
}

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

// 渲染计算方式
const computing_mode = (type) => {
  let field_text = ''
  switch (type) {
    case '1': // 表示各分项相加
      field_text = '各分项相加'
      break;
    case '2':
      field_text = '总分值/评分项数'
      break
    case '3':
      field_text = '总分值/评分人数'
      break
    default:
      break;
  }
  return field_text
}

// 渲染结果分数选项内容
const result_score_option = (type) => {
  let field_text = ''
  switch (type) {
    case '1':
      field_text = '大于'
      break;
    case '2':
      field_text = '小于'
      break;
    case '3':
      field_text = '等于'
      break;
    case '4':
      field_text = '大于或等于'
      break;
    case '5':
      field_text = '小于或等于'
      break;
    default:
      break;
  }
  return field_text
}

// 渲染结果导向 以及其余情况
const result_score_fall_through_with_others = (type) => {
  let field_text = ''
  switch (type) {
    case '1':
      field_text = '流程流转到上一步'
      break;
    case '2':
      field_text = '流程流转到下一步'
      break;
    case '3':
      field_text = '流程中止'
      break;
    default:
      break;
  }
  return field_text
}

export {
  showDeleteTempleteConfirm,
  genPrincipalListFromAssignees,
  renderTimeType,
  arrayNonRepeatfy,
  transformNewAssigneesToString,
  transformNewRecipientsToString,
  computing_mode,
  result_score_option,
  result_score_fall_through_with_others,
}

