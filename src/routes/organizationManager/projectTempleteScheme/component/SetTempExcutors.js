import React, { Component } from 'react'
import MenuSearchPartner from '@/components/MenuSearchMultiple/MenuSearchPartner.js'
import { connect } from 'dva'
import { debounce } from 'lodash'
import { updateTempleteContainer } from '../../../../services/organization'

@connect(mapStateToProps)
export default class SetTempExcutors extends Component {
  constructor(props) {
    super(props)
  }
  setList = (arr = []) => {
    const data = arr.map(item => {
      item.user_id = item.id
      return item
    })
    return data
  }
  getNode = (outline_tree, id) => {
    let nodeValue = null
    if (outline_tree) {
      nodeValue = outline_tree.find(item => item.id == id)
      if (nodeValue) {
        return nodeValue
      } else {
        for (let i = 0; i < outline_tree.length; i++) {
          let node = outline_tree[i]
          if (node.child_content && node.child_content.length > 0) {
            nodeValue = this.getNode(node.child_content, id)
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

  getTreeNodeValue = (outline_tree, id) => {
    if (outline_tree) {
      for (let i = 0; i < outline_tree.length; i++) {
        let node = outline_tree[i]
        if (node.id == id) {
          return node
        } else {
          if (node.child_content && node.child_content.length > 0) {
            let childNode = this.getNode(node.child_content, id)
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
  handleSelected = ({ selectedKeys, type }) => {
    const {
      currentOrgAllMembersList = [],
      id,
      currentTempleteListContainer,
      dispatch
    } = this.props
    const node_value = this.getTreeNodeValue(currentTempleteListContainer, id)
    // console.log('ssssssssaaaa_1', node_value)
    // console.log('ssssssssaaaa_2', currentTempleteListContainer, id)

    let final_excutors = selectedKeys.map(val => {
      const value = currentOrgAllMembersList.find(item => item.id == val)
      return value
    })
    // for (let val of selectedKeys) {
    //   const value = currentOrgAllMembersList.find(item => item.id == val)
    //   if (value) {
    //     if (type == 'add') {
    //       final_excutors.push(value)
    //     } else if (type == 'remove') {
    //       final_excutors = final_excutors.filter(item => item.id != val)
    //     }
    //   }
    // }
    node_value.executors = final_excutors
    dispatch({
      type: 'organizationManager/updatedatas',
      payload: {
        currentTempleteListContainer
      }
    })
    console.log('ssssssssaaaa_3', final_excutors, selectedKeys)
    this.setExcutors(final_excutors)
  }
  setExcutors = debounce(final_excutors => {
    const { id } = this.props
    const executors = final_excutors.map(item => item.id).join(',')
    updateTempleteContainer({ id, executors }).then(res => {})
  }, 500)
  render() {
    const { executors = [], currentOrgAllMembersList } = this.props
    const listData = this.setList(currentOrgAllMembersList)
    const current = this.setList(executors)
    console.log('ssssssssaaaa_1', current)
    return (
      <MenuSearchPartner
        HideInvitationOther
        not_show_wechat_invite
        invitationType="1"
        listData={listData}
        keyCode={'user_id'}
        searchName={'name'}
        currentSelect={current}
        chirldrenTaskChargeChange={this.handleSelected}
      />
    )
  }
}

function mapStateToProps({
  technological: {
    datas: { currentOrgAllMembersList = [] }
  },
  organizationManager: {
    datas: { currentTempleteListContainer = [] }
  }
}) {
  return {
    currentOrgAllMembersList,
    currentTempleteListContainer
  }
}
