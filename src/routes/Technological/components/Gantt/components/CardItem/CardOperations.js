import { message, Tooltip } from 'antd'
import React from 'react'
import ReactDOM from 'react-dom'
import {
  MESSAGE_DURATION_TIME,
  NOT_HAS_PERMISION_COMFIRN,
  PROJECT_TEAM_CARD_DELETE,
  PROJECT_TEAM_CARD_EDIT
} from '../../../../../../globalset/js/constant'
import { fetchVisitControlInfo } from '../../../../../../services/technological/task'
import {
  checkIsHasPermissionInBoard,
  checkRoleAndMemberVisitControlPermissions
} from '../../../../../../utils/businessFunction'
import { CardBarOperations } from './CardBarConstans'
import styles from './CardOperations.less'

/**
 * 任务条的更多设置按钮组
 */
export default class CardOperation extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      /** 是否打开了编辑名称弹窗 */
      isOpenEditName: false,
      /** 是否没有访问权限 */
      notVisitPermission: false
    }
  }
  componentDidMount() {
    this.node = this.getParent()
    /** 如果是拖拽依赖显示的，就不加载访问控制 */
    if (this.props.rely_down) return
    /** 获取访问控制信息 */
    this.getVisitControlInfo().then(res => {
      const { is_privilege, privileges, card_id } = res.data || {}
      /** 检查有没有访问控制权限 */
      const flag = checkRoleAndMemberVisitControlPermissions({
        privileges,
        board_id: this.props.board_id,
        board_permissions_code: PROJECT_TEAM_CARD_EDIT,
        is_privilege
      })
      this.setState({
        notVisitPermission: !flag
      })
    })
  }

  /**
   * 过滤需要显示的设置项
   * @returns {{name: string, icon: string, key: string,component: JSX.Element | null}[]}
   */
  fetchOperations = () => {
    /** 由外部来确定需要显示什么样的操作按钮 */
    const { operations = [] } = this.props
    const tools = CardBarOperations.tools
    const arr = tools.filter(
      item => !!operations.find(tool => tool === item.key)
    )
    return arr
  }

  /** 每个设置项都会有不一样的禁用逻辑 */
  CheckDisabled = key => {
    const { data } = this.props
    /** 需要单独控制是否禁用的列表 */
    const toolsDisabled = [CardBarOperations.BarColor]
    /** 是否是需要验证禁用的元素 */
    const isDisabledItem = toolsDisabled.includes(key)
    /** 不需要验证，所以不需要禁用 */
    if (!isDisabledItem) return false

    switch (key) {
      case CardBarOperations.BarColor:
        /** 任务未选择标签，禁用按钮 */
        if (!data.label_data) return true
        if (!data.label_data.length) return true
        return false
      default:
        return false
    }
  }

  /** 点击了工具 */
  handleTools = val => {
    if (
      this.state.notVisitPermission &&
      val.key !== CardBarOperations.MoreOperation &&
      val.key !== CardBarOperations.RelyKey
    ) {
      return message.warn(NOT_HAS_PERMISION_COMFIRN, MESSAGE_DURATION_TIME)
    }
    switch (val.key) {
      /** 编辑名称 */
      case CardBarOperations.EditName:
        this.setState({
          isOpenEditName: true
        })
        break
      default:
        break
    }
  }

  /**
   * 编辑完成
   * @param {{name: String}} val 改动的名称
   */
  handleOverEdit = val => {
    this.setState({
      isOpenEditName: false
    })
    const { updateCardBarDatas } = this.props
    /** 调用父级的更改属性方法 父级是 CardItem/index.js */
    updateCardBarDatas && updateCardBarDatas(val)
  }

  /**
   * 获取访问控制详情
   */
  getVisitControlInfo = () => {
    return fetchVisitControlInfo({ id: this.props.data.id }).then(res => {
      // console.log(res)
      if (res.code === '0') {
        return res
      }
      return Promise.reject(res)
    })
  }

  /** 获取父级节点 */
  getParent = () => {
    /** 顶父级节点 */
    const parentNode = ((ReactDOM.findDOMNode(this) || {}).parentElement || {})
      .parentElement
    return parentNode
  }

  /** 是否有删除任务的权限 */
  checkRemoveCard = () => {
    return !checkIsHasPermissionInBoard(
      PROJECT_TEAM_CARD_DELETE,
      this.props.board_id
    )
  }

  render() {
    /** 没有访问控制权限的判断 */
    const notVisitPermission = this.state.notVisitPermission
    /** 过滤之后的操作列表 */
    const tools = this.fetchOperations()
    /** 空的自定义标签，Fragment会报错 */
    const fragmentDiv = ({ children }) => {
      return <span>{children}</span>
    }
    return (
      <div className={styles.container} onMouseUp={e => e.stopPropagation()}>
        {tools.map(item => {
          /** 属于设置项的组件 */
          const Ele = item.component ? item.component : fragmentDiv
          /** 是否禁用 */
          const disabled = this.CheckDisabled(item.key)
          return (
            <Ele
              key={item.key}
              valueKey={item.key}
              data={this.props.data}
              disabled={key => {
                /** 删除任务需要单独的权限控制 */
                if (key === CardBarOperations.MoreOperation) {
                  return this.checkRemoveCard()
                }
                if (key === CardBarOperations.RelyKey) {
                  return (
                    /** 视图类型 */
                    ['2', '5'].includes(this.props.group_view_type) ||
                    /** 全项目 */
                    this.props.board_id === '0' ||
                    /** 有父级 */
                    this.props.parent_card_id
                  )
                }
                return disabled || notVisitPermission
              }}
              {...this.props}
              isOpenEditName={this.state.isOpenEditName}
              parentNode={this.node}
              handleOverEdit={this.handleOverEdit}
            >
              <Tooltip title={`${item.name}${disabled ? '(未激活)' : ''}`}>
                <span
                  className={disabled ? styles.disabled : ''}
                  tabIndex={-1}
                  onClick={e => {
                    e.stopPropagation()
                    e.preventDefault()
                    this.handleTools(item)
                  }}
                  key={item.key}
                  dangerouslySetInnerHTML={{ __html: item.icon }}
                ></span>
              </Tooltip>
            </Ele>
          )
        })}
      </div>
    )
  }
}
