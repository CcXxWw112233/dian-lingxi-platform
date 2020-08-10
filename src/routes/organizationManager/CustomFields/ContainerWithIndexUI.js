
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

const { Panel } = Collapse;

export default class ContainerWithIndexUI extends Component {

  constructor(props) {
    super(props)
    this.state = {
      isAddCustomFieldVisible: false, // 是否显示添加字段
      isAddCustomFieldListVisible: false, // 是否显示添加分组字段
      inputValue: ''
    }
  }

  initState = () => {
    this.setState({
      isAddCustomFieldVisible: false,
      isAddCustomFieldListVisible: false,
      inputValue: ''
    })
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
  handleAddCustomFields = (e) => {
    e && e.stopPropagation()
    this.setState({
      isAddCustomFieldVisible: true
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
    this.setState({
      isAddCustomFieldListVisible: false
    })
  }

  customFiledsOverlay = () => {
    return (
      <Menu>
        <Menu.Item key='rename'>重命名</Menu.Item>
        <Menu.Item key='edit_fileds'>编辑字段</Menu.Item>
        <Menu.Item key='discont_fileds'>停用字段</Menu.Item>
        <Menu.Item key='delelte_fileds'>删除</Menu.Item>
      </Menu>
    )
  } 

  dropDownContent = () => {
    return (
      <Dropdown trigger={['click']} getPopupContainer={triggerNode => triggerNode.parentNode} overlay={this.customFiledsOverlay()}>
        <Tooltip title="字段菜单分类" getPopupContainer={triggerNode => triggerNode.parentNode}>
          <span className={`${commonStyles.custom_fileds_more} ${globalStyles.authTheme}`}>
            <em>&#xe66f;</em>
          </span>
        </Tooltip>
      </Dropdown>
    )
  }

  headerContent = () => {
    return (
      <div className={indexStyles.collapse_header_}>
        <div className={indexStyles.collapse_header_left}>
          这是一个字段分组
      </div>
        <div className={indexStyles.collapse_header_right} onClick={(e) => e && e.stopPropagation()}>
          <Tooltip title="添加字段" getPopupContainer={triggerNode => triggerNode.parentNode}>
            <span onClick={(e) => this.handleAddCustomFields(e)} className={globalStyles.authTheme}>
              <em>&#xe70b;</em>
            </span>
          </Tooltip>
          {this.dropDownContent()}
        </div>
      </div>
    )
  }

  panelContent = () => {
    return (
      <>
        <hr className={`${commonStyles.custom_hr} ${commonStyles.custom_hr_sub}`} />
        <div className={indexStyles.panel_content_hover}>
          <div className={indexStyles.panel_content}>
            <div className={indexStyles.panel_content_left}>
              <div className={indexStyles.panel_item_name}>
                <span className={globalStyles.authTheme}>&#xe6b2;</span>
                <span>这是一个单选项字段</span>
              </div>
              <div className={indexStyles.panel_detail}>
                <span>类型：单选</span>
                <span>被引用次数：4次 <em onClick={this.handleCustomQuoteDetail}>详情</em></span>
                <span>创建人：严世威</span>
                <span>状态：启用</span>
              </div>
            </div>
            <div className={indexStyles.panel_content_right}>
              {this.dropDownContent()}
            </div>
          </div>
        </div>
        <hr className={`${commonStyles.custom_hr} ${commonStyles.custom_hr_sub}`} />
        <div className={indexStyles.panel_content_hover}>
          <div className={indexStyles.panel_content}>
            <div className={indexStyles.panel_content_left}>
              <div className={indexStyles.panel_item_name}>
                <span className={globalStyles.authTheme}>&#xe6b2;</span>
                <span>这是一个单选项字段</span>
              </div>
              <div className={indexStyles.panel_detail}>
                <span>类型：单选</span>
                <span>被引用次数：4次 <em>详情</em></span>
                <span>创建人：严世威</span>
                <span>状态：启用</span>
              </div>
            </div>
            <div className={indexStyles.panel_content_right}>
              <Tooltip title="字段菜单" getPopupContainer={triggerNode => triggerNode.parentNode}>
                <span className={`${commonStyles.custom_fileds_more} ${globalStyles.authTheme}`}>
                  <em>&#xe66f;</em>
                </span>
              </Tooltip>
            </div>
          </div>
        </div>
      </>
    )
  }

  renderCustomCategoryContent = () => {
    return (
      <div className={indexStyles.collapse_content}>
        <Collapse destroyInactivePanel={true} bordered={false} defaultActiveKey={['1']}>
          <Panel header={this.headerContent()} key="1">
            <div>
              {this.panelContent()}
            </div>
          </Panel>
          <Panel header={this.headerContent()} key="2">
            {this.panelContent()}
          </Panel>
          <Panel header={this.headerContent()} key="3">
            {this.panelContent()}
          </Panel>
        </Collapse>
        {/* {panelContent} */}
      </div>
    )
  }

  render() {
    const { isAddCustomFieldVisible, isAddCustomFieldListVisible, inputValue, isCustomFieldQuoteDetailVisible } = this.state
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
                  <Button type="primary" disabled={!inputValue}>确定</Button>
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
                <CustomFieldCategory />
              </Modal>
            )
          }
        </div>
        {<CustomFieldQuoteDetail visible={isCustomFieldQuoteDetailVisible} updateState={this.updateState} />}
      </>
    )
  }
}
