import React, { Component } from 'react'
import { Tree, Menu, Tooltip, Input, Button } from 'antd'
import indexStyles from '../index.less'
import globalStyles from '@/globalset/css/globalClassName.less'
import { connect } from 'dva'
import { isApiResponseOk } from '@/utils/handleResponseData'
const { TreeNode } = Tree;
@connect(mapStateToProps)
export default class TempleteSchemeTree extends Component {

  state = {
  }

  // Tree 的选择回调
  onSelect = (selectedKeys, e) => {
    const { currentTempleteListContainer = [] } = this.props
    const { selected } = e
    const { is_add_sibling, selectedKeys: oldSelectedKeys } = this.state
    if (is_add_sibling && selected) {
      this.updateSpliceTreeList({ datas: currentTempleteListContainer, currentId: oldSelectedKeys[0], type: 'remove' })
      this.setState({
        is_add_sibling: !is_add_sibling
      })
    }
    this.setState({
      selectedKeys
    })
    let currentSelectedItemInfo = this.recursion(currentTempleteListContainer, selectedKeys[0])
    this.props.dispatch({
      type: 'organizationManager/updateDatas',
      payload: {
        currentSelectedItemInfo // 需要点击的时候保存一个当前对象
      }
    })

  }

  /**
   * 递归遍历, 写来做实验的
   * @param {Array} data 当前树状结构
   * @param {String} currentId 当前点击的ID
   */
  recursion = (data, currentId) => {
    let result = null;
    if (!data) return
    for (let val = 0; val < data.length; val++) {
      if (result !== null) {
        break
      }
      let item = data[val]
      if (item.id == currentId) {
        result = { ...item, prev_index: val, is_rename: false }
        break
      } else if (item.child_content && item.child_content.length > 0) {
        result = this.recursion(item.child_content, currentId)
      }
    }
    return result
  }

  /**
   * 获取当前元素中所有父元素所在的下标 (层级)
   * @param {Array} data2 当前的树状列表结构
   * @param {String} nodeId2 当前的ID
   */
  getCurrentElementParentKey(data2, nodeId2) {
    let arrRes = [];
    if (data2.length == 0) {
      if (!!nodeId2) {
        arrRes.unshift(data2)
      }
      return arrRes;
    }
    let rev = (data, nodeId) => {
      for (let i = 0, length = data.length; i < length; i++) {
        let node = data[i];
        if (node.id == nodeId) {
          arrRes.unshift(i)
          rev(data2, node.parent_id);
          break;
        }
        else {
          if (!!node.child_content) {
            rev(node.child_content, nodeId);
          }
        }
      }
      return arrRes;
    };
    arrRes = rev(data2, nodeId2);
    return arrRes;
  }

  /**
   * 更新添加同级树状结构
   * @param {Array} datas 当前的树状结构
   * @param {String} currentId 当前的对象ID
   */
  updateTreeList = ({ datas, currentId, type }) => {
    let arr = [...datas]
    const { currentSelectedItemInfo = {} } = this.props
    let { template_data_type, template_id, parent_id } = currentSelectedItemInfo
    // let obj = { id: 'add_sibiling', name: '', template_data_type: template_data_type, template_id: template_id, parent_id: parent_id, child_content: [] }
    // 得到一个当前元素中所有父级所在的下标位置的数组
    let parentKeysArr = this.getCurrentElementParentKey(arr, currentId);

    if (parentKeysArr.length == '1') { // 如果说当前点击的是最外层的元素, 那么就直接在当前追加一条
      arr.splice(parentKeysArr[0] + 1, 0, { id: 'add_sibiling', name: '', template_data_type: template_data_type, template_id: template_id, parent_id: parent_id, child_content: [] })
    } else {
      parentKeysArr.splice(-1, 1) // 这里为什么要截取呢, 是因为,只需要找到当前元素的父元素即可
      arr.map((item, i) => {
        if (i == parentKeysArr[0]) {
          let obj = { ...item };
          for (let n = 1; n < parentKeysArr.length; n++) {
            obj = item.child_content[parentKeysArr[n]];
          }
          obj.child_content && obj.child_content.push({ id: 'add_sibiling', name: '', template_data_type: template_data_type, template_id: template_id, parent_id: parent_id, child_content: [] });
        }
        return item;
      });
    }
    // return
    this.props.dispatch({
      type: 'organizationManager/updateDatas',
      payload: {
        currentTempleteListContainer: arr
      }
    })
  }

  /**
   * 添加子级更新树状结构
   */
  updateAddChildrenTreeList = ({ datas, currentId, type }) => {
    let arr = [...datas]
    const { currentSelectedItemInfo = {} } = this.props
    let { template_data_type, template_id, parent_id, prev_index } = currentSelectedItemInfo
    // let obj = { id: 'add_sibiling', name: '', template_data_type: template_data_type, template_id: template_id, parent_id: parent_id, child_content: [] }
    // 得到一个当前元素中所有父级所在的下标位置的数组
    let parentKeysArr = this.getCurrentElementParentKey(arr, currentId);

    if (parentKeysArr.length == '1') { // 如果说当前点击的是最外层的元素, 那么就直接在当前追加一条
      arr.splice(prev_index, 1, { ...currentSelectedItemInfo, child_content: [{id: 'add_children', name: '', template_data_type: template_data_type, template_id: template_id, parent_id: parent_id, child_content: []}] })
    } else {
      parentKeysArr.splice(-1, 1) // 这里为什么要截取呢, 是因为,只需要找到当前元素的父元素即可
      arr.map((item, i) => {
        if (i == parentKeysArr[0]) {
          let obj = { ...item };
          for (let n = 1; n < parentKeysArr.length; n++) {
            obj = item.child_content[parentKeysArr[n]];
          }
          // obj.child_content && obj.child_content.splice(prev_index, 0, {...currentSelectedItemInfo, child_content:[{ id: 'add_children', name: '', template_data_type: template_data_type, template_id: template_id, parent_id: parent_id, child_content: [] }]});
          let ccc = obj.child_content && obj.child_content[prev_index]
          ccc.child_content && ccc.child_content.push({ id: 'add_children', name: '', template_data_type: template_data_type, template_id: template_id, parent_id: parent_id, child_content: [] })
        }
        return item;
      });
    }
    this.props.dispatch({
      type: 'organizationManager/updateDatas',
      payload: {
        currentTempleteListContainer: arr
      }
    })
  }

  // 删除添加
  updateSpliceTreeList = ({ datas, currentId, type }) => {
    let arr = [...datas]
    const whetherExistenceEmptyName = (content, id) => {
      content = content.filter(item => !item.name)
      return content
    }
    const { currentSelectedItemInfo = {}, dispatch } = this.props
    let { template_data_type, template_id, parent_id, prev_index, id } = currentSelectedItemInfo
    // let obj = { id: 'add_sibiling', name: '', template_data_type: template_data_type, template_id: template_id, parent_id: parent_id, child_content: [] }
    // 得到一个当前元素中所有父级所在的下标位置的数组
    let parentKeysArr = this.getCurrentElementParentKey(arr, currentId);

    if (parentKeysArr.length == '1') { // 如果说当前点击的是最外层的元素, 那么就直接在当前追加一条
      let flag = whetherExistenceEmptyName(arr)
      if (flag && flag.length) {
        arr.splice(parentKeysArr[0] + 1, 1)
        this.props.dispatch({
          type: 'organizationManager/updateDatas',
          payload: {
            currentTempleteListContainer: arr
          }
        })
      } else {
        arr.splice(prev_index, 1)
        Promise.resolve(
          dispatch({
            type: 'organizationManager/deleteTempleteContainer',
            payload: {
              id: id,
              template_id: template_id
            }
          })
        ).then(res => {
          if (isApiResponseOk(res)) {
            this.props.dispatch({
              type: 'organizationManager/updateDatas',
              payload: {
                currentTempleteListContainer: arr
              }
            })
          }
        })
      }
      return
    } else {
      parentKeysArr.splice(-1, 1) // 这里为什么要截取呢, 是因为,只需要找到当前元素的父元素即可
      arr.map((item, i) => {
        if (i == parentKeysArr[0]) {
          let obj = { ...item };
          for (let n = 1; n < parentKeysArr.length; n++) {
            obj = item.child_content[parentKeysArr[n]];
          }
          let flag = whetherExistenceEmptyName(obj.child_content && obj.child_content)
          if (flag && flag.length) {
            // 如果是点击了添加同级的操作
            obj.child_content && obj.child_content.splice(-1, 1);
            dispatch({
              type: 'organizationManager/updateDatas',
              payload: {
                currentTempleteListContainer: arr
              }
            })
          } else {
            obj.child_content && obj.child_content.splice(prev_index, 1);
            Promise.resolve(
              dispatch({
                type: 'organizationManager/deleteTempleteContainer',
                payload: {
                  id: id,
                  template_id: template_id
                }
              })
            ).then(res => {
              if (isApiResponseOk(res)) {
                dispatch({
                  type: 'organizationManager/updateDatas',
                  payload: {
                    currentTempleteListContainer: arr
                  }
                })
              }
            })
          }
        }
        return item;
      });
    }
    // this.props.dispatch({
    //   type: 'organizationManager/updateDatas',
    //   payload: {
    //     currentTempleteListContainer: arr
    //   }
    // })
  }

  // ---------------------------- 头部导航点击事件 S ---------------------------------------------------

  // 添加同级
  handleWrapperAddSibiling = (e) => {
    e && e.stopPropagation()
    const { selectedKeys = [] } = this.state
    const { currentTempleteListContainer = [], dispatch } = this.props
    let currentId = selectedKeys[0]
    this.setState({
      is_add_sibling: true
    })
    this.updateTreeList({ datas: currentTempleteListContainer, currentId, type: 'add' })
  }

  // 添加子级
  handleWrapperAddChildren = (e) => {
    e && e.stopPropagation()
    const { selectedKeys = [] } = this.state
    const { currentTempleteListContainer = [], dispatch } = this.props
    let currentId = selectedKeys[0]
    this.setState({
      is_add_children: true
    })
    this.updateAddChildrenTreeList({datas: currentTempleteListContainer, currentId, type: 'add'})
  }

  rename = (datas, currentId) => {
    let arr = [...datas]
    const { currentSelectedItemInfo = {} } = this.props
    let { template_data_type, template_id, parent_id, id } = currentSelectedItemInfo
    // let obj = { id: 'add_sibiling', name: '', template_data_type: template_data_type, template_id: template_id, parent_id: parent_id, child_content: [] }
    // 得到一个当前元素中所有父级所在的下标位置的数组
    let parentKeysArr = this.getCurrentElementParentKey(arr, currentId);

    if (parentKeysArr.length == '1') { // 如果说当前点击的是最外层的元素, 那么就直接在当前追加一条
      arr.splice(parentKeysArr[0], 1, { ...currentSelectedItemInfo, is_rename: true })
    } else {
      parentKeysArr.splice(-1, 1) // 这里为什么要截取呢, 是因为,只需要找到当前元素的父元素即可
      arr.map((item, i) => {
        if (i == parentKeysArr[0]) {
          let obj = { ...item };
          for (let n = 1; n < parentKeysArr.length; n++) {
            obj = item.child_content[parentKeysArr[n]];
          }
          obj.child_content && obj.child_content.splice(parentKeysArr[length-1],1,{...currentSelectedItemInfo, is_rename: true});
        }
        return item;
      });
    }
    this.props.dispatch({
      type: 'organizationManager/updateDatas',
      payload: {
        currentTempleteListContainer: arr
      }
    })
  }

  // 重命名
  handleWrapperRename = (e) => {
    e && e.stopPropagation()
    const { selectedKeys = [] } = this.state
    const { currentTempleteListContainer = [], dispatch } = this.props
    let currentId = selectedKeys[0]
    let newArr = this.rename(currentTempleteListContainer, currentId)
    console.log(newArr, 'sssssssssss')
  }

  // 点击删除
  handleWrapperDeleteItem = (e) => {
    e && e.stopPropagation()
    const { selectedKeys = [] } = this.state
    const { currentTempleteListContainer = [], dispatch } = this.props
    let currentId = selectedKeys[0]
    this.updateSpliceTreeList({ datas: currentTempleteListContainer, currentId, type: 'remove' })
  }


  // ---------------------------- 头部导航点击事件 E ---------------------------------------------------


  // ---------------------------  每一个hoverIcon 的点击事件 S -----------------------------------------

  /**
   * 每一个Icon图标的事件
   * @param {String} key 当前操作的字段名称
   * @param {Object} e 当前事件对象 
   */
  handleOperator = (key, e) => {
    const cond = {
      add_sibiling: (e) => this.handleAddSibiling(e),
      add_children: (e) => this.handleAddChildren(e),
      rename: (e) => this.handleRename(e),
      delete_item: (e) => this.handleDeleteItem(e)
    }
    cond[key](e);
  }

  // 添加同级 S
  handleAddSibiling = (e) => {
    // console.log(e, 'sssssssss_eeeeeeee')
    e && e.stopPropagation()
  }
  // 添加同级 E

  // 添加子级 S
  handleAddChildren = (e) => {
    e && e.stopPropagation()
  }
  // 添加子级 E

  // 重命名 S
  handleRename = (e) => {
    e && e.stopPropagation()
  }
  // 重命名 E

  // 删除 S
  handleDeleteItem = (e) => {
    e && e.stopPropagation()
  }
  // 删除 E

  // ---------------------------  每一个hoverIcon 的点击事件 E -----------------------------------------

  // --------------------------  新增元素的输入框等事件 S -------------------------------------
  // Input输入框事件
  handleChangeTempleteContainerValue = (e) => {
    e && e.stopPropagation()
    this.setState({
      inputValue: e.target.value
    })
  }

  // 添加同级 或 子级 的确定点击事件
  handleCreateTempContainer = (e) => {
    e && e.stopPropagation()
    const { currentSelectedItemInfo: { template_data_type, template_id, parent_id, id, name } } = this.props
    const { inputValue } = this.state
    if (name) {
      this.props.dispatch({
        type: 'organizationManager/updateTempleteContainer',
        payload: {
          name: inputValue,
          id: id,
          template_id: template_id
        }
      })
    } else {
      this.props.dispatch({
        type: 'organizationManager/createTempleteContainer',
        payload: {
          name: inputValue,
          parent_id: parent_id == '0' ? id : parent_id,
          template_data_type: template_data_type,
          template_id: template_id
        }
      })
    }
    
  }

  // 添加 同级 或 子级 的取消点击事件
  handleCancelTempContainer = (e) => {
    e && e.stopPropagation()
    const { selectedKeys = [] } = this.state
    const { currentTempleteListContainer = [], dispatch } = this.props
    let currentId = selectedKeys[0]
    this.updateSpliceTreeList({ datas: currentTempleteListContainer, currentId, type: 'remove' })
  }

  // --------------------------  新增元素的输入框等事件 E -------------------------------------

  // 每一个Icon小图标的操作
  renderOperatorIconList = () => {
    const operatorIconList = [
      {
        toolTipText: '添加同级',
        key: 'add_sibiling',
        icon: <span>&#xe6f1;</span>,
        onClick: (e) => this.handleOperator('add_sibiling', e)
      },
      {
        toolTipText: '添加子级',
        key: 'add_children',
        icon: <span>&#xe6f2;</span>,
        onClick: (e) => this.handleOperator('add_children', e)
      },
      {
        toolTipText: '重命名',
        key: 'rename',
        icon: <span>&#xe602;</span>,
        onClick: (e) => this.handleOperator('rename', e)
      },
      {
        toolTipText: '删除',
        key: 'delete_item',
        icon: <span>&#xe7c3;</span>,
        onClick: (e) => this.handleOperator('delete_item', e)
      },
    ]
    return operatorIconList
  }

  // 渲染树状列表的title
  renderPlanTreeTitle = ({ type, name, is_rename }) => {
    let icon = ''
    if (type == '1') {
      icon = <span className={globalStyles.authTheme} style={{ color: '#FAAD14', fontSize: '18px', marginRight: '6px' }}>&#xe6ef;</span>
    } else if (type == '2') {
      icon = <span className={globalStyles.authTheme} style={{ color: '#18B2FF', fontSize: '18px', marginRight: '6px' }}>&#xe6f0;</span>
    }
    let operatorIconList = this.renderOperatorIconList()
    return (
      <div className={indexStyles.show_icon} style={{ display: 'flex', alignItems: 'center' }}>
        {
          !name || is_rename ? (
            <>
              {icon}
              <span style={{ flex: 1, marginRight: '12px' }}><Input autoFocus={true} onClick={this.handleChangeTempleteContainerValue} onChange={this.handleChangeTempleteContainerValue} /></span>
              <span>
                <Button onClick={this.handleCreateTempContainer} type="primary" style={{ marginRight: '8px' }} disabled={this.state.inputValue ? false : true}>确定</Button>
                <Button onClick={this.handleCancelTempContainer}>取消</Button>
              </span>
            </>
          ) : (
              <>
                {icon}
                <span>{name}</span>
                <div className={indexStyles.icon_list}>
                  {
                    operatorIconList.map(item => (
                      <Tooltip placement="top" title={item.toolTipText}>
                        <span onClick={item.onClick} key={item.key} className={`${globalStyles.authTheme} ${indexStyles.icon_item} ${item.key == 'delete_item' && indexStyles.delete_item}`}>{item.icon}</span>
                      </Tooltip>
                    ))
                  }
                </div>
              </>
            )
        }
      </div>
    )
  }

  // 递归渲染树状结构
  renderPlanTreeNode = (data) => {
    return data && data.map(item => {
      let { template_data_type, name, id, is_rename } = item
      if (item.child_content && item.child_content.length > 0) {
        return (
          <TreeNode title={this.renderPlanTreeTitle({ type: template_data_type, name, id, is_rename })} key={item.id} dataRef={item} >
            {this.renderPlanTreeNode(item.child_content)}
          </TreeNode>
        );
      } else {
        return <TreeNode title={this.renderPlanTreeTitle({ type: template_data_type, name, id, is_rename })} key={item.id} dataRef={item} />;
      }

    });
  }

  render() {
    const { planningData = [], selectedKeys = [] } = this.state
    let flag = selectedKeys && selectedKeys.length
    const { currentTempleteListContainer = [] } = this.props
    return (
      <div className={indexStyles.planningSchemeItemWrapper}>
        {/* 顶部工具栏 */}
        <div className={indexStyles.planningSchemeItem_top}>
          <div>
            <span onClick={this.handleWrapperAddSibiling} className={`${globalStyles.authTheme} ${flag && indexStyles.pub_hover}`}>&#xe6f1; 添加同级</span>
            <span onClick={this.handleWrapperAddChildren} style={{ marginLeft: '18px' }} className={`${globalStyles.authTheme} ${flag && indexStyles.pub_hover}`}>&#xe6f2; 添加子级</span>
          </div>
          <div>
            <span onClick={this.handleWrapperRename} style={{ marginRight: '18px' }} className={`${globalStyles.authTheme} ${flag && indexStyles.pub_hover}`}>&#xe602; 重命名</span>
            <span onClick={this.handleWrapperDeleteItem} className={`${globalStyles.authTheme} ${flag && indexStyles.del_hover}`}>&#xe7c3; 删除</span>
          </div>
        </div>
        {/* 渲染树 */}
        <div className={indexStyles.treeNodeWrapper}>
          <Tree
            blockNode={true}
            onSelect={this.onSelect}
          >
            {this.renderPlanTreeNode(currentTempleteListContainer)}
          </Tree>
        </div>
      </div>

    )
  }
}

function mapStateToProps({
  organizationManager: {
    datas: {
      currentTempleteListContainer = [],
      currentSelectedItemInfo = {}
    }
  }
}) {
  return {
    currentTempleteListContainer,
    currentSelectedItemInfo
  }
}
