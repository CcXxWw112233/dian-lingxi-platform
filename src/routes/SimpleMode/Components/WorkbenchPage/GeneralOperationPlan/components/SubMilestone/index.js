import React from 'react'
import {
  MilestoneWidth,
  ParentSubMilestoneHeight,
  SubMilestoneHeight,
  SubMilestoneMargin,
  SubMilestoneMiniHeight
} from '../../constans'
import styles from './index.less'

/** 二级里程碑卡片
 * @description 父级调用节点是OverviewContainer
 */
export default class SubMilestone extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      /** 当前分组是否展开 */
      groupOpen: false
    }
  }

  /** 渲染合并中的子里程碑合集mini状态 */
  SubChildMilestoneRenderMini = props => {
    return (
      <div
        className={styles.submilestone_item_mini}
        style={{
          height: SubMilestoneMiniHeight
        }}
        tabIndex={-1}
      ></div>
    )
  }

  /**
   * 渲染合并中的子里程碑合集larger状态
   * @returns {React.ReactNode}
   */
  SubChildMilestoneRenderLarger = props => {
    const { child_list = [] } = props
    return child_list.map(item => {
      return (
        <div
          key={item.id}
          className={styles.submilestone_item_large}
          style={{
            height: SubMilestoneHeight,
            marginBottom: SubMilestoneMargin
          }}
        >
          <div className={styles.large_title}>{item.name}</div>
          <div>
            <span className={styles.sub_large_title}>首开区</span>
          </div>
        </div>
      )
    })
  }

  render() {
    const { datas = [] } = this.props
    return (
      <div className={styles.submilestone_container}>
        {datas.map(item => {
          return (
            <div
              key={item.id}
              className={`${styles.container_submilestone} ${
                this.state.groupOpen ? styles.group_milestone : ''
              }`}
              style={{
                width: MilestoneWidth,
                minHeight: ParentSubMilestoneHeight
              }}
            >
              {this.state.groupOpen ? (
                <this.SubChildMilestoneRenderLarger child_list={item.child} />
              ) : (
                <this.SubChildMilestoneRenderMini />
              )}
            </div>
          )
        })}
      </div>
    )
  }
}
