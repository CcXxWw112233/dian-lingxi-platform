import { Tooltip } from 'antd'
import React from 'react'
import ReactDOM from 'react-dom'
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
      isOpenEditName: false
    }
  }
  componentDidMount() {
    this.node = this.getParent()
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

  /** 获取父级节点 */
  getParent = () => {
    /** 顶父级节点 */
    const parentNode = ((ReactDOM.findDOMNode(this) || {}).parentElement || {})
      .parentElement
    return parentNode
  }

  render() {
    /** 过滤之后的操作列表 */
    const tools = this.fetchOperations()
    /** 空的自定义标签，Fragment会报错 */
    const fragmentDiv = ({ children }) => {
      return <span>{children}</span>
    }
    return (
      <div
        className={styles.container}
        onMouseUp={e => e.stopPropagation()}
        onClick={e => {
          e.stopPropagation()
          e.preventDefault()
        }}
      >
        {tools.map(item => {
          /** 属于设置项的组件 */
          const Ele = item.component ? item.component : fragmentDiv
          /** 是否禁用 */
          const disabled = this.CheckDisabled(item.key)
          return (
            <Ele
              key={item.key}
              data={this.props.data}
              disabled={disabled}
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
