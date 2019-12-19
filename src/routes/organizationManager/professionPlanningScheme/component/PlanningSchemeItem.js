import React, { Component } from 'react'
import { Tree, Collapse, Icon } from 'antd'
import indexStyles from '../index.less'
import globalStyles from '@/globalset/css/globalClassName.less'
const { TreeNode } = Tree;
const { Panel } = Collapse;

export default class PlanningSchemeItem extends Component {

  state = {
    planningData: [
      { id: 'parent_1', name: '前期调研', type: 'lcb', parent_id: '0', child_data: [{ id: 'child_1', name: '规划', parent_id: 'parent_1', type: 'task', child_data: [{ id: 'child_1-1', name: '上位政策解读', parent_id: 'child_1', child_data: [], type: 'task' }] }, { id: 'child_2', name: '市政', parent_id: 'parent_1', child_data: [], type: 'task' }] },
      { id: 'parent_2', name: '初次方案', type: 'lcb', parent_id: '0', child_data: [] },
      { id: 'parent_3', name: '沟通讨论', type: 'lcb', parent_id: '0', child_data: [] },
      { id: 'parent_4', name: '深化方案', type: 'lcb', parent_id: '0', child_data: [{ id: 'child_4-1', name: '规划', parent_id: 'parent_4', type: 'task', child_data: [{ id: 'child_4-1-1', name: '上位政策解读', parent_id: 'child_4-1', child_data: [], type: 'task' }] }] },
    ],
  }

  onChange = (e) => {
    console.log(e, 'sssssssss')
  }

  // 渲染树状列表的title
  renderPlanTreeTitle = ({ type, name }) => {
    let icon = ''
    if (type == 'lcb') {
      icon = <span className={globalStyles.authTheme} style={{ color: '#FAAD14', fontSize: '18px', marginRight: '6px' }}>&#xe6ef;</span>
    } else {
      icon = <span className={globalStyles.authTheme} style={{ color: '#18B2FF', fontSize: '18px', marginRight: '6px' }}>&#xe6f0;</span>
    }
    return (
      <div className={indexStyles.panel_header} style={{ display: 'flex', alignItems: 'center' }}>
        {icon}
        <span style={{flex:1}}>{name}</span>
        <div className={indexStyles.icon_list} style={{alignSelf: 'flex-end'}}>
          <span className={globalStyles.authTheme}>&#xe6f1;</span>
          <span className={globalStyles.authTheme}>&#xe6f2;</span>
          <span className={globalStyles.authTheme}>&#xe7c3;</span>
        </div>
      </div>
    )
  }

  renderPlanTreeNode = (data) => {
    return data && data.map(item => {
      let { type, name } = item
      if (item.child_data && item.child_data.length > 0) {
        return (
          <Panel forceRender={false} showArrow={true} header={this.renderPlanTreeTitle({ type, name })} key={item.id} dataRef={item} >
            {/* <div>{this.renderPlanTreeNode(item.child_data)}</div> */}
            <Collapse onChange={this.onChange} bordered={false}>
              {this.renderPlanTreeNode(item.child_data)}
            </Collapse>
          </Panel>
        );
      } else {
        return <Panel forceRender={false} className={indexStyles.not_arrow} showArrow={false} header={this.renderPlanTreeTitle({ type, name })} key={item.id} dataRef={item}/>;
      }

    });
  }


  render() {
    const { planningData = [] } = this.state

    return (
      <div className={indexStyles.treeNodeWrapper}>
        <Collapse bordered={false} onChange={this.onChange}>
          {this.renderPlanTreeNode(planningData)}
          {/* <Panel showArrow={true} header={this.renderPlanTreeTitle({ type: 'lcb', name: '我的天' })} key={'1'}><div>{this.renderPlanTreeTitle({type: 'lcb',name: 'wodet'})}</div></Panel> */}
        </Collapse>
      </div>
    )
  }
}
