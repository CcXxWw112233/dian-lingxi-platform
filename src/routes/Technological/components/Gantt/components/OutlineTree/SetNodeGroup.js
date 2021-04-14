import React, { Component } from 'react'
import { Menu, Button, Input, message, Modal, Dropdown, Select } from 'antd'
import styles from './nodeOperate.less'
import globalStyles from '@/globalset/css/globalClassName.less'
import { connect } from 'dva'
import {
  addTaskGroup,
  changeTaskType,
  deleteTask,
  requestDeleteMiletone,
  deleteTaskVTwo,
  boardAppRelaMiletones,
  updateTaskVTwo,
  updateMilestone,
  deleteCardGroup,
  addCardGroup,
  deleteMilestoneGroup,
  addMilestoneGroup
} from '../../../../../../services/technological/task'
import { isApiResponseOk } from '../../../../../../utils/handleResponseData'
import OutlineTree from '.'
import { visual_add_item } from '../../constants'
import {
  nonAwayTempleteStartPropcess,
  workflowDelete
} from '../../../../../../services/technological/workFlow'
import { currentNounPlanFilterName } from '../../../../../../utils/businessFunction'
import { TASKS, FLOWS } from '../../../../../../globalset/js/constant'
import { debounce } from 'lodash'
import CardGroupNames from '../CardGroupNames'
const { Option } = Select
@connect(mapStateToProps)
export default class SetNodeGroup extends Component {
  constructor(props) {
    super(props)
    this.state = {
      group_sub_visible: false, //分组
      create_group_visible: false, //新建分组
      group_value: '',
      groups: [] //分组列表
    }
  }
  componentDidMount() {
    this.getCardGroups()
  }
  // 获取任务分组列表
  getCardGroups = () => {
    const { gantt_board_id, about_group_boards = [] } = this.props
    const item =
      about_group_boards.find(item => item.board_id == gantt_board_id) || {}
    const { list_data = [] } = item
    this.setState({
      groups: list_data
    })
  }
  // 创建分组的区域
  renderCreateGroup = () => {
    const { group_value } = this.state
    return (
      <div className={styles.create_group}>
        <div
          className={styles.create_group_top}
          onClick={e => e.stopPropagation()}
        >
          新建分组
          <div
            className={`${globalStyles.authTheme} ${styles.create_group_top_go}`}
            onClick={e => {
              e.stopPropagation()
              this.setCreateGroupVisible(false)
            }}
          >
            &#xe7ec;
          </div>
        </div>
        <div className={styles.create_group_middle}>
          <Input
            onClick={e => e.stopPropagation()}
            placeholder={'请输入分组标题'}
            value={group_value}
            onChange={this.groupValueChange}
          />
        </div>
        <div className={styles.create_group_bott}>
          <Button
            disabled={!!!group_value}
            style={{ width: '100%' }}
            type={'primary'}
            onClick={e => {
              e.stopPropagation()
              this.addGroup()
            }}
          >
            确认
          </Button>
        </div>
      </div>
    )
  }
  //设置选择分组二级菜单是否显示
  setGroupSubShow = bool => {
    this.setState({
      group_sub_visible: bool // !group_sub_visible
    })
  }
  //设置新建分组显示
  setCreateGroupVisible = bool => {
    this.setState({
      create_group_visible: bool
    })
  }
  setGroupList = list_id => {
    this.setGroupSubShow(false)
    this.setCreateGroupVisible(false)
    this.relationGroup(list_id)
  }
  // 分组列表
  renderGroupList = () => {
    const {
      nodeValue: { list_ids = [] }
    } = this.props
    const { groups } = this.state
    return (
      <>
        <div
          className={`${styles.submenu_area_item} ${styles.submenu_area_item_create}`}
          onClick={e => {
            e.stopPropagation()
            this.setCreateGroupVisible(true)
          }}
          style={{ justifyContent: 'flex-start' }}
        >
          <span className={`${globalStyles.authTheme}`}>&#xe782;</span>
          <span>新建分组</span>
        </div>
        {groups.map(item => {
          const { list_id, list_name } = item
          return (
            <div
              title={list_name}
              onClick={e => {
                e.stopPropagation()
                this.setGroupList(`${list_id}`)
              }}
              className={`${styles.submenu_area_item} `}
              key={list_id}
            >
              <div className={`${styles.name} ${globalStyles.global_ellipsis}`}>
                {list_name}
              </div>
              <div
                style={{
                  display: list_ids.includes(list_id) ? 'block' : 'none'
                }}
                className={`${globalStyles.authTheme} ${styles.check}`}
              >
                &#xe7fc;
              </div>
            </div>
          )
        })}
      </>
    )
  }
  //分组名输入
  groupValueChange = e => {
    const { value } = e.target
    this.setState({
      group_value: value
    })
  }
  addGroup = () => {
    const { gantt_board_id } = this.props
    const { group_value } = this.state
    const params = {
      board_id: gantt_board_id,
      name: group_value
    }
    addTaskGroup({ ...params }).then(res => {
      if (isApiResponseOk(res)) {
        const { id, name } = res.data
        const obj = {
          list_id: id,
          list_name: name
        }
        this.addGroupCalback(obj)
        message.success('创建分组成功')
        this.setCreateGroupVisible(false)
      } else {
        message.error(res.message)
      }
    })
    this.setState({
      group_value: ''
    })
  }
  addGroupCalback = arg => {
    const { dispatch, about_group_boards = [], gantt_board_id } = this.props
    const arr = [...about_group_boards]
    const index = arr.findIndex(item => item.board_id == gantt_board_id)
    arr[index].list_data.push({ ...arg })
    dispatch({
      type: 'gantt/updateDatas',
      payload: {
        about_group_boards: arr
      }
    })
  }
  // 关联分组
  relationGroup = list_id => {
    const {
      gantt_board_id,
      nodeValue: { id },
      nodeValue: { tree_type, list_ids },
      dispatch
    } = this.props
    let params = {
      list_id
    }

    if (tree_type == '1') {
      params = { ...params, id }
    } else {
      params = {
        ...params,
        board_id: gantt_board_id,
        card_id: id
      }
    }
    let func = () => Promise.resolve({})
    const origin_has = list_ids.includes(list_id) //原来存在
    if (tree_type == '2') {
      //任务类型
      if (origin_has) {
        func = deleteCardGroup
      } else {
        func = addCardGroup
      }
    } else if (tree_type == '1') {
      // 里程碑类型
      if (origin_has) {
        func = deleteMilestoneGroup
      } else {
        func = addMilestoneGroup
      }
    } else {
      return
    }
    // const func = tree_type == '1' ? updateMilestone : updateTaskVTwo
    func({ ...params }, { isNotLoading: false }).then(res => {
      if (isApiResponseOk(res)) {
        message.success(origin_has ? '已取消关联该分组' : '已关联分组')
        if (tree_type == '1') {
          dispatch({
            type: 'gantt/getGttMilestoneList',
            payload: {}
          })
        }
        this.setRelationGroupId({ list_id: params.list_id })
      } else {
        message.error(res.message)
      }
    })
  }
  // 更新节点list_ids
  setRelationGroupId = ({ list_id }) => {
    let {
      nodeValue: { id },
      outline_tree = [],
      dispatch,
      nodeValue: { tree_type }
    } = this.props
    let node = OutlineTree.getTreeNodeValue(outline_tree, id)
    const { list_ids = [] } = node
    if (list_ids.includes(list_id)) {
      node.list_ids = list_ids.filter(i => i != list_id) //如果发现之前有，那就是删除
    } else {
      node.list_ids ? node.list_ids.push(list_id) : (node.list_ids = [list_id]) //如果发现之前没有，那就是添加
    }
    // 父任务下所有子任务的分组和父任务一致
    if (tree_type == '2') {
      if (node.children) {
        node.children = node.children.map(item => {
          const { list_ids = [] } = item
          if (list_ids.includes(list_id)) {
            item.list_ids = list_ids.filter(i => i != list_id) //如果发现之前有，那就是删除
          } else {
            item.list_ids
              ? item.list_ids.push(list_id)
              : (item.list_ids = [list_id]) //如果发现之前没有，那就是添加
          }
          return item
        })
      }
    }
    dispatch({
      type: 'gantt/handleOutLineTreeData',
      payload: {
        data: outline_tree
      }
    })
  }
  // ----------分组逻辑--------end+

  renderDrop = () => {
    const { create_group_visible } = this.state
    const {
      nodeValue: { list_ids = [] }
    } = this.props
    return (
      <Dropdown
        trigger={['click']}
        overlay={
          <div className={`${styles.submenu_area} ${styles.submenu_area2}`}>
            {create_group_visible
              ? this.renderCreateGroup()
              : this.renderGroupList()}
          </div>
        }
      >
        {list_ids.length ? (
          <div>{this.renderGroupsName()}</div>
        ) : (
          <span style={{ color: 'rgba(0,0,0,.25)' }}>未选择</span>
        )}
      </Dropdown>
    )
  }
  onSelect = debounce(value => {
    console.log(`ssssssssss_selected`, value)
    this.relationGroup(value)
  }, 0)
  onDeselect = debounce(value => {
    console.log(`sssssssssss_unselected`, value)
    this.relationGroup(value)
  }, 0)

  renderGroupsName = () => {
    const {
      nodeValue: { list_ids = [] }
    } = this.props
    const { groups } = this.state
    return <CardGroupNames selects={list_ids} list_data={groups} />
  }

  renderTarget = () => {
    const {
      nodeValue: { tree_type, parent_card_id, list_ids = [] }
    } = this.props
    let vdom = ''
    if (tree_type == '3') {
      vdom = (
        <div>
          <span style={{ color: 'rgba(0,0,0,.25)' }}>--</span>
        </div>
      )
    } else if (tree_type == '2' && !!parent_card_id) {
      vdom = (
        <div>
          {list_ids.length ? (
            this.renderGroupsName()
          ) : (
            <span style={{ color: 'rgba(0,0,0,.25)' }}>--</span>
          )}
        </div>
      )
    } else {
      vdom = this.renderDrop()
    }
    return vdom
  }
  render() {
    // 子任务和流程没有分组，子任务分组跟随父类任务
    return this.renderTarget()
  }
}

//  建立一个从（外部的）state对象到（UI 组件的）props对象的映射关系
function mapStateToProps({
  gantt: {
    datas: { gantt_board_id, about_group_boards = [], outline_tree = [] }
  },
  projectDetail: {
    datas: { projectDetailInfoData = {} }
  }
}) {
  return {
    gantt_board_id,
    projectDetailInfoData,
    about_group_boards,
    outline_tree
  }
}

// onSelect = debounce(value => {
//   console.log(`ssssssssss_selected`, value)
//   this.relationGroup(value)
// }, 0)
// onDeselect = debounce(value => {
//   console.log(`sssssssssss_unselected`, value)
//   this.relationGroup(value)
// }, 0)
// renderSelect = () => {
//   const {
//     nodeValue: { list_ids = [] }
//   } = this.props
//   return (
//     <Select
//       mode="multiple"
//       style={{ width: '100%', height: 18 }}
//       size={'small'}
//       maxTagCount={1}
//       placeholder="请选择分组"
//       value={list_ids}
//       onSelect={this.onSelect}
//       onDeselect={this.onDeselect}
//     >
//       {this.renderOptions()}
//     </Select>
//   )
// }

// renderOptions = () => {
//   const { groups } = this.state
//   return groups.map(item => {
//     const { list_id, list_name } = item
//     return (
//       <Option key={list_id}>
//         {list_name}
//         {list_id}
//       </Option>
//     )
//   })
// }
