
// 容器组件
import React, { Component, useState, useEffect } from 'react'
import { Input, Button, Modal, Collapse, Tooltip, Dropdown, Menu } from 'antd'
import indexStyles from './index.less'
import commonStyles from './common.less'
import globalStyles from '@/globalset/css/globalClassName.less'
import CustomFieldCategory from './component/CustomFieldCategory'
import axios from 'axios'
import Cookies from 'js-cookie'
import { setUploadHeaderBaseInfo } from '../../../utils/businessFunction'
import CustomFieldQuoteDetail from './component/CustomFieldQuoteDetail'
import { createCustomFieldGroup, getCustomFieldList } from '../../../services/organization'
import { isApiResponseOk } from '../../../utils/handleResponseData'
import { getCreateUser } from './handleOperateModal'

const { Panel } = Collapse;

export default class ContainerWithIndexUI extends Component {

  constructor(props) {
    super(props)
    this.state = {
      isAddCustomFieldVisible: false, // 是否显示添加字段
      isAddCustomFieldListVisible: false, // 是否显示添加分组字段
      inputValue: '', // 创建分组名称
    }
  }

  initState = () => {
    this.setState({
      isAddCustomFieldVisible: false,
      isAddCustomFieldListVisible: false,
      inputValue: ''
    })
  }

  componentDidMount() {
    this.props.dispatch({
      type: 'organizationManager/getCustomFieldList',
      payload: {}
    })
  }

  componentWillUnmount() {
    this.initState()
  }

  updateState = () => {
    this.setState({
      isCustomFieldQuoteDetailVisible: false
    })
  }

  // 关闭回调
  onCancel = () => {
    this.initState()
  }

  // 点击添加字段
  handleAddCustomFields = (e, item) => {
    e && e.stopPropagation()
    this.setState({
      isAddCustomFieldVisible: true,
    })
    this.props.dispatch({
      type: 'organizationManager/updateDatas',
      payload: {
        currentOperateFieldItem: item
      }
    })
  }

  // 点击添加分组字段
  setAddCustomFieldsList = (e) => {
    e && e.stopPropagation()
    this.setState({
      isAddCustomFieldListVisible: true
    })
  }

  // 点击详情
  handleCustomQuoteDetail = () => {
    this.setState({
      isCustomFieldQuoteDetailVisible: true
    })
  }

  onChange = (e) => {
    this.setState({
      inputValue: e.target.value
    })
  }

  onBlur = (e) => {
    let value = e.target.value
    if (!value || value.trimLR() == '') {
      this.setState({
        isAddCustomFieldListVisible: false
      })
    }
  }

  // 创建自定义字段分组
  handleCreateCustomFieldGroup = (e) => {
    e && e.stopPropagation()
    const { inputValue } = this.state
    const { dispatch } = this.props
    if (!inputValue || inputValue.trimLR() == '') {
      this.setState({
        isAddCustomFieldListVisible: false
      })
      return
    } else {
      dispatch({
        type: 'organizationManager/createCustomFieldGroup',
        payload: {
          name: inputValue
        }
      })
      this.setState({
        isAddCustomFieldListVisible: false,
        inputValue: ''
      })
    }
  }

  // 重命名
  handleRename = (e, item) => {
    console.log(e, item);
    const { domEvent } = e
    const { id } = item
    domEvent && domEvent.stopPropagation()
    this.setState({
      // current_operate_rename_item: id
    })
  }

  confirm = ({item, type}) => {
    const modal = Modal.confirm()
    const that = this
    modal.update({
      title: '确认要删除这条字段吗？',
      content: '删除后不可恢复',
      zIndex: 1110,
      okText: '确认',
      cancelText: '取消',
      style: {
        letterSpacing: '1px'
      },
      // getContainer: document.getElementById('org_managementContainer') ? () => document.getElementById('org_managementContainer') : triggerNode => triggerNode.parentNode,
      onOk: () => {
        that.props.dispatch({
          type: type =='no_group' ? 'organizationManager/deleteCustomField' : 'organizationManager/deleteCustomFieldGroup',
          payload: {
            id: item.id
          }
        })
      },
      onCancel: () => {
        modal.destroy();
      }
    });
  }

  // 删除字段
  handleDeleteField = ({e, item, type}) => {
    const { domEvent } = e
    domEvent && domEvent.stopPropagation()
    this.confirm({item, type})
  }

  customFiledsOverlay = ({ item, type }) => {
    return (
      <Menu>
        {
          type == 'group' && (
            <Menu.Item onClick={(e) => { this.handleRename(e, item) }} key='rename'>重命名</Menu.Item>
          )
        }
        {
          type == 'no_group' && (
            <Menu.Item key='edit_fileds'>编辑字段</Menu.Item>
          )
        }
        {
          type == 'no_group' && (
            <Menu.Item key='discont_fileds'>停用字段</Menu.Item>
          )
        }
        <Menu.Item onClick={(e) => { this.handleDeleteField({e, item, type}) }} style={{ color: '#F5222D' }} key='delelte_fileds'>删除</Menu.Item>
      </Menu>
    )
  }

  dropDownContent = ({ item, type }) => {
    return (
      <Dropdown trigger={['click']} getPopupContainer={triggerNode => triggerNode.parentNode} overlay={this.customFiledsOverlay({ item, type })}>
        <Tooltip title="字段菜单分类" getPopupContainer={triggerNode => triggerNode.parentNode}>
          <span className={`${commonStyles.custom_fileds_more} ${globalStyles.authTheme}`}>
            <em>&#xe66f;</em>
          </span>
        </Tooltip>
      </Dropdown>
    )
  }

  headerContent = (item) => {
    return (
      <div className={indexStyles.collapse_header_}>
        <div className={indexStyles.collapse_header_left}>
          {item.name}
        </div>
        <div className={indexStyles.collapse_header_right} onClick={(e) => e && e.stopPropagation()}>
          <Tooltip title="添加字段" getPopupContainer={triggerNode => triggerNode.parentNode}>
            <span onClick={(e) => this.handleAddCustomFields(e, item)} className={globalStyles.authTheme}>
              <em>&#xe70b;</em>
            </span>
          </Tooltip>
          {this.dropDownContent({ item, type: 'group' })}
        </div>
      </div>
    )
  }

  panelContent = (value, index) => {
    const { field_status, group_id } = value
    return (
      <>
        {
          group_id != '0' && (
            <hr className={`${commonStyles.custom_hr} ${commonStyles.custom_hr_sub}`} />
          )
        }
        <div className={indexStyles.panel_content_hover}>
          <div className={indexStyles.panel_content}>
            <div className={indexStyles.panel_content_left}>
              <div className={indexStyles.panel_item_name}>
                <span className={globalStyles.authTheme}>&#xe6b2;</span>
                <span>{value.name}</span>
              </div>
              <div className={indexStyles.panel_detail}>
                <span>类型：单选</span>
                <span>被引用次数：4次 <em onClick={this.handleCustomQuoteDetail}>详情</em></span>
                <span>创建人：{getCreateUser()}</span>
                <span style={{ color: field_status == '1' && '#F5222D' }}>状态：{field_status == '0' ? '启用' : '停用'}</span>
              </div>
            </div>
            <div className={indexStyles.panel_content_right}>
              {this.dropDownContent({ item: value, type: 'no_group' })}
            </div>
          </div>
        </div>
        {
          (!!index || index == 0) && (
            <hr className={`${commonStyles.custom_hr} ${commonStyles.custom_hr_nogroup}`} />
          )
        }
      </>
    )
  }

  renderCustomCategoryContent = () => {
    const { customFieldsList: { groups = [], fields = [] } } = this.props
    return (
      <div className={indexStyles.collapse_content}>
        <Collapse destroyInactivePanel={true} bordered={false} defaultActiveKey={['1']}>
          {
            !!(groups && groups.length) && groups.map(item => {
              return (
                <Panel header={this.headerContent(item)} key={item.id}>
                  {
                    item.fields && item.fields.length && item.fields.map(value => {
                      return (
                        <div>
                          {this.panelContent(value)}
                        </div>
                      )
                    })
                  }
                </Panel>
              )
            })
          }
        </Collapse>
        {
          !!(fields && fields.length) && fields.map((item,index) => {
            return (
              <div className={indexStyles.no_collapse_content}>
                {this.panelContent(item, index)}
              </div>
            )
          })
        }
      </div>
    )
  }

  render() {
    const { isAddCustomFieldVisible, isAddCustomFieldListVisible, inputValue, isCustomFieldQuoteDetailVisible } = this.state
    const { customFieldsList = {} } = this.props
    return (
      <>
        <div className={indexStyles.custom_fields_wrapper}>
          <div>
            <div className={indexStyles.custom_title}>
              <div className={`${globalStyles.authTheme} ${indexStyles.custom_title_icon}`}>&#xe7f8;</div>
              <div className={indexStyles.custom_title_name}>
                自定义字段
            </div>
            </div>
            <div className={indexStyles.custom_add_field}>
              <span onClick={(e) => this.handleAddCustomFields(e)}>
                <span className={globalStyles.authTheme}>&#xe782;</span>
                <span>添加字段</span>
              </span>
            </div>
            {
              isAddCustomFieldListVisible ? (
                <div className={indexStyles.custom_add_field_list_input_field}>
                  <Input
                    autoFocus={true}
                    value={inputValue}
                    onChange={this.onChange}
                    onBlur={this.onBlur}
                  />
                  <Button onClick={this.handleCreateCustomFieldGroup} type="primary" disabled={!inputValue || inputValue.trimLR() == ''}>确定</Button>
                </div>
              ) : (
                  <div className={indexStyles.custom_add_field_list} onClick={this.setAddCustomFieldsList}>
                    <span className={globalStyles.authTheme}>&#xe782;</span>
                    <span>新建字段分组</span>
                  </div>
                )
            }
            <hr className={commonStyles.custom_hr} />
            {/* 分组和默认列表 */}
            {this.renderCustomCategoryContent()}
          </div>
        </div >
        <div id={'customCategoryContainer'} className={indexStyles.customCategoryContainer}>
          {
            isAddCustomFieldVisible && (
              <Modal
                width={440}
                visible={isAddCustomFieldVisible}
                title={null}
                footer={null}
                destroyOnClose={true}
                maskClosable={false}
                getContainer={() => document.getElementById('customCategoryContainer')}
                onCancel={this.onCancel}
                style={{ width: '440px' }}
                maskStyle={{ backgroundColor: 'rgba(0,0,0,.3)' }}
              >
                <CustomFieldCategory customFieldsList={customFieldsList} onCancel={this.onCancel} />
              </Modal>
            )
          }
        </div>
        {/* 点击详情内容 */}
        {<CustomFieldQuoteDetail visible={isCustomFieldQuoteDetailVisible} updateState={this.updateState} />}
      </>
    )
  }
}
