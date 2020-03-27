import React, { Component } from 'react'
import { Tooltip, message, Modal, Dropdown, Menu } from 'antd'
import { connect } from 'dva'
import indexStyles from './index.less'
import VisitControl from '../../routes/Technological/components/VisitControl/index'
import InformRemind from '@/components/InformRemind'
import { setContentPrivilege, toggleContentPrivilege, removeContentPrivilege } from '../../services/technological/project'
import globalStyles from '@/globalset/css/globalClassName.less'
import { currentNounPlanFilterName, checkIsHasPermissionInBoard, checkIsHasPermissionInVisitControl } from "@/utils/businessFunction";
import {
  MESSAGE_DURATION_TIME,
  NOT_HAS_PERMISION_COMFIRN, PROJECT_FILES_FILE_UPDATE, PROJECT_FILES_FILE_EDIT, UPLOAD_FILE_SIZE, REQUEST_DOMAIN_FILE, PROJECT_FILES_FILE_DOWNLOAD
} from "@/globalset/js/constant";
import { FLOWS } from '../../globalset/js/constant'
@connect(mapStateToProps)
export default class HeaderContentRightMenu extends Component {

  state = {
  }

  // 访问控制的操作 S
  /**
   * 访问控制的开关切换
   * @param {Boolean} flag 开关切换
   */
  handleVisitControlChange = (flag) => {
    const { drawContent = {} } = this.props
    const { is_privilege = '0', card_id } = drawContent
    const toBool = str => !!Number(str)
    const is_privilege_bool = toBool(is_privilege)
    if (flag === is_privilege_bool) {
      return
    }
    //toggle权限
    const data = {
      content_id: card_id,
      content_type: 'card',
      is_open: flag ? 1 : 0
    }
    toggleContentPrivilege(data).then(res => {
      if (res && res.code === '0') {
        // message.success('设置成功', MESSAGE_DURATION_TIME)
        setTimeout(() => {
          message.success('设置成功')
        }, 500)
        let temp_arr = res && res.data
        this.visitControlUpdateCurrentModalData({ is_privilege: flag ? '1' : '0', type: 'privilege', privileges: temp_arr }, flag)
      } else {
        message.warning(res.message)
      }
    })
  }

  // 数组去重
  arrayNonRepeatfy = arr => {
    let temp_arr = []
    let temp_id = []
    for (let i = 0; i < arr.length; i++) {
      if (!temp_id.includes(arr[i]['id'])) {//includes 检测数组是否有某个值
        temp_arr.push(arr[i]);
        temp_id.push(arr[i]['id'])
      }
    }
    return temp_arr
  }

  // 访问控制的更新model中的数据
  visitControlUpdateCurrentModalData = (obj = {}) => {
    // console.log(obj, 'sssss_obj')
    const { drawContent = {} } = this.props
    const { dispatch } = this.props
    const { privileges = [], board_id, card_id } = drawContent
    // 这是移除的操作
    if (obj && obj.type && obj.type == 'remove') {
      let new_privileges = [...privileges]
      new_privileges.map((item, index) => {
        if (item.id == obj.removeId) {
          new_privileges.splice(index, 1)
        }
      })
      let new_drawContent = { ...drawContent, privileges: new_privileges }
      dispatch({
        type: 'publicTaskDetailModal/updateDatas',
        payload: {
          drawContent: new_drawContent
        }
      })
      this.props.handleTaskDetailChange && this.props.handleTaskDetailChange({ drawContent: new_drawContent, card_id })
    }
    // 这是添加成员的操作
    // 这是更新弹窗中的priveleges
    if (obj && obj.type && obj.type == 'add') {
      let new_privileges = []
      for (let item in obj) {
        if (item == 'privileges') {
          obj[item].map(val => {
            let temp_arr = this.arrayNonRepeatfy([].concat(...privileges, val))
            return new_privileges = [...temp_arr]
          })
        }
      }
      let new_drawContent = { ...drawContent, privileges: new_privileges }
      dispatch({
        type: 'publicTaskDetailModal/updateDatas',
        payload: {
          drawContent: new_drawContent
        }
      })
      this.props.handleTaskDetailChange && this.props.handleTaskDetailChange({ drawContent: new_drawContent, card_id })
    }

    // 这是更新type类型
    if (obj && obj.type && obj.type == 'change') {
      let { id } = obj.temp_arr
      let new_privileges = [...privileges]
      new_privileges = new_privileges.map((item) => {
        let new_item = item
        if (item.id == id) {
          new_item = { ...item, content_privilege_code: obj.code }
        } else {
          new_item = { ...item }
        }
        return new_item
      })
      let new_drawContent = { ...drawContent, privileges: new_privileges }
      dispatch({
        type: 'publicTaskDetailModal/updateDatas',
        payload: {
          drawContent: new_drawContent
        }
      })
      this.props.handleTaskDetailChange && this.props.handleTaskDetailChange({ drawContent: new_drawContent, card_id })
    }

    // 访问控制的切换
    if (obj && obj.type == 'privilege') {
      let new_privileges = [...privileges]
      for (let item in obj) {
        if (item == 'privileges') {
          obj[item].map(val => {
            let temp_arr = this.arrayNonRepeatfy([].concat(...privileges, val))
            if (temp_arr && !temp_arr.length) return false
            return new_privileges = [...temp_arr]
          })
        }
      }
      let new_drawContent = { ...drawContent, is_privilege: obj.is_privilege, privileges: new_privileges }
      dispatch({
        type: 'publicTaskDetailModal/updateDatas',
        payload: {
          drawContent: new_drawContent
        }
      })
      this.props.handleTaskDetailChange && this.props.handleTaskDetailChange({ drawContent: new_drawContent, card_id, name: 'is_privilege', value: obj.is_privilege })
      this.props.updateParentTaskList && this.props.updateParentTaskList()
    }

    // 需要调用父级的列表
    // this.props.handleTaskDetailChange && this.props.handleTaskDetailChange({ drawContent: new_drawContent, card_id })

    // 调用更新项目列表
    dispatch({
      type: 'projectDetail/projectDetailInfo',
      payload: {
        id: board_id
      }
    })

  }

  /**
   * 添加成员的回调
   * @param {Array} users_arr 添加成员的数组
   */
  handleVisitControlAddNewMember = (users_arr = []) => {
    if (!users_arr.length) return
    const { user_set = {} } = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : {};
    const { user_id } = user_set
    const { drawContent = {} } = this.props
    const { card_id, privileges = [] } = drawContent
    const content_id = card_id
    const content_type = 'card'
    let temp_ids = [] // 用来保存添加用户的id
    let new_ids = [] // 用来保存权限列表中用户id
    let new_privileges = [...privileges]

    // 这是所有添加成员的id列表
    users_arr && users_arr.map(item => {
      temp_ids.push(item.id)
    })
    let flag
    // 权限列表中的id
    new_privileges = new_privileges && new_privileges.map(item => {
      let { id } = (item && item.user_info) && item.user_info
      if (user_id == id) { // 从权限列表中找到自己
        if (temp_ids.indexOf(id) != -1) { // 判断自己是否在添加的列表中
          flag = true
        }
      }
      new_ids.push(id)
    })

    // 这里是需要做一个只添加了自己的一条提示
    if (flag && temp_ids.length == '1') { // 表示只选择了自己, 而不是全选
      message.warn('该成员已存在, 请不要重复添加', MESSAGE_DURATION_TIME)
      return false
    } else { // 否则表示进行了全选, 那么就过滤
      temp_ids = temp_ids && temp_ids.filter(item => {
        if (new_ids.indexOf(item) == -1) {
          return item
        }
      })
    }

    setContentPrivilege({
      content_id,
      content_type,
      privilege_code: 'read',
      user_ids: temp_ids,
    }).then(res => {
      if (res && res.code === '0') {
        setTimeout(() => {
          message.success('添加用户成功')
        }, 500)
        let temp_arr = []
        temp_arr.push(res.data)
        this.visitControlUpdateCurrentModalData({ privileges: temp_arr, type: 'add' })
      } else {
        message.warn(res.message)
      }
    })
  }

  /**
   * 访问控制移除成员
   * @param {String} id 移除成员对应的id
   */
  handleVisitControlRemoveContentPrivilege = id => {
    let temp_id = []
    temp_id.push(id)
    removeContentPrivilege({ id: id }).then(res => {
      const isResOk = res => res && res.code === '0'
      if (isResOk(res)) {
        setTimeout(() => {
          message.success('移除用户成功')
        }, 500)
        this.visitControlUpdateCurrentModalData({ removeId: id, type: 'remove' })
      } else {
        message.warn(res.message)
      }
    })
  }

  /**
   * 访问控制设置更新成员
   * @param {String} id 设置成员对应的id
   * @param {String} type 设置成员对应的字段
   */
  handleVisitControlChangeContentPrivilege = (id, type) => {
    const { drawContent = {} } = this.props
    const { card_id } = drawContent
    let temp_id = []
    temp_id.push(id)
    const obj = {
      content_id: card_id,
      content_type: 'card',
      privilege_code: type,
      user_ids: temp_id
    }
    setContentPrivilege(obj).then(res => {
      const isResOk = res => res && res.code === '0'
      if (isResOk(res)) {
        setTimeout(() => {
          message.success('设置成功')
        }, 500)
        let temp_arr = []
        temp_arr = res && res.data[0]
        this.visitControlUpdateCurrentModalData({ temp_arr: temp_arr, type: 'change', code: type })
      } else {
        message.warn(res.message)
      }
    })
  }

  /**
   * 其他成员的下拉回调
   * @param {String} id 这是用户的user_id
   * @param {String} type 这是对应的用户字段
   * @param {String} removeId 这是对应移除用户的id
   */
  handleClickedOtherPersonListOperatorItem = (id, type, removeId) => {
    if (type === 'remove') {
      this.handleVisitControlRemoveContentPrivilege(removeId)
    } else {
      this.handleVisitControlChangeContentPrivilege(id, type)
    }
  }

  // 访问控制操作 E

  /**
 * 获取流程执行人列表
 * 因为这个弹窗是共用的, 所以需要从外部接收一个 principalList执行人列表
 * 思路: 如果返回的 assignee_type == 1 那么表示需要获取项目列表中的成员
 * @param {Array} nodes 当前弹窗中所有节点的推进人
 */
  genPrincipalListFromAssignees = (nodes = []) => {
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

  // 中止流程的点击事件
  handleDiscontinueProcess = () => {
    const { projectDetailInfoData: { board_id }, processInfo: { id } } = this.props
    this.props.dispatch({
      type: 'publicProcessDetailModal/workflowEnd',
      payload: {
        id,
        board_id,
        calback: () => {
          setTimeout(() => {
            message.success(`中止${currentNounPlanFilterName(FLOWS)}成功`)
          }, 200)
          this.props.onCancel && this.props.onCancel()
        }
      }
    })
  }

  // 删除流程的点击事件
  handleDeletProcess = () => {
    const { projectDetailInfoData: { board_id }, processInfo: { id } } = this.props
    if (!id) return false
    this.confirm({id, board_id})
  }

  confirm({id, board_id}) {
    const that = this
    const { dispatch } = that.props
    const modal = Modal.confirm();
    modal.update({
      title: `确认删除该${currentNounPlanFilterName(FLOWS)}吗？`,
      okText: '确认',
      cancelText: '取消',
      getContainer: () => document.getElementById('container_fileDetailContentOut'),
      zIndex:1010,
      onOk() {
        dispatch({
          type: 'publicProcessDetailModal/workflowDelete',
          payload: {
            id,
            board_id,
            calback: () => {
              setTimeout(() => {
                message.success(`删除${currentNounPlanFilterName(FLOWS)}成功`)
              }, 200)
              that.props.onCancel && that.props.onCancel()
            }
          }
        })
      },
      onCancel: () => {
        modal.destroy();
      }
    });
  }

  // 重启流程的点击事件
  handleReStartProcess = () => {
    const { projectDetailInfoData: { board_id }, processInfo: { id } } = this.props
    this.props.dispatch({
      type: 'publicProcessDetailModal/restartProcess',
      payload: {
        id,
        board_id,
        calback: () => {
          setTimeout(() => {
            message.success(`重启${currentNounPlanFilterName(FLOWS)}成功`)
          }, 200)
          this.props.onCancel && this.props.onCancel()
        }
      }
    })
  }


  handleSelectMenuItem = (e) => {
    const { key } = e
    switch (key) {
      case 'discontinue': // 表示匹配中止
        this.handleDiscontinueProcess()
        break;
      case 'delete': // 表示匹配删除
        this.handleDeletProcess()
        break
      case 'restart': // 表示匹配重启
        this.handleReStartProcess()
        break
      default:
        break;
    }
  }

  renderMoreMenu = (status) => {
    return (
      <Menu onClick={this.handleSelectMenuItem}>
        {
          status == '1' && (
            <Menu.Item key="discontinue">中止{currentNounPlanFilterName(FLOWS)}</Menu.Item>
          )
        }
        {
          status == '2' && (
            <Menu.Item key="restart">重启{currentNounPlanFilterName(FLOWS)}</Menu.Item>
          )
        }
        {
          (status == '2' || status == '3' || status == '0')&& (
            <Menu.Item style={{ color: '#FF4D4F' }} key="delete">删除{currentNounPlanFilterName(FLOWS)}</Menu.Item>
          )
        }
      </Menu>
    )
  }


  render() {
    const { projectDetailInfoData: { board_id, data = [] }, processInfo = {}, processPageFlagStep } = this.props
    const { is_privilege, privileges = [], assignees, id, nodes = [], status } = processInfo
    const principalList = this.genPrincipalListFromAssignees(nodes);
    return (
      <div>
        {
          processPageFlagStep == '4' ? (
            <div className={indexStyles.detail_action_list}>

              {/* 访问控制 */}
              <span className={`${indexStyles.action} ${indexStyles.visit_wrap}`}>
                {
                  board_id && (
                    <VisitControl
                      board_id={board_id}
                      isPropVisitControl={is_privilege === '0' ? false : true}
                      // handleVisitControlChange={this.handleVisitControlChange}
                      principalList={data}
                      otherPrivilege={privileges}
                      // handleClickedOtherPersonListOperatorItem={this.handleClickedOtherPersonListOperatorItem}
                      // handleAddNewMember={this.handleVisitControlAddNewMember}
                    />
                  )
                }

              </span>
              {/* 通知提醒 */}
              {
                checkIsHasPermissionInVisitControl('edit', privileges, is_privilege, [], checkIsHasPermissionInBoard(PROJECT_FILES_FILE_EDIT, board_id)) && (
                  <div className={indexStyles.margin_right10} style={{ marginTop: '4px' }}>
                    <InformRemind processPrincipalList={principalList} rela_id={id} rela_type={'3'} user_remind_info={data} />
                  </div>
                )
              }
              {/* 更多选项 */}
              <span className={`${indexStyles.action}`} style={{ position: 'relative' }}>
                <Dropdown trigger={'click'} overlay={this.renderMoreMenu(status)} getPopupContainer={triggerNode => triggerNode.parentNode}>
                  <span className={indexStyles.more_icon}>
                    <span className={`${globalStyles.authTheme} ${indexStyles.more}`}>&#xe7fd;</span>
                  </span>
                </Dropdown>
              </span>
            </div>
          ) : (<></>)
        }
      </div>

    )
  }
}

//  只关联public中弹窗内的数据
function mapStateToProps({ publicProcessDetailModal: { processInfo = {}, processPageFlagStep }, projectDetail: { datas: { projectDetailInfoData = {} } }
}) {
  return { processInfo, processPageFlagStep, projectDetailInfoData }
}
