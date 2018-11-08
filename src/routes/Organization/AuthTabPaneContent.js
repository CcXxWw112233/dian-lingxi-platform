import React from 'react'
import { Collapse, Checkbox, Row, Col, TreeSelect, Icon, Dropdown, Menu, Modal , Button } from 'antd';
import indexStyles from './index.less'
import RenameModal from './RenameModal'

const CheckboxGroup = Checkbox.Group;
const Panel = Collapse.Panel
const SHOW_PARENT = TreeSelect.SHOW_PARENT;

export default class AuthTabPaneContent extends React.Component {
  state = {
  };
  // 全选
  onCheckAllChange = ({parentKey,childKey},e) => {
    const { datas: { permission_data = [] } } = this.props.model
    permission_data[parentKey]['child_data'][childKey]['checkedAll'] = e.target.checked
    permission_data[parentKey]['child_data'][childKey]['indeterminate'] = false
    let arr = []
    for(let val of permission_data[parentKey]['child_data'][childKey]['role_data']){
      arr.push(val.id)
    }
    permission_data[parentKey]['child_data'][childKey]['already_has_role'] =  e.target.checked? arr : []
    this.props.updateDatas({permission_data})
  }
  groupOnChange = ({parentKey,childKey}, checkedList ) => {
    const { datas: { permission_data = [] } } = this.props.model
    let arr = []
    for(let val of permission_data[parentKey]['child_data'][childKey]['role_data']){
      arr.push(val.id)
    }
    permission_data[parentKey]['child_data'][childKey]['checkedAll'] = checkedList.length === arr.length
    permission_data[parentKey]['child_data'][childKey]['indeterminate'] = !!checkedList.length && (checkedList.length < arr.length)
    permission_data[parentKey]['child_data'][childKey]['already_has_role'] =  checkedList
    this.props.updateDatas({permission_data})

  }

  finallySave({value, parentKey}) {
    console.log(parentKey, value)
    const { datas: { permission_data = [] } } = this.props.model
    let objdata = []
    for(let i = 0; i < permission_data.length; i++) {
      for(let j = 0; j < permission_data[i]['child_data'].length; j ++) {
        const obj = {
          function_id: permission_data[i]['child_data'][j]['id']
        }
        obj['role_data'] = []
        obj['role_data'] = obj['role_data'].concat(permission_data[i]['child_data'][j]['already_has_role'])
        obj['role_data'] = Array.from(new Set(obj['role_data']))
        objdata.push(obj)
      }
    }
    this.props.savePermission(objdata)
  }
  render(){
    const { datas: { permission_data = [] } } = this.props.model
    console.log(permission_data)
    return (
      <div className={indexStyles.TabPaneContent}>
        <Collapse accordion>
          {permission_data.map((value, parentKey) => {
            const { name, isCanOperate, child_data =[],} = value
            return (
              <Panel header={
                <div className={indexStyles.parrentPanaelHeader}>
                  <div className={indexStyles.parrentPanaelHeader_l}>
                    <div>{name}</div>
                  </div>
                </div>} key={parentKey}>
                <Collapse bordered={false} >
                  {/*二级折叠*/}
                  {child_data.map((value, childKey) => {
                    const { name, role_data = [],already_has_role = [], indeterminate, checkedAll } = value
                    return(
                      <Panel header={<
                        div style={childrenPanelTitle}>
                        <Checkbox
                          indeterminate={indeterminate}
                          onChange={this.onCheckAllChange.bind(this,{parentKey,childKey})}
                          checked={checkedAll}
                          style={{marginRight: 12 }} />
                        {name}</div>}
                             style={{...childrenPanelStyles}} key={childKey}>
                        <div className={indexStyles.childrenPanelContent}>
                          <div style={checkBoxAllStyles}>
                            <Checkbox  indeterminate={indeterminate} onChange={this.onCheckAllChange.bind(this,{parentKey,childKey})} checked={checkedAll} style={{marginRight: 12 }}></Checkbox>
                          </div>
                          <Checkbox.Group style={{ width: '100%' }} onChange={this.groupOnChange.bind(this, {parentKey,childKey})} value={already_has_role}>
                            <Row style={childrenPanelRowsStyles}>
                              {role_data.map((value, key) => {
                                const { name, id } = value
                                return(
                                  <Col span={8}><Checkbox value={id}>{name}</Checkbox></Col>
                                )
                              })}
                            </Row>
                          </Checkbox.Group>
                        </div>
                      </Panel>
                    )
                  })}
                </Collapse>
                {/*保存*/}
                <div style={{margin: '0 auto',marginTop: 20, textAlign: 'center'}}>
                  <Button type={'primary'}  onClick={this.finallySave.bind(this, {value, parentKey})}>保存</Button>
                </div>
              </Panel>
            )
          })}
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

