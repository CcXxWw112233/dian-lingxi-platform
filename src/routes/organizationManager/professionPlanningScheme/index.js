import React, { Component } from 'react'
import indexStyles from './index.less'
import globalStyles from '@/globalset/css/globalClassName.less'
import { ORGANIZATION, PROJECTS } from "@/globalset/js/constant";
import { currentNounPlanFilterName } from "@/utils/businessFunction";
import planning from '../../../assets/organizationManager/planning.png'
import PlanningSchemeContainer from './PlanningSchemeContainer'
import { connect } from 'dva'
import { Tooltip } from 'antd';

@connect(mapStateToProps)
export default class index extends Component {

  state = {
    whetherShowPlanDetail: false, // 是否显示方案详情
  }

  // 更新该组件中的state
  updateStateDatas = (datas) => {
    this.setState({ ...datas })
  }

  componentDidMount() {
    // console.log("进来了", 'sssssssss')
    this.props.dispatch({
      type: 'organizationManager/getTemplateList',
      payload: {

      }
    })
  }

  // 点击新建方案
  handleAddNewPlan = () => {
    this.props.dispatch({
      type: 'organizationManager/updateDatas',
      payload: {
        isAddNewPlan: true
      }
    })
    this.whetherShowPlanDetail()
  }

  // 其他项目列表的点击事件
  handleOperatorOthersPlan = (id) => {
    // console.log(id, 'sssssssssss_id')
    this.whetherShowPlanDetail()
    this.props.dispatch({
      type: 'organizationManager/getTemplateListContainer',
      payload: {
        template_id: id
      }
    })
  }

  // 是否显示详情页
  whetherShowPlanDetail = () => {
    this.setState({
      whetherShowPlanDetail: true
    })
  }

  render() {
    const { whetherShowPlanDetail } = this.state
    const { templateList = [] } = this.props
    return (
      <div>

        <div className={indexStyles.title}>
          <div className={`${globalStyles.authTheme} ${indexStyles.title_icon}`}>&#xe684;</div>
          <div style={{ fontSize: '20px', fontWeight: 900, color: 'rgba(0,0,0,0.65)', letterSpacing: '4px' }}>{`${currentNounPlanFilterName(PROJECTS)}解决方案`}</div>
        </div>
        {/* 新建规划方案列表 */}
        {
          whetherShowPlanDetail ? (
            <div><PlanningSchemeContainer updateStateDatas={this.updateStateDatas} /></div>
          ) : (
              <div className={indexStyles.plan_list_wrapper}>
                <div className={`${indexStyles.add_plan} ${indexStyles.margin_right}`} onClick={this.handleAddNewPlan}>
                  <span className={`${globalStyles.authTheme} ${indexStyles._add_plan_name}`}>&#xe8fe; 新建方案</span>
                </div>
                {/* 项目默认方案 */}
                {
                  templateList && templateList.map(item => {
                    let { template_type, id } = item
                    return(
                      template_type == '1' ? (
                        <div key={item.id} style={{ position: 'relative', marginRight: '16px' }} className={indexStyles.margin_right} onClick={(e) => { this.handleOperatorOthersPlan(id, e) }}>
                          <img src={planning} width={'140px'} height={'100px'} />
                          <span className={indexStyles.plan_default_name}>{item.name}</span>
                        </div>
                      ) : (
                          <div key={item.id} style={{ position: 'relative' }} className={`${indexStyles.margin_right} ${indexStyles.others_list}`} onClick={(e) => { this.handleOperatorOthersPlan(id,e) }}>
                            <Tooltip placement="top" title={item.name}>
                              <span className={indexStyles.plan_name}>{item.name}</span>
                            </Tooltip>
                          </div>
                        )
                    )
                  })
                }
              </div>
            )
        }
      </div>
    )
  }
}

function mapStateToProps({
  organizationManager: {
    datas: {
      isAddNewPlan,
      templateList = []
    }
  }
}) {
  return {
    isAddNewPlan,
    templateList
  }
}
