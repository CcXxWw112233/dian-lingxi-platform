import { connect } from 'dva'
import React from 'react'
import { WorkbenchModel } from '../../../../../../../models/technological/workbench'
import styles from './index.less'
import globalStyles from '../../../../../../../globalset/css/globalClassName.less'
import 'animate.css'
import { Dropdown, Menu, message, Spin, Tree } from 'antd'
import { calendarGetTemplateList } from '../../../../../../../services/organization'
import PropTypes from 'prop-types'
import Empty from '../../../../../../../components/Empty'
import { NodeType, TempType, TotalBoardKey } from '../../constans'
/** 文件夹的图标 */
const folderIcon = require('../../../../../../../assets/workbench/foldericon.png')

/**
 * 渲染项目中的模板列表
 */
@connect(
  ({
    [WorkbenchModel.namespace]: {
      datas: { projectList }
    },
    simplemode: { simplemodeCurrentProject }
  }) => ({
    projectList,
    simplemodeCurrentProject
  })
)
export default class CalendarTempTree extends React.Component {
  /** 组件props注解 */
  static propTypes = {
    /** 项目列表 */
    projectList: PropTypes.array,
    /** 当前选中的项目 */
    simplemodeCurrentProject: PropTypes.object,
    /** 勾选里程碑等树形节点回调 */
    onChange: PropTypes.func,
    /** 选中了模板的回调 */
    onSelect: PropTypes.func,
    /** 返回列表的回调 */
    onBack: PropTypes.func
  }
  constructor(props) {
    super(props)
    this.state = {
      /** 模板树加载 */
      loading: false,
      /** 无模板数据和无模板查找显示的nodata */
      showNoData: false,
      /** 选中模板的树形数据 */
      treeData: [],
      /** 模板数据列表 */
      tempList: [],
      /** 是否选中模板显示 */
      showInfoTree: false,
      /** 选中的数据 */
      currentData: {}
    }
    /** 全选了项目的key
     * @default string '0'
     */
    this.TotalBoardKey = TotalBoardKey
    /** 请求数据返回的code正确码 */
    this.SuccessCode = '0'
    /** 模板类型 */
    this.TempType = TempType
    /** 节点类型 */
    this.NodeType = NodeType
  }

  componentDidMount() {
    this.fetchTempList()
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.simplemodeCurrentProject !== this.props.simplemodeCurrentProject
    ) {
      this.fetchTempList()
    }
  }
  /** 获取所有项目列表中，存在的模板信息
   * @returns {?String[] | ?string }
   */
  getBoardTempIds = () => {
    /**
     * projectList 所选组织的项目列表
     * simplemodeCurrentProject 所选的项目 用于判断是不是全选项目，或者当前选择的项目
     */
    const { projectList, simplemodeCurrentProject } = this.props
    /** 当前选中的项目id */
    const currentBoardId = simplemodeCurrentProject
      ? simplemodeCurrentProject.board_id || this.TotalBoardKey
      : this.TotalBoardKey

    if (this.TotalBoardKey === currentBoardId) {
      /** 全选了项目 */
      return [
        ...new Set(
          projectList
            .filter(item => !!item.template_id)
            .map(item => item.template_id)
        )
      ]
    } else
      return (projectList.find(item => item.board_id === currentBoardId) || {})
        .template_id
  }

  /** 更新显示和隐藏loading
   * @param {Boolean} bool 是否显示
   */
  setLoading = bool => {
    this.setState({
      loading: bool
    })
  }

  /**
   * 请求模板列表
   */
  fetchTempList = () => {
    this.setLoading(true)
    /** 获取到的模板id列表或模板id */
    let templateIds = this.getBoardTempIds()
    /** 清空 */
    this.setState({
      showInfoTree: false,
      currentData: {},
      treeData: []
    })
    if (templateIds) {
      /** 获取返回的组织列表类型 */
      const idsType = typeof templateIds
      if (idsType === 'string') {
        templateIds = [templateIds]
      }
    } else {
      /** 没有数据，没有模板id */
      this.setState({
        showNoData: true,
        loading: false
      })
      return
    }
    if (!templateIds.length) {
      /** 没有数据，没有模板id */
      this.setState({
        showNoData: true,
        loading: false
      })
      return
    }
    calendarGetTemplateList({ ids: templateIds.join(',') })
      .then(res => {
        if (res.code === this.SuccessCode) {
          this.setState({
            tempList: res.data,
            showNoData: false
          })
        } else {
          message.warn(res.message)
        }
        this.setLoading(false)
      })
      .catch(_ => {
        message.warn(_.message)
        this.setLoading(false)
      })
  }

  /** 自定义节点字段名称，需要格式化
   * @param {object[]} data 需要格式化的源数据
   * @returns {{key, title, children, [disabled, selectable]}[]}
   */
  forMateTreeData = data => {
    if (!data || !data?.length) return data || []
    const arr = []
    data.forEach(item => {
      const obj = { ...item }
      if (obj.child_content && obj.child_content.length) {
        obj.child_content = this.forMateTreeData(obj.child_content)
      }
      /** 是否是里程碑 */
      const isMilestoneType =
        obj.template_data_type === this.TempType.milestoneType
      /** 是否是子里程碑 */
      const isSubMilestoneType =
        !obj.parent_id && obj.parent_id !== '0' && isMilestoneType
      /** 是否任务 */
      const isCardType = obj.template_data_type === this.TempType.cardType
      /** 是否是子任务 */
      const isSubCardType =
        !obj.parent_id && obj.parent_id !== '0' && isCardType

      /** 判定类型 */
      const type = (() => {
        if (obj.template_data_type === this.TempType.milestoneType) {
          if (isSubMilestoneType) return this.NodeType.submilestonetype
          else if (isMilestoneType) return this.NodeType.milestonetype
        }
        if (obj.template_data_type === this.TempType.cardType) {
          if (isSubCardType) return this.NodeType.subcardtype
          else if (isCardType) return this.NodeType.cardtype
        }
        return this.NodeType.unknowType
      })()

      /** 是里程碑和子里程碑就显示 */
      if (isMilestoneType || isSubMilestoneType)
        arr.push({
          ...obj,
          children: obj.child_content,
          title: this.treeTitle(obj.name, { ...obj, type }),
          key: obj.id,
          type: type
        })
    })
    return arr
  }

  /**
   * 模板点击事件
   * @param {{id:string, name: string, contents: object[]}} temp 点击的模板
   */
  handleClickTemp = temp => {
    const { onSelect } = this.props
    this.setState({
      currentData: temp,
      treeData: this.forMateTreeData(temp.contents),
      showInfoTree: true
    })
    onSelect && onSelect(temp)
  }

  /**
   * 自定义渲染title
   * @param {string} title 名称
   * @param {{id:string, type: string}} 当前节点
   * @returns {React.ReactNode}
   */
  treeTitle = (title, node) => {
    return (
      <div className={styles.tree_name}>
        <span className={`${globalStyles.authTheme} ${styles.title_icon}`}>
          {(type => {
            switch (type) {
              case this.NodeType.milestonetype:
                return <b>&#xe85d;</b>
              case this.NodeType.submilestonetype:
                return <b>&#xe85f;</b>
              case this.NodeType.cardtype:
                return <b>&#xe861;</b>
              default:
                return null
            }
          })(node.type)}
        </span>{' '}
        <span>{title}</span>
      </div>
    )
  }

  /** 点击返回列表 */
  handleBackList = () => {
    const { onBack } = this.props
    this.setState({
      showInfoTree: false,
      currentData: {},
      treeData: []
    })

    onBack && onBack()
  }

  /** 选中复选框的事件
   * @param {string[]} selectedKeys 选中的列表
   */
  handleSelectTemp = selectedKeys => {
    // console.log(selectedKeys)
    const { onChange } = this.props
    onChange && onChange(selectedKeys)
  }

  /**
   * 模板切换事件
   * @param {{key: string}} param0 key 点击的key
   * @returns {null}
   */
  handleTempChange = ({ key }) => {
    const { currentData = {} } = this.state
    const { onSelect } = this.props
    if (currentData.id === key) return
    /** 获取点击的模板数据 */
    const current = this.state.tempList.find(item => item.id === key)
    if (current) {
      this.setState({
        currentData: current,
        treeData: this.forMateTreeData(current.contents)
      })
      onSelect && onSelect(current)
    }
  }

  render() {
    /** 树形属性和事件 */
    const treeProps = {
      /** 显示复选框 */
      checkable: true,
      /** 树型数据 */
      treeData: this.state.treeData,
      /** 选中节点 */
      onCheck: this.handleSelectTemp
    }
    /** 动画效果，如果打开模板树，就执行动画 */
    const containerInOrOut = this.state.showInfoTree
      ? 'animate__animated animate__fadeOutUp animate__faster'
      : 'animate__animated animate__fadeInDown animate__faster'
    return (
      <div className={`${styles.container} g_scrollbar_y`}>
        <Spin
          size="large"
          spinning={this.state.loading}
          tip="模板数据加载中"
          style={{ width: '100%', height: '100%' }}
        >
          {!this.state.showNoData && (
            <div className={`${styles.templist} ${containerInOrOut}`}>
              {this.state.tempList.map(item => {
                return (
                  <div
                    className={styles.templist_item}
                    key={item.id}
                    onClick={() => this.handleClickTemp(item)}
                  >
                    <div className={styles.templist_item_icon}>
                      <img src={folderIcon} alt="" width="100%" />
                    </div>
                    <div className={styles.templist_item_name}>{item.name}</div>
                  </div>
                )
              })}
            </div>
          )}

          {this.state.showNoData && <Empty description="暂无模板数据" />}

          {this.state.showInfoTree && (
            <div
              className={`${styles.tempInfo} animate__animated animate__fadeInUp animate__faster`}
            >
              <div
                className={styles.templist_item}
                key={this.state.currentData.id}
                style={{ paddingLeft: 10 }}
              >
                <div
                  className={`${globalStyles.authTheme} ${styles.backList}`}
                  onClick={this.handleBackList}
                >
                  &#xe7ec;
                </div>
                <div className={styles.templist_item_icon}>
                  <img src={folderIcon} alt="" width="100%" />
                </div>
                <Dropdown
                  trigger={['click']}
                  overlay={
                    <Menu
                      onClick={this.handleTempChange}
                      defaultSelectedKeys={[this.state.currentData.id]}
                      selectedKeys={[this.state.currentData.id]}
                    >
                      {this.state.tempList.map(item => {
                        return <Menu.Item key={item.id}>{item.name}</Menu.Item>
                      })}
                    </Menu>
                  }
                >
                  <div className={styles.templist_item_name}>
                    {this.state.currentData.name}
                    <span
                      className={globalStyles.authTheme}
                      style={{
                        fontSize: 12,
                        transform: 'rotate(90deg)',
                        display: 'inline-block',
                        marginLeft: 8
                      }}
                    >
                      &#xe61f;
                    </span>
                  </div>
                </Dropdown>
              </div>
              <div className={styles.treeable}>
                <Tree {...treeProps} />
              </div>
            </div>
          )}
        </Spin>
      </div>
    )
  }
}
