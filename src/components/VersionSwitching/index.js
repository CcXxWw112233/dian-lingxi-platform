/**
 * 该组件需要接收的参数有
 * <VersionSwitching {...params} 
                handleVersionItem={ this.handleVersionItem } 
                getVersionItemMenuClick={this.getVersionItemMenuClick}
                uploadProps={uploadProps} />
    需要文件相关的id字段 具体情况传入具体id
    两个方法: 1. 每一个menuItem切换的回调
							2. 设置为主版本的切换 
		以及一个上传文件的事件
 */

import React, { Component } from 'react'
import { Table, Button, Menu, Dropdown, Icon, Input, Drawer, Tooltip, Upload, Modal } from 'antd';
import globalStyles from '@/globalset/css/globalClassName.less'
import indexStyles from './index.less'

export default class index extends Component {

  state = {
    is_close: null, // 是否关闭状态, 默认为 null
    new_filePreviewCurrentVersionList: [], // 定义一个空的数组
  }

  componentWillReceiveProps(nextProps) {
    // console.log(nextProps, 'sssss')
    const { filePreviewCurrentVersionList = [] } = nextProps
    let new_filePreviewCurrentVersionList = [...filePreviewCurrentVersionList]
    new_filePreviewCurrentVersionList = new_filePreviewCurrentVersionList.map(item => {
      let new_item = { ...item }
      new_item = { ...item, is_edit: false }
      return new_item
    })

    this.setState({
      new_filePreviewCurrentVersionList,
    })
    // console.log(new_filePreviewCurrentVersionList, 'sssss')
  }

  /**
   * Dropdown的点击显示隐藏的回调
   * @param {Boolean} visible 是否显示 
   */
  handleVisibleChg(visible) {
    this.setState({
      is_close: visible
    })
  }

  // 点击关闭按钮的回调
  handleCloseChg() {
    const { is_close } = this.state
    this.handleVisibleChg(!is_close)
  }

  /**
   * 设置为主版本
   * @param {Object} 对应需要的参数
   * @param {Object} e 对应点击的key的字段
   */
  handleVersionChg = ({ list, file_id, file_name }, e) => {
    // console.log(e, 'sssss')
    this.props.getVersionItemMenuClick({ list, file_id, file_name }, e)
  }

  /**
   * 每一个menu菜单的item选项的切换
   * @param {Object} e 当前的事件对象
   */
  handleVersionItem = (e) => {
    // 调用父类的点击预览的版本切换的方法
    this.props.handleVersionItem(e)
  }

  handleFileDecription = (list, e) => {
    this.props.handleFileVersionDecription(list, e)
  }

  // 修改文本框的value值
  handleChgEditVal(e) {
    this.props.handleFileVersionValue(e)
  }

  // 阻止编辑的时候事件冒泡
  handleStopPro(e) {
    e && e.stopPropagation()
  }


  render() {

    const { is_close, new_filePreviewCurrentVersionList = [] } = this.state
    const { new_filePreviewVersionList = [], filePreviewCurrentFileId, uploadProps, is_edit_version_description } = this.props
    let temp_arr = new_filePreviewCurrentVersionList && new_filePreviewCurrentVersionList.length ? new_filePreviewCurrentVersionList : [...new_filePreviewVersionList]
    // console.log(this.props, 'sssss')
    // 点击版本信息的显示列表
    const getVersionItemMenu = (list) => {
      return (
        // onClick={this.getVersionItemMenuClick.bind(this, list)}
        <Menu selectable={true} style={{ width: 400, maxHeight: '314px' }}>
          <div key="versionTitle" style={{ borderBottom: '1px solid rgba(0,0,0,0.09)', height: '56px', lineHeight: '56px', padding: '0 16px' }}>
            <div className={indexStyles.title_wrapper} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span className={indexStyles.version_title}>版本信息</span>
              <span onClick={() => { this.handleCloseChg() }} className={indexStyles.version_close}>x</span>
            </div>
          </div>
          <Menu onClick={(e) => { this.handleVersionItem(e) }} className={`${globalStyles.global_vertical_scrollbar}`} style={{ maxHeight: '200px', overflowY: 'auto' }}>
            {list.map((value, key) => {
              const { file_name, creator, create_time, file_size, file_id, is_edit, remarks } = value
              return (
                <Menu.Item style={{ height: 'auto' }} className={indexStyles.version_menuItem} key={file_id}>
                  {
                    is_edit_version_description && is_edit ? (
                      <div style={{ marginBottom: '5px' }}>
                        <Input.TextArea
                          style={{ resize: 'none' }}
                          autoFocus={true}
                          autosize={true}
                          onChange={(e) => { this.handleChgEditVal(e) }}
                          onBlur={(e) => { this.handleFileDecription(list, e) }}
                          onClick={(e) => { this.handleStopPro(e) }}
                        />
                      </div>
                    ) : (
                        <div className={`${indexStyles.versionItemMenu} ${filePreviewCurrentFileId == file_id && indexStyles.current_version_color}`}>
                          <div className={`${globalStyles.authTheme} ${indexStyles.circle_icon} ${indexStyles.hover_color}`}>{filePreviewCurrentFileId == file_id ? (<span style={{ fontSize: '14px' }}>&#xe696;</span>) : (<span> &#xe697;</span>)}</div>
                          {
                            remarks && remarks ? (
                              <div style={{ lineHeight: '30px'}}>
                              <span style={{fontWeight: 400, fontSize: 14, marginRight: '5px' }} className={`${indexStyles.creator} ${indexStyles.hover_color}`} >
                                {remarks}&nbsp;&nbsp;&nbsp;&nbsp;
                              </span>
                              {filePreviewCurrentFileId == file_id && (
                                  <span className={`${indexStyles.status}`}>主版本</span>)}
                              </div>
                            ) : (
                                <div
                                  style={{ lineHeight: '30px' }}
                                >
                                  <span style={{ fontWeight: 400, fontSize: 14 }} className={`${indexStyles.creator} ${indexStyles.hover_color}`}>{creator}&nbsp;&nbsp;</span>
                                  <span className={indexStyles.hover_color}>上传于&nbsp;&nbsp;</span>
                                  <span className={indexStyles.hover_color}>{create_time}&nbsp;&nbsp;</span>
                                  {filePreviewCurrentFileId == file_id && (
                                    <span className={`${indexStyles.status}`}>主版本</span>)}
                                </div>
                              )
                          }
                          <div className={`${indexStyles.file_size} ${indexStyles.initalShow}`}>{file_size}</div>
                          <div className={`${indexStyles.file_size} ${indexStyles.initalHide} ${globalStyles.authTheme} ${indexStyles.operate}`}>
                            <Dropdown overlay={versionItemMenu({ list, file_id, file_name })}>
                              <span>&#xe7fd;</span>
                            </Dropdown>.
                          </div>
                        </div>
                      )
                  }
                </Menu.Item>
              )
            })}
          </Menu>
          <div key="updateVersion" style={{ height: '58px', lineHeight: '28px', borderTop: '1px solid rgba(0,0,0,0.09)' }} >
            <Upload className={indexStyles.upload_file} {...uploadProps} showUploadList={false}>
              <Button type="primary" style={{ color: '#fff', textAlign: 'center', width: 368, }}>
                <Icon type="upload" theme="outlined" style={{ margin: 0, fontSize: 16 }} /> 上传新版本
              </Button>
            </Upload>
          </div>
        </Menu>
      )
    }
    // 显示点点点的下拉菜单
    const versionItemMenu = ({ list, file_id, file_name }) => {
      return (
        <Menu onClick={(e) => { this.handleVersionChg({ list, file_id, file_name }, e) }}>
          <Menu.Item key="1">设为主版本</Menu.Item>
          <Menu.Item key="3">编辑版本信息</Menu.Item>
          <Menu.Item key="2" disabled>移到回收站</Menu.Item>
        </Menu>
      )
    }

    return (
      <div>
        <Dropdown visible={is_close} onVisibleChange={(visible) => { this.handleVisibleChg(visible) }} overlay={getVersionItemMenu(temp_arr)} trigger={['click']}>
          <Button className={indexStyles.version} style={{ height: 24, marginLeft: 14, display: 'flex', lineHeight: '24px' }}>
            <div className={`${globalStyles.authTheme}`}>&#xe785;</div>&nbsp;&nbsp;版本信息
                </Button>
        </Dropdown>
      </div>
    )
  }
}
