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
import {
  createRole,
  deleteRole,
  OrgAddRoleGroup,
  OrgPutRole,
  OrgPutRoleGroup,
  OrgRoleAdd,
  OrgRoleGroupList,
  OrgRoleRemove,
  OrgRoleRemoveGroup
} from '../../../../../../services/organization'
import { MainOrgType, MarkDefaultType, NormalOrgType } from './constans'
import { message, Modal } from 'antd'
import { MaxZIndex } from '../../../../../../globalset/js/constant'

/** 组织架构组件
 * @description 用于展示组织架构成员和权限列表，组织架构图
 */
@connect(
  ({
    [OrgStructureModel.namespace]: { openPanel, activeRoleData },
    technological: {
      datas: { currentSelectOrganize = {} }
    }
  }) => ({
    openPanel,
    activeRoleData,
    currentSelectOrganize
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
    activeRoleData: PropTypes.any,
    /** 选择的组织 */
    currentSelectOrganize: PropTypes.object
  }

  constructor(props) {
    super(props)
    this.state = {
      data: [],
      /** 默认的角色 */
      defaultRoles: {}
    }
  }
  componentDidMount() {
    window.addEventListener('keydown', this.KeyboardEvent)
    this.getOrgRoleList()
  }
  componentWillUnmount() {
    window.removeEventListener('keydown', this.KeyboardEvent)
  }

  /** 转成树结构 */
  arrayToTree = options => {
    this.data = options.data || []
    this.parentKey = options.parentKey || 'parent_id'
    this.childrenKey = options.childrenKey || 'roles'
    this.key = options.key || 'id'
    this.maping = options.maping || undefined
    this.rootValue = options.rootValue || '0'
    this.treeData = []
    this.indexStorage = {}
    this.getDataBykey = function(key) {
      return this.indexStorage[key]
    }
    this.setMapping = function() {
      for (let i = 0; i < this.data.length; i++) {
        var item = this.data[i]
        for (let x in this.maping) {
          item[this.maping[x]] = item[x]
        }
      }
    }
    if (this.maping) {
      this.setMapping()
    }
    this.setIndexStorage = function() {
      for (let i = 0; i < this.data.length; i++) {
        this.indexStorage[this.data[i][this.key]] = this.data[i] // 以id作为索引存储元素，可以无需遍历直接定位元素
      }
    }
    this.setIndexStorage()
    // 利用数组浅拷贝
    this.toTree = function() {
      // var THISDATA = JSON.parse(JSON.stringify(this.data))
      for (let i = 0; i < this.data.length; i++) {
        let currentElement = this.data[i]
        let tempCurrentElementParent = this.indexStorage[
          currentElement[this.parentKey]
        ] // 临时变量里面的当前元素的父元素
        if (tempCurrentElementParent) {
          // 如果存在父元素
          if (!tempCurrentElementParent[this.childrenKey]) {
            // 如果父元素没有chindren键
            tempCurrentElementParent[this.childrenKey] = [] // 设上父元素的children键
          }
          tempCurrentElementParent[this.childrenKey].push(currentElement) // 给父元素加上当前元素作为子元素
        } else {
          // 不存在父元素，意味着当前元素是一级元素
          if (
            this.rootValue != undefined &&
            currentElement[this.key] === this.rootValue
          ) {
            this.treeData.push(currentElement)
          } else {
            this.treeData.push(currentElement)
          }
        }
      }
      return this.treeData
    }
    this.toTree()
    return this
  }

  /** 格式化数据 */
  forMatData = (data = []) => {
    const arr = []
    data.forEach(item => {
      let obj = {
        ...item,
        role_group_name: item.role_group_name || item.name
      }
      if (obj.roles && obj.roles.length) {
        obj.roles = this.forMatData(obj.roles)
      }
      arr.push(obj)
    })
    return arr
  }

  /** 获取数据列表 */
  getOrgRoleList = () => {
    const { currentSelectOrganize } = this.props
    OrgRoleGroupList({ org_id: currentSelectOrganize.id }).then(res => {
      // console.log(res)
      /** 过滤不需要默认分组的数据 */
      const respdata = (res.data || []).filter(
        item => item.mark !== MarkDefaultType
      )
      /** 获取默认的角色分组 */
      const defaultRoles =
        (res.data || []).find(item => item.mark === MarkDefaultType) || {}
      const data = this.forMatData(respdata)
      let arrs = []
      data.forEach(item => {
        item.roles = this.arrayToTree({
          data: item.roles,
          rootValue: item.id
        }).treeData
        arrs.push(item)
      })
      this.setState({
        data: arrs,
        defaultRoles: defaultRoles
      })
    })
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
   * @param {string} 点击的角色类型
   */
  mapTreeHandleClick = (data, type) => {
    const { dispatch } = this.props
    dispatch({
      type: [OrgStructureModel.namespace, OrgStructureModel.getRoleInfo].join(
        '/'
      ),
      payload: {
        role_info: data,
        /** 判断是不是默认角色，默认角色不需要更新到activeRole */
        markType: type
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
          const n = this.findNode(node_id, element.roles)
          if (n) return n
        }
      }
    }
  }

  /** 创建一个空的主题数据 */
  createEmptyObj = (text, length) => {
    const objChildLength = length || 0
    /** 需要添加的子主题内容 */
    const addSubObj = {
      role_group_name: text || '子主题' + (objChildLength + 1),
      id: Math.ceil(Math.random() * 1e10),
      role_type: '2'
    }
    return addSubObj
  }

  /** 给分组添加角色 */
  addGroupRoleChild = (parent, data) => {
    const activeRoleData = parent || this.props.activeRoleData
    return this.addRole({
      ...data,
      group_id: activeRoleData?.id,
      parent_id: '0'
    })
  }

  /** 角色上添加普通角色 */
  addSubChildRole = (parent, data) => {
    if (parent) {
      if (this.isGroupNode(parent))
        return this.addRole({
          parent_id: parent.id,
          group_id: parent.id,
          ...data
        }).catch(err => false)
      else
        return this.addRole({
          parent_id: parent.id,
          group_id: parent.group_id,
          ...data
        }).catch(err => false)
    }
    return null
  }

  /** 添加一个自己的child数组 */
  addSubItemForTree = async node => {
    const activeRoleData = node || this.props.activeRoleData
    const { data = [] } = this.state
    if (activeRoleData) {
      /** 新的变量，用于修改 */
      const obj = { ...activeRoleData }
      /** 第几个子节点 */
      const objChildLength = obj.roles?.length || 0
      /** 需要添加的子主题内容 */
      let addSubObj = this.createEmptyObj(
        activeRoleData.role_group_name + '_' + (objChildLength + 1)
      )

      if (this.isGroupNode(activeRoleData)) {
        const res = await this.addGroupRoleChild(activeRoleData, addSubObj)
        const d = res.data
        addSubObj = { ...d, role_group_name: d.name }
      } else {
        const res = await this.addSubChildRole(activeRoleData, addSubObj)
        if (res) {
          const d = res.data
          if (!d) return
          addSubObj = { ...d, role_group_name: d.name }
        } else return console.error('parent不存在')
      }

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

  /** 更新分组的节点 */
  updateGroupRoleNode = val => {
    const { activeRoleData } = this.props
    if (activeRoleData)
      OrgPutRoleGroup({
        id: activeRoleData.id,
        name: val.role_group_name
      }).then(res => {
        let arr = [...this.state.data]
        /** 角色数据详情 */
        const roleGroupData = res.data
        arr = arr.map(item => {
          if (item.id === activeRoleData.id) {
            return { ...item, ...roleGroupData }
          }
          return item
        })
        this.setState({
          data: arr
        })
      })
  }

  /** 更新文字等 */
  updateText = val => {
    if (this.isGroupNode()) {
      this.updateGroupRoleNode(val)
    } else {
      OrgPutRole({ name: val.role_group_name, role_id: val.id }).then(res => {
        const data = res.data
        const treeData = this.updateTreeData(
          { ...data, role_group_name: data.name },
          this.state.data
        )
        this.setState({
          data: treeData
        })
      })
    }
  }

  /** 是否是分组的节点 */
  isGroupNode = node => {
    const { activeRoleData } = this.props
    if (node || activeRoleData) {
      if (activeRoleData.mark) return true
      return false
    }
    return false
  }
  /** 确认更新删除 */
  updateRemoveNode = () => {
    const { activeRoleData, dispatch, currentSelectOrganize } = this.props
    if (this.isGroupNode()) {
      this.removeGroupRoleNode()
    } else {
      OrgRoleRemove({
        org_id: currentSelectOrganize.id,
        id: activeRoleData.id
      }).then(() => {
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
      })
    }
  }

  /** 删除选中的节点 */
  deleteTreeNode = () => {
    const { activeRoleData } = this.props
    if (
      activeRoleData &&
      activeRoleData.mark &&
      activeRoleData?.mark !== NormalOrgType
    )
      return message.warn('此分组不可删除')
    if (activeRoleData) {
      if (activeRoleData.roles?.length)
        Modal.confirm({
          title: `确定要删除 ${activeRoleData.role_group_name} 吗？`,
          zIndex: MaxZIndex + 15,
          onOk: () => {
            this.updateRemoveNode()
          }
        })
      else this.updateRemoveNode()
    }
  }

  /** 删除分组的节点 */
  removeGroupRoleNode = () => {
    const { activeRoleData, dispatch } = this.props
    if (activeRoleData)
      OrgRoleRemoveGroup({ group_id: activeRoleData.id }).then(() => {
        const arr = [...this.state.data]
        this.setState({
          data: arr.filter(item => item.id !== activeRoleData.id)
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
      })
  }

  /** 添加分组同级节点 */
  addOrgGroupRoleNode = () => {
    const { activeRoleData, currentSelectOrganize } = this.props
    if (activeRoleData) {
      const index = this.state.data.findIndex(
        item => item.id === activeRoleData.id
      )
      if (index > -1) {
        const param = {
          name: '分组名称' + (this.state.data.length + 1),
          org_id: currentSelectOrganize.id
        }
        OrgAddRoleGroup(param).then(res => {
          /** 分组角色id */
          const roleGroupData = res.data
          const arr = Array.from(this.state.data)
          arr.splice(index + 1, 0, roleGroupData)
          this.setState({
            data: arr
          })
        })
      }
    }
  }

  /** 添加同级数据 */
  addSibilingsNode = async () => {
    const { activeRoleData } = this.props
    if (activeRoleData) {
      /** 说明点击的是顶级分组 */
      if (
        activeRoleData.mark &&
        (activeRoleData.mark === NormalOrgType ||
          activeRoleData.mark === MainOrgType)
      ) {
        return this.addOrgGroupRoleNode()
      }
      const nodes = this.findNode(activeRoleData.id, this.state.data)
      if (!nodes) return
      const parent = nodes.parent
      const index = parent.roles.findIndex(
        item => item.id === activeRoleData.id
      )
      if (index !== -1) {
        let roles = parent.roles
        let addObj = this.createEmptyObj(
          parent.role_group_name + '_' + ((roles.length || 0) + 1)
        )

        if (this.isGroupNode(parent)) {
          const res = await this.addGroupRoleChild(parent, addObj)
          const d = res.data
          addObj = { ...d, role_group_name: d.name }
        } else {
          const res = await this.addSubChildRole(parent, addObj)
          if (res) {
            const d = res.data
            if (d) {
              addObj = { ...d, role_group_name: d.name }
            } else return
          }
        }

        roles.splice(index, 0, addObj)
        parent.roles = roles
        let arr = this.updateTreeData(parent, this.state.data)
        this.setState({
          data: arr
        })
      }
    }
  }

  /** 添加角色 */
  addRole = val => {
    const { currentSelectOrganize } = this.props
    return OrgRoleAdd({
      group_id: val.group_id,
      parent_id: val.parent_id,
      _organization_id: currentSelectOrganize.id,
      name: val.role_group_name,
      type: '1'
    }).catch(err => {
      message.warn(err.message)
      return Promise.reject(err)
    })
  }

  render() {
    /** 是否显示右侧角色窗口 */
    const { openPanel, activeRoleData } = this.props
    const { defaultRoles } = this.state
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
              <span onClick={() => this.addSubItemForTree()}>&#xe8b8;</span>
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

        <div className={styles.defatultRoles}>
          {(defaultRoles.roles || []).map(item => {
            return (
              <div
                key={item.id}
                className={styles.roles_item}
                onClick={() => this.mapTreeHandleClick(item, MarkDefaultType)}
              >
                {item.name}
              </div>
            )
          })}
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
