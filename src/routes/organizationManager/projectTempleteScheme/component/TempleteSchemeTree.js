import React, { Component } from 'react'
import { Tree, Menu, Tooltip, Input, Button, message, Dropdown } from 'antd'
import { MESSAGE_DURATION_TIME } from '@/globalset/js/constant'
import indexStyles from '../index.less'
import globalStyles from '@/globalset/css/globalClassName.less'
import { connect } from 'dva'
import { isApiResponseOk } from '@/utils/handleResponseData'
import { removeEmptyArrayEle } from '../../../../utils/util'
const { TreeNode } = Tree;
const { SubMenu } = Menu;
@connect(mapStateToProps)
export default class TempleteSchemeTree extends Component {

  state = {
  }

  // 初始化的state数据
  initStateDatas = () => {
    this.setState({
      is_add_sibiling: false, // 添加同级
      is_add_children: false, // 添加子级
      is_add_rename: false, // 重命名
      inputValue: '', // 输入框value值
      local_name: '', // 本地名称
    })
  }

  // 卸载事件
  componentWillUnmount() {
    this.props.dispatch({
      type: 'organizationManager/updateDatas',
      payload: {
        currentTempleteListContainer: [],
        currentTempleteId: '',
        currentSelectedItemInfo: {}
      }
    })
    this.props.dispatch({
      type: 'publicProcessDetailModal/updateDatas',
      payload: {
        processTemplateList: [],
      }
    })
  }

  // 展开的回调
  onExpand = (expandedKeys) => {
    this.setState({
      expandedKeys: expandedKeys
    })
  }

  // Tree 的选择回调
  onSelect = (selectedKeys, e) => {
    const { currentTempleteListContainer = [] } = this.props
    let new_data = [...currentTempleteListContainer]
    const { selected } = e
    const { is_wrapper_add_sibiling, is_add_sibiling, is_wrapper_add_children, is_add_children, is_wrapper_add_rename, is_add_rename, selectedKeys: oldSelectedKeys } = this.state
    // if (is_add_sibiling || is_add_children || is_add_rename) return
    if (oldSelectedKeys && oldSelectedKeys[0] != selectedKeys[0] && selected) { // 这步判断就是 ==> 相当于点击每一个item的切换，需要把上一个找到并恢复上一个点击的状态
      // this.updateSpliceTreeList({ datas: currentTempleteListContainer, currentId: oldSelectedKeys[0], type: 'remove' })
      if (is_wrapper_add_sibiling || is_add_sibiling) { // 如果是同级，就处理同级
        this.updateCancelOrDeleteSibilingTreeList({ datas: currentTempleteListContainer, type: 'add_sibiling' })
      } else if (is_wrapper_add_children || is_add_children) { // 如果是子级，就处理子级
        this.updateCancelOrDeleteChildrenTreeList({ datas: currentTempleteListContainer, type: 'add_children' })
      } else if (is_wrapper_add_rename || is_add_rename){ // 如果是重命名就处理重命名
        this.updateCancelOrDeleteAlreadyExistsTreeList({ datas: currentTempleteListContainer, type: oldSelectedKeys && oldSelectedKeys[0] })
      }
      this.initStateDatas()
    } else if (!oldSelectedKeys && selected) { // 这里是点击每一个item上hover图标的点击事件
      this.updateCancelOrDeleteAlreadyExistsTreeList({ datas: currentTempleteListContainer, type: selectedKeys[0] })
      this.initStateDatas()
    }
    this.setState({
      selectedKeys,
    })
    // 这是在选中的时候更新一个当前点击的对象, 保存在 model 中
    let currentSelectedItemInfo = this.recursion(currentTempleteListContainer, selectedKeys[0])
    this.props.dispatch({
      type: 'organizationManager/updateDatas',
      payload: {
        currentSelectedItemInfo // 需要点击的时候保存一个当前对象
      }
    })

  }

  /**
   * 判断是否可以创建子任务
   * @param {Array} data 数据列表
   * @param {String} nodeId 当前需要判断的对象
   * @returns {Boolean} true 表示当前这个为子任务 表示不能创建
   */
  judgeWhetherCreateChildTask = (data, nodeId) => {
    let flag
    if (data.length == 0) {
      if (!!nodeId) {
        flag = false
      }
      return flag;
    }
    let rev = (data, nodeId, parent_type) => {
      for (let i = 0, length = data.length; i < length; i++) {
        let node = data[i];
        if (node.id == nodeId) {
          flag = node.template_data_type == '2' && node.template_data_type == parent_type && parent_type == '2'
          rev(data, node.parent_id);
          break;
        }
        else {
          if (!!node.child_content) {
            rev(node.child_content, nodeId, node.template_data_type);
          }
        }
      }
      return flag;
    };
    flag = rev(data, nodeId);
    return flag;
  }

  /**
   * 递归遍历, 写来做实验的
   * 对数据进行初始化, 添加某些需要的字段
   * @param {Array} data 当前树状结构
   * @param {String} currentId 当前点击的ID
   * @return {Array} 返回一个新的数组, 对每一个item进行塞值, 存储后续需要的数据
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
   * 逻辑: 找到当前点击对象的父元素, 然后push一个同级对象
   * @param {Array} datas 当前的树状结构
   * @param {String} currentId 当前的对象ID
   */
  updateAddSibilingTreeList = ({ datas, currentId }) => {
    let arr = [...datas]
    const { currentSelectedItemInfo = {} } = this.props
    if (currentSelectedItemInfo && Object.keys(currentSelectedItemInfo) && Object.keys(currentSelectedItemInfo).length == '0' || !currentSelectedItemInfo) return false
    let { template_data_type, template_id, parent_id, id } = currentSelectedItemInfo
    // 得到一个当前元素中所有父级所在的下标位置的数组
    let parentKeysArr = this.getCurrentElementParentKey(arr, currentId);
    let PARENTID = parent_id == '0' ? id : parent_id
    if (parentKeysArr.length == '1') { // 如果说当前点击的是最外层的元素, 那么就直接在当前追加一条
      arr.splice(parentKeysArr[0] + 1, 0, { id: 'add_sibiling', name: '', template_data_type: template_data_type, template_id: template_id, parent_id: PARENTID, child_content: [] })
    } else {
      let curr = JSON.parse(JSON.stringify(parentKeysArr || []))
      parentKeysArr.splice(-1, 1) // 这里为什么要截取呢, 是因为,只需要找到当前元素的父元素即可
      arr = arr.map((item, i) => {
        let obj = { ...item };
        if (i == parentKeysArr[0]) {
          for (let n = 1; n < parentKeysArr.length; n++) {// 不管怎样，这里的obj永远获取到的都是当前点击的元素的父元素
            obj = item.child_content[parentKeysArr[n]];
          }
          obj.child_content && obj.child_content.splice(curr[1] + 1, 0, { id: 'add_sibiling', name: '', template_data_type: template_data_type == '3' ? '2' : template_data_type, template_id: template_id, parent_id: PARENTID, child_content: [] })
          return item
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

  /**
   * 添加子级更新树状结构
   * 逻辑: 获取当前对象自己所在的位置,然后在child_content中push一个对象
   * 同时也要更新父级的展开关闭状态
   * @param {Array} datas 当前的树状结构
   * @param {String} currentId 当前的对象ID
   */
  updateAddChildrenTreeList = ({ datas, currentId }) => {
    let arr = [...datas]
    const { expandedKeys = [] } = this.state
    const { currentSelectedItemInfo = {} } = this.props
    let { template_data_type, template_id, parent_id, prev_index, id } = currentSelectedItemInfo
    let tempExpandedKeys = [...expandedKeys]
    let PARENTID = parent_id == '0' ? id : parent_id
    // 得到一个当前元素中所有父级所在的下标位置的数组
    let parentKeysArr = this.getCurrentElementParentKey(arr, currentId);
    let temp = [].concat([{ id: 'add_children', name: '', template_data_type: '2', template_id: template_id, parent_id: PARENTID, child_content: [] }],currentSelectedItemInfo.child_content)
    if (parentKeysArr.length == '1') { // 如果说当前点击的是最外层的元素, 那么就直接在当前追加一条
      arr.splice(parentKeysArr[0], 1, { ...currentSelectedItemInfo, child_content: removeEmptyArrayEle(temp) })
      tempExpandedKeys.push(PARENTID)
    } else {
      parentKeysArr.splice(-1, 1) // 这里为什么要截取呢, 是因为,只需要找到当前元素的父元素即可
      arr.map((item, i) => {
        if (i == parentKeysArr[0]) {
          let obj = { ...item };
          for (let n = 1; n < parentKeysArr.length; n++) {
            obj = item.child_content[parentKeysArr[n]];
          }
          let recentlyParent = obj.child_content && obj.child_content[prev_index]
          recentlyParent.child_content && recentlyParent.child_content.push({ id: 'add_children', name: '', template_data_type: '2', template_id: template_id, parent_id: recentlyParent.id, child_content: [] })
          tempExpandedKeys.push(recentlyParent.id)
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
    this.setState({
      expandedKeys: tempExpandedKeys
    })
  }

  // 根据不同的类型来进行取消或者删除
  accordingToDifferenceTypeUpdateTreeList = ({ datas, type }) => {
    switch (type) {
      case 'add_sibiling': // 添加同级
        this.updateCancelOrDeleteSibilingTreeList({ datas, type })
        break;
      case 'add_children': // 添加子级
        this.updateCancelOrDeleteChildrenTreeList({ datas, type })
        break
      default: // 表示已存在的元素
        this.updateCancelOrDeleteAlreadyExistsTreeList({ datas, type })
        break;
    }
  }

  /**
   * 新增加的结构的取消删除更新树状结构
   * 同级操作更新
   * 逻辑: 找到当前操作的并截取
   * @param {Array} datas 当前的树状结构
   * @param {String} type 当前添加该结构的ID,利用type类型来进行区分
   */
  updateCancelOrDeleteSibilingTreeList = ({ datas, type, oldId, whetherUpdate }) => {
    if (!datas) return
    let arr = [...datas]
    // 定义一个判断是否在列表中存在一个其他的Type类型
    const whetherExistenceOthersType = (content) => {
      content = content.filter(item => item.id == type)
      return content
    }
    const { currentSelectedItemInfo = {}, dispatch } = this.props
    if (currentSelectedItemInfo && Object.keys(currentSelectedItemInfo) && Object.keys(currentSelectedItemInfo).length == '0' || !currentSelectedItemInfo) return false
    let { id, prev_index } = currentSelectedItemInfo
    // 得到一个当前元素中所有父级所在的下标位置的数组
    let parentKeysArr = oldId ? this.getCurrentElementParentKey(arr, oldId) : this.getCurrentElementParentKey(arr, id);
    if (parentKeysArr.length == '1') { // 如果说当前点击的是最外层的元素, 那么就直接在当前追加一条
      let flag = whetherExistenceOthersType(arr)
      if (flag && flag.length) {
        arr.splice(parentKeysArr[0] + 1, 1)
        dispatch({
          type: 'organizationManager/updateDatas',
          payload: {
            currentTempleteListContainer: arr,
          }
        })
      }
    } else {
      let curr = JSON.parse(JSON.stringify(parentKeysArr || []))
      parentKeysArr.splice(-1, 1) // 这里为什么要截取呢, 是因为,只需要找到当前元素的父元素即可
      let new_data = []
      arr = arr.map((item, i) => {
        let obj = { ...item };
        if (i == parentKeysArr[0]) {
          let content = {}
          for (let n = 1; n < parentKeysArr.length; n++) {
            content = item.child_content[parentKeysArr[n]];
          }
          if (!(content && Object.keys(content).length)) {
            content = item.child_content
            new_data = item.child_content && item.child_content.filter(i => i.id != 'add_sibiling')
            item['child_content'] = new_data
            return item
          } else {
            let flag = whetherExistenceOthersType(content.child_content && content.child_content)
            if (flag && flag.length) {
              new_data = content.child_content && content.child_content.filter(i => i.id != 'add_sibiling')
              content.child_content = new_data
              item['child_content'].splice(parentKeysArr[1],1,content)
              return item
            }
          }
        }
        return item;
      });
      dispatch({
        type: 'organizationManager/updateDatas',
        payload: {
          currentTempleteListContainer: arr,
        }
      })
    }
  }

  /**
   * 新增加的结构的取消删除更新树状结构
   * 子级操作更新
   * @param {Array} datas 当前的树状结构
   * @param {String} type 当前添加该结构的ID,利用type类型来进行区分
   */
  updateCancelOrDeleteChildrenTreeList = ({ datas, type, oldId, whetherUpdate }) => {
    let arr = [...datas]
    const { is_add_children } = this.state
    // 定义一个判断是否在列表中存在一个其他的Type类型
    const whetherExistenceOthersType = (content) => {
      content = content.filter(item => item.id == type)
      return content
    }
    const { expandedKeys = [] } = this.state
    const { currentSelectedItemInfo = {}, dispatch } = this.props
    if (currentSelectedItemInfo && Object.keys(currentSelectedItemInfo) && Object.keys(currentSelectedItemInfo).length == '0' || !currentSelectedItemInfo) return false
    let { id, prev_index, parent_id } = currentSelectedItemInfo
    // let obj = { id: 'add_sibiling', name: '', template_data_type: template_data_type, template_id: template_id, parent_id: parent_id, child_content: [] }
    // 得到一个当前元素中所有父级所在的下标位置的数组
    let parentKeysArr = oldId ? this.getCurrentElementParentKey(arr, oldId) : this.getCurrentElementParentKey(arr, id);

    if (parentKeysArr.length == '1') { // 如果说当前点击的是最外层的元素, 那么就直接在当前追加一条
      let flag = whetherExistenceOthersType(arr[parentKeysArr[0]].child_content)
      if (flag && flag.length) {
        arr[parentKeysArr[0]].child_content = arr[parentKeysArr[0]].child_content.filter(i => i.id != type)
        dispatch({
          type: 'organizationManager/updateDatas',
          payload: {
            currentTempleteListContainer: arr,
            // currentSelectedItemInfo: {}
          }
        })
        let PARENTID = parent_id == '0' ? id : parent_id
        if (expandedKeys.indexOf(PARENTID) != -1) {
          let tempExpandedKeys = [...expandedKeys]
          tempExpandedKeys = tempExpandedKeys.filter(item => item != PARENTID)
          this.setState({
            expandedKeys: tempExpandedKeys
          })
        }
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
          let flag = whetherExistenceOthersType(obj.child_content && obj.child_content[prev_index].child_content)
          if (flag && flag.length) {
            let recentlyParent = obj.child_content && obj.child_content[prev_index]
            recentlyParent.child_content.splice(-1, 1);
            if (expandedKeys.indexOf(recentlyParent.id) != -1) {
              let tempExpandedKeys = [...expandedKeys]
              tempExpandedKeys = tempExpandedKeys.filter(item => item != recentlyParent.id)
              this.setState({
                expandedKeys: tempExpandedKeys
              })
            }
          }
        }
        return item;
      });
      dispatch({
        type: 'organizationManager/updateDatas',
        payload: {
          currentTempleteListContainer: arr,
          // currentSelectedItemInfo: {}
        }
      })
    }
  }

  /**
   * 对已经存在的 元素进行取消删除等操作
   */
  updateCancelOrDeleteAlreadyExistsTreeList = ({ datas, type }) => {
    let arr = [...datas]
    const { currentSelectedItemInfo = {}, dispatch } = this.props
    if (currentSelectedItemInfo && Object.keys(currentSelectedItemInfo) && Object.keys(currentSelectedItemInfo).length == '0' || !currentSelectedItemInfo) return false
    let { id, prev_index, template_id } = currentSelectedItemInfo
    if (type == 'DELETE') {
      Promise.resolve(
        dispatch({
          type: 'organizationManager/deleteTempleteContainer',
          payload: {
            id: id,
            template_id
          }
        })
      ).then(res => {
        if (isApiResponseOk(res)) {
          dispatch({
            type: 'organizationManager/updateDatas',
            payload: {
              currentSelectedItemInfo: {}
            }
          })
          this.setState({
            selectedKeys: [],
          })
          this.initStateDatas()
        }
      })
      return
    }
    // let obj = { id: 'add_sibiling', name: '', template_data_type: template_data_type, template_id: template_id, parent_id: parent_id, child_content: [] }
    // 得到一个当前元素中所有父级所在的下标位置的数组
    let parentKeysArr = this.getCurrentElementParentKey(arr, id);
    if (parentKeysArr.length == '1') { // 如果说当前点击的是最外层的元素, 那么就直接在当前追加一条
      // arr = this.rename({datas: arr, id, flag: false})
      arr.splice(parentKeysArr[0], 1, { ...currentSelectedItemInfo, is_rename: false })
    } else {
      parentKeysArr.splice(-1, 1) // 这里为什么要截取呢, 是因为,只需要找到当前元素的父元素即可
      arr.map((item, i) => {
        if (i == parentKeysArr[0]) {
          let obj = { ...item };
          for (let n = 1; n < parentKeysArr.length; n++) {
            obj = item.child_content[parentKeysArr[n]];
          }
          obj.child_content && obj.child_content.splice(prev_index, 1, { ...currentSelectedItemInfo, is_rename: false });
        }
        return item;
      });
    }
    this.initStateDatas()
    this.setState({
      selectedKeys: [],
    })
    dispatch({
      type: 'organizationManager/updateDatas',
      payload: {
        currentTempleteListContainer: arr,
        // currentSelectedItemInfo: {}
      }
    })
  }

  // ---------------------------- 头部导航点击事件 S ---------------------------------------------------

  /**
   * 重命名更新
   * @param {Array} datas 当前的树状结构列表
   * @param {String} currentId 当前选择的ID
   * @param {Boolean} flag true/false 表示重命名/不重命名
   */
  rename = ({ datas, currentId, flag }) => {
    let arr = [...datas]
    const { currentSelectedItemInfo = {} } = this.props
    let { template_data_type, template_id, parent_id, id, prev_index } = currentSelectedItemInfo
    // let obj = { id: 'add_sibiling', name: '', template_data_type: template_data_type, template_id: template_id, parent_id: parent_id, child_content: [] }
    // 得到一个当前元素中所有父级所在的下标位置的数组
    let parentKeysArr = this.getCurrentElementParentKey(arr, currentId);
    if (parentKeysArr.length == '1') { // 如果说当前点击的是最外层的元素, 那么就直接在当前追加一条
      // debugger
      arr.splice(parentKeysArr[0], 1, { ...currentSelectedItemInfo, is_rename: flag })
    } else {
      parentKeysArr.splice(-1, 1) // 这里为什么要截取呢, 是因为,只需要找到当前元素的父元素即可
      arr.map((item, i) => {
        if (i == parentKeysArr[0]) {
          let obj = { ...item };
          for (let n = 1; n < parentKeysArr.length; n++) {
            obj = item.child_content[parentKeysArr[n]];
            // obj = item.child_content[prev_index];
          }
          obj.child_content && obj.child_content.splice(prev_index, 1, { ...currentSelectedItemInfo, is_rename: flag });
        }
        return item;
      });
    }
    return arr
  }

  // ---------------------------- 头部导航点击事件 E ---------------------------------------------------


  // ---------------------------  每一个hoverIcon 的点击事件 S -----------------------------------------


  // 添加同级 S
  handleAddSibiling = (e, id) => {
    e && e.stopPropagation()
    var { currentTempleteListContainer = [] } = this.props
    this.setState({
      is_add_sibiling: true,
      selectedKeys: [],
    })
    this.updateAddSibilingTreeList({ datas: currentTempleteListContainer, currentId: id })
  }
  // 添加同级 E

  // 添加子级 S
  handleAddChildren = (e, id) => {
    e && e.stopPropagation()
    let { currentTempleteListContainer = [] } = this.props
    this.setState({
      is_add_children: true,
      selectedKeys: [],
    })
    this.updateAddChildrenTreeList({ datas: currentTempleteListContainer, currentId: id })
  }
  // 添加子级 E

  // 插入流程 S
  handleInsertFlow = ({e,name}) => {
    const { domEvent, key } = e
    domEvent && domEvent.stopPropagation()
    const { currentSelectedItemInfo = {} } = this.props
    if (!(currentSelectedItemInfo && Object.keys(currentSelectedItemInfo).length)) return
    const { template_id, parent_id, id } = currentSelectedItemInfo
    let obj = {
      name: name,
      parent_id,
      rela_id: key,
      template_data_type: '3',
      template_id: template_id,
      target_id: id
    }
    this.props.dispatch({
      type: 'organizationManager/createTempleteContainer',
      payload: {
        ...obj
      }
    }).then(res => {
      if (isApiResponseOk(res)) {
        this.initStateDatas()
      }
    })
  }
  // 插入流程 E

  // 重命名 S
  handleRename = (e, id) => {
    e && e.stopPropagation()
    const { is_add_rename } = this.state
    const { currentSelectedItemInfo: { name } } = this.props
    if (is_add_rename) {
      return false
    }
    const { currentTempleteListContainer = [], dispatch } = this.props
    let newArr = this.rename({ datas: currentTempleteListContainer, currentId: id, flag: true })
    this.props.dispatch({
      type: 'organizationManager/updateDatas',
      payload: {
        currentTempleteListContainer: newArr
      }
    })
    this.setState({
      is_add_rename: true,
      selectedKeys: [],
      inputValue: name,
      local_name: name,
    })
  }
  // 重命名 E

  // 删除 S
  handleDeleteItem = (e, id) => {
    e && e.stopPropagation()
    const { currentTempleteListContainer = [] } = this.props
    this.updateCancelOrDeleteAlreadyExistsTreeList({ datas: currentTempleteListContainer, id, type: 'DELETE' })
  }
  // 删除 E

  // ---------------------------  每一个hoverIcon 的点击事件 E -----------------------------------------

  // --------------------------  新增元素的输入框等事件 S -------------------------------------
  // Input输入框事件
  handleChangeTempleteContainerValue = (e) => {
    e && e.stopPropagation()
    if (e.target.value.trimLR() == '') {
      // message.warn('名称不能为空哦~', MESSAGE_DURATION_TIME)
      this.setState({
        inputValue: ''
      })
      return false
    }
    if (e.target.value.length > 50) {
      message.warn('最多只能输入50个字符')
      return
    }
    this.setState({
      inputValue: e.target.value,
    })
  }

  // 添加同级 或 子级 的确定点击事件
  handleCreateTempContainer = ({ e, is_rename }) => {
    e && e.stopPropagation()
    const { inputValue, local_name, is_add_children, is_wrapper_add_children } = this.state
    if (inputValue == local_name || inputValue == '') return
    const { currentSelectedItemInfo = {} } = this.props
    if (currentSelectedItemInfo && Object.keys(currentSelectedItemInfo) && Object.keys(currentSelectedItemInfo).length == '0' || !currentSelectedItemInfo) return false
    const { template_data_type, template_id, parent_id, id, name, child_content } = currentSelectedItemInfo
    // 如果是template_data_type == '2' 子任务, 就取parent_id , 否则为 id ==> 判断是否 创建添加的是什么
    // 如果是创建添加子任务，那么就取该 对象中的 id 否则为parent_id
    let PARENTID = template_data_type == '2' ? ((is_add_children || is_wrapper_add_children) ? id : parent_id) : parent_id
    if (is_rename) {
      this.props.dispatch({
        type: 'organizationManager/updateTempleteContainer',
        payload: {
          name: inputValue,
          id: id,
          template_id: template_id
        }
      })
      this.initStateDatas()
    } else {
      this.props.dispatch({
        type: 'organizationManager/createTempleteContainer',
        payload: {
          name: inputValue,
          parent_id: parent_id == '0' ? id : PARENTID,
          template_data_type: is_add_children || is_wrapper_add_children ? '2' : template_data_type == '3' ? '2' : template_data_type,
          template_id: template_id,
          target_id: id
        }
      })
    }

    this.initStateDatas()
  }

  // 添加 同级 或 子级 的取消点击事件
  handleCancelTempContainer = ({ e, id: type }) => {
    e && e.stopPropagation()
    const { currentTempleteListContainer = [] } = this.props
    // this.updateCancelOrDeleteTreeList({ datas: currentTempleteListContainer, type })
    this.initStateDatas()
    this.accordingToDifferenceTypeUpdateTreeList({ datas: currentTempleteListContainer, type })
  }

  // --------------------------  新增元素的输入框等事件 E -------------------------------------

  handleSelectOptions = ({e, type,id}) => {
    const { key, domEvent } = e
    domEvent && domEvent.stopPropagation()
    const { currentTempleteListContainer = [] } = this.props
    const { is_add_sibiling, is_add_children, is_add_rename } = this.state
    if (is_add_sibiling || is_add_children || is_add_rename) return
    // if (id) {
    //   let currentSelectedItemInfo = this.recursion(currentTempleteListContainer, id)
    //   this.props.dispatch({
    //     type: 'organizationManager/updateDatas',
    //     payload: {
    //       currentSelectedItemInfo // 需要点击的时候保存一个当前对象
    //     }
    //   })
    // }
    // 先更新一个状态 所以 延时操作
    setTimeout(() => {
      switch (key) {
        case 'insert_milepost': // 表示插入里程碑
          this.handleAddSibiling(domEvent,id)
          break;
        case 'insert_task':
          if (type == '1') { // 表示里程碑中添加任务
            this.handleAddChildren(domEvent,id)
            return
          } else if (type == '2') { // 表示任务中添加任务
            this.handleAddSibiling(domEvent,id)
            return
          } else if (type == '3') { // 表示流程中添加任务
            this.handleAddSibiling(domEvent,id)
            return
          }
          break
        case 'add_sub_task':
          if (type == '2') { // 表示任务中添加子任务
            this.handleAddChildren(domEvent,id)
          }
          break
        case 'rename': // 重命名
          this.handleRename(domEvent,id)
          break
        case 'delete':
          this.handleDeleteItem(domEvent,id)
        default:
          break;
      }
    },200)
    
  }

  handleDropdownContentClick = ({e,type,id}) => {
    e && e.stopPropagation()
    const { currentTempleteListContainer = [] } = this.props
    const { is_add_sibiling, is_add_children, is_add_rename } = this.state
    if (is_add_sibiling || is_add_children || is_add_rename) return
    if (id) {
      let currentSelectedItemInfo = this.recursion(currentTempleteListContainer, id)
      this.props.dispatch({
        type: 'organizationManager/updateDatas',
        payload: {
          currentSelectedItemInfo // 需要点击的时候保存一个当前对象
        }
      })
    }
  }

  // 渲染点点点
  renderSelectMoreOptions = ({type, id}) => {
    const { currentTempleteListContainer = [], processTemplateList = [] } = this.props
    let flag = this.judgeWhetherCreateChildTask(currentTempleteListContainer, id)
    return (
      <Menu 
        onClick={(e) => { this.handleSelectOptions({e,type,id}) }} 
        getPopupContainer={triggerNode => triggerNode.parentNode}>
        {
          type == '1' && (
            <Menu.Item key={'insert_milepost'}>插入里程碑</Menu.Item>
          )
        }
        <Menu.Item key={'insert_task'}>插入任务</Menu.Item>
        {
          type == '2' && (!flag) && (
            <Menu.Item disabled={flag} key={'add_sub_task'}>新建子任务</Menu.Item>
          )
        }
        {
          <Menu.Item key={'rename'}>重命名</Menu.Item>
        }
        {
          (type == '2' || type == '3') && (!flag) && (
            <SubMenu trigger={['click']}
              title={
                <span>插入流程</span>
              }
            >
              {
               !(processTemplateList && processTemplateList.length) ? ('') : processTemplateList.map(item => {
                 const { id, name } = item
                  return <Menu.Item onClick={(e) => { this.handleInsertFlow({e,name}) }} title={name} key={`${id}`}>{name}</Menu.Item>
               })
              }
            </SubMenu>
          )
        }
        <Menu.Item style={{color: '#F5222D'}} key={'delete'}>删除</Menu.Item>
      </Menu>
    )
  }

  // 渲染dropdown内容
  renderSpotDropdownContent = ({type, id}) => {
    return (
      <div 
        onClick={(e) => e.stopPropagation()}
      >
        <Dropdown 
        trigger={['click']} overlayClassName={indexStyles.tempMoreOptionsWrapper} getPopupContainer={() => document.getElementById('planningSchemeItemWrapper')} overlay={this.renderSelectMoreOptions({type, id})}>
          <span onClick={(e) => {this.handleDropdownContentClick({e,type,id})}} style={{fontSize: '16px', color: '#1890FF'}} className={`${globalStyles.authTheme} ${indexStyles.sopt_icon}`}>&#xe7fd;</span>
        </Dropdown>
      </div>
    )
  }

  // 渲染树状列表的title
  renderPlanTreeTitle = ({ type, name, is_rename, id }) => {
    const { local_name, inputValue } = this.state
    const disabled = (inputValue == local_name) || (inputValue == '')
    let icon = ''
    if (type == '1') {
      icon = <span className={globalStyles.authTheme} style={{ color: '#FAAD14', fontSize: '18px', marginRight: '6px' }}>&#xe6ef;</span>
    } else if (type == '2') {
      icon = <span className={globalStyles.authTheme} style={{ color: '#18B2FF', fontSize: '18px', marginRight: '6px' }}>&#xe6f0;</span>
    } else if (type == '3') {
      icon = <span className={globalStyles.authTheme} style={{ color: '#7CB305', fontSize: '20px', marginRight: '6px' }}>&#xe629;</span>
    }
    return (
      <div id={`show_icon-${id}`} className={indexStyles.show_icon} style={{ display: 'flex', alignItems: 'center' }}>
        {
          !name || is_rename ? (
            <>
              {icon}
              <span style={{ flex: 1, marginRight: '12px' }}><Input value={this.state.inputValue} maxLength={51} autoFocus={true} onClick={e => e.stopPropagation()} onPressEnter={(e) => { this.handleCreateTempContainer({ e, is_rename }) }} onChange={this.handleChangeTempleteContainerValue} /></span>
              <span>
                <Button onClick={(e) => { this.handleCreateTempContainer({ e, is_rename }) }} type="primary" style={{ marginRight: '8px' }} disabled={disabled}>确定</Button>
                <Button onClick={(e) => { this.handleCancelTempContainer({ e, id }) }}>取消</Button>
              </span>
            </>
          ) : (
              <>
                {icon}
                <span title={name} style={{overflow: 'hidden', textOverflow: 'ellipsis'}}>{name}</span>
                <div className={indexStyles.icon_list}>
                  {this.renderSpotDropdownContent({ type, id })}
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

  // 渲染数组为空的时候结构
  renderEmptyTreeData = () => {
    return (
      <div style={{lineHeight: '92px', textAlign: 'center', color: 'rgba(0,0,0,0.45)'}}>
        暂无数据
      </div>
    )
  }

  // 渲染有数据时的树状结构
  renderNotEmptyTreeData = () => {
    const { expandedKeys = [], selectedKeys = [], is_add_rename } = this.state
    const { currentTempleteListContainer = [] } = this.props
    return (
      < div className={`${indexStyles.treeNodeWrapper} ${globalStyles.global_vertical_scrollbar}`} >
        <Tree
          blockNode={true}
          selectedKeys={selectedKeys}
          expandedKeys={expandedKeys}
          onSelect={this.onSelect}
          onExpand={this.onExpand}
        >
          {this.renderPlanTreeNode(currentTempleteListContainer)}
        </Tree>
      </div >
    )
  }

  render() {
    const { planningData = [], expandedKeys = [], selectedKeys = [], is_add_rename, is_wrapper_add_rename } = this.state
    const { currentTempleteListContainer = [] } = this.props
    let flag = selectedKeys && selectedKeys.length && !is_wrapper_add_rename
    let whetherCreateChildTask = selectedKeys && selectedKeys.length && this.judgeWhetherCreateChildTask(currentTempleteListContainer, selectedKeys[0])
    return (
      <div id={'planningSchemeItemWrapper'} className={indexStyles.planningSchemeItemWrapper}>
        {
          currentTempleteListContainer && currentTempleteListContainer.length ? (
            this.renderNotEmptyTreeData()
          ) : (
              this.renderEmptyTreeData()
            )
        }

      </div>

    )
  }
}

function mapStateToProps({
  organizationManager: {
    datas: {
      currentTempleteListContainer = [],
      currentSelectedItemInfo = {},
      currentTempleteId
    }
  },
  publicProcessDetailModal: {
    processTemplateList = []
  },
}) {
  return {
    currentTempleteListContainer,
    currentSelectedItemInfo,
    currentTempleteId,
    processTemplateList
  }
}
