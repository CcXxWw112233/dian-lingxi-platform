import { Select, Tag, Divider, Button, Checkbox } from 'antd'
import React from 'react'
import styles from './index.less'
import { DefaultFilterConditions } from './constans'
import ChartBox from './components/ChartBox'
import PieProject from './components/PieProject'
import FunnlProject from './components/FunnelProject'
import { connect } from 'dva'

@connect(({ simplemode: { simplemodeCurrentProject } }) => ({
  simplemodeCurrentProject
}))
export default class ChartForStatistics extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidMount() {}

  render() {
    return (
      <div className={styles.container}>
        <div className={styles.container_title}>
          <div className={styles.container_title_text}>
            <h3>正在参与统计的项目</h3>
          </div>
          <div className={styles.filter_condition}>
            <Select
              defaultValue="0"
              size="small"
              style={{ width: '150px' }}
              dropdownRender={menu => (
                <div onMouseDown={e => e.preventDefault()}>
                  <div className={styles.menus}>{menu}</div>
                  <Divider style={{ margin: '4px 0' }} />
                  <div className={styles.operation_settings}>
                    <Checkbox>全选</Checkbox>
                  </div>
                </div>
              )}
            >
              <Select.Option value="0">跟随导航栏</Select.Option>
            </Select>
            <div>
              <Tag closable onClose={console.log}>
                Tag 2
              </Tag>
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
              <PieProject />
            </ChartBox>
            {/* 阶段分布 */}
            <ChartBox title={DefaultFilterConditions.STEPS.name}>
              <FunnlProject />
            </ChartBox>
            {/* 时间分布 */}
            <ChartBox title={DefaultFilterConditions.TIME.name}>
              <div>{DefaultFilterConditions.TIME.name}</div>
            </ChartBox>
          </div>
        </div>
      </div>
    )
  }
}
