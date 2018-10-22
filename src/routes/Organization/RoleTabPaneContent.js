import React from 'react'
import { Collapse, Checkbox, Row, Col, TreeSelect, Icon, Dropdown, Menu, Modal  } from 'antd';
import indexStyles from './index.less'
// import RoleChildPanel from './RoleChildPanel'

const CheckboxGroup = Checkbox.Group;
const Panel = Collapse.Panel
const SHOW_PARENT = TreeSelect.SHOW_PARENT;
const treeData = [
  {
    title: '项目1',
    value: '1',
    key: '1',
    children: [{
      title: '流程',
      value: '1-1',
      key: '1-1',
    }],
  }, {
    title: '项目2',
    value: '2',
    key: '2',
    children: [{
      title: '项目2: 流程',
      value: '2-1',
      key: '2-1',
    }, {
      title: '任务',
      value: '2-2',
      key: '2-2',
    }, {
      title: '文档',
      value: '2-3',
      key: '2-3',
    }],
  }];

export default class AuthTabPaneContent extends React.Component {
  state = {
    roleManagerData: [
      {
        title: '超级管理员',
        isDefaultRole: false, //是否默认角色
        isDefaultSystem: true, //是否系统角色
        isCanOperate: false, //是否可操作
        authData: [
          {
            title: '项目管理',
            selects: [1, 2, 3], //已选列表
            indeterminate: false, //是否部分选中
            checkedAll: true,  //是否全选
            optionsData: [
              {
                option: '创建组织项目',
                optionValue: 1
              },
              {
                option: '编辑项目分组',
                optionValue: 2
              },
              {
                option: '主动加入项目',
                optionValue: 3
              }
            ], //权限列表

          }
        ],
        canVisittreeData: treeData, //可访问项目
        treeDataSelects: [],
      }, {
        title: '研发',
        isDefaultRole: true, //是否默认角色
        isDefaultSystem: false, //是否系统角色
        isCanOperate: true, //是否可操作
        authData: [
          {
            title: '项目管理',
            selects: [1, 2, 3], //已选列表
            indeterminate: false, //是否部分选中
            checkedAll: true,  //是否全选
            optionsData: [
              {
                option: '创建组织项目',
                optionValue: 1
              },
              {
                option: '编辑项目分组',
                optionValue: 2
              },
              {
                option: '主动加入项目',
                optionValue: 3
              }
            ], //权限列表

          }
        ],
        canVisittreeData: treeData, //可访问项目
        treeDataSelects: [],
      },
    ]
  };
  // 全选
  onCheckAllChange = ({parentKey,childKey},e) => {
    const { roleManagerData } = this.state
    roleManagerData[parentKey]['authData'][childKey]['checkedAll'] = e.target.checked
    roleManagerData[parentKey]['authData'][childKey]['indeterminate'] = false
    let arr = []
    for(let val of roleManagerData[parentKey]['authData'][childKey]['optionsData']){
      arr.push(val.optionValue)
    }
    roleManagerData[parentKey]['authData'][childKey]['selects'] =  e.target.checked? arr : []
    this.setState({
      roleManagerData
    })
  }
  groupOnChange = ({parentKey,childKey}, checkedList ) => {
    const { roleManagerData } = this.state
    let arr = []
    for(let val of roleManagerData[parentKey]['authData'][childKey]['optionsData']){
      arr.push(val.optionValue)
    }
    roleManagerData[parentKey]['authData'][childKey]['checkedAll'] = checkedList.length === arr.length
    roleManagerData[parentKey]['authData'][childKey]['indeterminate'] = !!checkedList.length && (checkedList.length < arr.length)
    roleManagerData[parentKey]['authData'][childKey]['selects'] =  checkedList
    this.setState({
      roleManagerData
    })
  }
  // 树控件变化
  treeDataonChange = (parentKey, value) => {
    const { roleManagerData } = this.state
    roleManagerData[parentKey]['treeDataSelects'] = value
    this.setState({
      roleManagerData
    })
  }

  //menu点击
  handleMenuClick(board_id, e ) {
    e.domEvent.stopPropagation();
    this.setState({
    })
    const {key} = e
    this.deleteConfirm()
  }
  deleteConfirm(board_id ) {
    const that = this
    Modal.confirm({
      title: '确认删除？',
      okText: '确认',
      cancelText: '取消',
      onOk() {
      }
    });
  }
  render(){
    const { roleManagerData } = this.state
    const menu = (board_id) => {
      return (
        <Menu onClick={this.handleMenuClick.bind(this, board_id)}>
          <Menu.Item key={'1'}  style={{textAlign: 'center',padding:0,margin: 0}}>
            <div className={indexStyles.elseProjectMemu}>
              设为默认
            </div>
          </Menu.Item>
          <Menu.Item key={'2'} style={{textAlign: 'center',padding:0,margin: 0}}>
            <div className={indexStyles.elseProjectMemu}>
              复制
            </div>
          </Menu.Item>
          <Menu.Item key={'3'}  style={{textAlign: 'center',padding:0,margin: 0}}>
            <div className={indexStyles.elseProjectMemu}>
              重命名
            </div>
          </Menu.Item>
          <Menu.Item key={'4'}  style={{textAlign: 'center',padding:0,margin: 0}}>
            <div className={indexStyles.elseProjectDangerMenu}>
              删除
            </div>
          </Menu.Item>
        </Menu>
      );
    }

    return (
      <div className={indexStyles.TabPaneContent}>
        <Collapse accordion>
          {roleManagerData.map((value, parentKey) => {
            const { title, isDefaultRole, isDefaultSystem, isCanOperate, authData =[], canVisittreeData = [], treeDataSelects } = value
            return (
              <Panel header={
                <div className={indexStyles.parrentPanaelHeader}>
                  <div className={indexStyles.parrentPanaelHeader_l}>
                    <div>{title}</div>
                    {isDefaultSystem? (
                      <div>系统角色</div>
                    ):(
                      isDefaultRole ? (<div>默认角色</div>) : ('')
                    )}
                  </div>
                  <div className={indexStyles.parrentPanaelHeader_r}>
                    {isCanOperate?(
                      <Dropdown overlay={menu()}>
                        <Icon type="ellipsis" theme="outlined" />
                      </Dropdown>
                    ):('')}
                  </div>
                </div>} key={parentKey}>
                <div style={{color: '#8c8c8c'}}>可行驶权限：</div>
                <Collapse bordered={false} >
                  {/*二级折叠*/}
                  {authData.map((value, childKey) => {
                    const { optionsData, indeterminate, selects, checkedAll } = value
                    const { title } = value
                    return(
                      <Panel header={<
                        div style={childrenPanelTitle}>
                        <Checkbox
                          indeterminate={this.state.processList_one_indeterminate}
                          onChange={this.onCheckAllChange.bind(this,{parentKey,childKey})}
                          checked={this.state.processList_one_checkAll}
                          style={{marginRight: 12 }} />
                        {title}</div>}
                             style={{...childrenPanelStyles}} key={childKey}>
                        <div className={indexStyles.childrenPanelContent}>
                          <div style={checkBoxAllStyles}>
                            <Checkbox  indeterminate={indeterminate} onChange={this.onCheckAllChange.bind(this,{parentKey,childKey})} checked={checkedAll} style={{marginRight: 12 }}></Checkbox>
                          </div>
                          <Checkbox.Group style={{ width: '100%' }} onChange={this.groupOnChange.bind(this, {parentKey,childKey})} value={selects}>
                            <Row style={childrenPanelRowsStyles}>
                              {optionsData.map((value, key) => {
                                const { optionValue, option } = value
                                return(
                                  <Col span={8}><Checkbox value={optionValue}>{option}</Checkbox></Col>
                                )
                              })}
                            </Row>
                          </Checkbox.Group>
                        </div>
                      </Panel>
                    )
                  })}
                </Collapse>
                <div style={{color: '#8c8c8c', marginTop: 16}}>可访问内容：</div>
                <div style={{marginTop: 10}}>
                  <TreeSelect
                    treeData={canVisittreeData}
                    treeValue={treeDataSelects}
                    onChange={this.treeDataonChange.bind(this, parentKey)}
                    treeCheckable = {true}
                    showCheckedStrategy={SHOW_PARENT}
                    searchPlaceholder={'请选择'}
                    style={{width: '100%',}}
                  />
                </div>
              </Panel>
            )
          })}

        </Collapse>
        <div className={indexStyles.addParrentPanel}>
          <Icon type="plus-circle" theme="outlined" />
        </div>
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

{/*<Panel header="超级管理员" key="1">*/}
{/*</Panel>*/}
{/*<Panel header="团队负责人" key="2">*/}
{/*</Panel>*/}
{/*<Panel header="项目负责人" key="3">*/}
{/*</Panel>*/}
{/*<Panel header="研发" key="4">*/}
{/*</Panel>*/}
// <Panel header={
//   <div className={indexStyles.parrentPanaelHeader}>
{/*<div className={indexStyles.parrentPanaelHeader_l}>*/}
{/*<div>销售</div>*/}
//       <div>默认角色</div>
//     </div>
//     <div className={indexStyles.parrentPanaelHeader_r}>
//       <Dropdown overlay={menu()}>
{/*<Icon type="ellipsis" theme="outlined" />*/}
{/*</Dropdown>*/}
//     </div>
//  </div>} key="5">
//   <div style={{color: '#8c8c8c'}}>可行驶权限：</div>
//   <Collapse bordered={false} >
//     {chirldrenPanel('项目管理')}
//     {chirldrenPanel('成员管理')}
//     {chirldrenPanel('权限分配')}
//     {chirldrenPanel('企业操作')}
//     {chirldrenPanel('流程')}
//     {chirldrenPanel('任务')}
//     {chirldrenPanel('文件')}
{/*</Collapse>*/}
{/*<div style={{color: '#8c8c8c', marginTop: 16}}>可访问内容：</div>*/}
{/*<div style={{marginTop: 10}}>*/}
{/*<TreeSelect {...tProps} />*/}
{/*</div>*/}
{/*</Panel>*/}
{/*<Panel header="运营" key="6">*/}
{/*</Panel>*/}
{/*<Panel header="成员" key="7">*/}
{/*</Panel>*/}
