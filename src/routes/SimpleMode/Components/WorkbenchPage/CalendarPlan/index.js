import {
  Button,
  Calendar,
  Checkbox,
  Divider,
  Input,
  message,
  Popover,
  Radio,
  Select,
  Spin
} from 'antd'
import React from 'react'
import styles from './index.less'
import moment from 'moment'
import CalendarTempTree from './components/CalendarTempTree'
import {
  fetchCalendarData,
  getCalendarQueryParam
} from '../../../../../services/technological/calendarPlan'
import { connect } from 'dva'
import { WorkbenchModel } from '../../../../../models/technological/workbench'
import PropTypes from 'prop-types'
import { legendList, NodeType, TotalBoardKey } from './constans'
import globalStyles from '../../../../../globalset/css/globalClassName.less'
import { Fragment } from 'react'

/** 日历计划功能组件 */
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
export default class CalendarPlan extends React.Component {
  static propTypes = {
    /** 项目列表 */
    projectList: PropTypes.array,
    /** 选中的项目 */
    simplemodeCurrentProject: PropTypes.object
  }

  constructor(props) {
    super(props)
    /** 定义的年份mode */
    this.modeYear = 'year'
    /** 定义的月份mode */
    this.modeMonth = 'month'
    /** 最小的年份范围 */
    this.minYearNumber = 10
    /** 最大的年份范围 */
    this.maxYearNumber = 9
    this.state = {
      /** 更多事项的弹窗 */
      moreDataVisible: false,
      /** 日历模式 */
      mode: this.modeMonth,
      /** 设定的默认日历日期
       * @default moment moment数据
       */
      calendarValue: moment(),
      /** 选中的年 */
      selectedYear: moment().year(),
      /** 选中的月 */
      selectedMonth: moment().month() + 1,
      /** 选中的日 */
      selectedDay: moment().date(),

      /** 保存请求到的搜索条件 */
      queryParamsData: [],
      /** 里程碑子里程碑名称搜索 */
      queryName: '',
      /** 搜索条件
       * @default [x:string]:string[]
       */
      queryParams: {},
      /** 搜索的loading */
      searchLoading: false,
      /** 勾选的模板里程碑列表 */
      template_content_ids: null,
      /** 日历的数据 */
      calendar_data: [],
      /** 选中的模板id */
      template_id: ''
    }
    /** 月份列表 */
    this.monthList = (() =>
      new Array(12).fill(0).map((_, i) => {
        return {
          label: i + 1 + '月',
          key: i + 1
        }
      }))()
    /** 年份列表 */
    this.years = (() => {
      /** 当前年份 */
      const nowY = moment().year()
      /** 最小的年份 */
      const minY = nowY - this.minYearNumber
      /** 最大的年份 */
      const maxY = nowY + this.maxYearNumber
      /** 最小年份合集 */
      const minYears = []
      /** 最大年份合集 */
      const maxYears = []
      for (let index = nowY; index >= minY; index--) {
        minYears.unshift(index)
      }
      for (let index = nowY + 1; index <= maxY; index++) {
        maxYears.push(index)
      }
      return [...new Set([...minYears, ...maxYears])]
    })()

    /** 单元格的数据最大显示数量 */
    this.MaxCellDataLength = 2
  }

  componentDidMount() {
    this.fetchQueryParams()
    this.fetchQueryCalendarData()
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.simplemodeCurrentProject !== this.props.simplemodeCurrentProject
    ) {
      this.fetchQueryParams()
      if (!this.state.template_id) this.fetchQueryCalendarData()
      else this.backList()
    }
  }

  /** 日历切换事件
   * @param {moment.Moment} value 时间
   * @param {'month' | 'year'} mode 模式
   */
  onPanelChange = (value, mode) => {
    console.log(value, mode)
  }

  /** 添加一个0 */
  addZero = number => {
    return +number < 10 ? '0' + number : number
  }

  /** 点击了日期时间，更新选中的日历
   * @param {moment.Moment} date 选中的日历
   */
  handleDate = date => {
    const day = date.date()
    /** 保存上一个保存的月份 */
    const prevMonth = this.state.selectedMonth
    this.setState(
      {
        calendarValue: date,
        selectedYear: date.year(),
        selectedMonth: date.month() + 1,
        selectedDay: day
      },
      () => {
        /** 如果点击的日历跨了月份 */
        if (prevMonth !== date.month() + 1) {
          this.fetchQueryCalendarData()
        }
      }
    )
  }

  /** 日历模式切换
   * @param {Event} e
   */
  handleModeChange = e => {
    const value = e.target.value
    this.setState({
      mode: value
    })
  }

  /** 月份更新
   * @param {number} value 选择的月份
   */
  handleChangeMonth = value => {
    const timeString = `${this.state.selectedYear}${this.addZero(
      value
    )}${this.addZero(this.state.selectedDay)}`
    const date = moment(timeString, 'YYYYMMDD')
    this.setState(
      {
        calendarValue: date,
        selectedMonth: value
      },
      () => {
        this.fetchQueryCalendarData()
      }
    )
  }

  /** 年份更新
   * @param {number} value 选择的年份
   */
  handleChangeYear = value => {
    const timeString = `${value}${this.addZero(
      this.state.selectedMonth
    )}${this.addZero(this.state.selectedDay)}`
    const date = moment(timeString, 'YYYYMMDD')
    this.setState(
      {
        calendarValue: date,
        selectedYear: value
      },
      () => {
        this.fetchQueryCalendarData()
      }
    )
  }

  /** 获取选中的项目id
   * @returns {?string[]}
   */
  getSelectedBoardIds = () => {
    const { projectList, simplemodeCurrentProject } = this.props
    /** 选中项目的id */
    const currentProjectId = simplemodeCurrentProject
      ? simplemodeCurrentProject.board_id || TotalBoardKey
      : TotalBoardKey
    if (currentProjectId === TotalBoardKey) {
      return (projectList || []).map(item => item.board_id)
    } else {
      /** 选择的项目id */
      return currentProjectId ? [currentProjectId] : null
    }
  }

  /**
   * 获取日历的搜索条件
   */
  fetchQueryParams = () => {
    /** 获取到的项目id */
    let boardIds = this.getSelectedBoardIds()
    if (boardIds) {
      boardIds = typeof boardIds === 'string' ? [boardIds] : boardIds
    } else return

    getCalendarQueryParam({ board_ids: boardIds.join(',') })
      .then(res => {
        this.setState({
          /** 保存请求回来的查询条件 */
          queryParamsData: res.data
        })
      })
      .catch(err => message.warn(err.message))
  }

  /**
   * 搜索条件更新
   * @param {string} query_key 搜索的key，select的id
   * @param {string} val 所选的值 select.option.value
   */
  handleChangeQueryParam = (query_key, val) => {
    this.setState({
      queryParams: {
        ...this.state.queryParams,
        [query_key]: val
      }
    })
  }

  /** 全选查询条件的方法
   * @param {Event} e 事件
   * @param {{id: string, name: string, items: object[]}} option 选中的整个查询对象
   */
  setAllCheck = (e, option) => {
    /** 是否全选 */
    const chekced = e.target.checked
    /** 将子集全部选中 */
    const selectedIds = (option.items || []).map(item => item.id)
    this.setState({
      queryParams: {
        ...this.state.queryParams,
        [option.id]: chekced ? selectedIds : []
      }
    })
  }

  /** 获取日历的数据， */
  fetchQueryCalendarData = () => {
    this.setState({
      searchLoading: true
    })
    const params = {
      board_ids: this.getSelectedBoardIds(),
      year: this.state.selectedYear,
      month: this.state.selectedMonth,
      template_content_ids: this.state.template_content_ids
        ? this.state.template_content_ids.length
          ? this.state.template_content_ids
          : null
        : null,
      name: this.state.queryName,
      template_id: this.state.template_id,
      items: Object.keys(this.state.queryParams).length
        ? this.state.queryParams
        : null
    }
    fetchCalendarData(params)
      .then(res => {
        this.setState({
          searchLoading: false,
          calendar_data: res.data
        })
      })
      .catch(err => {
        message.warn(err.message)
        this.setState({
          searchLoading: false
        })
      })
  }

  /**
   * 重置搜索条件
   */
  handleResetQueryParams = () => {
    this.setState(
      {
        queryParams: {},
        queryName: ''
      },
      () => {
        /** 重新走一遍查询 */
        this.fetchQueryCalendarData()
      }
    )
  }

  /**
   * 勾选了里程碑id
   * @param {string[]} ids 勾选的里程碑id列表
   */
  handleChangeTemplateList = ids => {
    this.setState({
      template_content_ids: ids
    })
  }

  /**
   * 根据id来查找项目信息
   * @param {string} board_id 需要查找的项目id
   * @returns {{board_id: string, board_name: string}}
   */
  getBoardByBoardId = board_id => {
    const { projectList = [] } = this.props
    if (!board_id || !projectList.length) return null
    for (let i = 0; i < projectList.length; i++) {
      const item = projectList[i]
      if (item.board_id === board_id) {
        return item
      }
    }
    return null
  }

  /** 渲染更多事项的列表
   * @param {object[]} datas 当前单元格的数据列表
   * @returns {React.ReactNode}
   */
  renderMoreDatas = (datas = []) => {
    return (
      <div className={styles.popcontent}>
        <div className={styles.popcontent_header}>
          <span>
            {this.state.calendarValue
              ? this.state.calendarValue.format('MMM D ddd')
              : ''}
          </span>
          <span
            className={`${globalStyles.authTheme} ${styles.popclose}`}
            onClick={() =>
              this.setState({
                moreDataVisible: false
              })
            }
          >
            &#xe816;
          </span>
        </div>
        {datas.map(item => {
          return (
            <div className={styles.popcontent_item} key={item.id}>
              {this.renderDataItem(item)}
            </div>
          )
        })}
      </div>
    )
  }

  /**
   * 追加数据到日期单元格
   * @param {moment.Moment} date 日期时间
   * @returns {?React.ReactNode}
   */
  dateCellRender = date => {
    const { calendar_data = [] } = this.state
    /** 拥有数据的日期 */
    const hasDataDate = calendar_data.find(
      item =>
        date.format('l') ===
        moment(+((item.endTime || item.end_time) + '000')).format('l')
    )
    /** 相同时间的数据，用来限制显示 */
    const sameDateTime = {}
    return (
      <Fragment>
        {calendar_data.map(item => {
          /** 此日期是否有合适的数据 */
          const isSameDate =
            date.format('l') ===
            moment(+((item.endTime || item.end_time) + '000')).format('l')
          /** 当前日期无符合的数据 */
          if (!isSameDate) return null

          /** 存储日期中的数据数量 */
          if (!sameDateTime[item.end_time || item.endTime]) {
            sameDateTime[item.endTime || item.end_time] = []
          }
          sameDateTime[item.end_time || item.endTime].push(item)

          /** 当前日期存在多少个数据 */
          const tempLength = sameDateTime[item.end_time || item.endTime].length
          /** 如果超过最大显示数量 */
          if (tempLength <= this.MaxCellDataLength)
            /** 渲染显示的元素 */
            return this.renderDataItem(item)
          else if (tempLength > this.MaxCellDataLength) return null
        })}
        {hasDataDate &&
          (sameDateTime[hasDataDate.end_time] || []).length >
            this.MaxCellDataLength && (
            <Popover
              trigger="click"
              overlayClassName={styles.moreOverlay}
              content={this.renderMoreDatas(sameDateTime[hasDataDate.end_time])}
              visible={this.state.moreDataVisible}
              onVisibleChange={visible =>
                this.setState({ moreDataVisible: visible })
              }
            >
              <div className={styles.more_datas}>
                更多
                {(sameDateTime[hasDataDate.end_time] || []).length -
                  this.MaxCellDataLength}
                个事项
              </div>
            </Popover>
          )}
      </Fragment>
    )
  }

  /**
   * 选中了一个里程碑数据
   * @param {{id: strintg, name: string,board_id: string, list_names: string[], type: string}} data
   */
  handleDataOfDate = data => {
    console.log(data)
    /** 用来打开里程碑详情 */
  }

  /**
   * 渲染单个单元格的数据节点
   * @param {{id: strintg, name: string,board_id: string, list_names: string[], type: string}} item 单个节点的数据
   * @returns {React.ReactNode}
   */
  renderDataItem = item => {
    /** 是否里程碑 */
    const isMilestoneType =
      item.type === NodeType.milestonetype && item.is_parent
    /** 是否子里程碑 */
    const isSubMilestoneType =
      item.type === NodeType.milestonetype && !item.is_parent
    /** 是否任务 */
    const isCardType = false

    /** 是否多项目 */
    const isMultipleBoard =
      (this.getBoardByBoardId() || []).length > 1 ||
      this.props.simplemodeCurrentProject.board_id === TotalBoardKey
    /** 获取到项目名称 */
    const Board = this.getBoardByBoardId(item.board_id)
    return (
      <div
        className={styles.celldate_container}
        onClick={() => this.handleDataOfDate(item)}
      >
        <div className={`${globalStyles.authTheme} ${styles.date_celltype}`}>
          {isMilestoneType && (
            <span
              style={{ color: legendList.milestone.color }}
              dangerouslySetInnerHTML={{ __html: legendList.milestone.icon }}
            ></span>
          )}
          {isSubMilestoneType && (
            <span
              style={{ color: legendList.submilestone.color }}
              dangerouslySetInnerHTML={{ __html: legendList.submilestone.icon }}
            ></span>
          )}
          {isCardType && (
            <span
              style={{ color: legendList.card.color }}
              dangerouslySetInnerHTML={{ __html: legendList.card.icon }}
            ></span>
          )}
        </div>
        <div className={styles.date_content}>
          <div className={styles.celldate_title}>{item.name}</div>
          <div className={styles.subcelldate_title}>
            {isMultipleBoard
              ? `#${Board.board_name}`
              : (item.list_names || []).length
              ? `@${(item.list_names || []).join('/')}`
              : ''}
          </div>
        </div>
      </div>
    )
  }

  /** 从详情中返回列表 */
  backList = () => {
    this.setState(
      {
        template_content_ids: null,
        template_id: null
      },
      () => {
        this.fetchQueryCalendarData()
      }
    )
  }

  /** 选中了一个模板
   * @param {{id: string, name: string, template_type: string, contens: object[]}} 选中的模板
   */
  selectTemp = temp => {
    this.setState(
      {
        template_id: temp.id
      },
      () => {
        this.fetchQueryCalendarData()
      }
    )
  }

  /** 渲染图例 */
  renderLegend = (<div className={styles.legend_box}></div>)

  render() {
    const { workbenchBoxContent_height } = this.props
    const { Search } = Input
    return (
      <div
        className={styles.container}
        style={{ height: workbenchBoxContent_height }}
      >
        <div className={styles.heander_search}>
          <div className={styles.serach_forms}>
            {this.state.queryParamsData.map(item => {
              return (
                <Select
                  mode="multiple"
                  maxTagCount={2}
                  key={item.id}
                  placeholder={item.name}
                  style={{ width: 230, marginLeft: 10 }}
                  onChange={val => this.handleChangeQueryParam(item.id, val)}
                  value={this.state.queryParams[item.id] || []}
                  optionLabelProp="title"
                  dropdownRender={menu => (
                    <div>
                      {menu}
                      <Divider style={{ margin: '2px 0' }} />
                      <div
                        style={{
                          padding: '4px 8px 8px 8px',
                          cursor: 'pointer'
                        }}
                        onMouseDown={e => e.preventDefault()}
                      >
                        <Checkbox
                          checked={
                            (this.state.queryParams[item.id] || []).length ===
                              (item.items || []).length &&
                            (item.items || []).length > 0
                          }
                          onChange={e => this.setAllCheck(e, item)}
                          indeterminate={
                            !!(this.state.queryParams[item.id] || []).length &&
                            (this.state.queryParams[item.id] || []).length <
                              (item.items || []).length
                          }
                        >
                          全选
                        </Checkbox>
                      </div>
                    </div>
                  )}
                >
                  {(options =>
                    options.map(option => {
                      return (
                        <Select.Option
                          value={option.id}
                          key={option.id}
                          title={option.value}
                        >
                          <div>
                            {option.value}
                            {option.board_name && (
                              <div className={styles.selection_subtitle}>
                                #{option.board_name}
                              </div>
                            )}
                          </div>
                        </Select.Option>
                      )
                    }))(item.items || [])}
                </Select>
              )
            })}
            <Search
              value={this.state.queryName}
              onChange={val =>
                this.setState({
                  queryName: val.target.value
                })
              }
              placeholder="搜索里程碑、子里程碑名称"
              style={{ width: 300, marginLeft: 10 }}
              enterButton={
                <Button
                  type="primary"
                  icon="search"
                  loading={this.state.searchLoading}
                />
              }
              onSearch={this.fetchQueryCalendarData}
            />
            <Button
              type="default"
              style={{ marginLeft: 10 }}
              onClick={this.handleResetQueryParams}
            >
              重置
            </Button>
          </div>
          <div className={styles.calendarSelection}>
            <Popover trigger="click" content={<div></div>}>
              <span className={`${styles.legend} ${globalStyles.authTheme}`}>
                &#xe862;
              </span>
            </Popover>
            <Select
              defaultValue={this.state.selectedYear}
              style={{ marginRight: 10 }}
              value={this.state.selectedYear}
              onChange={this.handleChangeYear}
            >
              {this.years.map(item => {
                return (
                  <Select.Option key={item} value={item}>
                    {item}年
                  </Select.Option>
                )
              })}
            </Select>
            <Select
              defaultValue={this.state.selectedMonth}
              style={{ marginRight: 10 }}
              value={this.state.selectedMonth}
              onChange={this.handleChangeMonth}
            >
              {this.monthList.map(item => {
                return (
                  <Select.Option value={item.key} key={item.key}>
                    {item.label}
                  </Select.Option>
                )
              })}
            </Select>
            <Radio.Group
              value={this.state.mode}
              onChange={this.handleModeChange}
            >
              <Radio.Button value={this.modeMonth}>月</Radio.Button>
              <Radio.Button value={this.modeYear}>年</Radio.Button>
            </Radio.Group>
          </div>
        </div>
        <div className={styles.content}>
          <div className={styles.content_left_tree}>
            <CalendarTempTree
              onChange={this.handleChangeTemplateList}
              onBack={this.backList}
              onSelect={this.selectTemp}
            />
          </div>
          <div className={styles.content_calendar}>
            {!this.state.searchLoading ? (
              <Calendar
                className={styles.calendar}
                onPanelChange={this.onPanelChange}
                mode={this.state.mode}
                value={this.state.calendarValue}
                onSelect={this.handleDate}
                dateCellRender={this.dateCellRender}
              />
            ) : (
              <Spin spinning={true}>
                <div className={styles.loadingPage}></div>
              </Spin>
            )}
          </div>
        </div>
      </div>
    )
  }
}
