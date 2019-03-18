import React from 'react'
import indexStyles from '../../index.less'
import { Avatar } from 'antd'
import {ORGANIZATION, TASKS, FLOWS, DASHBOARD, PROJECTS, FILES, MEMBERS, CATCH_UP} from "../../../../../../../globalset/js/constant";
import {currentNounPlanFilterName} from "../../../../../../../utils/businessFunction";
import globalStyles from '../../../../../../../globalset/css/globalClassName.less'
import { Collapse } from 'antd';
const Panel = Collapse.Panel;

export default class PagingnationContent extends React.Component {
  state = {

  }

  render() {
    const data = [1, 2, 3, 41, 2, 31, 2, 3, 41, 2, 31, 2, 3, 41, 2, 31, 2, 3, 41, 2, 31, 2, 3, 41, 2, 3]
    const { clientHeight } = this.props
    const maxContentHeight = clientHeight - 108 - 150
    const PanelHeader = (value) => {
      return (
        <div className={indexStyles.panelHead}>
          <div className={`${indexStyles.panelHead_l} ${globalStyles.authTheme}`}>&#xe605;</div>
          <div className={indexStyles.panelHead_m}>
            <div className={indexStyles.panelHead_m_l}>流程实例名称</div>
            <div className={indexStyles.panelHead_m_r}>当前步骤名称</div>
          </div>
          <div className={indexStyles.panelHead_r}>
            <div className={indexStyles.panelHead_r_l}>||||||||||||||||||||</div>
            <div className={indexStyles.panelHead_r_m}>30%</div>
            <div className={indexStyles.panelHead_r_r}>
              <Avatar size="small" icon="user" />
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className={indexStyles.paginationContent} style={{maxHeight: maxContentHeight}}>
        <Collapse
            bordered={false}
            style={{backgroundColor: '#f5f5f5', marginTop: 4}}>
            {data.map((value, key) => {
              return (
                <Panel header={PanelHeader()} key={key} style={customPanelStyle} />
              )
            })}
          </Collapse>
      </div>
    )
  }
}
const customPanelStyle = {
  background: '#f5f5f5',
  borderRadius: 4,
  fontSize: 16,
  border: 0,
  marginLeft: 10,
  overflow: 'hidden',
};
