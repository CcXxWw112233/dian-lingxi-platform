import React from 'react'
import { Icon, Modal, message } from 'antd'
import Settings from '../../../../../../../components/headerOperate'
import {
  showConfirm,
  showDeleteConfirm
} from '../../../../../../../components/headerOperateModal'
import { PROJECT_FLOWS_FLOW_ABORT } from '../../../../../../../globalset/js/constant'
import { checkIsHasPermissionInBoard } from '../../../../../../../utils/businessFunction'
import VisitControl from './../../../../VisitControl/index';
import {
  toggleContentPrivilege,
  setContentPrivilege,
  removeContentPrivilege
} from './../../../../../../../services/technological/project';
import InformRemind from '@/components/InformRemind'

export default class Header extends React.Component {
  state = {
    controller: 0
  }
  componentDidMount() {
    if (!checkIsHasPermissionInBoard(PROJECT_FLOWS_FLOW_ABORT)) {
      return false
    }
    this.setState({
      controller: 1
    })
  }
  close() {
    this.props.close()
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

  getVisitControlDataFromPropsModelDatasProcessInfo = () => {
    const { model: { datas: { processInfo = {} } = {} } = {} } = this.props;
    return processInfo;
  };

  genPrincipalListFromAssignees = (nodes = []) => {
    return nodes.reduce((acc, curr) => {
      if (curr.assignees && curr.assignees.length) {
        const genNewPersonList = (arr = []) => {
          return arr.map(user => ({
            avatar: user.avatar,
            name: user.full_name
              ? user.full_name
              : user.name
                ? user.name
                : user.user_id
                  ? user.user_id
                  : ''
          }));
        };
        const newPersonList = genNewPersonList(curr.assignees);
        return [...acc, ...newPersonList.filter(i => !acc.find(a => a.name === i.name))];
      }
      return acc
    }, []);
  };

  isVisitControlOpen = () => {
    const {
      is_privilege
    } = this.getVisitControlDataFromPropsModelDatasProcessInfo();
    return is_privilege === '1' ? true : false;
  };

  handleClickedOtherPersonListOperatorItem = (id, type, removeId) => {
    if (type === 'remove') {
      this.handleVisitControlRemoveContentPrivilege(removeId)
    } else {
      this.handleVisitControlChangeContentPrivilege(id, type)
    }
  }

  handleVisitControlChangeContentPrivilege = (id, type) => {
    const { id: content_id, privileges } = this.getVisitControlDataFromPropsModelDatasProcessInfo()
    let temp_id = []
    temp_id.push(id)
    const obj = {
      content_id: content_id,
      content_type: 'flow',
      privilege_code: type,
      user_ids: temp_id
    }
    setContentPrivilege(obj).then(res => {
      const isResOk = res => res && res.code === '0'
      if (isResOk(res)) {
        let temp_arr = []
        temp_arr = res && res.data[0] 
        this.visitControlUpdateCurrentModalData({ temp_arr: temp_arr, type: 'change', code: type })
      } else {
        message.error('更新用户控制类型失败')
      }
    })
  }

  handleVisitControlRemoveContentPrivilege = id => {
    const { id: content_id, privileges } = this.getVisitControlDataFromPropsModelDatasProcessInfo()
    let temp_id = []
    temp_id.push(id)
    removeContentPrivilege({ id: id }).then(res => {
      const isResOk = res => res && res.code === '0'
      if (isResOk(res)) {
        this.visitControlUpdateCurrentModalData({ removeId: id, type: 'remove' })
      } else {
        message.error('移除用户内容控制权限失败')
      }
    })
  }

  handleVisitControlAddNewMember = (users_arr = []) => {
    if (!users_arr.length) return
    const { id, privileges } = this.getVisitControlDataFromPropsModelDatasProcessInfo()
    const content_id = id
    const content_type = 'flow'
    let temp_ids = [] // 用来保存用户的id
    users_arr && users_arr.map(item => {
      temp_ids.push(item.id)
    })
    setContentPrivilege({
      content_id,
      content_type,
      privilege_code: 'read',
      user_ids: temp_ids
    }).then(res => {
      if (res && res.code === '0') {
        let temp_arr = []
        temp_arr.push(res.data)
        this.visitControlUpdateCurrentModalData({ privileges: temp_arr, type: 'add' })
      }
    })
  }

  /**
   * 访问控制的开关切换
   * @param {Boolean} flag 开关切换
   */
  handleVisitControlChange = flag => {
    const {
      is_privilege = '0',
      id
    } = this.getVisitControlDataFromPropsModelDatasProcessInfo();
    const toBool = str => !!Number(str);
    const is_privilege_bool = toBool(is_privilege);
    if (flag === is_privilege_bool) {
      return;
    }
    //toggle权限
    const data = {
      content_id: id,
      content_type: 'flow',
      is_open: flag ? 1 : 0
    };
    toggleContentPrivilege(data).then(res => {
      if (res && res.code === '0') {
        let temp_arr = res && res.data
        this.visitControlUpdateCurrentModalData(
          { is_privilege: flag ? '1' : '0', type: 'privilege', privileges: temp_arr },
          flag
        );
      } else {
        message.error('设置内容权限失败，请稍后再试');
      }
    });
  };

  visitControlUpdateCurrentModalData = obj => {
    const originProcessInfo = this.getVisitControlDataFromPropsModelDatasProcessInfo();
    const { privileges = [], status } = originProcessInfo
    const { projectDetailInfoData = {} } = this.props.model.datas
    const { board_id } = projectDetailInfoData
    const { dispatch } = this.props

    // 访问控制开关
    if (obj && obj.type &&  obj.type == 'privilege') {
      let new_privileges = []
      for (let item in obj) {
        if (item == 'privileges') {
          obj[item].map(val => {
            let temp_arr = this.arrayNonRepeatfy([].concat(...privileges, val))
            return new_privileges = [...temp_arr]
          })
        }
      }
      let newProcessInfo = {...originProcessInfo, privileges: new_privileges, is_privilege: obj.is_privilege}
      this.props.updateDatasProcess({
        processInfo: newProcessInfo
      });
      // 这是需要获取一下流程列表 区分工作台和项目列表
      if (projectDetailInfoData && projectDetailInfoData.length) {
        dispatch({
          type: 'projectDetailProcess/getProcessListByType',
          payload: {
            status: status,
            board_id: board_id
          }
        })
      } else {

      }
      
    };

    // 访问控制添加
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
      let newProcessInfo = {...originProcessInfo, privileges: new_privileges}
      this.props.updateDatasProcess({
        processInfo: newProcessInfo
      });
    }

    // 访问控制移除
    if (obj && obj.type && obj.type == 'remove') {
      let new_privileges = [...privileges]
      new_privileges.map((item, index) => {
        if (item.id == obj.removeId) {
          new_privileges.splice(index, 1)
        }
      })
      let newProcessInfo = {...originProcessInfo, privileges: new_privileges, is_privilege: obj.is_privilege}
      this.props.updateDatasProcess({
        processInfo: newProcessInfo
      });
    }

    // 这是更新type类型
    if (obj && obj.type && obj.type == 'change') {
      let { id, content_privilege_code, user_info } = obj.temp_arr
      let new_privileges = [...privileges]
      new_privileges = new_privileges.map((item) => {
        let new_item = item
        if (item.id == id) {
          new_item = {...item, content_privilege_code: obj.code}
        } else {
          new_item = {...item}
        }
        return new_item
      })
      let newProcessInfo = {...originProcessInfo, privileges: new_privileges}
      this.props.updateDatasProcess({
        processInfo: newProcessInfo
      });
    }

  }

  render() {
    const disabled = this.props.model.datas.isProcessEnd
    const id = this.props.model.datas.totalId.flow
    const { processDoingList = [], processStopedList = [], processComepletedList = [], projectDetailInfoData = {}, processEditDatas = [] } = this.props.model.datas
    const { data = [], board_id } = projectDetailInfoData //任务执行人列表
    const ellipsis = <Icon type="ellipsis" onClick={() => { console.log(2) }} style={{ float: 'right', marginRight: '20px', fontSize: '16px', cursor: 'pointer' }} />
    const processDelete = async () => {
      await this.props.dispatch({
        type: 'workbenchDetailProcess/workflowDelete',
        payload: {
          id
        }
      })

      // 删除
      let processStopedLists = []
      processStopedList.length > 0 ? processStopedList.forEach((item) => {
        if (item.id === id) {

        } else {
          processStopedLists.push(item)
        }
      }) : null

      let processComepletedLists = []

      processComepletedList.length > 0 ? processComepletedList.forEach((item) => {
        if (item.id === id) {

        } else {
          processComepletedLists.push(item)
        }
      }) : null
      await this.props.updateDatasProcess({
        processStopedList: processStopedLists,
        processComepletedList: processComepletedLists
      })
      await this.props.close()
    }

    const processEnd = async () => {
      let processStopedLists = [],
        processDoingLists = []
      await this.props.dispatch({
        type: 'workbenchDetailProcess/workflowEnd',
        payload: {
          id: this.props.model.datas.totalId.flow
        }
      })
      this.props.dispatch({
        type: 'workbench/getBackLogProcessList',
        payload: {}
      })
      // processStopedList
      processDoingList ? processDoingList.forEach((item) => {
        if (item.id === id) {
          processStopedLists.push(item)
        } else {
          processDoingLists.push(item)
        }
      }) : null
      await this.props.updateDatasProcess({
        processStopedList: processStopedList ? processStopedList.concat(processStopedLists) : null,
        processDoingList: processDoingLists ? processDoingLists : null
      })

      await this.props.close()
    }

    const dataSource = [
      this.state.controller === 1 ? { content: '终止流程', click: showConfirm.bind(this, processEnd.bind(this)) } : undefined,
      { content: '移入回收站', click: this.state.controller === 1 ? showDeleteConfirm.bind(this, processDelete.bind(this)) : console.log('没权限') }
    ]
    let r = dataSource.reduce((r, c) => {
      return [
        ...r,
        ...(c === undefined ? [] : [c])
      ]
    }, [])
    const {
      is_privilege,
      privileges,
      nodes
    } = this.getVisitControlDataFromPropsModelDatasProcessInfo();
    const principalList = this.genPrincipalListFromAssignees(nodes);
    return (
      <div style={{
        height: '52px',
        background: 'rgba(255,255,255,1)',
        // borderBottom: '1px solid #E8E8E8',
        borderRadius: '4px 4px 0px 0px'
      }}>
        <div style={{
          width: '237px',
          height: '24px',
          background: 'rgba(245,245,245,1)',
          borderRadius: '4px',
          textAlign: 'center',
          lineHeight: '24px',
          float: 'left'
        }}>
          <span style={{ cursor: 'pointer', color: '##8C8C8C', fontSize: '14px' }}>示例项目</span>
          <span style={{ color: '##8C8C8C', fontSize: '14px' }}> > </span>
          <span style={{ cursor: 'pointer', color: '##8C8C8C', fontSize: '14px' }}>任务看板分组名称</span>
        </div>

        <div style={{ float: 'right' }}>
          <Icon type="close" onClick={this.close.bind(this)} style={{ float: 'right', marginRight: '20px', fontSize: '16px', cursor: 'pointer' }} />
          <Settings status={this.props.status} status={this.props.listData} {...this.props} item={ellipsis} dataSource={r} disabledEnd={(disabled === undefined || disabled === '') ? false : true} disabledDel={(disabled === undefined || disabled === '') ? true : false} />
          <span
            style={{
              float: 'right',
              marginTop: '-5px',
              marginLeft: this.isVisitControlOpen() ? '0px' : '10px',
              marginRight: this.isVisitControlOpen() ? '45px' : '20px',
              fontSize: '16px',
              cursor: 'pointer'
            }}
          >
            <VisitControl
              board_id={board_id}
              isPropVisitControl={is_privilege === '0' ? false : true}
              handleVisitControlChange={this.handleVisitControlChange}
              principalList={principalList}
              principalInfo='位流程推进人'
              otherPrivilege={privileges}
              handleAddNewMember={this.handleVisitControlAddNewMember}
              handleClickedOtherPersonListOperatorItem={this.handleClickedOtherPersonListOperatorItem}
            />
          </span>
          <span style={{ marginTop: '-4px', float: 'right', marginLeft: '18px' }}>
            <InformRemind processEditDatas={processEditDatas} rela_id={id} rela_type={'3'} user_remind_info={data} />
          </span>
          <Icon type="download" onClick={() => { console.log(1) }} style={{ float: 'right', fontSize: '16px', cursor: 'pointer' }} />
        </div>
      </div>
    )
  }
}
