import React, { Component } from 'react'
import { connect } from 'dva'
import indexStyles from './index.less'
import globalStyles from '@/globalset/css/globalClassName.less'
import HistogramComponent from './components/HistogramComponent'
import BarDiagramentComponent from './components/BarDiagramentComponent'
import PieComponent from './components/PieComponent'
import LineComponent from './components/LineComponent'
import PieEarlyWarningComponent from './components/PieEarlyWarningComponent'
import { currentNounPlanFilterName } from '../../../../../utils/businessFunction'
import { PROJECTS } from '../../../../../globalset/js/constant'
import FunnelComponent from './components/FunnelComponent'
import { Dropdown, Menu } from 'antd'
import { removeEmptyArrayEle } from '../../../../../utils/util'
@connect(mapStateToProps)
export default class index extends Component {
  state = {
    data: [
      {
        board_id: '1111',
        board_name: '我的天'
      },
      {
        board_id: '2222',
        board_name: '24HRS'
      },
      {
        board_id: '3333',
        board_name: '很长很长很长很长很长很长很长很长的项目名'
      }
    ]
  }

  updateSelectKeys = (props = {}) => {
    const { simplemodeCurrentProject = {}, projectList = [] } = props
    let board_ids = []
    if (simplemodeCurrentProject.board_id == '0') {
      projectList.map(item => {
        board_ids.push(item.board_id)
      })
    } else {
      board_ids.push(simplemodeCurrentProject.board_id)
    }
    this.setState({
      selectedKeys: board_ids
    })
  }

  componentDidMount() {
    this.updateSelectKeys(this.props)
  }

  componentWillReceiveProps(nextProps) {
    const { board_id } = this.props.simplemodeCurrentProject
    const { board_id: next_board_id } = nextProps.simplemodeCurrentProject
    if (board_id != next_board_id) {
      this.updateSelectKeys(nextProps)
    }
  }

  onVisibleChange = visible => {
    this.setState({
      dropdownVisible: visible
    })
  }

  handleSelectAllOrCancel = () => {
    const { selectedKeys = [] } = this.state
    const { projectList = [] } = this.props
    let board_ids = []
    if (selectedKeys.length == projectList.length) {
      board_ids = []
    } else {
      projectList.map(i => {
        board_ids.push(i.board_id)
      })
      board_ids = removeEmptyArrayEle(board_ids)
    }
    this.setState({
      selectedKeys: board_ids
    })
  }

  handleSelect = e => {
    const { domEvent, key, selectedKeys = [] } = e
    domEvent && domEvent.stopPropagation()
    if (key == 'select_all') {
      this.handleSelectAllOrCancel()
      return
    }
    this.setState({
      selectedKeys
    })
  }

  handleDeSelect = e => {
    const { domEvent, key, selectedKeys = [] } = e
    domEvent && domEvent.stopPropagation()
    if (key == 'select_all') {
      this.handleSelectAllOrCancel()
      return
    }
    this.setState({
      selectedKeys
    })
  }

  // 渲染title
  renderTitle = () => {
    const {
      simplemodeCurrentProject: { board_id, board_name }
    } = this.props
    let title_dec = '我的报表'
    if (!!board_id && board_id != '0') {
      title_dec = `${
        !!board_id && board_id != '0' ? board_name || '' : ''
      } ${currentNounPlanFilterName(PROJECTS)} 统计报表`
    }
    return title_dec
  }

  renderMenu = () => {
    const { data = [], selectedKeys = [] } = this.state
    const { projectList = [] } = this.props
    return (
      <Menu
        multiple={true}
        onSelect={this.handleSelect}
        onDeselect={this.handleDeSelect}
        selectable={true}
        className={indexStyles.chart_overlay_funnel}
        selectedKeys={selectedKeys}
        onClick={({ domEvent }) => domEvent && domEvent.stopPropagation()}
      >
        <Menu.Item key="select_all">
          <div className={indexStyles.chart_overlay_item}>
            <span>全选</span>
            <span
              className={`${globalStyles.authTheme} ${indexStyles.chart_overlay_check}`}
              style={{
                display: projectList.length == selectedKeys.length && 'block'
              }}
            >
              &#xe7fc;
            </span>
          </div>
        </Menu.Item>
        <Menu.Divider />
        {projectList.map(item => {
          return (
            <Menu.Item key={item.board_id}>
              <div
                title={item.board_name}
                className={indexStyles.chart_overlay_item}
              >
                <span>{item.board_name}</span>
                <span
                  className={`${globalStyles.authTheme} ${indexStyles.chart_overlay_check}`}
                  style={{
                    display:
                      selectedKeys.indexOf(item.board_id) != -1 && 'block'
                  }}
                >
                  &#xe7fc;
                </span>
              </div>
            </Menu.Item>
          )
        })}
      </Menu>
    )
  }

  render() {
    const {
      workbenchBoxContent_height,
      workbenchBoxContentWapperModalStyle = {},
      simplemodeCurrentProject = {}
    } = this.props
    let chart_item_width =
      workbenchBoxContentWapperModalStyle.width == '100%'
        ? document.body.clientWidth / 2 - 80
        : parseInt(workbenchBoxContentWapperModalStyle.width) / 2 - 80
    const { dropdownVisible } = this.state
    return (
      <div
        id={'statisticalReportContainer'}
        className={`${globalStyles.global_vertical_scrollbar} ${indexStyles.statisticalReportContainer}`}
        style={{
          height: workbenchBoxContent_height,
          // width: workbenchBoxContentWapperModalStyle.width
          width: '100%',
          overflowY: 'auto'
        }}
      >
        <div
          className={`${globalStyles.global_vertical_scrollbar}`}
          style={{
            // backgroundColor: '#fff',
            padding: '27px 38px',
            // height: '100%',
            borderRadius: '4px',
            minHeight: workbenchBoxContent_height,
            paddingBottom: '24px'
            // overflowY: 'auto'
          }}
        >
          <div className={indexStyles.chart_title}>{this.renderTitle()}</div>
          {simplemodeCurrentProject.board_id != '0' &&
            !!simplemodeCurrentProject.board_id && (
              <div
                className={indexStyles.chart_content_1}
                style={{ marginBottom: '24px' }}
              >
                <PieEarlyWarningComponent />
              </div>
            )}
          <div className={indexStyles.chart_content}>
            <div
              className={indexStyles.chart_item}
              style={{ width: chart_item_width }}
            >
              <div className={indexStyles.chart_item_top}>
                <div className={indexStyles.chart_item_t_left}>工时统计</div>
              </div>
              {/* 柱状图 */}
              <div className={indexStyles.chart_item_bottom}>
                <HistogramComponent width={chart_item_width} />
              </div>
            </div>
            <div
              className={indexStyles.chart_item}
              style={{ width: chart_item_width, marginRight: 0 }}
            >
              <div className={indexStyles.chart_item_top}>
                <div className={indexStyles.chart_item_t_left}>任务数统计</div>
              </div>
              {/* 条形图 */}
              <div className={indexStyles.chart_item_bottom}>
                <BarDiagramentComponent width={chart_item_width} />
              </div>
            </div>
            <div
              className={indexStyles.chart_item}
              style={{ width: chart_item_width }}
            >
              <div className={indexStyles.chart_item_top}>
                <div className={indexStyles.chart_item_t_left}>项目状态</div>
              </div>
              {/* 条形图 */}
              <div className={indexStyles.chart_item_bottom}>
                <PieComponent width={chart_item_width} />
              </div>
            </div>
            <div
              className={indexStyles.chart_item}
              style={{ width: chart_item_width, marginRight: 0 }}
            >
              <div className={indexStyles.chart_item_top}>
                <div className={indexStyles.chart_item_t_left}>
                  新增项目数{' '}
                  <span className={indexStyles.chart_item_t_left_date}>
                    (每月)
                  </span>
                </div>
              </div>
              {/* 条形图 */}
              <div className={indexStyles.chart_item_bottom}>
                <LineComponent width={chart_item_width} />
              </div>
            </div>
            <div
              className={indexStyles.chart_item}
              style={{ width: chart_item_width }}
            >
              <div className={indexStyles.chart_item_top}>
                <div className={indexStyles.chart_item_t_left}>新增项目数</div>
              </div>
              {/* 条形图 */}
              <div className={indexStyles.chart_item_bottom}>
                <FunnelComponent
                  selectedKeys={this.state.selectedKeys}
                  width={chart_item_width}
                />
              </div>
              <div className={indexStyles.chart_item_d_menu}>
                <Dropdown
                  getPopupContainer={triggerNode => triggerNode.parentNode}
                  overlay={this.renderMenu()}
                  trigger={['click']}
                  overlayStyle={{ maxWidth: '200px', width: '200px' }}
                  visible={dropdownVisible}
                  onVisibleChange={this.onVisibleChange}
                >
                  <span
                    style={{ fontSize: 18, fontWeight: 500, color: '#000' }}
                    className={globalStyles.authTheme}
                  >
                    &#xe60a; 选择项目 &#xe7ee;
                  </span>
                </Dropdown>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps({
  simplemode: {
    workbenchBoxContentWapperModalStyle = {},
    simplemodeCurrentProject = {}
  },
  workbench: {
    datas: { projectList = [] }
  }
}) {
  return {
    workbenchBoxContentWapperModalStyle,
    simplemodeCurrentProject,
    projectList
  }
}
