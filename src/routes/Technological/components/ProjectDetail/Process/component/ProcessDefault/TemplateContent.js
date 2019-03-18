import React from 'react'
import indexStyles from '../../index.less'
import { Avatar } from 'antd'
import {ORGANIZATION, TASKS, FLOWS, DASHBOARD, PROJECTS, FILES, MEMBERS, CATCH_UP} from "../../../../../../../globalset/js/constant";
import {currentNounPlanFilterName} from "../../../../../../../utils/businessFunction";
import globalStyles from '../../../../../../../globalset/css/globalClassName.less'
import { Collapse } from 'antd';
const Panel = Collapse.Panel;

export default class TemplateContent extends React.Component {
  state = {

  }

  render() {
    const data = [1, 2, 3, 41, 2, 31, 2, 3, 41, 2, 31, 2, 3, 41, 2, 31, 2, 3, 41, 2, 31, 2, 3, 41, 2, 3]
    const { clientHeight } = this.props
    const maxContentHeight = clientHeight - 108 - 160
    return (
      <div className={indexStyles.content} >
        <div className={indexStyles.paginationContent} style={{maxHeight: maxContentHeight}}>
          {data.map((value, key) => {
            return (
              <div className={indexStyles.tem_item}>
                <div className={`${indexStyles.tem_item_l} ${globalStyles.authTheme}`}>&#xe605;</div>
                <div className={indexStyles.tem_item_m}>
                  <div className={indexStyles.title}>流程模板名称埃里克记得哈快乐圣诞节</div>
                  <div className={indexStyles.tem_item_flow}>
                    {[1, 2, 3, 4].map((value, key) => {
                      return (
                        <div className={indexStyles.tem_item_flow_item}>流程步骤<span className={globalStyles.authTheme}>&#xe7eb;</span></div>
                      )
                    })}
                  </div>
                </div>
                <div className={`${indexStyles.tem_item_r} ${globalStyles.authTheme}`}>&#xe7eb;</div>
              </div>
            )
          })}
        </div>
        <div className={indexStyles.add}>新增模板</div>
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
