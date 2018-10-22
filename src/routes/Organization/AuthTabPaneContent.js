import React from 'react'
import { Collapse, Checkbox, Row, Col } from 'antd';
import indexStyles from './index.less'
const CheckboxGroup = Checkbox.Group;
const Panel = Collapse.Panel

const processList_one_array = [1,2,3,4,5] //编辑流程模板选项全部值

export default class AuthTabPaneContent extends React.Component {
  state = {
    processList_one_checkedList: processList_one_array,
    processList_one_indeterminate: false,
    processList_one_checkAll: true,
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
  render(){

    return (
      <div className={indexStyles.TabPaneContent}>
        <Collapse accordion>
          <Panel header="项目管理" key="1">
          </Panel>
          <Panel header="成员管理" key="2">
          </Panel>
          <Panel header="权限分配" key="3">
          </Panel>
          <Panel header="企业操作" key="4">
          </Panel>
          <Panel header="流程" key="5">
            <Collapse bordered={false} >
              <Panel header={<div style={childrenPanelTitle}>
                <Checkbox  indeterminate={this.state.processList_one_indeterminate} onChange={this.onCheckAllChange.bind(this,'1')} checked={this.state.processList_one_checkAll} style={{marginRight: 12 }} />
                编辑流程模板
              </div>} key="5_1" style={{...childrenPanelStyles}}>
                <div className={indexStyles.childrenPanelContent}>
                  <div style={checkBoxAllStyles}>
                    <Checkbox  indeterminate={this.state.processList_one_indeterminate} onChange={this.onCheckAllChange.bind(this,'1')} checked={this.state.processList_one_checkAll} style={{marginRight: 12 }}></Checkbox>
                  </div>
                  <Checkbox.Group style={{ width: '100%' }} onChange={this.onChange.bind(this, '1')} value={this.state.processList_one_checkedList}>
                    <Row style={childrenPanelRowsStyles}>
                      <Col span={8}><Checkbox value={1}>总监</Checkbox></Col>
                      <Col span={8}><Checkbox value={2}>研发</Checkbox></Col>
                      <Col span={8}><Checkbox value={3}>销售</Checkbox></Col>
                      <Col span={8}><Checkbox value={4}>运营</Checkbox></Col>
                      <Col span={8}><Checkbox value={5}>秘书</Checkbox></Col>
                    </Row>
                  </Checkbox.Group>
                </div>
              </Panel>
              <Panel header="增删流程模板" key="5_2" style={{...childrenPanelStyles}}>
                {2}
              </Panel>
              <Panel header="删除流程" key="5_3" style={{...childrenPanelStyles}}>
                {3}
              </Panel>
              <Panel header="终止流程" key="5_4"  style={{...childrenPanelStyles}}>
                {4}
              </Panel>
            </Collapse>
          </Panel>
          <Panel header="任务" key="6">
          </Panel>
          <Panel header="文件" key="7">
          </Panel>
        </Collapse>
      </div>
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
