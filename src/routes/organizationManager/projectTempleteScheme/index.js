import React, { Component } from 'react'
import indexStyles from './index.less'
import globalStyles from '@/globalset/css/globalClassName.less'
import { ORGANIZATION, PROJECTS } from "@/globalset/js/constant";
import { currentNounPlanFilterName } from "@/utils/businessFunction";
import planning from '../../../assets/organizationManager/planning.png'
import { connect } from 'dva'
import { Tooltip, Modal } from 'antd';
import TempleteSchemeDetail from './TempleteSchemeDetail'
import CreateTempleteScheme from './CreateTempleteScheme'

@connect(mapStateToProps)
export default class index extends Component {

  state = {
    whetherShowSchemeDetail: false, // 是否显示详情页
    projectSchemeBreadCrumbList: [], // 当前方案的面包屑路径
    current_templete_id: '', // 当前点击的方案ID
    current_templete_name: '', // 当前的方案名称
  }

  componentDidMount() {
    this.props.dispatch({
      type: 'organizationManager/getTemplateList',
      payload: {

      }
    })
  }

  // 更新该组件中的state
  updateStateDatas = (datas) => {
    this.setState({ ...datas })
  }

  handleOperatorSchemeList = ({ id, name }) => {
    if (id != '0') {
      this.props.dispatch({
        type: 'organizationManager/getTemplateListContainer',
        payload: {
          template_id: id
        }
      })
      this.props.dispatch({
        type: 'organizationManager/updateDatas',
        payload: {
          currentTempleteId: id
        }
      })
    }

    this.setState({
      whetherShowSchemeDetail: true,
      current_templete_id: id,
      current_templete_name: name
    })
  }

  handleDeleteTemplete = (e, id) => {
    e && e.stopPropagation()
    const that = this
    Modal.confirm({
      title: '删除模板',
      content: '确认删除该模板吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        this.props.dispatch({
          type: 'organizationManager/deleteTemplete',
          payload: {
            id: id
          }
        })
      }
    });
    
  }

  // 渲染初始列表状态
  renderInitTempleteList = () => {
    const { projectTemplateList = [] } = this.props
    return (
      <div className={indexStyles.plan_list_wrapper}>
        <div className={`${indexStyles.add_plan} ${indexStyles.margin_right}`} onClick={() => { this.handleOperatorSchemeList({ id:'0', name:'全部方案' }) }}>
          <span className={`${globalStyles.authTheme} ${indexStyles._add_plan_name}`}>&#xe8fe; 新建方案</span>
        </div>
        {
          projectTemplateList && projectTemplateList.map(item => {
            let { template_type, id, name } = item
            return (
              template_type == '1' ? (
                <div key={item.id} style={{ position: 'relative', marginRight: '16px' }} className={indexStyles.margin_right} onClick={() => { this.handleOperatorSchemeList({ id, name }) }}>
                  <img src={planning} width={'140px'} height={'100px'} />
                  <span className={indexStyles.plan_default_name}>{item.name}</span>
                </div>
              ) : (
                  <div key={item.id} style={{ position: 'relative' }} className={`${indexStyles.margin_right} ${indexStyles.others_list}`} onClick={() => { this.handleOperatorSchemeList({ id, name }) }}>
                    <Tooltip title="删除模板" placement="top">
                      <span onClick={(e) => { this.handleDeleteTemplete(e, item.id) }} className={`${globalStyles.authTheme} ${indexStyles.del_temp}`}>&#xe7c3;</span>
                    </Tooltip>
                    <Tooltip placement="bottom" title={item.name}>
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

  // 渲染每一个列表详情
  renderEverySchemeItem = () => {
    let { projectSchemeBreadCrumbList, current_templete_id, current_templete_name } = this.state
    return (current_templete_id == '0' ?
      <CreateTempleteScheme 
        updateStateDatas={this.updateStateDatas}
      /> :
      <TempleteSchemeDetail
        current_templete_id={current_templete_id}
        current_templete_name={current_templete_name}
        updateStateDatas={this.updateStateDatas}
      />
    )
  }

  render() {
    const { whetherShowSchemeDetail } = this.state
    return (
      <div>
        {/* title 标题 */}
        <div className={indexStyles.title}>
          <div className={`${globalStyles.authTheme} ${indexStyles.title_icon}`}>&#xe684;</div>
          <div style={{ fontSize: '20px', fontWeight: 900, color: 'rgba(0,0,0,0.65)', letterSpacing: '4px' }}>{`${currentNounPlanFilterName(PROJECTS)}解决方案`}</div>
        </div>
        {
          whetherShowSchemeDetail ? this.renderEverySchemeItem() : this.renderInitTempleteList()
        }
      </div>
    )
  }
}

function mapStateToProps({
  organizationManager: {
    datas: {
      // whetherShowSchemeDetail,
      projectTemplateList = [],
    }
  }
}) {
  return {
    // whetherShowSchemeDetail,
    projectTemplateList,
  }
}
