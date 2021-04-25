import React from 'react'
import MilestoneTimeLine from './components/MilestoneTimeLine'
import styles from './index.less'
import moment from 'moment'
import BoardGroupTree from './components/BoardGroupTree'
import MilestoneCardContainer from './components/MilestoneCardContainer'
import { getFirstItem, getLastItem } from './utils'
import TransformMatrixArray from '../../../../../utils/MatrixArray'
import {
  beforeStartMilestoneDays,
  DaysWidth,
  IconMarginRight,
  IconWidth,
  OverallItem,
  OverallRowHeight,
  OverallRowPaddingTB
} from './constans'
import { connect } from 'dva'
import { ProjectDetailModel } from '../../../../../models/technological/projectDetail'
import {
  fetchSearchParams,
  milestoneList,
  overallControllData
} from '../../../../../services/technological/overallControll'
import { Button, Checkbox, Divider, message, Select } from 'antd'
import MustBeChooseBoard from '../../../../../components/MustBeChooseBoard'
import { debounce } from 'lodash'

/** 关键控制点的组件 */
@connect(
  ({
    [ProjectDetailModel.namespace]: {
      datas: { projectDetailInfoData }
    },
    simplemode: { simplemodeCurrentProject }
  }) => ({
    projectDetailInfoData,
    simplemodeCurrentProject
  })
)
export default class OverallControl extends React.Component {
  constructor(props) {
    super(props)
    /** 全选项目的id */
    this.TotalBoardValue = '0'
    /** 总体的包裹元素 */
    this.containerRef = React.createRef()
    this.state = {
      /** 是否显示指引 */
      isShowGuide: false,
      /** 包裹元素的框高 */
      containerDom: {
        currentHeight: 0,
        currentWidth: 0
      },
      /** 当前鼠标放在哪个数据上面 */
      hoverActiveId: '',
      /** 默认的最小时间，不允许小与这个时间 */
      beforeStartMilestoneDays: 10,
      /** 默认的最大时间偏移 */
      afterMilestoneDays: 15,
      /** 左侧树类型的数据 */
      treeData: [],
      /** 用于显示控制点的data */
      overallRenderData: [],
      /** 关键控制点的模拟数据 */
      overall_data: [],
      /** 一级里程碑的数据 */
      firstMilestoneData: [],
      /** 最小的时间 */
      minTime: 0,
      /** 最大的时间 */
      maxTime: 0,
      /** 搜索列表 */
      searchList: [],
      /** 选择的搜索条件 */
      queryParams: {}
    }
    /** 防止文字重叠，多几个像素，避免重叠 */
    this.debounceTextWidth = 2
    this.updateRenderData = debounce(this.updateRenderData, 50)
    this.timer = null
    this.mouseleaveTimer = null
  }

  componentDidMount() {
    this.updateSearch()
    this.fetchSearchItems()
  }
  componentDidUpdate(prevProps) {
    if (
      prevProps.simplemodeCurrentProject.board_id !==
      this.props.simplemodeCurrentProject.board_id
    ) {
      this.updateSearch()
    }
  }

  /** 更新搜索条件 */
  updateSearch = () => {
    const { simplemodeCurrentProject } = this.props
    const currentBoardId = simplemodeCurrentProject
      ? simplemodeCurrentProject.board_id
      : this.TotalBoardValue
    if (currentBoardId === this.TotalBoardValue) {
      setTimeout(() => {
        this.setState(
          {
            isShowGuide: true,
            overall_data: [],
            firstMilestoneData: [],
            searchList: []
          },
          () => {
            this.updateRenderData()
          }
        )
      }, 500)
    } else {
      this.setState({
        isShowGuide: false
      })
    }
    clearTimeout(this.timer)
    this.fetchSearchItems()
    Promise.all([this.fetchMilestoneData(), this.fetchControllData()]).then(
      () => {
        this.timer = setTimeout(() => {
          this.fetchTimes()
        }, 50)
      }
    )
  }

  /** 获取dom的数据(暂时废弃) */
  getCurrentDom = () => {
    const { current } = this.containerRef
    if (current) {
      this.setState({
        containerDom: {
          currentWidth: current.clientWidth + current.scrollWidth,
          currentHeight: current.clientHeight + current.scrollHeight
        }
      })
    }
  }

  /** 更新时间 */
  fetchTimes = () => {
    Promise.all([this.getFirstTime(), this.getEndTime()]).then(() => {
      this.updateRenderData()
    })
  }
  /** 获取控制点的数据最早的时间 */
  getFirstTime = () => {
    return new Promise(resolve => {
      const { overall_data = [] } = this.state
      /** 所有列表中的最早时间合集 */
      const firstArr = []
      overall_data.forEach(item => {
        const first = getFirstItem(item.content || [], 'end_time')
        if (first) firstArr.push(first)
      })
      /** 获取最小的时间 */
      const minTime = Math.min.apply(
        this,
        firstArr.map(item => item.end_time)
      )
      /** 里程碑最小的时间 */
      const milestoneMinItem = this.state.firstMilestoneData[0]
      /** 保存最小的时间 */
      this.setState(
        {
          minTime: Math.min.apply(this, [
            moment(minTime).valueOf(),
            moment(milestoneMinItem?.deadline || minTime)
              .subtract(this.state.beforeStartMilestoneDays, 'day')
              .valueOf()
          ])
        },
        () => {
          resolve(this.state.minTime)
        }
      )
    })
  }

  /** 获取时间跨度最小的时间 */
  getEndTime = () => {
    return new Promise(resolve => {
      const { overall_data = [] } = this.state
      /** 所有列表中的最早时间合集 */
      const endArr = []
      overall_data.forEach(item => {
        const first = getLastItem(item.content || [], 'end_time')
        if (first) endArr.push(first)
      })
      /** 获数据中取最小的时间 */
      const maxTime = Math.max.apply(
        this,
        endArr.map(item => item.end_time)
      )

      /** 里程碑最小的时间 */
      const milestoneMaxItem = this.state.firstMilestoneData[
        this.state.firstMilestoneData.length - 1
      ]
      /** 变更的时间 */
      let time = maxTime
      /** 取最大的时间 */
      time = Math.max.apply(this, [
        moment(maxTime).valueOf(),
        moment(milestoneMaxItem?.deadline || time)
          .add(this.state.afterMilestoneDays, 'day')
          .valueOf()
      ])

      if (!milestoneMaxItem) {
        time = maxTime
      }
      /** 保存最小的时间 */
      this.setState(
        {
          maxTime: time
        },
        () => {
          resolve(this.state.maxTime)
        }
      )
    })
  }

  /**
   * 计算每个数据的长度获取矩阵列表
   * @param {{}[]} datas 控制点的数据列表
   */
  getMatrixArray = datas => {
    /** 每个元素的边距，宽度，合计在一起的宽度 */
    const DomWidth =
      OverallItem.paddingLeft +
      OverallItem.paddingRight +
      IconWidth +
      IconMarginRight

    // const { datas = [] } = this.props
    if (!datas.length) return []
    /** 总时间天数 */
    let timeSpan = Math.abs(
      moment(this.state.minTime).diff(moment(this.state.maxTime), 'days')
    )
    if (!timeSpan) return []
    /** 最后一个数据的dom长度 */
    let lastWidth = 0
    /** 重组后的数据 */
    const arr = datas.map(cell => {
      /** 数据的名称 */
      const name = cell.name.toString()
      /** 文字的像素长度 */
      const textWidth =
        name.pxWidth('normal normal bold 14px Robot') + this.debounceTextWidth
      /** 时间转换成开始的下标 */
      const timeTransfromToStart = Math.abs(
        moment(this.state.minTime).diff(moment(cell.end_time), 'days')
      )
      /** 保存最后一个数据的长度，用于在数据后面追加合适的格子 */
      lastWidth = textWidth + DomWidth
      return {
        ...cell,
        startIndex: timeTransfromToStart,
        width: Math.floor(textWidth + DomWidth)
      }
    })
    /** 转换的矩阵数据 */
    const matrixArr = TransformMatrixArray({
      /** 总时间天数，加上最后一个数据占用长度 */
      span: timeSpan + Math.floor(lastWidth / DaysWidth) + 10,
      spanStep: DaysWidth,
      data: arr
    })

    return matrixArr
  }

  /** 获取一级里程碑列表 */
  fetchMilestoneData = async () => {
    const { simplemodeCurrentProject } = this.props
    const currentBoardId = simplemodeCurrentProject
      ? simplemodeCurrentProject.board_id
      : this.TotalBoardValue
    if (currentBoardId === this.TotalBoardValue)
      return message.warn('请选择单个项目进行查看')
    return milestoneList({ board_id: currentBoardId })
      .then(res => {
        // console.log(res)
        this.setState({
          firstMilestoneData: (res.data || [])
            .filter(item => item.deadline)
            .map(item => ({
              ...item,
              deadline: +(item.deadline + '000')
            }))
            .sort((a, b) => a.deadline - b.deadline)
        })
        return res.data
      })
      .catch(err => message.warn(err))
  }

  /** 获取搜索的条件列表 */
  fetchSearchItems = () => {
    const { simplemodeCurrentProject } = this.props
    /** 当前选择的项目id */
    const currentBoardId = simplemodeCurrentProject
      ? simplemodeCurrentProject.board_id
      : this.TotalBoardValue
    if (currentBoardId === this.TotalBoardValue) return

    fetchSearchParams({ board_id: currentBoardId }).then(res => {
      // console.log(res)
      this.setState({
        searchList: res.data
      })
    })
  }

  /** 获取关键控制点的数据 */
  fetchControllData = async () => {
    /** 过滤搜索条件没有数据的key
     * @returns {?{[x: string]: any} | null}
     */
    const filterParamsNull = () => {
      const obj = {}
      Object.keys(this.state.queryParams).forEach(item => {
        if (this.state.queryParams[item]) {
          obj[item] = this.state.queryParams[item]
        }
      })
      return Object.keys(obj).length ? obj : null
    }

    const { simplemodeCurrentProject } = this.props
    const currentBoardId = simplemodeCurrentProject
      ? simplemodeCurrentProject.board_id
      : this.TotalBoardValue
    if (currentBoardId === this.TotalBoardValue)
      return message.warn('请选择单个项目进行查看')

    return overallControllData({
      board_id: currentBoardId,
      items: filterParamsNull()
    })
      .then(res => {
        this.setState({
          overall_data: (res.data || [])
            .map(item => {
              let content = item.content || []
              content = content.map(c => ({
                ...c,
                end_time: +(c.end_time + '000')
              }))
              return { ...item, content }
            })
            .sort((a, b) => a.end_time - b.end_time)
        })
        return res.data
      })
      .catch(err => message.warn(err.message))
  }

  /** 更新渲染的数据 */
  updateRenderData = () => {
    const { overall_data = [] } = this.state
    /** 控制点数据 */
    // const arr = []
    /** 左侧数据更新 */
    const treeItem = []
    overall_data.forEach(item => {
      /** 所有的数据 */
      const data = this.getMatrixArray(item.content || [])
      /** 执行过格式化之后的数据，用于渲染 */
      const formatData = this.forMatMartixArray(data)
      /** 保存左侧的数据 */
      treeItem.push({
        ...item,
        content: formatData,
        height: data.length * OverallRowHeight + OverallRowPaddingTB * 2
      })
      /** 保存右侧的数据 */
      // arr.push(data)
    })
    this.setState({
      treeData: treeItem
    })
  }

  /** 格式化拿到的数据，用来显示 */
  forMatMartixArray = data => {
    let dataArray = []
    /** 拿到数据之后，进行去重和渲染 */
    data.forEach(item => {
      const obj = {}
      item.forEach(day => {
        if (day) {
          if (!obj[day.id]) {
            obj[day.id] = day
          }
        }
      })
      dataArray.push(Object.values(obj))
    })
    return dataArray
  }

  /** 鼠标放在上面的事件
   * @param {{list_id: string}} val 当前鼠标放上去的数据
   */
  MouseEnter = val => {
    clearTimeout(this.mouseleaveTimer)
    this.setState({
      hoverActiveId: val.list_id
    })
  }

  /** 鼠标移开 */
  MouseLeave = () => {
    clearTimeout(this.mouseleaveTimer)
    this.mouseleaveTimer = setTimeout(() => {
      this.setState({
        hoverActiveId: ''
      })
    }, 200)
  }

  /**
   * 搜索条件更新
   * @param {string} query_key 搜索的key，select的id
   * @param {string} val 所选的值 select.option.value
   */
  handleChangeQueryParam = (query_key, val) => {
    // return
    this.setState(
      {
        queryParams: {
          ...this.state.queryParams,
          [query_key]: (val || []).length ? val : null
        }
      },
      () => {
        this.updateSearch()
      }
    )
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
    this.setState(
      {
        queryParams: {
          ...this.state.queryParams,
          [option.id]: chekced ? selectedIds : null
        }
      },
      () => {
        this.updateSearch()
      }
    )
  }

  /**
   * 重置搜索条件
   */
  handleResetQueryParams = () => {
    this.setState(
      {
        queryParams: {}
      },
      () => {
        /** 重新走一遍查询 */
        this.updateSearch()
      }
    )
  }

  render() {
    const { workbenchBoxContent_height } = this.props
    return (
      <div
        className={styles.container}
        style={{ height: workbenchBoxContent_height }}
      >
        <div className={styles.container_header}>
          {(this.state.searchList || []).map(item => {
            return (
              <Select
                mode="multiple"
                maxTagCount={2}
                key={item.id}
                dropdownMatchSelectWidth={false}
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
          <Button
            type="default"
            style={{ marginLeft: 10, flex: 'none' }}
            onClick={this.handleResetQueryParams}
          >
            重置
          </Button>
        </div>
        <div className={styles.container_content} ref={this.containerRef}>
          <div className={styles.content_board_group}>
            {/* 左侧项目和分组列表 */}
            <BoardGroupTree
              datas={this.state.treeData}
              onMouseEnter={this.MouseEnter}
              onMouseOut={() => this.MouseLeave()}
              onMouseOver={item => this.MouseEnter(item)}
              onMouseLeave={() => this.MouseLeave()}
              activeId={this.state.hoverActiveId}
            />
          </div>
          <div className={styles.content_overview} id="content_overview">
            <div>
              <MilestoneTimeLine
                maxConstans={this.state.afterMilestoneDays}
                data={this.state.firstMilestoneData}
                // currentDom={this.state.containerDom}
                listData={this.state.overall_data}
                minTime={this.state.minTime}
                maxTime={this.state.maxTime}
                workbenchBoxContent_height={workbenchBoxContent_height}
              />
              {this.state.treeData.map(item => {
                return (
                  <MilestoneCardContainer
                    onMouseOut={() => this.MouseLeave()}
                    onMouseLeave={() => this.MouseLeave()}
                    onMouseEnter={() => this.MouseEnter(item)}
                    onMouseOver={() => this.MouseEnter(item)}
                    key={item.list_id}
                    active={this.state.hoverActiveId === item.list_id}
                    datas={item.content}
                    minTime={this.state.minTime}
                    maxTime={this.state.maxTime}
                  />
                )
              })}
            </div>
          </div>
        </div>
        {this.state.isShowGuide && (
          <MustBeChooseBoard
            onClose={() =>
              this.setState({
                isShowGuide: false
              })
            }
            element={'#choose_board'}
            tips="请选择一个项目，查看相应的内容！"
          />
        )}
      </div>
    )
  }
}
