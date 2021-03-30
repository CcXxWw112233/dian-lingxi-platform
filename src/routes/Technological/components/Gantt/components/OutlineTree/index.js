import React, { Component } from 'react'
import styles from './index.less'
import { Input, Dropdown, message, Tooltip, Menu, Switch } from 'antd'
import globalStyles from '@/globalset/css/globalClassName.less'
import ManhourSet from './ManhourSet.js'
import { Popover, Avatar } from 'antd'
import MenuSearchPartner from '@/components/MenuSearchMultiple/MenuSearchPartner.js'
import { getOrgIdByBoardId } from '@/utils/businessFunction'
import moment from 'moment'
import AvatarList from '@/components/avatarList'
import NodeOperate from './NodeOperate'
import { validatePositiveInt } from '../../../../../../utils/verify'
import { connect } from 'dva'
import { isSamDay } from '../../../../../../utils/util'
import TreeNode from './TreeNode'
import NodeTreeTable from './NodeTreeTable'

@connect(function({
  gantt: {
    datas: { outline_columns, outline_default_columns, outline_is_show_order }
  }
}) {
  return {
    outline_columns,
    outline_default_columns,
    outline_is_show_order
  }
})
class MyOutlineTree extends Component {
  render() {
    const {
      onDataProcess,
      onExpand,
      onHover,
      hoverItem,
      gantt_board_id,
      projectDetailInfoData,
      outline_tree_round,
      changeOutLineTreeNodeProto,
      deleteOutLineTreeNode
    } = this.props
    const {
      outline_columns,
      outline_default_columns,
      outline_is_show_order
    } = this.props
    console.log('sssssssssadasd', {
      outline_columns,
      outline_default_columns,
      outline_is_show_order
    })
    return (
      <div className={styles.outline_tree}>
        {React.Children.map(this.props.children, (child, i) => {
          return (
            <TreeNode
              {...child.props}
              changeOutLineTreeNodeProto={changeOutLineTreeNodeProto}
              deleteOutLineTreeNode={deleteOutLineTreeNode}
              onDataProcess={onDataProcess}
              onExpand={onExpand}
              onHover={onHover}
              hoverItem={hoverItem}
              gantt_board_id={gantt_board_id}
              projectDetailInfoData={projectDetailInfoData}
              outline_tree_round={outline_tree_round}
              columns={outline_columns}
              defaultColumns={outline_default_columns}
              showNumber={outline_is_show_order}
            >
              {child.props.children}
            </TreeNode>
          )
        })}
      </div>
    )
  }
}

const getNode = (outline_tree, id) => {
  let nodeValue = null
  if (outline_tree) {
    nodeValue = outline_tree.find(item => item.id == id)
    if (nodeValue) {
      return nodeValue
    } else {
      for (let i = 0; i < outline_tree.length; i++) {
        let node = outline_tree[i]
        if (node.children && node.children.length > 0) {
          nodeValue = getNode(node.children, id)
          if (nodeValue) {
            return nodeValue
          }
        } else {
          continue
          // return null;
        }
      }
    }
  }
  return nodeValue
}

const getNodeByname = (outline_tree, key, value) => {
  let nodeValue = null
  if (outline_tree) {
    nodeValue = outline_tree.find(item => item[key] == value)
    if (nodeValue) {
      return nodeValue
    } else {
      let length = outline_tree.length
      for (let i = 0; i < length; i++) {
        let node = outline_tree[i]
        if (node.children && node.children.length > 0) {
          nodeValue = getNodeByname(node.children, key, value)
          if (nodeValue) {
            return nodeValue
          }
        } else {
          continue
          // return null;
        }
      }
    }
  }
  return nodeValue
}

const getTreeNodeValue = (outline_tree, id) => {
  if (outline_tree) {
    for (let i = 0; i < outline_tree.length; i++) {
      let node = outline_tree[i]
      if (node.id == id) {
        return node
      } else {
        if (node.children && node.children.length > 0) {
          let childNode = getNode(node.children, id)
          if (childNode) {
            return childNode
          }
        } else {
          continue
          // return null;
        }
      }
    }
  } else {
    return null
  }
}

const getAddNode = (outline_tree, add_id) => {
  let nodeValue = null
  if (outline_tree) {
    nodeValue = outline_tree.find(item => item.add_id == add_id)
    if (nodeValue) {
      return nodeValue
    } else {
      for (let i = 0; i < outline_tree.length; i++) {
        let node = outline_tree[i]
        if (node.children && node.children.length > 0) {
          nodeValue = getAddNode(node.children, add_id)
          if (nodeValue) {
            return nodeValue
          }
        } else {
          continue
          // return null;
        }
      }
    }
  }
  return nodeValue
}

const getTreeAddNodeValue = (outline_tree, add_id) => {
  if (outline_tree) {
    for (let i = 0; i < outline_tree.length; i++) {
      let node = outline_tree[i]
      if (node.add_id == add_id) {
        return node
      } else {
        if (node.children && node.children.length > 0) {
          let childNode = getAddNode(node.children, add_id)
          if (childNode) {
            return childNode
          }
        } else {
          continue
          // return null;
        }
      }
    }
  } else {
    return null
  }
}

// 过滤掉指定的树节点(删除树节点)
const filterTreeNode = (tree, id) => {
  if (!(tree instanceof Array)) {
    return tree
  }
  const length = tree.length
  for (let i = 0; i < length; i++) {
    let el = tree[i]
    if (el.id == id) {
      tree.splice(i, 1)
      break
    } else {
      if (el.children && el.children.length) {
        filterTreeNode(el.children, id)
      }
    }
  }
  return tree
}
// 过滤掉指定的树节点(删除树节点)(通过指定属性)
const filterTreeNodeByName = (tree, key, value) => {
  if (!(tree instanceof Array)) {
    return tree
  }
  const length = tree.length
  for (let i = 0; i < length; i++) {
    let el = tree[i]
    if (el[key] == value) {
      tree.splice(i, 1)
      break
    } else {
      if (el.children && el.children.length) {
        filterTreeNodeByName(el.children, key, value)
      }
    }
  }
  return tree
}
const getTreeNodeValueByName = (outline_tree, key, value) => {
  if (outline_tree) {
    let length = outline_tree.length
    for (let i = 0; i < length; i++) {
      let node = outline_tree[i]
      if (node[key] == value) {
        return node
      } else {
        if (node.children && node.children.length > 0) {
          let childNode = getNodeByname(node.children, key, value)
          if (childNode) {
            return childNode
          }
        } else {
          continue
          // return null;
        }
      }
    }
  } else {
    return null
  }
}

const OutlineTree = MyOutlineTree
//树节点
OutlineTree.TreeNode = TreeNode
//树方法
OutlineTree.getTreeNodeValue = getTreeNodeValue
OutlineTree.getTreeAddNodeValue = getTreeAddNodeValue
OutlineTree.filterTreeNode = filterTreeNode
OutlineTree.getTreeNodeValueByName = getTreeNodeValueByName
OutlineTree.filterTreeNodeByName = filterTreeNodeByName
export default OutlineTree
