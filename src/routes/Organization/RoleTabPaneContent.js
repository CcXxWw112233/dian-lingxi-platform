import React from 'react'
import { Collapse, Checkbox, Row, Col, TreeSelect, Icon, Dropdown, Menu, Modal , Button } from 'antd';
import indexStyles from './index.less'
import RenameModal from './RenameModal'

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

const nomaDataObj = { //默认
    title: '',
    isDefaultRole: false, //是否默认角色
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
  }

export default class RoleTabPaneContent extends React.Component {
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
        treeDataSelects: [], //已选择的树
      }, {
        title: '团队负责人',
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
        treeDataSelects: [], //已选择的树
      },{
        title: '项目负责人',
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
        treeDataSelects: [], //已选择的树
      },{
        title: '顾问',
        isDefaultRole: false, //是否默认角色
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
      },{
        title: '研发',
        isDefaultRole: false, //是否默认角色
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
      },{
        title: '销售',
        isDefaultRole: false, //是否默认角色
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
      },{
        title: '运营',
        isDefaultRole: false, //是否默认角色
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
      },{
        title: '成员',
        isDefaultRole: false, //是否默认角色
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
      }
    ],
    renameModalVisable: false, //重命名或添加item modal显示
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

  //menu点击项------------------start
  handleMenuClick(parentKey, e ) {
    e.domEvent.stopPropagation();
    this.setState({
      parentKey
    })
    const { key } = e
    switch (key) {
      case '1':
        this.setDefaut(parentKey)
        break
      case '2':
        this.copyPanelItem(parentKey)
        break
      case '3':
        this.refactorName(parentKey)
        break
      case '4':
        this.deleteConfirm(parentKey)
        break
      default:
        break
    }
  }
  setDefaut(parentKey) {
    const { roleManagerData } = this.state
    roleManagerData[parentKey]['isDefaultRole'] = true
    this.setState({
      roleManagerData
    })
  }
  copyPanelItem(parentKey) {
    const { roleManagerData } = this.state
    const newObj = roleManagerData[parentKey]
    roleManagerData.push(newObj)
    this.setState({
      roleManagerData
    })
  }
  refactorName(parentKey) {
    this.setState({
      reName_Add_type: '1'
    })
    this.setRenameModalVisable()
  }
  setRenameModalVisable() {
    this.setState({
      renameModalVisable: !this.state.renameModalVisable
    })
  }
  reNamePanelItem(values) {
    const { name } = values
    const { roleManagerData, parentKey } = this.state
    roleManagerData[parentKey]['title'] = name
    this.setState({
      roleManagerData
    })
  }
  deleteConfirm(parentKey ) {
    const that = this
    Modal.confirm({
      title: '确认删除？',
      okText: '确认',
      cancelText: '取消',
      onOk() {
        that.deletePanelItem(parentKey)
      }
    });
  }
  deletePanelItem(parentKey) {
    const { roleManagerData } = this.state
    roleManagerData.splice(parentKey, 1)
    this.setState({
      roleManagerData
    })
  }
  //menu点击项------------------end

  addPanel() {
    this.setState({
      reName_Add_type: '2'
    })
    this.setRenameModalVisable()
  }
  addPanelItem(values) {
    const { name } = values
    const { roleManagerData } = this.state
    const obj = {...nomaDataObj}
    obj['title'] = name
    roleManagerData.push(obj)
    this.setState({
      roleManagerData
    })
  }

  finallySave() {

  }
  render(){
    const { roleManagerData } = this.state
    const operateMenu = (parentKey) => {
      return (
        <Menu onClick={this.handleMenuClick.bind(this, parentKey)}>
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
                      <Dropdown overlay={operateMenu(parentKey)}>
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
                          disabled={!isCanOperate}
                          indeterminate={indeterminate}
                          onChange={this.onCheckAllChange.bind(this,{parentKey,childKey})}
                          checked={checkedAll}
                          style={{marginRight: 12 }} />
                          {title}</div>}
                             style={{...childrenPanelStyles}} key={childKey}>
                        <div className={indexStyles.childrenPanelContent}>
                          <div style={checkBoxAllStyles}>
                            <Checkbox disabled={!isCanOperate} indeterminate={indeterminate} onChange={this.onCheckAllChange.bind(this,{parentKey,childKey})} checked={checkedAll} style={{marginRight: 12 }}></Checkbox>
                          </div>
                          <Checkbox.Group style={{ width: '100%' }} onChange={this.groupOnChange.bind(this, {parentKey,childKey})} value={selects} disabled={!isCanOperate}>
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
        <div className={indexStyles.addParrentPanel} onClick={this.addPanel.bind(this)}>
          <Icon type="plus-circle" theme="outlined" />
        </div>
        {/*重命名,添加*/}
        <RenameModal reName_Add_type={this.state.reName_Add_type} renameModalVisable={this.state.renameModalVisable} reNamePanelItem={this.reNamePanelItem.bind(this)} addPanelItem={this.addPanelItem.bind(this)} setRenameModalVisable={this.setRenameModalVisable.bind(this)}/>
        <div style={{margin: '0 auto',marginTop: 20, textAlign: 'center'}}>
          <Button type={'primary'}  onClick={this.finallySave.bind(this)}>保存</Button>
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

