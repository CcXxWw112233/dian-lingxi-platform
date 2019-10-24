import React from 'react'
import { Input, Menu, Spin, Icon, message, Dropdown, Tooltip, Button } from 'antd'
import indexStyles from './index.less'
import { isApiResponseOk } from "@/utils/handleResponseData"
import globalStyles from '@/globalset/css/globalClassName.less'
import { getBoardTagList } from '@/services/technological/task'


export default class LabelDataComponent extends React.Component {
  state = {
    visible: false, // 控制下拉列表是否显示
    isAddLabel: false, // 是否新建标签
  }

  getInitBoardTag = (board_id) => {
    getBoardTagList({board_id}).then(res => {
      if (isApiResponseOk(res)) {
        this.setState({
          boardTagList: res.data
        })
      } else {
        message.warn(res.message)
      }
    })
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.board_id != this.props.board_id) {
      this.getInitBoardTag(nextProps.board_id)
    }
  }

  handleMenuClick = (e) => {
    const { selectedValue } = this.props;
    const { key } = e;
    if (selectedValue) {
      if (selectedValue == key) {
        this.setSelectKey(e, 'remove')
      } else {
        this.setSelectKey(e, 'update')
      }

    } else {
      this.setSelectKey(e, 'add')
    }
  }

  setSelectKey(e, type) {
    let { key, item = {} } = e;
    if (!key) {
      return false
    }
  }

  fuzzyQuery = (list, searchName, keyWord) => {
    var arr = [];
    for (var i = 0; i < list.length; i++) {
      if (list[i][searchName].indexOf(keyWord) !== -1) {
        arr.push(list[i]);
      }
    }
  }

  onChange = (e) => {
    const { listData = [], searchName } = this.props
    const keyWord = e.target.value
    const resultArr = this.fuzzyQuery(listData, searchName, keyWord)
    this.setState({
      keyWord,
      resultArr
    })
  }

  // 控制显示隐藏的回调
  handleVisibleChange = () => {
    this.setState({
      visible: true
    })
  }

  // 返回 回调
  handleBack = () => {
    this.setState({
      isAddLabel: false
    })
  }

  // 关闭回调
  handleClose = (e) => {
    // console.log('进来了', e, 'ssssss')
    // e && e.stropPropagation()
    this.setState({
      visible: false
    })
  }

  // 点击确定
  handleSave = () => {
    this.setState({
      isAddLabel: false
    })
  }

  // 新建标签回调
  handleAddLabel = () => {
    // console.log('进来了', 'ssssssss')
    this.setState({
      isAddLabel: true
    })
  }


  // 默认的menu
  randerNormalMenu = () => {
    const { Inputlaceholder = '搜索', children, keyWord } = this.props
    return (
      <Menu getCalendarContainer={triggerNode => triggerNode.parentNode}getCalendarContainer={triggerNode => triggerNode.parentNode} style={{ padding: '8px 0px', boxShadow: '0px 2px 8px 0px rgba(0,0,0,0.15)' }}
        // selectedKeys={[selectedValue]}
        // onClick={this.handleMenuClick}
        multiple={false}
         >

        <div style={{ padding: '12px', paddingTop: '6px', boxSizing: 'border-box', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
          <Input placeholder={Inputlaceholder} value={keyWord} onChange={this.onChange.bind(this)} />
        </div>
        <Menu className={globalStyles.global_vertical_scrollbar} style={{ maxHeight: '248px', overflowY: 'auto', borderRight: 'none' }}>
          <Menu>
            <div style={{ padding: 0, margin: 0, height: '40px', lineHeight: '40px', cursor: 'pointer' }} onClick={this.handleAddLabel}>
              <div style={{ display: 'flex', alignItems: 'center' }} >
                <div style={{ width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 20, marginRight: 4, color: 'rgb(73, 155, 230)', }}>
                  <Icon type={'plus-circle'} style={{ fontSize: 12, marginLeft: 10, color: 'rgb(73, 155, 230)' }} />
                </div>
                <span style={{ color: 'rgb(73, 155, 230)' }}>新建标签</span>
              </div>
            </div>
          </Menu>
          <Menu.Item key="1">
            <div className={indexStyles.label_item}>
              <span className={`${indexStyles.label_name}`}>标签名称</span>
              <span>
                <span className={`${globalStyles.authTheme} ${indexStyles.edit_icon}`}>&#xe791;</span>
                <span style={{ display: 'inline-block' }}>
                  <Icon type="check" />
                </span>
              </span>
            </div>
          </Menu.Item>
        </Menu>
      </Menu>
    )
  }

  // 新建标签的menu
  randerAddLabelsMenu = () => {
    return (
      <Menu getCalendarContainer={triggerNode => triggerNode.parentNode} style={{ padding: '8px 0px', boxShadow: '0px 2px 8px 0px rgba(0,0,0,0.15)', width: '248px', }}
        // selectedKeys={[selectedValue]}
        // onClick={this.handleMenuClick}
        multiple={false}
         >

        <div style={{ display: 'flex', padding: '12px 16px', alignItems: 'center' }}>
          <span onClick={this.handleBack} className={`${globalStyles.authTheme} ${indexStyles.back_icon}`}>&#xe7ec;</span>
          <span className={indexStyles.label_title}>新建标签</span>
          <span onClick={this.handleClose} className={`${globalStyles.authTheme} ${indexStyles.close_icon}`}>&#xe7fe;</span>
        </div>

        <Menu style={{height: '134px', borderTop: '1px solid rgba(0,0,0,0.09)', borderBottom: '1px solid rgba(0,0,0,0.09)', padding: '12px 24px'}}>
          <div className={indexStyles.input}>
            <input placeholder="标签名称" />
          </div>
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
            <span className={indexStyles.circle}></span>
          </div>
        </Menu>
        <Menu>
          <div style={{textAlign: 'center', height: '58px', padding: '12px'}}>
            <Button onClick={this.handleSave} style={{width: '100%'}} type="primary">确认</Button>
          </div>
        </Menu>
      </Menu>
    )
  }



  render() {
    const { Inputlaceholder = '搜索', children, keyWord } = this.props
    const { isAddLabel, visible } = this.state
    console.log(visible, 'ssssss')

    return (
      <div style={{ position: 'relative' }} onClick={this.handleVisibleChange}>

        <Dropdown
          visible={visible}
          trigger={['click']}
          getCalendarContainer={triggerNode => triggerNode.parentNode}
          overlayClassName={indexStyles.labelDataWrapper}
          overlay={isAddLabel ? this.randerAddLabelsMenu() : this.randerNormalMenu()}
        >
          <div>
            {children}
          </div>
        </Dropdown>
      </div>

    )
  }

}
