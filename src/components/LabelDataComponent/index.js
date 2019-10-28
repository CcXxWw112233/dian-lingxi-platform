import React from 'react'
import { Input, Menu, Spin, Icon, message, Dropdown, Tooltip, Button } from 'antd'
import indexStyles from './index.less'
import { isApiResponseOk } from "@/utils/handleResponseData"
import globalStyles from '@/globalset/css/globalClassName.less'
import { getBoardTagList } from '@/services/technological/task'
import { connect } from 'dva'

@connect()
export default class LabelDataComponent extends React.Component {
  state = {
    visible: false, // 控制下拉列表是否显示
    is_add_label: false, // 是否新建标签
    labelColorArr: [
      { label_id: 'red', label_color: '255,163,158' },
      { label_id: 'yellow', label_color: '255,213,145' },
      { label_id: 'blue', label_color: '145,213,255' },
      { label_id: 'purple', label_color: '211,173,247' },
      { label_id: 'green', label_color: '183,235,143' },
    ]
  }

  getInitBoardTag = (board_id) => {
    getBoardTagList({ board_id }).then(res => {
      if (isApiResponseOk(res)) {
        this.setState({
          boardTagList: res.data
        })
      } else {
        message.warn(res.message)
      }
    })
  }

  initSet = (props) => {
    const { keyWord, boardTagList = [] } = this.state
    let selectedKeys = []
    const { listData = [], searchName, currentSelect = [] } = props
    if (!Array.isArray(currentSelect)) return false
    for (let val of currentSelect) {
      selectedKeys.push(val['label_id'])
    }
    this.setState({
      selectedKeys
    }, () => {
      // this.setState({
      //   resultArr: this.fuzzyQuery(boardTagList, searchName, keyWord),
      // })
    })
  }
  componentDidMount() {
    this.initSet(this.props)
  }
  componentWillReceiveProps(nextProps) {
    this.initSet(nextProps)
    if (nextProps.board_id != this.props.board_id) {
      this.getInitBoardTag(nextProps.board_id)
    }
  }
  //模糊查询
  handleMenuReallySelect = (e) => {
    // e && e.stropPropagation()
    console.log('进来了', 'sssssssss')
    console.log(e, 'ssssss')
  }

  setSelectKey(e, type) {
    const { key, selectedKeys } = e
    if (!key) {
      return false
    }
    this.setState({
      selectedKeys
    }, () => {
      const { listData = [], searchName } = this.props
      const { keyWord, boardTagList = [] } = this.state
      // this.setState({
      //   resultArr: this.fuzzyQuery(boardTagList, searchName, keyWord),
      // })
    })
    this.props.handleChgSelectedLabel && this.props.handleChgSelectedLabel({ selectedKeys, key, type })
  }

  fuzzyQuery = (list, searchName, keyWord) => {
    var arr = [];
    for (var i = 0; i < list.length; i++) {
      if (list[i][searchName].indexOf(keyWord) !== -1) {
        arr.push(list[i]);
      }
    }
    return arr
  }

  onChange = (e) => {
    const { listData = [], searchName } = this.props
    const { boardTagList = [] } = this.state
    const keyWord = e.target.value
    // const resultArr = this.fuzzyQuery(boardTagList, searchName, keyWord)
    this.setState({
      keyWord,
      // resultArr
    })
  }

  // 控制显示隐藏的回调
  handleVisibleChange = (visible) => {
    // console.log(visible, 'sssss_visible')
    this.setState({
      visible: visible
    })
  }

  // 返回 回调
  handleBack = () => {
    this.setState({
      is_add_label: false
    })
  }

  // 关闭回调
  handleClose = (e) => {
    // console.log('进来了', e, 'ssssss')
    // e && e.stropPropagation()
    this.setState({
      visible: false,
    }, () => {
      this.setState({
        is_add_label: false
      })
    })
  }

  // 点击确定
  handleSave = () => {
    const { inputValue, selectedId, boardTagList = [] } = this.state
    let tempItem = boardTagList.find(item => item.is_selected_label == true)
    const color = tempItem.color
    this.props.handleAddLabel && this.props.handleAddLabel({ name: inputValue, color: color })
    this.setState({
      is_add_label: false
    })
  }

  // 新建标签回调
  handleAddLabel = (e) => {
    // console.log(e, 'ssssssss')
    // e && e.stropPropagation()
    this.setState({
      is_add_label: true
    })
  }

  /**
   * 标签的点击事件
   * @param {String} selectedId 当前点击的对象ID
   */
  handleLabelCheck(selectedId) {
    // console.log(e, 'ssssss')
    // e && e.stropPropagation()
    const { labelColorArr = [] } = this.state
    let new_labelColorArr = [...labelColorArr]
    new_labelColorArr = new_labelColorArr.map(item => {
      if (item.label_id == selectedId) { // 找到当前的点击对象
        if (item.is_selected_label) {// 如果已经点击了,那么再次点击则是取消
          let new_item = item
          new_item = { ...item, is_selected_label: false }
          return new_item
        } else { // 否则表示选择该标签
          let new_item = item
          new_item = { ...item, is_selected_label: true }
          return new_item
        }
      } else { // 排他处理
        let new_item = item
        new_item = { ...item, is_selected_label: false }
        return new_item
      }
    })
    this.setState({
      labelColorArr: new_labelColorArr,
      selectedId: selectedId
    })
  }

  // 输入框的chg事件
  handleChgValue = (e) => {
    let val = e.target.value
    this.setState({
      inputValue: val
    })
  }

  // 默认的menu
  randerNormalMenu = () => {
    const { Inputlaceholder = '搜索' } = this.props
    const { boardTagList = [], selectedKeys = [], keyWord } = this.state
    return (
      <Menu getCalendarContainer={triggerNode => triggerNode.parentNode} style={{ padding: '8px 0px', boxShadow: '0px 2px 8px 0px rgba(0,0,0,0.15)' }}
        selectedKeys={selectedKeys}
        onSelect={this.handleMenuReallySelect.bind(this)}
        multiple={true}
      >

        <div style={{ padding: '12px', paddingTop: '6px', boxSizing: 'border-box', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
          <Input placeholder={Inputlaceholder} value={keyWord} onChange={this.onChange.bind(this)} />
        </div>
        <Menu className={globalStyles.global_vertical_scrollbar} style={{ maxHeight: '248px', overflowY: 'auto', borderRight: 'none' }}>
          <Menu key="addLabel">
            <div style={{ padding: 0, margin: 0, height: '40px', lineHeight: '40px', cursor: 'pointer' }} onClick={this.handleAddLabel}>
              <div style={{ display: 'flex', alignItems: 'center' }} >
                <div style={{ width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 20, marginRight: 4, color: 'rgb(73, 155, 230)', }}>
                  <Icon type={'plus-circle'} style={{ fontSize: 12, marginLeft: 10, color: 'rgb(73, 155, 230)' }} />
                </div>
                <span style={{ color: 'rgb(73, 155, 230)' }}>新建标签</span>
              </div>
            </div>
          </Menu>
          {
            (boardTagList && boardTagList.length) && boardTagList.map((value) => {
              const { id, name, color } = value
              return (
                <Menu.Item key={id}>
                  <div className={indexStyles.label_item}>
                    <span style={{ background: `rgba(${color}, 1)` }} className={`${indexStyles.label_name}`}>{name}</span>
                    <span>
                      <span className={`${globalStyles.authTheme} ${indexStyles.edit_icon}`}>&#xe791;</span>
                      <span style={{ display: selectedKeys.indexOf(id) != -1 ? 'inline-block' : 'none' }}>
                        <Icon type="check" />
                      </span>
                    </span>
                  </div>
                </Menu.Item>
              )
            })
          }

        </Menu>
      </Menu>
    )
  }

  // 新建标签的menu
  randerAddLabelsMenu = () => {
    const { inputValue, labelColorArr = [] } = this.state
    const is_selected_label = (labelColorArr && labelColorArr.length) && labelColorArr.find(item => item.is_selected_label == true) && inputValue && inputValue != ''

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

        <Menu style={{ minHeight: '134px', borderTop: '1px solid rgba(0,0,0,0.09)', borderBottom: '1px solid rgba(0,0,0,0.09)', padding: '12px 24px' }}>
          <div className={indexStyles.input}>
            <input placeholder="标签名称" value={inputValue} onChange={this.handleChgValue} maxLength={30} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            {
              labelColorArr.map((item) => {
                const { label_id, label_color } = item
                return (
                  <span onClick={() => { this.handleLabelCheck(label_id) }} key={label_id} className={indexStyles.circle} style={{ background: `rgba(${label_color},1)` }}>
                    <span style={{ display: item.is_selected_label ? 'block' : 'none' }} className={`${globalStyles.authTheme} ${indexStyles.check_icon}`}>&#xe7fc;</span>
                  </span>
                )
              })
            }
          </div>
        </Menu>
        <Menu>
          <div style={{ textAlign: 'center', height: '58px', padding: '12px' }}>
            <Button disabled={is_selected_label ? false : true} onClick={this.handleSave} style={{ width: '100%' }} type="primary">确认</Button>
          </div>
        </Menu>
      </Menu>
    )
  }



  render() {
    const { children } = this.props
    const { is_add_label, visible } = this.state

    return (
      <div style={{ position: 'relative' }} 
        // onClick={this.handleVisibleChange}
      >

        <Dropdown
          visible={visible}
          trigger={['click']}
          getCalendarContainer={triggerNode => triggerNode.parentNode}
          overlayClassName={indexStyles.labelDataWrapper}
          overlay={is_add_label ? this.randerAddLabelsMenu() : this.randerNormalMenu()}
          onVisibleChange={(visible) => { this.handleVisibleChange(visible) }}
        >
          <div>
            {children}
          </div>
        </Dropdown>
      </div>

    )
  }

}
