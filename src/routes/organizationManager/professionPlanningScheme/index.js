import React, { Component } from 'react'
import PlanningSchemeItem from './component/PlanningSchemeItem'
import indexStyles from './index.less'
import globalStyles from '@/globalset/css/globalClassName.less'
import { ORGANIZATION, PROJECTS } from "@/globalset/js/constant";
import { currentNounPlanFilterName } from "@/utils/businessFunction";
import planning from '../../../assets/organizationManager/planning.png'
import PlanningSchemeContainer from './component/PlanningSchemeContainer'
import { connect } from 'dva'

@connect()
export default class index extends Component {

  state = {
    whetherShowPlanDetail: false, // 是否显示方案详情
  }

  // 更新该组件中的state
  updateStateDatas = (datas) => {
    this.setState({ ...datas })
  }

  // 点击新建方案
  handleAddNewPlan = () => {
    this.props.dispatch({
      type: 'organizationManager/updateDatas',
      payload: {
        isAddNewPlan: true
      }
    })

    this.setState({
      whetherShowPlanDetail: true
    })
  }

  render() {
    const { whetherShowPlanDetail } = this.state
    return (
      <div>

        <div className={indexStyles.title}>
          <div className={`${globalStyles.authTheme} ${indexStyles.title_icon}`}>&#xe684;</div>
          <div style={{ fontSize: '20px', fontWeight: 900, color: 'rgba(0,0,0,0.65)', letterSpacing: '4px' }}>{`${currentNounPlanFilterName(PROJECTS)}解决方案`}</div>
        </div>
        {/* 新建规划方案列表 */}
        {
          whetherShowPlanDetail ? (
            <div><PlanningSchemeContainer updateStateDatas={this.updateStateDatas}/></div>
          ) : (
              <div className={indexStyles.plan_list_wrapper} onClick={this.handleAddNewPlan}>
                <div className={`${indexStyles.add_plan} ${indexStyles.margin_right}`}>
                  <span className={`${globalStyles.authTheme} ${indexStyles._add_plan_name}`}>&#xe8fe; 新建方案</span>
                </div>
                {/* 项目默认方案 */}
                <div style={{ position: 'relative' }} className={indexStyles.margin_right}>
                  <img src={planning} width={'148px'} height={'100px'} />
                  <span className={indexStyles.plan_default_name}>城市规划方案</span>
                </div>

              </div>
            )
        }
      </div>
    )
  }
}
