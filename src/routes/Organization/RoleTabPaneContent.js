import React from 'react'
import { Collapse, Checkbox, Row, Col, TreeSelect, Icon, Dropdown, Menu, Modal , Button, Tree } from 'antd';
import indexStyles from './index.less'
import RenameModal from './RenameModal'
const TreeNode = Tree.TreeNode;

const CheckboxGroup = Checkbox.Group;
const Panel = Collapse.Panel
const SHOW_PARENT = TreeSelect.SHOW_PARENT;


export default class RoleTabPaneContent extends React.Component {
  state = {
    renameModalVisable: false, //重命名或添加item modal显示
  };
  // 全选
  onCheckAllChange = ({parentKey,childKey},e) => {
    const { datas: { role_data }} = this.props.model
    let arr = []
    for(let val of role_data[parentKey]['function_tree_data'][childKey]['child_data']){
      arr.push(val.id)
    }
    role_data[parentKey]['function_tree_data'][childKey]['selects'] =   e.target.checked? arr : []
    role_data[parentKey]['function_tree_data'][childKey]['indeterminate'] = false
    role_data[parentKey]['function_tree_data'][childKey]['checkedAll'] = e.target.checked

    this.props.updateDatas({
      role_data
    })
  }
  groupOnChange = ({parentKey,childKey}, checkedList ) => {
    const { datas: { role_data }} = this.props.model
    let arr = []
    for(let val of role_data[parentKey]['function_tree_data'][childKey]['child_data']){
      arr.push(val.id)
    }
    role_data[parentKey]['function_tree_data'][childKey]['selects'] =  checkedList
    role_data[parentKey]['function_tree_data'][childKey]['checkedAll'] = checkedList.length === arr.length
    role_data[parentKey]['function_tree_data'][childKey]['indeterminate'] = !!checkedList.length && (checkedList.length < arr.length)

    this.props.updateDatas({
      role_data
    })

  }

  //menu点击项------------------start
  handleMenuClick({parentKey, value}, e ) {
    e.domEvent.stopPropagation();
    this.setState({
      parentKey,
      role_id: value.id,
    })
    const { key } = e
    switch (key) {
      case '1':
        this.setDefaut({parentKey, value})
        break
      case '2':
        this.copyPanelItem({parentKey, value})
        break
      case '3':
        this.refactorName({parentKey, value})
        break
      case '4':
        this.deleteConfirm({parentKey, value})
        break
      default:
        break
    }
  }
  setDefaut({parentKey, value}) {
    this.props.setDefaultRole({
      role_id: value.id
    })
  }
  copyPanelItem({parentKey, value}) {
    const { id, name } = value
    this.props.copyRole({
      role_id: id,
      name,
    })
  }
  refactorName({parentKey, value}) {
    this.setState({
      reName_Add_type: '1',
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
    this.props.updateRole({
      name,
      role_id: this.state.role_id
    })
  }
  deleteConfirm({parentKey, value} ) {
    const that = this
    Modal.confirm({
      title: '确认删除？',
      okText: '确认',
      cancelText: '取消',
      onOk() {
        that.deletePanelItem({parentKey, value})
      }
    });
  }
  deletePanelItem(parentKey) {
   this.props.deleteRole({
     id: this.state.role_id
   })
  }
  //menu点击项------------------end
  onCheck = (parentKey, e) => {
    const { datas: { role_data }} = this.props.model
    role_data[parentKey]['already_has_content_permission_trans'] = e
    this.props.updateDatas({
      role_data
    })
  }
  addPanel() {
    this.setState({
      reName_Add_type: '2'
    })
    this.setRenameModalVisable()
  }
  addPanelItem(values) {
    const { name } = values
    this.props.createRole({name})
  }

  finallySave({value, parentKey}) {
    console.log(parentKey, value)
    const { id, function_tree_data = [], content_tree_data = [], already_has_content_permission_trans = [] } = value

    let function_data = []
    let content_data = []
    for(let i = 0; i < function_tree_data.length; i++) {
      function_data =  function_data.concat(function_tree_data[i]['selects'])
    }
    function_data = Array.from(new Set(function_data))

    for(let i = 0; i < content_tree_data.length; i++ ) {
      const cobj = {
        type: '1', //项目
      }
      cobj['board_id'] = content_tree_data[i]['board_id']
      cobj['app_data'] = JSON.parse(JSON.stringify(content_tree_data[i]['app_data']))

      for(let j = 0; j < cobj['app_data'].length; j ++ ) {
        delete  cobj['app_data'][j]['name']
        cobj['app_data'][j]['is_enable'] = '0'
        for(let k = 0; k < already_has_content_permission_trans.length; k ++) {
          if(already_has_content_permission_trans[k].indexOf('__') !== -1){
            const  arr = already_has_content_permission_trans[k].split('__')
            if( cobj['board_id'] === arr[0] && cobj['app_data'][j]['app_id'] === arr[1]) {
              cobj['app_data'][j]['is_enable'] = '1'
            }else {

            }
          }
        }
      }
      content_data.push(cobj)
    }

    const obj = {
      role_id: id,
      function_data: function_data,
      content_data: content_data,
    }
    this.props.saveRolePermission(obj)
  }
  render(){
    const { datas: { role_data }} = this.props.model
    const operateMenu = ({parentKey, value}) => {
      return (
        <Menu onClick={this.handleMenuClick.bind(this, {parentKey, value})}>
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
    const loop = data => {
      if(!data || !data.length){
        return
      }
      return data.map((item) => {
        if (item.app_data) {
          return (
            <TreeNode key={item.app_id ? `${item.board_id}__${item.app_id}`: item.board_id } title={2}>
              {loop(item.app_data)}
            </TreeNode>
          );
        }
        return <TreeNode key={item.app_id ? `${item.board_id}__${item.app_id}`: item.board_id } title={1}/>;
      });
    }
    return (
      <div className={indexStyles.TabPaneContent}>
        <Collapse accordion>
          {role_data.map((value, parentKey) => {
            const { name, is_default, role_type, function_tree_data =[], content_tree_data = [], already_has_function_permission, already_has_content_permission_trans } = value
            return (
              <Panel header={
                <div className={indexStyles.parrentPanaelHeader}>
                  <div className={indexStyles.parrentPanaelHeader_l}>
                    <div>{name}</div>
                    {role_type === '1'? (
                      <div>系统角色</div>
                    ):(
                      is_default === '1' ? (<div>默认角色</div>) : ('')
                    )}
                  </div>
                  <div className={indexStyles.parrentPanaelHeader_r}>
                    {role_type !== '1'?(
                      <Dropdown overlay={operateMenu({parentKey, value})}>
                        <Icon type="ellipsis" theme="outlined" />
                      </Dropdown>
                    ):('')}
                  </div>
                </div>} key={parentKey}>
                <div style={{color: '#8c8c8c'}}>可行驶权限：</div>
                <Collapse bordered={false} >
                  {/*二级折叠*/}
                  {function_tree_data.map((value, childKey) => {
                    const { child_data,checkedAll ,indeterminate, selects } = value //indeterminate, checkedAll
                    const { name } = value
                    return(
                      <Panel header={<
                        div style={childrenPanelTitle}>
                        <Checkbox
                          disabled={role_type === '1'}
                          indeterminate={indeterminate}
                          onChange={this.onCheckAllChange.bind(this,{parentKey,childKey})}
                          checked={checkedAll}
                          style={{marginRight: 12 }} />
                          {name}</div>}
                             style={{...childrenPanelStyles}} key={childKey}>
                        <div className={indexStyles.childrenPanelContent}>
                          <div style={checkBoxAllStyles}>
                            <Checkbox disabled={role_type === '1'} indeterminate={indeterminate} onChange={this.onCheckAllChange.bind(this,{parentKey,childKey})} checked={checkedAll} style={{marginRight: 12 }}></Checkbox>
                          </div>
                          <Checkbox.Group style={{ width: '100%' }} onChange={this.groupOnChange.bind(this, {parentKey,childKey})} value={ selects } disabled={role_type === '1'}>
                            <Row style={childrenPanelRowsStyles}>
                              {child_data.map((value, key) => {
                                const { id, name } = value
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
                <div style={{color: '#8c8c8c', marginTop: 16}}>可访问内容：</div>
                <div style={{marginTop: 10}}>
                  {/*<TreeSelect*/}
                    {/*treeData={canVisittreeData}*/}
                    {/*treeValue={treeDataSelects}*/}
                    {/*onChange={this.treeDataonChange.bind(this, parentKey)}*/}
                    {/*treeCheckable = {true}*/}
                    {/*showCheckedStrategy={SHOW_PARENT}*/}
                    {/*searchPlaceholder={'请选择'}*/}
                    {/*style={{width: '100%',}}*/}
                  {/*/>*/}
                  <Tree  checkable  multiple onCheck={this.onCheck.bind(this, parentKey)} disabled={role_type === '1'} checkedKeys={already_has_content_permission_trans}>
                    {/*{loop(content_tree_data)}*/}
                  {content_tree_data.map((value, key) => {
                    const { board_id, board_name, app_data } = value
                      return (
                        <TreeNode key={board_id} title={board_name}>
                          {app_data.map((value2, key) => {
                            const { app_name, app_id } = value2
                            return(
                              <TreeNode key={`${board_id}__${app_id}`} title={app_name} />
                              )
                          })}
                        </TreeNode>
                      )
                    })}
                  </Tree>
                </div>
                <div style={{margin: '0 auto',marginTop: 20, textAlign: 'center'}}>
                  <Button type={'primary'}  onClick={this.finallySave.bind(this, {value, parentKey})}>保存</Button>
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

// roleManagerData: [
//   {
//     title: '超级管理员',
//     isDefaultRole: false, //是否默认角色
//     isDefaultSystem: true, //是否系统角色
//     isCanOperate: false, //是否可操作
//     authData: [
//       {
//         title: '项目管理',
//         selects: [1, 2, 3], //已选列表
//         indeterminate: false, //是否部分选中
//         checkedAll: true,  //是否全选
//         optionsData: [
//           {
//             option: '创建组织项目',
//             optionValue: 1
//           },
//           {
//             option: '编辑项目分组',
//             optionValue: 2
//           },
//           {
//             option: '主动加入项目',
//             optionValue: 3
//           }
//         ], //权限列表
//
//       }
//     ],
//     canVisittreeData: treeData, //可访问项目
//     treeDataSelects: [], //已选择的树
//   }, {
//     title: '团队负责人',
//     isDefaultRole: false, //是否默认角色
//     isDefaultSystem: true, //是否系统角色
//     isCanOperate: false, //是否可操作
//     authData: [
//       {
//         title: '项目管理',
//         selects: [1, 2, 3], //已选列表
//         indeterminate: false, //是否部分选中
//         checkedAll: true,  //是否全选
//         optionsData: [
//           {
//             option: '创建组织项目',
//             optionValue: 1
//           },
//           {
//             option: '编辑项目分组',
//             optionValue: 2
//           },
//           {
//             option: '主动加入项目',
//             optionValue: 3
//           }
//         ], //权限列表
//
//       }
//     ],
//     canVisittreeData: treeData, //可访问项目
//     treeDataSelects: [], //已选择的树
//   },{
//     title: '项目负责人',
//     isDefaultRole: false, //是否默认角色
//     isDefaultSystem: true, //是否系统角色
//     isCanOperate: false, //是否可操作
//     authData: [
//       {
//         title: '项目管理',
//         selects: [1, 2, 3], //已选列表
//         indeterminate: false, //是否部分选中
//         checkedAll: true,  //是否全选
//         optionsData: [
//           {
//             option: '创建组织项目',
//             optionValue: 1
//           },
//           {
//             option: '编辑项目分组',
//             optionValue: 2
//           },
//           {
//             option: '主动加入项目',
//             optionValue: 3
//           }
//         ], //权限列表
//
//       }
//     ],
//     canVisittreeData: treeData, //可访问项目
//     treeDataSelects: [], //已选择的树
//   },{
//     title: '顾问',
//     isDefaultRole: false, //是否默认角色
//     isDefaultSystem: false, //是否系统角色
//     isCanOperate: true, //是否可操作
//     authData: [
//       {
//         title: '项目管理',
//         selects: [1, 2, 3], //已选列表
//         indeterminate: false, //是否部分选中
//         checkedAll: true,  //是否全选
//         optionsData: [
//           {
//             option: '创建组织项目',
//             optionValue: 1
//           },
//           {
//             option: '编辑项目分组',
//             optionValue: 2
//           },
//           {
//             option: '主动加入项目',
//             optionValue: 3
//           }
//         ], //权限列表
//
//       }
//     ],
//     canVisittreeData: treeData, //可访问项目
//     treeDataSelects: [],
//   },{
//     title: '研发',
//     isDefaultRole: false, //是否默认角色
//     isDefaultSystem: false, //是否系统角色
//     isCanOperate: true, //是否可操作
//     authData: [
//       {
//         title: '项目管理',
//         selects: [1, 2, 3], //已选列表
//         indeterminate: false, //是否部分选中
//         checkedAll: true,  //是否全选
//         optionsData: [
//           {
//             option: '创建组织项目',
//             optionValue: 1
//           },
//           {
//             option: '编辑项目分组',
//             optionValue: 2
//           },
//           {
//             option: '主动加入项目',
//             optionValue: 3
//           }
//         ], //权限列表
//
//       }
//     ],
//     canVisittreeData: treeData, //可访问项目
//     treeDataSelects: [],
//   },{
//     title: '销售',
//     isDefaultRole: false, //是否默认角色
//     isDefaultSystem: false, //是否系统角色
//     isCanOperate: true, //是否可操作
//     authData: [
//       {
//         title: '项目管理',
//         selects: [1, 2, 3], //已选列表
//         indeterminate: false, //是否部分选中
//         checkedAll: true,  //是否全选
//         optionsData: [
//           {
//             option: '创建组织项目',
//             optionValue: 1
//           },
//           {
//             option: '编辑项目分组',
//             optionValue: 2
//           },
//           {
//             option: '主动加入项目',
//             optionValue: 3
//           }
//         ], //权限列表
//
//       }
//     ],
//     canVisittreeData: treeData, //可访问项目
//     treeDataSelects: [],
//   },{
//     title: '运营',
//     isDefaultRole: false, //是否默认角色
//     isDefaultSystem: false, //是否系统角色
//     isCanOperate: true, //是否可操作
//     authData: [
//       {
//         title: '项目管理',
//         selects: [1, 2, 3], //已选列表
//         indeterminate: false, //是否部分选中
//         checkedAll: true,  //是否全选
//         optionsData: [
//           {
//             option: '创建组织项目',
//             optionValue: 1
//           },
//           {
//             option: '编辑项目分组',
//             optionValue: 2
//           },
//           {
//             option: '主动加入项目',
//             optionValue: 3
//           }
//         ], //权限列表
//
//       }
//     ],
//     canVisittreeData: treeData, //可访问项目
//     treeDataSelects: [],
//   },{
//     title: '成员',
//     isDefaultRole: false, //是否默认角色
//     isDefaultSystem: false, //是否系统角色
//     isCanOperate: true, //是否可操作
//     authData: [
//       {
//         title: '项目管理',
//         selects: [1, 2, 3], //已选列表
//         indeterminate: false, //是否部分选中
//         checkedAll: true,  //是否全选
//         optionsData: [
//           {
//             option: '创建组织项目',
//             optionValue: 1
//           },
//           {
//             option: '编辑项目分组',
//             optionValue: 2
//           },
//           {
//             option: '主动加入项目',
//             optionValue: 3
//           }
//         ], //权限列表
//
//       }
//     ],
//     canVisittreeData: treeData, //可访问项目
//     treeDataSelects: [],
//   }
// ],
// const treeData = [
//   {
//     title: '项目1123123123123123123123',
//     value: '12',
//     key: '12',
//     child_data: [{
//       title: '流程',
//       value: '1-1',
//       key: '1-1',
//     }],
//   },
//   {
//     title: '项目1123123123123123123123',
//     value: '13',
//     key: '13',
//     child_data: [{
//       title: '流程',
//       value: '1-1',
//       key: '1-1',
//     }],
//   },
//   {
//     title: '项目1123123123123123123123',
//     value: '14',
//     key: '14',
//     child_data: [{
//       title: '流程',
//       value: '1-1',
//       key: '1-1',
//     }],
//   },
//   {
//     title: '项目1123123123123123123123',
//     value: '15',
//     key: '51',
//     child_data: [{
//       title: '流程',
//       value: '1-1',
//       key: '1-1',
//     }],
//   },
//   {
//     title: '项目1123123123123123123123',
//     value: '1',
//     key: '16',
//     child_data: [{
//       title: '流程',
//       value: '1-1',
//       key: '1-1',
//     }],
//   }, {
//     title: '项目2',
//     value: '2',
//     key: '2',
//     child_data: [{
//       title: '项目2: 流程',
//       value: '2-1',
//       key: '2-1',
//     }, {
//       title: '任务',
//       value: '2-2',
//       key: '2-2',
//     }, {
//       title: '文档',
//       value: '2-3',
//       key: '2-3',
//     }],
//   }];
//
// const nomaDataObj = { //默认
//   title: '',
//   isDefaultRole: false, //是否默认角色
//   isDefaultSystem: false, //是否系统角色
//   isCanOperate: true, //是否可操作
//   authData: [
//     {
//       title: '项目管理',
//       selects: [1, 2, 3], //已选列表
//       indeterminate: false, //是否部分选中
//       checkedAll: true,  //是否全选
//       optionsData: [
//         {
//           option: '创建组织项目',
//           optionValue: 1
//         },
//         {
//           option: '编辑项目分组',
//           optionValue: 2
//         },
//         {
//           option: '主动加入项目',
//           optionValue: 3
//         }
//       ], //权限列表
//
//     }
//   ],
//   canVisittreeData: treeData, //可访问项目
//   treeDataSelects: [],
// }
