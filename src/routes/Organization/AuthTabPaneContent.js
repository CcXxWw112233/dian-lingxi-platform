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

export default class AuthTabPaneContent extends React.Component {
  state = {
    roleManagerData: [
      {
        title: '项目管理',
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
        title: '成员管理',
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
        title: '权限分配',
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
        title: '企业操作',
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
        title: '流程',
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
        title: '任务',
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
        title: '文件',
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

                  </div>
                </div>} key={parentKey}>
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
              </Panel>
            )
          })}
        </Collapse>
        {/*保存*/}
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

