import React from 'react'
import indexStyle from './index.less'
import globalStyles from '../../../../globalset/css/globalClassName.less'
import { Icon, Menu, Dropdown, Tooltip, Collapse, Card } from 'antd'
import CollectionProject from './CollectionProject'
import ElseProject from './ElseProject'
import AddModalForm from "./AddModalForm";
import ShowAddMenberModal from './ShowAddMenberModal'
import { checkIsHasPermission } from '../../../../utils/businessFunction'
import {MESSAGE_DURATION_TIME, NOT_HAS_PERMISION_COMFIRN, TEAM_BOARD_CREATE} from "../../../../globalset/js/constant";
import { message } from 'antd'

const Panel = Collapse.Panel

export default class Projectlist extends React.Component {

  addItem() {
    if(!checkIsHasPermission(TEAM_BOARD_CREATE)){
      message.warn(NOT_HAS_PERMISION_COMFIRN, MESSAGE_DURATION_TIME)
      return false
    }
    this.props.showModal()
  }
  render() {
    const { datas = {} } = this.props.model
    const { projectList = {} }  = datas
    const { star = [], create = [], participate = [] } = projectList

    const addItem = (
      <div className={indexStyle.addListItem} onClick={this.addItem.bind(this)}>
        <Icon type="plus-circle-o" style={{fontSize: 18, color: '#8c8c8c',marginTop: 6}} />
      </div>
    )
    return (
      <div className={indexStyle.projectListOut}>
        <Collapse accordion bordered={false} style={{backgroundColor:'#f5f5f5',marginTop: 30}} >
          <Panel header="我收藏的项目" key="1"  style={customPanelStyle}>
            {star.map((value, key) => (
              <ElseProject {...this.props} itemDetailInfo={value} key={key}/>
            ))}
            {/*{addItem}*/}
          </Panel>
          <Panel header="我管理的项目" key="2"  style={customPanelStyle}>
            {create.map((value, key) => (
              <ElseProject {...this.props}  itemDetailInfo={value} key={key}/>
            ))}
            {addItem}
          </Panel>
          <Panel header="我参与的项目" key="3"  style={customPanelStyle}>
            {participate.map((value, key) => (
              <ElseProject {...this.props}  itemDetailInfo={value} key={key}/>
            ))}
            {/*{addItem}*/}
          </Panel>
        </Collapse>
        <AddModalForm {...this.props}></AddModalForm>
        {/*<ShowAddMenberModal {...this.props}></ShowAddMenberModal>*/}
      </div>
    )
  }
}
const customPanelStyle = {
  background: '#f5f5f5',
  borderRadius: 4,
  fontSize:16,
  marginBottom: 20,
  border: 0,
  overflow: 'hidden',
};
