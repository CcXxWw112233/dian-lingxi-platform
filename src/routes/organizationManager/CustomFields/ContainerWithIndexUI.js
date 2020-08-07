
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

const { Panel } = Collapse;

function ContainerWithIndexUI(props) {
  const [is_add_custom_field, setAddCustomFields] = useState(false)
  const [is_add_custom_field_list, setAddCustomFieldsList] = useState(false)
  const [inputValue, setInputValue] = useState('')
  useEffect(() => {
    axios({
      url: './constantDetail.json',
      method: 'get',
      headers: {
        Authorization: Cookies.get('Authorization'),
        refreshToken: Cookies.get('refreshToken'),
        ...setUploadHeaderBaseInfo({}),
      },
    }).then(res => {
      console.log(res);
    })
  })
  const onChange = (e) => {
    setInputValue(e.target.value)
  }
  const onBlur = (e) => {
    let value = e.target.value
    setAddCustomFieldsList(false)
    setInputValue('')
  }
  const onClick = (e) => {
    e && e.stopPropagation()
    setAddCustomFields(true)
  }

  const customFiledsOverlay = () => {
    return (
      <Menu>
        <Menu.Item key='rename'>重命名</Menu.Item>
        <Menu.Item key='edit_fileds'>编辑字段</Menu.Item>
        <Menu.Item key='discont_fileds'>停用字段</Menu.Item>
        <Menu.Item key='delelte_fileds'>删除</Menu.Item>
      </Menu>
    )
  }

  const dropDownContent = () => {
    return (
      <Dropdown trigger={['click']} getPopupContainer={triggerNode => triggerNode.parentNode} overlay={customFiledsOverlay()}>
        <Tooltip title="字段菜单分类" getPopupContainer={triggerNode => triggerNode.parentNode}>
          <span className={`${commonStyles.custom_fileds_more} ${globalStyles.authTheme}`}>
            <em>&#xe66f;</em>
          </span>
        </Tooltip>
      </Dropdown>
    )
  }

  const header = (
    <div className={indexStyles.collapse_header_}>
      <div className={indexStyles.collapse_header_left}>
        这是一个字段分组
      </div>
      <div className={indexStyles.collapse_header_right} onClick={(e) => e && e.stopPropagation()}>
        <Tooltip title="添加字段" getPopupContainer={triggerNode => triggerNode.parentNode}>
          <span onClick={(e) => onClick(e)} className={globalStyles.authTheme}>
            <em>&#xe70b;</em>
          </span>
        </Tooltip>
        {dropDownContent()}
      </div>
    </div>
  )

  const panelContent = (
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
              <span>被引用次数：4次 <em>详情</em></span>
              <span>创建人：严世威</span>
              <span>状态：启用</span>
            </div>
          </div>
          <div className={indexStyles.panel_content_right}>
            {dropDownContent()}
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
  );

  const renderCustomCategoryContent = () => {
    return (
      <div className={indexStyles.collapse_content}>
        <Collapse destroyInactivePanel={true} bordered={false} defaultActiveKey={['1']}>
          <Panel header={header} key="1">
            <div>
              {panelContent}
            </div>
          </Panel>
          <Panel header={header} key="2">
            {panelContent}
          </Panel>
          <Panel header={header} key="3">
            {panelContent}
          </Panel>
        </Collapse>
        {/* {panelContent} */}
      </div>
    )
  }
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
            <span onClick={(e) => onClick(e, true)}>
              <span className={globalStyles.authTheme}>&#xe782;</span>
              <span>添加字段</span>
            </span>
          </div>
          {
            is_add_custom_field_list ? (
              <div className={indexStyles.custom_add_field_list_input_field}>
                <Input
                  autoFocus={true}
                  value={inputValue}
                  onChange={(e) => { onChange(e) }}
                  onBlur={(e) => { onBlur(e) }}
                />
                <Button type="primary" disabled={!inputValue}>确定</Button>
              </div>
            ) : (
                <div className={indexStyles.custom_add_field_list} onClick={() => setAddCustomFieldsList(true)}>
                  <span className={globalStyles.authTheme}>&#xe782;</span>
                  <span>新建字段分组</span>
                </div>
              )
          }
          <hr className={commonStyles.custom_hr} />
          {/* 分组和默认列表 */}
          {renderCustomCategoryContent()}
        </div>
      </div >
      <div id={'customCategoryContainer'} className={indexStyles.customCategoryContainer}>
        {
          is_add_custom_field && (
            <Modal
              width={440}
              visible={is_add_custom_field}
              title={null}
              width={400}
              footer={null}
              destroyOnClose={true}
              maskClosable={false}
              getContainer={() => document.getElementById('customCategoryContainer')}
              onCancel={() => setAddCustomFields(false)}
              style={{ width: '440px' }}
              maskStyle={{ backgroundColor: 'rgba(0,0,0,.3)' }}
            >
              <CustomFieldCategory />
            </Modal>
          )
        }
      </div>
    </>
  )
}

export default ContainerWithIndexUI;

