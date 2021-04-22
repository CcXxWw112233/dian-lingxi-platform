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
  OverallRowHeight
} from './constans'
import { debounce } from '../../../../../utils/util'
import { connect } from 'dva'
import { ProjectDetailModel } from '../../../../../models/technological/projectDetail'
import {
  milestoneList,
  overallControllData
} from '../../../../../services/technological/overallControll'
import { message } from 'antd'

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
    this.state = {
      /** 当前鼠标放在哪个数据上面 */
      hoverActiveId: '',
      /** 默认的最小时间，不允许小与这个时间 */
      beforeStartMilestoneDays: beforeStartMilestoneDays,
      /** 左侧树类型的数据 */
      treeData: [],
      /** 用于显示控制点的data */
      overallRenderData: [],
      /** 关键控制点的模拟数据 */
      overall_data: [
        // {
        //   list_id: '123',
        //   list_name: '分组名称',
        //   data: [
        //     {
        //       id: '1384780487343607808',
        //       name: '任务1',
        //       status: '0',
        //       type: '2',
        //       list_names: [],
        //       end_time: moment()
        //         .subtract(2, 'day')
        //         .valueOf(),
        //       is_parent: true,
        //       fields: []
        //     },
        //     {
        //       id: '1384780487343607809',
        //       name: '任务2',
        //       status: '0',
        //       type: '2',
        //       list_names: [],
        //       end_time: moment()
        //         .add(3, 'day')
        //         .valueOf(),
        //       is_parent: true,
        //       fields: []
        //     },
        //     {
        //       id: '1384780487343607810',
        //       name: '任务3777878',
        //       status: '0',
        //       type: '2',
        //       list_names: [],
        //       end_time: moment()
        //         .add(25, 'day')
        //         .valueOf(),
        //       is_parent: true,
        //       fields: []
        //     },
        //     {
        //       id: '1384780487343607811',
        //       name: '任务4',
        //       status: '0',
        //       type: '2',
        //       list_names: [],
        //       end_time: moment()
        //         .add(46, 'day')
        //         .valueOf(),
        //       is_parent: true,
        //       fields: []
        //     },
        //     {
        //       id: '1384780487343607812',
        //       name: '任务5',
        //       status: '0',
        //       type: '2',
        //       list_names: [],
        //       end_time: moment()
        //         .add(50, 'day')
        //         .valueOf(),
        //       is_parent: true,
        //       fields: []
        //     },
        //     {
        //       id: '1384780487343607813',
        //       name: '任务6',
        //       status: '0',
        //       type: '2',
        //       list_names: [],
        //       end_time: moment()
        //         .add(10, 'day')
        //         .valueOf(),
        //       is_parent: true,
        //       fields: []
        //     }
        //   ]
        // },
        // {
        //   list_id: '1234',
        //   list_name: '分组名称2',
        //   data: [
        //     {
        //       id: '2384780487343607808',
        //       name: '任务1',
        //       status: '0',
        //       type: '2',
        //       list_names: [],
        //       end_time: moment()
        //         .subtract(2, 'day')
        //         .valueOf(),
        //       is_parent: true,
        //       fields: []
        //     },
        //     {
        //       id: '2384780487343607809',
        //       name: '任务2',
        //       status: '0',
        //       type: '2',
        //       list_names: [],
        //       end_time: moment()
        //         .add(3, 'day')
        //         .valueOf(),
        //       is_parent: true,
        //       fields: []
        //     },
        //     {
        //       id: '2384780487343607810',
        //       name: '任务3777878',
        //       status: '0',
        //       type: '2',
        //       list_names: [],
        //       end_time: moment()
        //         .add(25, 'day')
        //         .valueOf(),
        //       is_parent: true,
        //       fields: []
        //     },
        //     {
        //       id: '2384780487343607811',
        //       name: '任务4',
        //       status: '0',
        //       type: '2',
        //       list_names: [],
        //       end_time: moment()
        //         .add(46, 'day')
        //         .valueOf(),
        //       is_parent: true,
        //       fields: []
        //     },
        //     {
        //       id: '2384780487343607812',
        //       name: '任务5',
        //       status: '0',
        //       type: '2',
        //       list_names: [],
        //       end_time: moment()
        //         .add(50, 'day')
        //         .valueOf(),
        //       is_parent: true,
        //       fields: []
        //     },
        //     {
        //       id: '2384780487343607813',
        //       name: '任务6',
        //       status: '0',
        //       type: '2',
        //       list_names: [],
        //       end_time: moment()
        //         .add(10, 'day')
        //         .valueOf(),
        //       is_parent: true,
        //       fields: []
        //     }
        //   ]
        // }
      ],
      /** 一级里程碑的数据 */
      firstMilestoneData: [
        // {
        //   name: '土地公告0',
        //   deadline: moment()
        //     .subtract(20, 'day')
        //     .valueOf(),
        //   id: '0'
        // },
        // {
        //   name: '土地公告',
        //   deadline: moment().valueOf(),
        //   id: '1'
        // },
        // {
        //   name: '土地公告2',
        //   id: '7',
        //   deadline: moment()
        //     .add(1, 'month')
        //     .valueOf()
        // },
        // {
        //   name: '土地公告3',
        //   id: '11',
        //   deadline: moment()
        //     .add(3, 'month')
        //     .valueOf()
        // }
      ],
      /** 最小的时间 */
      minTime: 0,
      /** 最大的时间 */
      maxTime: 0
    }
    /** 防止文字重叠，多几个像素，避免重叠 */
    this.debounceTextWidth = 5
    this.MouseLeave = debounce(this.MouseLeave, 50)
    this.MouseEnter = debounce(this.MouseEnter, 50)
  }

  componentDidMount() {
    Promise.all([this.fetchMilestoneData(), this.fetchControllData()]).then(
      () => {
        setTimeout(() => {
          this.getFirstTime()
          this.getEndTime()
        }, 10)
      }
    )
  }

  /** 获取控制点的数据最早的时间 */
  getFirstTime = () => {
    const { overall_data = [] } = this.state
    /** 所有列表中的最早时间合集 */
    const firstArr = []
    overall_data.forEach(item => {
      const first = getFirstItem(item.content || [], 'end_time')
      firstArr.push(first)
    })
    /** 获取最小的时间 */
    const minTime = Math.min.apply(
      this,
      firstArr.map(item => item.end_time)
    )
    /** 里程碑最小的时间 */
    const milestoneMinItem = this.state.firstMilestoneData[0]
    /** 保存最小的时间 */
    this.setState({
      minTime: Math.min.apply(this, [
        moment(minTime).valueOf(),
        moment(milestoneMinItem?.deadline || minTime)
          .subtract(this.state.beforeStartMilestoneDays, 'day')
          .valueOf()
      ])
    })
  }

  /** 获取时间跨度最小的时间 */
  getEndTime = () => {
    const { overall_data = [] } = this.state
    /** 所有列表中的最早时间合集 */
    const endArr = []
    overall_data.forEach(item => {
      const first = getLastItem(item.content || [], 'end_time')
      endArr.push(first)
    })
    /** 获取最小的时间 */
    const maxTime = Math.max.apply(
      this,
      endArr.map(item => item.end_time)
    )
    /** 保存最小的时间 */
    this.setState({
      maxTime
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
    /** 最后一个数据的dom长度 */
    let lastWidth = 0
    /** 重组后的数据 */
    const arr = datas.map(cell => {
      /** 数据的名称 */
      const name = cell.name.toString()
      /** 文字的像素长度 */
      const textWidth =
        name.pxWidth('normal bold 14px Robot') + this.debounceTextWidth
      /** 时间转换成开始的下标 */
      const timeTransfromToStart = Math.abs(
        moment(this.state.minTime).diff(moment(cell.end_time), 'days')
      )
      /** 保存最后一个数据的长度，用于在数据后面追加合适的格子 */
      lastWidth = textWidth + DomWidth
      return {
        ...cell,
        startIndex: timeTransfromToStart,
        width: textWidth + DomWidth
      }
    })
    /** 转换的矩阵数据 */
    const matrixArr = TransformMatrixArray({
      /** 总时间天数，加上最后一个数据占用长度 */
      span: timeSpan + Math.floor(lastWidth / DaysWidth),
      spanStep: DaysWidth,
      data: arr
    })

    return matrixArr
  }

  componentDidUpdate(prevP, prevS) {
    if (
      prevS.minTime !== this.state.minTime ||
      prevS.maxTime !== this.state.maxTime
    ) {
      this.updateRenderData()
    }
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

  /** 获取关键控制点的数据 */
  fetchControllData = async () => {
    const { simplemodeCurrentProject } = this.props
    const currentBoardId = simplemodeCurrentProject
      ? simplemodeCurrentProject.board_id
      : this.TotalBoardValue
    if (currentBoardId === this.TotalBoardValue)
      return message.warn('请选择单个项目进行查看')
    return overallControllData({ board_id: currentBoardId, items: null })
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
      /** 保存左侧的数据 */
      treeItem.push({
        ...item,
        content: this.forMatMartixArray(data),
        height: data.length * OverallRowHeight
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
    this.setState({
      hoverActiveId: val.list_id
    })
  }

  /** 鼠标移开 */
  MouseLeave = () => {
    this.setState({
      hoverActiveId: ''
    })
  }

  render() {
    const { workbenchBoxContent_height } = this.props
    return (
      <div
        className={styles.container}
        style={{ height: workbenchBoxContent_height }}
      >
        <div className={styles.container_header}>
          运营总览
          {/* 预留过滤选项列表 */}
        </div>
        <div className={styles.container_content}>
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
          <div className={styles.content_overview}>
            <MilestoneTimeLine
              data={this.state.firstMilestoneData}
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
    )
  }
}
