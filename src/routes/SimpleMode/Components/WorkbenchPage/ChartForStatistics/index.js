import {
  Select,
  Tag,
  Divider,
  Button,
  Checkbox,
  message,
  notification
} from 'antd'
import React from 'react'
import styles from './index.less'
import { ALLBOARD, DefaultFilterConditions } from './constans'
import ChartBox from './components/ChartBox'
import PieProject from './components/PieProject'
import FunnlProject from './components/FunnelProject'
import { connect } from 'dva'
import BoardTable from './components/BoardTable'
import { getBoardStatistical } from '../../../../../services/technological/statisticalReport'
import { getProjectUserList } from '../../../../../services/technological/workbench'
import LineChartProject from './components/LineChartProject'

@connect(({ simplemode: { simplemodeCurrentProject } }) => ({
  simplemodeCurrentProject
}))
export default class ChartForStatistics extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
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
      board_create_time: {
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
       * 项目列表数据
       */
      boards: [],
      /**
       * 用于显示的表格数据
       */
      filter_boards: [],
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
    }
  }

  componentDidMount() {
    this.getBoardList()
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
  getBoardList = () => {
    const { simplemodeCurrentProject } = this.props
    const id = simplemodeCurrentProject.board_id
    getProjectUserList().then(res => {
      // 保存项目列表
      this.setState(
        {
          projects: res.data || [],
          selected: id === ALLBOARD ? this.getAllBoardId(res.data || []) : id,
          isCheckedAll: id === ALLBOARD
        },
        () => {
          this.getData()
        }
      )
    })
  }

  /**
   * 获取数据
   */
  getData = () => {
    const { selected } = this.state
    getBoardStatistical({ board_ids: selected.join(',') }).then(res => {
      // console.log(res)
      this.clearQueryParam()
      this.setState({ ...res.data, filter_boards: res.data?.boards })
    })
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
   * 是否全选
   * @param {} val
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
   */
  handleFilterQuery = (type, data) => {
    // console.log(type, data)
    let { filter_params } = this.state
    const addKey = data.name

    // 不存在就赋值
    let isAdd = false
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
        // 更新
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
    if (filter_params.querys.length) {
      const querys = filter_params.querys || []
      let arr = [...boards]
      const StatusQuery = querys.find(item => item.type === STATUS.chartKey)
      const StepQuery = querys.find(item => item.type === STEPS.chartKey)
      const TimeQuery = querys.find(item => item.type === TIME.chartKey)
      if (StatusQuery) {
        // 如果是状态分布过滤
        arr = arr.filter(item => item[STATUS.filterKey] === StatusQuery.name)
      }
      if (StepQuery) {
        // 如果是阶段分布过滤
        arr = arr.filter(item => item[STEPS.filterKey].includes(StepQuery.name))
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
    } else {
      // 没有过滤项，直接恢复原来的数据
      this.setState({
        filter_boards: [...boards]
      })
    }
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

  render() {
    const {
      projects = [],
      selected = [],
      isCheckedAll,
      filter_params
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
              defaultValue="0"
              size="small"
              style={{ width: '200px' }}
              mode="multiple"
              placeholder="请选择多个项目进行统计"
              maxTagCount={1}
              value={selected}
              onChange={this.handleSelectBoard}
              dropdownMatchSelectWidth={false}
              dropdownStyle={{ maxWidth: 300 }}
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
              <span>12</span>
              <span>项目数</span>
            </div>
            <div className={styles.task}>
              <span>12</span>
              <span>项目数</span>
            </div>
          </div>
        </div>
        <div className={styles.statistics_content}>
          <div className={styles.statis_title}>项目统计</div>
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
                data={this.state.board_create_time}
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
        </div>
        <div className={styles.provier_open}>
          <b onClick={this.handleToggleOpen}>展开/收起</b> <span>项目列表</span>
        </div>
        <div className={styles.table}>
          <BoardTable data={this.state.filter_boards} />
        </div>
      </div>
    )
  }
}
