import React from 'react'
import indexStyle from './index.less'
import globalStyles from '../../../../globalset/css/globalClassName.less'
import { Icon, Menu, Dropdown, Tooltip, Collapse, Card } from 'antd'
import CollectionProject from './CollectionProject'
import ElseProject from './ElseProject'
import AddModalForm from "./AddModalForm";

const Panel = Collapse.Panel

export default class Projectlist extends React.Component {

  projectNameMouseOVer() {
    console.log(111)
  }
  render() {
    const addItem = (
      <div className={indexStyle.addListItem} onClick={this.props.showModal}>
        <Icon type="plus-circle-o" style={{fontSize: 18, color: '#8c8c8c',marginTop: 6}} />
      </div>
    )
    return (
      <div className={indexStyle.projectListOut}>
        <Collapse accordion bordered={false} style={{backgroundColor:'#f5f5f5',marginTop: 30}} defaultActiveKey={['2']}>
          <Panel header="我收藏的项目" key="1"  style={customPanelStyle}>
             <CollectionProject {...this.props}/>
            {addItem}
          </Panel>
          <Panel header="我管理的项目" key="2"  style={customPanelStyle}>
            <ElseProject {...this.props}/>
            {addItem}
          </Panel>
          <Panel header="我参与的项目" key="3"  style={customPanelStyle}>

          </Panel>
        </Collapse>
        <AddModalForm {...this.props}></AddModalForm>
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
