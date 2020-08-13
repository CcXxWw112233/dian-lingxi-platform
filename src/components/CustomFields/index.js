import React, { Component } from 'react'
import { connect } from 'dva'
import { Popover, Button, Tree } from 'antd'
import indexStyles from './index.less'
import globalsetStyles from '@/globalset/css/globalClassName.less'
import { getCustomFieldList } from '../../services/organization'
import { isApiResponseOk } from '../../utils/handleResponseData'
import { removeEmptyArrayEle } from '../../utils/util'
import EmptyImg from '@/assets/projectDetail/process/Empty@2x.png'

const { TreeNode } = Tree;

export default class Index extends Component {

  constructor(props) {
    super(props)
    this.state = {
      visible: false,
      checkedKeys: []
    }
  }

  initeState = () => {
    this.setState({
      visible: false,
      checkedKeys: [],
      treeData: [],
      groupsData: []
    })
  }

  componentDidMount() {
    const { org_id } = this.props
    getCustomFieldList({ _organization_id: org_id }).then(res => {
      if (isApiResponseOk(res)) {
        let treeData = removeEmptyArrayEle([].concat(res.data.groups, res.data.fields))
        this.setState({
          groupsData: res.data.groups,
          treeData
        })
      }
    })
  }

  handleVisibleChange = visible => {
    this.setState({
      visible: visible,
    });
    if (!visible) {
      this.setState({
        checkedKeys: []
      })
    }
  }

  onCheck = (checkedKeys) => {
    this.setState({
      checkedKeys
    })
  }

  // 重置
  handleReSetting = (e) => {
    e && e.stopPropagation()
    this.setState({
      checkedKeys: []
    })
  }

  // 添加字段
  handleAddCustomField = (e) => {
    e && e.stopPropagation()
    const { checkedKeys = [], groupsData = [] } = this.state
    let need_checkedKeys = []
    groupsData.forEach(item => {
      need_checkedKeys = checkedKeys.filter(n => n != item.id)
    })
    const calback = () => {
      this.setState({
        visible: false,
        checkedKeys: []
      })
    }
    this.props.handleAddCustomField && this.props.handleAddCustomField(need_checkedKeys, calback)
  }

  renderTreeNodes = (data) => {
    if (!data) return
    return data.map(item => {
      if (item.fields && item.fields.length) {
        return (
          <TreeNode title={item.name} key={item.id} dataRef={item}>
            {this.renderTreeNodes(item.fields)}
          </TreeNode>
        );
      }
      return <TreeNode title={item.name} key={item.id} dataRef={item} />;
    });
  }


  renderSelectedTree = () => {
    const { treeData = [], checkedKeys = [] } = this.state
    return (
      <div className={`${indexStyles.treeWrapper} ${globalsetStyles.global_vertical_scrollbar}`}>
        {
          treeData && treeData.length ? (
            <Tree
              checkable
              onCheck={this.onCheck}
              checkedKeys={checkedKeys}
            >
              {this.renderTreeNodes(treeData)}
            </Tree>
          ) : (
              <div style={{ height: '230px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                <div><img style={{ width: '94px', height: '62px' }} src={EmptyImg} alt="" /></div>
                <div style={{ color: 'rgba(0,0,0,0.45)' }}>暂无数据</div>
              </div>
            )
        }
      </div>
    )
  }

  renderButton = () => {
    const { checkedKeys = [] } = this.state
    return (
      <div className={indexStyles.fileds_button}>
        <Button onClick={this.handleReSetting}>重置</Button>
        <Button onClick={this.handleAddCustomField} disabled={!!!(checkedKeys && checkedKeys.length)} type="primary">确定</Button>
      </div>
    )
  }

  renderContent = () => {
    const { treeData = [] } = this.state
    return (
      <div>
        <div>{this.renderSelectedTree()}</div>
        {
          !!(treeData && treeData.length) && (
            <div>{this.renderButton()}</div>
          )
        }

      </div>
    )
  }

  componentWillUnmount() {
    console.log('进来了','sssssssssssssunmount');
  }

  render() {
    const { children, placement, getPopupContainer } = this.props
    return (
      <div>
        <Popover
          getPopupContainer={getPopupContainer ? () => getPopupContainer : triggerNode => triggerNode.parentNode}
          placement={placement ? placement : 'bottom'}
          title={<div className={indexStyles.popover_title}>添加字段</div>}
          trigger="click"
          visible={this.state.visible}
          onVisibleChange={this.handleVisibleChange}
          content={this.renderContent()}
        >
          {children}
        </Popover>
      </div>
    )
  }
}

Index.defaultProps = {
  org_id: '', // 需要一个组织ID获取树状列表
  handleAddCustomField: function(){}, // 添加自定义字段回调，由外部决定
}
