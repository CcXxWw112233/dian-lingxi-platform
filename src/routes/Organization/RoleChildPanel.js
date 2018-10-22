import React from 'react'
import indexStyles from './index.less'
import {Checkbox , Collapse, Row, Col} from 'antd'
const Panel = Collapse.Panel

const processList_one_array = [1,2,3,4,5] //编辑流程模板选项全部值
export default class RoleChildPanel extends React.Component {
  state = {
    processList_one_checkedList: processList_one_array,
    processList_one_indeterminate: false,
    processList_one_checkAll: false,
  };
  onChange = (code, checkedList) => {
    this.setState({
      processList_one_checkedList: checkedList,
      processList_one_indeterminate: !!checkedList.length && (checkedList.length < processList_one_array.length),
      processList_one_checkAll: checkedList.length === processList_one_array.length,
    })
  }

  onCheckAllChange = (code,e) => {
    this.setState({
      processList_one_checkedList: e.target.checked ? processList_one_array : [],
      processList_one_indeterminate: false,
      processList_one_checkAll: e.target.checked,
    });
  }
  render() {
    return (
      <Panel header={<div style={childrenPanelTitle}>
        <Checkbox  indeterminate={this.state.processList_one_indeterminate} onChange={this.onCheckAllChange.bind(this,'1')} checked={this.state.processList_one_checkAll} style={{marginRight: 12 }} />
        项目管理
      </div>} key="5_1" style={{...childrenPanelStyles}}>
        <div className={indexStyles.childrenPanelContent}>
          <div style={checkBoxAllStyles}>
            <Checkbox  indeterminate={this.state.processList_one_indeterminate} onChange={this.onCheckAllChange.bind(this,'1')} checked={this.state.processList_one_checkAll} style={{marginRight: 12 }}></Checkbox>
          </div>
          <Checkbox.Group style={{ width: '100%' }} onChange={this.onChange.bind(this, '1')} value={this.state.processList_one_checkedList}>
            <Row style={childrenPanelRowsStyles}>
              <Col span={8}><Checkbox value={1}>创建组织项目</Checkbox></Col>
              <Col span={8}><Checkbox value={2}>编辑项目分组</Checkbox></Col>
              <Col span={8}><Checkbox value={3}>主动加入项目</Checkbox></Col>
            </Row>
          </Checkbox.Group>
        </div>
      </Panel>
    )
  }
}

const childrenPanelStyles = { //子panel
  borderBottom: '1px dashed rgba(0,0,0,.2)',
  position: 'relative',
}
const checkBoxAllStyles = { //全选checkbox外层div
  position: 'absolute',
  top: 12,
  left: 40}
const childrenPanelRowsStyles  = { //子panel下的Row
  lineHeight: '34px'
}
const childrenPanelTitle = {
  paddingLeft: 0
}
