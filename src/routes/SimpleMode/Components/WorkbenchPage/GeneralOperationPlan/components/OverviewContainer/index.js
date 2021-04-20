import React from 'react'
import { Fragment } from 'react'
import {
  getStatus,
  MilestoneTotalHeight,
  MilestoneTypes,
  MilestoneWidth
} from '../../constans'
import SubMilestone from '../SubMilestone'
import styles from './index.less'

/** 运营总图的运营图 */
export default class OverviewContainer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      /** 运营总图的数据 */
      overview_data: [
        {
          name: '土地公告',
          id: '1',
          child: [
            {
              name: '土地公告child1',
              id: '2'
            },
            {
              name: '土地公告child2',
              id: '3'
            },
            {
              name: '土地公告child13',
              id: '4'
            },
            {
              name: '土地公告child4',
              id: '5'
            },
            {
              name: '土地公告child5',
              id: '6'
            }
          ]
        },
        {
          name: '土地公告2',
          id: '7',
          child: [
            {
              name: '土地公告2child1',
              id: '8'
            },
            {
              name: '土地公告2child2',
              id: '9'
            },
            {
              name: '土地公告2child3',
              id: '10'
            }
          ]
        },
        {
          name: '土地公告3',
          id: '11',
          child: [
            {
              name: '土地公告3child1',
              id: '12'
            },
            {
              name: '土地公告3child2',
              id: '13'
            },
            {
              name: '土地公告3child3',
              id: '14'
            }
          ]
        }
      ]
    }
  }

  /** 渲染一级里程碑的数据
   * @param {{data: {}, index: number}} props React组件的props
   */
  ParentMilestonRender = props => {
    /** 当前渲染的数据
     * @param {{name: string, id: string}} data 数据
     * @param {number} index 当前序号
     */
    const { data, index } = props
    return (
      <div className={styles.parent_milestone}>
        <span className={styles.milestone_name}>{data.name}</span>
        <span className={styles.milestone_index}>
          <b>{index}</b>
        </span>
      </div>
    )
  }

  /**
   * 渲染二级节点的线段
   * @param {{data: {}}} props 当前组件的ReactProps
   * @returns {React.ReactNode}
   */
  SubMilestoneRender = props => {
    /**  */
    const { data, type } = props
    /** 状态中的颜色 */
    const color = getStatus(type).color
    return (
      <div
        className={styles.milestone_step_item}
        style={{ backgroundColor: color }}
      ></div>
    )
  }

  render() {
    const { overview_data = [] } = this.state
    return (
      <div className={styles.overview_container}>
        <div className={styles.header_top}>
          {/** 占位元素，和左侧等高,也用于显示一级里程碑 */}
        </div>
        <div className={styles.overview_content}>
          <div
            className={styles.milestone_total}
            style={{ marginBottom: MilestoneTotalHeight }}
          >
            {overview_data.map((item, index) => {
              const children = item.child || []
              return (
                <div
                  key={item.id}
                  className={styles.milestone_steps}
                  style={{ width: MilestoneWidth }}
                >
                  {children.map(child => {
                    return (
                      <this.SubMilestoneRender
                        data={child}
                        key={child.id}
                        type={MilestoneTypes.NormalDone.status}
                      />
                    )
                  })}
                  <this.ParentMilestonRender data={item} index={index + 1} />
                </div>
              )
            })}
          </div>
          <SubMilestone datas={overview_data} />
        </div>
      </div>
    )
  }
}
