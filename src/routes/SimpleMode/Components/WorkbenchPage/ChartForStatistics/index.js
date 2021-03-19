import {
  Select,
  Tag,
  Divider,
  Button,
  Checkbox,
  message,
  notification,
  Popover
} from 'antd'
import React from 'react'
import styles from './index.less'
import {
  ALLBOARD,
  BOARDQRCODE,
  CARDQRCODE,
  DefaultFilterConditions
} from './constans'
import ChartBox from './components/ChartBox'
import PieProject from './components/PieProject'
import FunnlProject from './components/FunnelProject'
import { connect } from 'dva'
import BoardTable from './components/BoardTable'
import {
  getBoardStatistical,
  getChartQrcode,
  getTaskStatistical
} from '../../../../../services/technological/statisticalReport'
import { getProjectUserList } from '../../../../../services/technological/workbench'
import LineChartProject from './components/LineChartProject'
import PieTask from './components/PieTask'
import TaskTable from './components/TaskTable'
import ChartWorkTime from './components/ChartWorkTime'
import ChartTaskNumber from './components/ChartNumber'
import queryString from 'query-string'
import { isApiResponseOk } from '../../../../../utils/handleResponseData'

@connect(({ simplemode: { simplemodeCurrentProject } }) => ({
  simplemodeCurrentProject
}))
export default class ChartForStatistics extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      /**
       * 是否多个项目统计
       */
      isMultipleBoardSearch: false,
      /**
       * 任务数
       */
      card_count: 0,
      /**
       * 项目数
       */
      board_count: 0,
      /**
       * 二维码地址
       */
      qrcode_img: '',
      /**
       * 所有项目列表
       */
      projects: [],
      /**
       * 选中列表
       */
      selected: [],
      /**
       * 是否全选了
       */
      isCheckedAll: false,
      /**
       * 获取到的阶段分布数据
       */
      board_stage: {
        count: [],
        status: []
      },
      board_start_time: {
        number: [],
        time: []
      },
      /**
       * 状态分布数据
       */
      board_status: {
        /**
         * data 数据
         */
        count: [],
        /**
         * tooltip的数据
         */
        status: []
      },
      /**
       * 任务状态分布
       */
      card_status: {
        /**
         * data 数据
         */
        count: [],
        /**
         * tooltip的数据
         */
        status: []
      },
      /**
       * 任务数量分布
       */
      card_number: {
        legend: [],
        series: [],
        user_ids: [],
        users: []
      },
      /**
       * 任务列表
       */
      items: [],
      /**
       * 任务工时分布
       */
      card_working_hour: {
        legend: [],
        series: [],
        user_ids: [],
        users: []
      },
      /**
       * 项目列表数据
       */
      boards: [],
      /**
       * 用于显示的表格数据
       */
      filter_boards: [],
      /**
       * 用于显示任务列表
       */
      filter_tasks: [],
      /**
       * 用于过滤的字段
       */
      filter_params: {
        querys: [],
        /**
         * 状态分布的查询数据
         */
        [DefaultFilterConditions.STATUS.chartKey]: {},
        /**
         * 阶段分布的查询数据
         */
        [DefaultFilterConditions.STEPS.chartKey]: {},
        /**
         * 时间分布的查询数据
         */
        [DefaultFilterConditions.TIME.chartKey]: {}
      },
      /**
       * 任务统计过滤
       */
      card_filter: {
        /**
         * 任务状态分布查询数据
         */
        [DefaultFilterConditions.CARD_STATUS.chartKey]: {},
        /**
         * 任务工时分布查询数据
         */
        [DefaultFilterConditions.CARD_TIME.chartKey]: {},
        /**
         * 任务数量分布查询数据
         */
        [DefaultFilterConditions.CARD_NUMBER.chartKey]: {}
      }
    }
  }

  componentDidMount() {
    this.getBoardList()
  }

  componentDidUpdate(nextProps) {
    const { simplemodeCurrentProject } = nextProps
    if (
      this.props.simplemodeCurrentProject?.board_id !==
      simplemodeCurrentProject?.board_id
    ) {
      this.getBoardList()
    }
  }
  /**
   * 清除搜索条件
   */
  clearQueryParam = () => {
    this.setState({
      /**
       * 用于过滤的字段
       */
      filter_params: {
        querys: [],
        /**
         * 状态分布的查询数据
         */
        [DefaultFilterConditions.STATUS.chartKey]: {},
        /**
         * 阶段分布的查询数据
         */
        [DefaultFilterConditions.STEPS.chartKey]: {},
        /**
         * 时间分布的查询数据
         */
        [DefaultFilterConditions.TIME.chartKey]: {}
      }
    })
  }

  /**
   * 获取所有项目的id
   * @param {*} data
   * @returns Array<string> board_ids
   */
  getAllBoardId = (data = []) => {
    return data.map(item => item.board_id)
  }
  /**
   * 获取项目列表
   */
  getBoardList = _ => {
    const { simplemodeCurrentProject } = this.props
    const id = simplemodeCurrentProject.board_id || '0'
    getProjectUserList()
      .then(res => {
        if (isApiResponseOk(res)) {
          // 保存项目列表
          this.setState(
            {
              projects: res.data || [],
              selected:
                id === ALLBOARD ? this.getAllBoardId(res.data || []) : [id],
              isCheckedAll: id === ALLBOARD
            },
            () => {
              this.getData()
            }
          )
        } else {
          this.errorInit()
        }
        return res
      })
      .catch(err => {
        this.errorInit()
      })
  }

  /**
   * 初始化失败的提示
   */
  errorInit = () => {
    notification.warn({
      message: '请求错误',
      description: (
        <span>
          获取项目列表失败, <a onClick={() => this.getBoardList()}>点击重试</a>
        </span>
      )
    })
  }
  /**
   * 获取选中的项目id
   * @returns string 1,2,3
   */
  getSelectedBoardIds = () => {
    const { selected } = this.state
    return (selected || []).join(',')
  }
  /**
   * 获取数据
   */
  getData = () => {
    getBoardStatistical({ board_ids: this.getSelectedBoardIds() }).then(res => {
      // console.log(res)
      this.clearQueryParam()
      this.setState({
        ...res.data,
        /**
         * 用于渲染列表的过滤数据
         */
        filter_boards: res.data?.boards,
        /**
         * 用于显示项目数量
         */
        board_count: res.data?.boards.length,
        isMultipleBoardSearch: this.state.selected.length > 1
      })
    })

    this.fetchCardStatistical()
  }
  /**
   * 获取任务数据列表
   */
  fetchCardStatistical = ids => {
    getTaskStatistical({ board_ids: ids || this.getSelectedBoardIds() }).then(
      res => {
        this.setState({
          ...res.data,
          filter_tasks: this.setTableData(res.data?.items),
          card_count: res.data?.card_status.total || 0,
          card_filter: this.clearCardFilter()
        })
      }
    )
  }

  /**
   * 选中项目
   * @param {*} val
   */
  handleSelectBoard = val => {
    this.setState({
      selected: val,
      isCheckedAll: val.length === this.state.projects.length
    })
  }

  /**
   * 是否全选项目
   * @param {object} val
   */
  handleSelectedAll = val => {
    /**
     * 是否全选
     */
    const flag = val.target.checked
    if (flag) {
      const ids = this.getAllBoardId(this.state.projects)
      this.setState({
        isCheckedAll: true,
        selected: ids
      })
    } else
      this.setState({
        isCheckedAll: false,
        selected: []
      })
  }

  /**
   * 更新项目统计数据
   * @param {*} data
   */
  updateBoardsForEcharts = (data = []) => {
    this.filterPie(data)
    this.filterFunnel(data)
    this.filterLine(data)
  }

  /**
   * 更新项目统计饼图
   * @param {*} data
   */
  filterPie = (data = []) => {
    const { STATUS } = DefaultFilterConditions
    const { board_status } = this.state
    const obj = {}
    data.forEach(item => {
      if (!obj[item[STATUS.filterKey]]) {
        obj[item[STATUS.filterKey]] = []
      }
      obj[item[STATUS.filterKey]].push(item)
    })
    let current = []
    board_status.status.forEach(item => {
      if (obj[item]) {
        current.push(obj[item].length)
      } else current.push(0)
    })
    this.setState({
      board_status: {
        ...board_status,
        count: current
      }
    })
  }
  /**
   * 更新项目统计漏斗图
   */
  filterFunnel = (data = []) => {
    const { STEPS } = DefaultFilterConditions
    const { board_stage } = this.state
    let current = new Array(board_stage.status.length).fill(0)
    data.forEach(item => {
      if (item[STEPS.filterKey]) {
        board_stage.status.forEach((stat, index) => {
          // 如果数据中的列表包含了预设的值，则数据自增
          if (item[STEPS.filterKey].includes(stat)) {
            current[index] += 1
          }
        })
      }
    })
    this.setState({
      board_stage: {
        ...board_stage,
        count: current
      }
    })
  }

  /**
   * 更新项目统计折线图
   */
  filterLine = (data = []) => {
    const { TIME } = DefaultFilterConditions
    const { board_start_time } = this.state
    let current = new Array(board_start_time.time.length).fill(0)
    data.forEach(item => {
      const create_time = item[TIME.filterKey]
      const date = new Date(+(create_time + '000'))
      const y = date.getFullYear()
      const m = date.getMonth() + 1
      board_start_time.time.forEach((time, index) => {
        const t = time.split('-')
        const year = +t[0]
        const month = +t[1]
        if (year === y && m === month) {
          current[index] += 1
        }
      })
    })
    this.setState({
      board_start_time: {
        ...board_start_time,
        number: [...current]
      }
    })
  }

  /**
   * 点击确定，查询数据
   */
  handleQuery = () => {
    if (!this.state.selected.length) {
      notification.warn({
        message: '提示',
        description: '请选择一个或多个项目生成统计图表'
      })
      return
    }

    this.getData()
  }

  /**
   * 图表被点击的回调
   * @param {string} type 类型 Pie | Funnel ...
   */
  handleFilterQuery = (type, data) => {
    // console.log(type, data)
    let { filter_params } = this.state
    /**
     * 查询的条件，显示值
     */
    const addKey = data.name

    // 不存在就赋值
    /**
     * 用来判定是否第二次点击，因为第二次点击要去除查询条件
     */
    let isAdd = false
    /**
     * 查询条件列表 [{name: '进行中', type: 'Pie',...}]
     */
    let querys = [...filter_params.querys]
    if (querys.find(item => item.name === addKey && item.type === type)) {
      isAdd = true
      filter_params.querys = querys.filter(item => item.type !== type)
      filter_params[type] = {}
    } else {
      let flag = false
      isAdd = false
      // 查询是否有这个图表的查询字段，有的话就替换，没有就添加
      filter_params.querys = filter_params.querys.map(item => {
        if (item.type === type) {
          flag = true
          return { ...item, name: addKey, key: '' }
        }
        return item
      })
      // 没有，就添加
      if (!flag)
        filter_params.querys.push({
          type,
          name: addKey,
          key: ''
        })
    }

    switch (type) {
      /**
       * 如果是饼图
       */
      case DefaultFilterConditions.STATUS.chartKey:
        // 如果存在选中条件，就添加选中样式
        if (!isAdd)
          filter_params[type] = {
            ...data,
            // 设置选中样式
            itemStyle: DefaultFilterConditions.STATUS.itemStyle
          }
        break
      case DefaultFilterConditions.STEPS.chartKey:
        // 更新
        if (!isAdd)
          filter_params[type] = {
            ...data,
            // 设置选中样式
            itemStyle: DefaultFilterConditions.STEPS.itemStyle || {}
          }
        break
      case DefaultFilterConditions.TIME.chartKey:
        // 更新
        if (!isAdd)
          filter_params[type] = {
            ...data,
            // 设置选中样式
            itemStyle: DefaultFilterConditions.TIME.itemStyle || {},
            symbol: DefaultFilterConditions.TIME.symbol,
            symbolSize: DefaultFilterConditions.TIME.symbolSize
          }
        break
      default:
        break
    }
    this.setState(
      {
        filter_params: { ...filter_params }
      },
      () => {
        this.updateFilterBoards()
      }
    )
  }

  /**
   * 点击隐藏，显示表格
   */
  handleToggleOpen = () => {}

  /**
   * 更新项目表格列表
   */
  updateFilterBoards = () => {
    const { filter_params, boards } = this.state
    const { STATUS, STEPS, TIME } = DefaultFilterConditions
    let arr = [...boards]
    if (filter_params.querys.length) {
      const querys = filter_params.querys || []
      const StatusQuery = querys.find(item => item.type === STATUS.chartKey)
      const StepQuery = querys.find(item => item.type === STEPS.chartKey)
      const TimeQuery = querys.find(item => item.type === TIME.chartKey)
      if (StatusQuery) {
        // 如果是状态分布过滤
        arr = arr.filter(item => item[STATUS.filterKey] === StatusQuery.name)
      }
      if (StepQuery) {
        // 如果是阶段分布过滤
        arr = arr.filter(item =>
          (item[STEPS.filterKey] || []).includes(StepQuery.name)
        )
      }
      if (TimeQuery) {
        // 如果是时间分布过滤
        const split = TimeQuery.name.split('-')
        const year = split[0]
        const month = split[1]
        arr = arr.filter(item => {
          const time = item[TIME.filterKey] + '000'
          const date = new Date(+time)
          const y = date.getFullYear()
          const m = date.getMonth() + 1
          return +year === y && +month === m
        })
      }
      this.setState({
        filter_boards: arr
      })
      this.updateBoardsForEcharts(arr)
      this.updateTaskFilter(arr)
    } else {
      // 没有过滤项，直接恢复原来的数据
      this.setState({
        filter_boards: [...boards]
      })
      this.updateBoardsForEcharts([...boards])
      this.updateTaskFilter([...boards])
    }
    /**
     * 更新项目数量
     */
    this.setState({
      board_count: arr.length
    })
  }

  /**
   * 移除查询条件
   */
  removeQueryParam = val => {
    const { filter_params } = this.state
    filter_params.querys = filter_params.querys.filter(
      item => item.type !== val.type
    )
    filter_params[val.type] = {}
    this.setState(
      {
        filter_params: { ...filter_params }
      },
      () => {
        this.updateFilterBoards()
      }
    )
    // 更新列表
  }

  /**
   * 过滤children字段空数组
   * @param {*} arr
   * @returns
   */
  setTableData = (arr = []) => {
    return arr.map(item => {
      let new_item = { ...item }
      new_item.key = item.id
      if (new_item.children && new_item.children.length == 0)
        delete new_item.children
      if (new_item.children && !!new_item.children.length) {
        new_item.children = this.setTableData(new_item.children)
      }
      return new_item
    })
  }
  /**
   * 获取报表的小程序二维码
   * @param type "board_statistic" | "card_statistic"
   */
  getQrcode = (type = BOARDQRCODE) => {
    const { filter_params, selected, filter_boards } = this.state
    const { STATUS, STEPS, TIME } = DefaultFilterConditions
    const arr = [STATUS, STEPS, TIME]
    const list = arr
      .map(item => {
        const name = filter_params[item.chartKey]?.name
        if (name) {
          return [item.filterKey, name]
        }
        return null
      })
      .filter(i => i)
    const entries = new Map(list)
    let obj = Object.fromEntries(entries || {})
    const param = queryString.stringify(obj)
    getChartQrcode({
      report_code: type,
      board_ids:
        type === CARDQRCODE ? filter_boards.map(item => item.id) : selected,
      query_condition: param
    }).then(res => {
      // console.log(res)
      const { code_url } = res.data
      this.setState({
        qrcode_img: code_url
      })
    })
  }

  /**
   * 打开二维码弹窗
   * @param {boolean} visible 二维码开启还是关闭
   * @param {string} t 二维码类型，任务还是项目
   */
  openQrcode = (visible, t) => {
    if (visible) {
      this.setState({ qrcode_img: '' })
      this.getQrcode(t)
    }
  }

  /**
   * 更新任务列表过滤
   */
  updateTaskFilter = (data = []) => {
    const ids = data.map(item => item.id)
    this.fetchCardStatistical(ids.join(','))
  }

  /** 清空任务统计的查询条件 */
  clearCardFilter = () => {
    return {
      /**
       * 任务状态分布查询数据
       */
      [DefaultFilterConditions.CARD_STATUS.chartKey]: {},
      /**
       * 任务工时分布查询数据
       */
      [DefaultFilterConditions.CARD_TIME.chartKey]: {},
      /**
       * 任务数量分布查询数据
       */
      [DefaultFilterConditions.CARD_NUMBER.chartKey]: {}
    }
  }

  /**
   * 任务图表点击逻辑
   */
  handleClickCardChart = (type, val) => {
    let { card_filter } = this.state
    const { CARD_STATUS, CARD_NUMBER, CARD_TIME } = DefaultFilterConditions
    /**
     * 是否已经选择了，需要去除选择
     */
    let inArray = false
    if (card_filter[type].name && card_filter[type].name === val.name) {
      inArray = true
      // card_filter[type] = {}
    }
    card_filter = this.clearCardFilter()
    switch (type) {
      case CARD_STATUS.chartKey:
        if (!inArray) {
          card_filter[type] = {
            ...val,
            itemStyle: CARD_STATUS.itemStyle || {}
          }
        }
        break
      case CARD_NUMBER.chartKey:
        if (!inArray) {
          card_filter[type] = {
            ...val,
            itemStyle: CARD_NUMBER.itemStyle || {}
          }
        }
        break
      case CARD_TIME.chartKey:
        if (!inArray) {
          card_filter[type] = {
            ...val,
            itemStyle: CARD_TIME.itemStyle || {}
          }
        }
        break
      default:
        break
    }

    /**
     * 去除了children空数组字段
     */
    let arr
    if (!inArray) {
      arr = this.cardFilterForData(type, this.state.items, val)
    } else {
      arr = this.cardFilterForData('', this.state.items, val)
    }

    this.setState({
      card_filter,
      filter_tasks: this.setTableData(arr)
    })
  }

  /**
   * 任务列表过滤
   */
  cardFilterForData = (type, data = [], filterData = {}) => {
    const { CARD_STATUS, CARD_NUMBER, CARD_TIME } = DefaultFilterConditions
    let arr = []
    /**
     * 饼图的名称过滤
     */
    const FilterName = filterData.name
    /**
     * 柱状图 （时间，数量分布）的id过滤
     */
    const FilterId = filterData.user_id
    data.forEach(item => {
      switch (type) {
        case CARD_STATUS.chartKey:
          if (
            item[CARD_STATUS.filterKey] === FilterName ||
            (item.children && item.children.length)
          ) {
            let obj = { ...item, subhassom: true }
            if (obj.children && obj.children.length) {
              /**
               * 递归调用遍历子列表
               */
              obj.children = this.cardFilterForData(
                type,
                obj.children,
                filterData
              )
              /**
               * 判定子集是否有符合条件的数据
               */
              obj.subhassom = obj.children.some(child => {
                if (child.children && child.children.length) return true
                else return child[CARD_STATUS.filterKey] === FilterName
              })
            } else {
              delete obj.children
            }
            /**
             * 如果有子列表并且子列表中含有符合条件的数据
             */
            if (obj.subhassom) arr.push(obj)
          }
          break
        case CARD_TIME.chartKey:
        case CARD_NUMBER.chartKey:
          /**
           * 如果数据包含了用户
           */
          if (
            (item[CARD_TIME.filterKey] || []).some(
              user => user.id === FilterId
            ) ||
            (item.children && item.children.length)
          ) {
            let obj = { ...item, subhassom: true }
            if (obj.children && obj.children.length) {
              obj.children = this.cardFilterForData(
                type,
                obj.children,
                filterData
              )
              /**
               * 判定子集是否有符合条件的数据
               */
              obj.subhassom = obj.children.some(child => {
                if (child.children && child.children.length) return true
                else
                  return (child[CARD_TIME.filterKey] || []).some(
                    user => user.id === FilterId
                  )
              })
            } else {
              delete obj.children
            }
            /**
             * 如果有子列表并且子列表中含有符合条件的数据
             */
            if (obj.subhassom) arr.push(obj)
          }
          break
        default:
          arr = this.setTableData(data)
          break
      }
    })
    return arr
  }

  render() {
    const {
      projects = [],
      selected = [],
      isCheckedAll,
      filter_params,
      card_filter
    } = this.state
    const { workbenchBoxContent_height } = this.props
    return (
      <div
        className={styles.container}
        style={{
          height: workbenchBoxContent_height,
          overflowY: 'auto'
        }}
      >
        <div className={styles.container_title}>
          <div className={styles.container_title_text}>
            <h3>正在参与统计的项目</h3>
          </div>
          <div className={styles.filter_condition}>
            <Select
              filterOption={(val, option) =>
                option.props.title.indexOf(val) !== -1
              }
              defaultValue="0"
              size="small"
              style={{ width: '200px' }}
              mode="multiple"
              placeholder="请选择多个项目进行统计"
              maxTagCount={1}
              value={selected}
              onChange={this.handleSelectBoard}
              dropdownMatchSelectWidth={false}
              dropdownStyle={{ maxWidth: 500 }}
              dropdownRender={menu => (
                <div onMouseDown={e => e.preventDefault()}>
                  <div className={styles.menus}>{menu}</div>
                  <Divider style={{ margin: '6px 0' }} />
                  <div
                    className={styles.operation_settings}
                    onMouseDown={e => e.preventDefault()}
                  >
                    <Checkbox
                      onChange={this.handleSelectedAll}
                      checked={isCheckedAll}
                      onMouseDown={e => e.stopPropagation()}
                    >
                      全选
                    </Checkbox>
                    <Button
                      size="small"
                      type="primary"
                      onClick={this.handleQuery}
                    >
                      确定
                    </Button>
                  </div>
                </div>
              )}
            >
              {(projects || []).map(item => {
                return (
                  <Select.Option
                    title={item.board_name}
                    key={item.board_id}
                    value={item.board_id}
                  >
                    {item.board_name}
                  </Select.Option>
                )
              })}
            </Select>
            <div>
              {filter_params.querys.map(item => {
                return (
                  <Tag
                    closable
                    color="#108ee9"
                    onClose={() => this.removeQueryParam(item)}
                    key={item.type}
                  >
                    {item.name}
                  </Tag>
                )
              })}
            </div>
          </div>
          <div className={styles.board_total}>
            <div className={styles.board}>
              <span>{this.state.board_count}</span>
              <span>项目数</span>
            </div>
            <div className={styles.task}>
              <span>{this.state.card_count}</span>
              <span>任务数</span>
            </div>
          </div>
        </div>
        {this.state.isMultipleBoardSearch && (
          <div className={styles.statistics_content}>
            <div className={styles.statis_title}>
              项目统计
              <Popover
                trigger={['click']}
                onVisibleChange={this.openQrcode}
                placement="leftTop"
                content={
                  <div style={{ width: 300 }}>
                    <img
                      src={this.state.qrcode_img}
                      alt="二维码"
                      width="100%"
                    />
                  </div>
                }
              >
                <div className={styles.showQR}>&#xe702;</div>
              </Popover>
            </div>
            <div className={styles.statis_container}>
              {/* 状态分布 */}
              <ChartBox title={DefaultFilterConditions.STATUS.name}>
                <PieProject
                  data={this.state.board_status}
                  selectedParam={
                    filter_params[DefaultFilterConditions.STATUS.chartKey]
                  }
                  onHandleClick={this.handleFilterQuery.bind(
                    this,
                    DefaultFilterConditions.STATUS.chartKey
                  )}
                />
              </ChartBox>
              {/* 阶段分布 */}
              <ChartBox title={DefaultFilterConditions.STEPS.name}>
                <FunnlProject
                  data={this.state.board_stage}
                  selectedParam={
                    filter_params[DefaultFilterConditions.STEPS.chartKey]
                  }
                  onHandleClick={this.handleFilterQuery.bind(
                    this,
                    DefaultFilterConditions.STEPS.chartKey
                  )}
                />
              </ChartBox>
              {/* 时间分布 */}
              <ChartBox title={DefaultFilterConditions.TIME.name}>
                <LineChartProject
                  data={this.state.board_start_time}
                  selectedParam={
                    filter_params[DefaultFilterConditions.TIME.chartKey]
                  }
                  onHandleClick={this.handleFilterQuery.bind(
                    this,
                    DefaultFilterConditions.TIME.chartKey
                  )}
                />
              </ChartBox>
            </div>
            <div className={styles.provier_open}>
              {/* <b onClick={this.handleToggleOpen}>展开/收起</b> <span>项目列表</span> */}
            </div>
            <div className={styles.table}>
              <BoardTable data={this.state.filter_boards} />
            </div>
          </div>
        )}

        {/* 任务统计 */}
        <div className={styles.statistics_content}>
          <div className={styles.statis_title}>
            任务统计
            <Popover
              trigger={['click']}
              onVisibleChange={v => this.openQrcode(v, CARDQRCODE)}
              placement="leftTop"
              content={
                <div style={{ width: 300 }}>
                  <img src={this.state.qrcode_img} alt="二维码" width="100%" />
                </div>
              }
            >
              <div className={styles.showQR}>&#xe702;</div>
            </Popover>
          </div>
          <div className={styles.statis_container}>
            <ChartBox title={DefaultFilterConditions.CARD_STATUS.name}>
              <PieTask
                data={this.state.card_status}
                onHandleClick={this.handleClickCardChart.bind(
                  this,
                  DefaultFilterConditions.CARD_STATUS.chartKey
                )}
                selectedParam={
                  card_filter[DefaultFilterConditions.CARD_STATUS.chartKey]
                }
              />
            </ChartBox>
            <ChartBox title={DefaultFilterConditions.CARD_TIME.name}>
              <ChartWorkTime
                data={this.state.card_working_hour}
                onHandleClick={this.handleClickCardChart.bind(
                  this,
                  DefaultFilterConditions.CARD_TIME.chartKey
                )}
                selectedParam={
                  card_filter[DefaultFilterConditions.CARD_TIME.chartKey]
                }
              />
            </ChartBox>
            <ChartBox title={DefaultFilterConditions.CARD_NUMBER.name}>
              <ChartTaskNumber
                data={this.state.card_number}
                onHandleClick={this.handleClickCardChart.bind(
                  this,
                  DefaultFilterConditions.CARD_NUMBER.chartKey
                )}
                selectedParam={
                  card_filter[DefaultFilterConditions.CARD_NUMBER.chartKey]
                }
              />
            </ChartBox>
          </div>
          <div className={styles.provier_open}>
            {/* <b onClick={this.handleToggleOpen}>展开/收起</b>{' '}
            <span>项目列表</span> */}
          </div>
          <div className={styles.table}>
            <TaskTable data={this.state.filter_tasks} />
          </div>
        </div>
      </div>
    )
  }
}
