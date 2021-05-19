import React from 'react'
import styles from './index.less'
import globalStyles from '../../../../../../globalset/css/globalClassName.less'
import ReactDOM from 'react-dom'
import 'animate.css'
import { connect } from 'dva'
import { OrgStructureModel } from '../../../../../../models/technological/orgStructure'
import OrgStructureCanvas from './components/OrgStructureCanvas'
import RoleMemberPanel from './components/RoleMemberPanel'
import PropTypes from 'prop-types'

/** 组织架构组件
 * @description 用于展示组织架构成员和权限列表，组织架构图
 */
@connect(
  ({ [OrgStructureModel.namespace]: { openPanel, activeRoleData } }) => ({
    openPanel,
    activeRoleData
  })
)
export default class OrganizationalStructure extends React.Component {
  /** props状态的管理，说明来源 */
  static propTypes = {
    /** 是否显示组织架构页面的成员和权限窗口
     * @description 来源是redux
     */
    openPanel: PropTypes.bool,
    /** 选中的架构图单个详情 */
    activeRoleData: PropTypes.any
  }

  constructor(props) {
    super(props)
    this.state = {
      data: require('./data.json') || []
    }
  }
  componentDidMount() {
    window.addEventListener('keydown', this.KeyboardEvent)
  }
  componentWillUnmount() {
    window.removeEventListener('keydown', this.KeyboardEvent)
  }
  /** 返回到首页 */
  backHome = () => {
    const { dispatch } = this.props
    dispatch({
      type: [
        OrgStructureModel.namespace,
        OrgStructureModel.reducers.updateDatas
      ].join('/'),
      payload: {
        showStructure: false
      }
    })
  }

  /** 监听键盘事件
   * @param {React.KeyboardEvent} e 键盘事件
   */
  KeyboardEvent = e => {
    const { key } = e
    if (key === 'Delete') {
      this.deleteTreeNode()
    }
  }

  /** 组织架构图点击的事件监听
   * @param {{id: string, role_group_id: string, role_group_name: string} | null} 点击的角色信息
   */
  mapTreeHandleClick = data => {
    const { dispatch } = this.props
    dispatch({
      type: [OrgStructureModel.namespace, OrgStructureModel.getRoleInfo].join(
        '/'
      ),
      payload: {
        role_info: data
      }
    })
  }

  /** 更新树的数据
   * @param {{id: string}} data 树中的一个数据
   * @param {{}[]} tree 原始节点
   * @param {'update' | 'remove'} type 更新类型
   */
  updateTreeData = (data, tree, type = 'update') => {
    const arr = []
    if (!data || !data?.id) return tree
    /** 是否已经更新过了 */
    let isUpdate = false
    tree.forEach(item => {
      let obj = { ...item }
      if (data.id === obj.id) {
        if (type === 'update') obj = { ...item, ...data }
        else if (type === 'remove') obj = null
        isUpdate = true
      }
      /** 没有更新过，继续递归更新 */
      if (!isUpdate) {
        if (obj.roles && obj.roles.length) {
          obj.roles = this.updateTreeData(data, obj.roles, type)
        }
      }
      if (obj) arr.push(obj)
    })
    return arr
  }

  /** 查找节点 */
  findNode = (node_id, tree) => {
    for (let index = 0; index < tree.length; index++) {
      const element = tree[index]
      if (element.id === node_id) {
        return { parent: null, node: element }
      }
      if (element.roles && element.roles.length) {
        const node = element.roles.find(item => item.id === node_id)
        if (node) {
          return { parent: element, node }
        } else {
          return this.findNode(node_id, element.roles)
        }
      }
    }
    return undefined
  }

  /** 创建一个空的主题数据 */
  createEmptyObj = length => {
    const objChildLength = length || 0
    /** 需要添加的子主题内容 */
    const addSubObj = {
      role_group_name: '子主题' + (objChildLength + 1),
      id: Math.ceil(Math.random() * 1e10),
      role_type: '2'
    }
    return addSubObj
  }

  /** 添加一个自己的child数组 */
  addSubItemForTree = () => {
    const { activeRoleData } = this.props
    const { data = [] } = this.state
    if (activeRoleData) {
      /** 新的变量，用于修改 */
      const obj = { ...activeRoleData }
      /** 第几个子节点 */
      const objChildLength = obj.roles?.length || 0
      /** 需要添加的子主题内容 */
      const addSubObj = this.createEmptyObj(objChildLength)
      if (!obj.roles) {
        obj.roles = []
      }
      obj.roles.push(addSubObj)
      /** 得到全新的树结构 */
      const treeData = this.updateTreeData(obj, data)
      this.setState({
        data: treeData
      })
    }
  }

  /** 更新文字等 */
  updateText = val => {
    const treeData = this.updateTreeData(val, this.state.data)
    this.setState({
      data: treeData
    })
  }

  /** 删除选中的节点 */
  deleteTreeNode = () => {
    const { activeRoleData, dispatch } = this.props
    if (activeRoleData) {
      const treeData = this.updateTreeData(
        activeRoleData,
        this.state.data,
        'remove'
      )
      this.setState({
        data: treeData
      })
      dispatch({
        type: [
          OrgStructureModel.namespace,
          OrgStructureModel.reducers.updateDatas
        ].join('/'),
        payload: {
          activeRoleData: null
        }
      })
    }
  }

  /** 添加同级数据 */
  addSibilingsNode = () => {
    const { activeRoleData } = this.props
    if (activeRoleData) {
      const nodes = this.findNode(activeRoleData.id, this.state.data)
      const parent = nodes.parent
      const index = parent.roles.findIndex(
        item => item.id === activeRoleData.id
      )
      if (index !== -1) {
        let roles = parent.roles
        const addObj = this.createEmptyObj(roles.length || 0)
        roles.splice(index, 0, addObj)
        parent.roles = roles
        let arr = this.updateTreeData(parent, this.state.data)
        this.setState({
          data: arr
        })
      }
    }
  }

  render() {
    /** 是否显示右侧角色窗口 */
    const { openPanel, activeRoleData } = this.props
    return ReactDOM.createPortal(
      <div
        className={`${styles.container} animate_animated animate__fadeInRight animate__faster`}
      >
        <div className={styles.top_operations}>
          <span
            className={`${styles.backBtn} ${globalStyles.authTheme}`}
            onClick={() => this.backHome()}
          >
            &#xe7d7;
          </span>
          <div
            className={`${styles.maptree_settings} ${globalStyles.authTheme}`}
          >
            <div
              className={`${styles.maptree_addsub} ${
                styles.maptree_default_settings
              } ${!activeRoleData ? styles.disabled : ''}`}
            >
              <span onClick={this.addSubItemForTree}>&#xe8b8;</span>
              <span onClick={this.addSibilingsNode}>&#xe8b9;</span>
            </div>
            <div
              className={`${styles.maptree_default_settings} ${
                !activeRoleData ? styles.disabled : ''
              }`}
            >
              <span onClick={this.deleteTreeNode}>&#xe8c8;</span>
            </div>
          </div>
        </div>

        <OrgStructureCanvas
          onChange={this.mapTreeHandleClick}
          StructureData={this.state.data}
          onUpdateText={val => this.updateText(val)}
          activeItem={this.props.activeRoleData}
        />
        {openPanel && <RoleMemberPanel />}
      </div>,
      document.body
    )
  }
}
