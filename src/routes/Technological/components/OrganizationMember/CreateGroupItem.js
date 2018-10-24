//分组列表
import React from 'react'
import CreateTaskStyle from './CreateTask.less'
import { Icon, Checkbox, Collapse, Input, message, Menu, Modal, Dropdown } from 'antd'
import QueueAnim from  'rc-queue-anim'
import ItemTwo from  './ItemTwo'
import ItemOne from './ItemOne'
import {MESSAGE_DURATION_TIME} from "../../../../globalset/js/constant";
import ShowAddMenberModal from './ShowAddMenberModal'

const Panel = Collapse.Panel

export default class TaskItem extends React.Component {

  state = {
    isInEditAdd: false,
    inputValue: '',
    ShowAddMenberModalVisibile: false,
  }
  //添加成员
  gotoAddItem() {
    this.setShowAddMenberModalVisibile()
  }
  addItem(data,e) {
    const name =  e.target.value
    if(name){
      const obj = Object.assign(data,{name})
      this.props.addTask(obj)
    }
    this.setState({
      isAddEdit:false,
    })
  }

  //点击分组操作
  handleMenuClick(e ) {
    e.domEvent.stopPropagation();
    const { key } = e
    switch (key) {
      case '1':
        this.setIsInEditAdd()
        break
      case '2':
        this.deleteConfirm()
        break
      default:
        break
    }
  }
  deleteConfirm(parentKey ) {
    const that = this
    Modal.confirm({
      title: '确认删除？',
      okText: '确认',
      cancelText: '取消',
      onOk() {
        that.deleteGroupItem(parentKey)
      }
    });
  }
  deleteGroupItem(parentKey) {
  }

  //  修改分组名称
  setIsInEditAdd() {
    this.setState({
      isInEditAdd: true
    })
  }
  inputEditOk(e) {
    this.setState({
      isInEditAdd: false,
      inputValue: '',
    })
    if(!this.state.inputValue) {
      return false
    }
  //  caozuo props
  }
  inputChange(e) {
    this.setState({
      inputValue: e.target.value
    })
  }

//添加项目组成员操作
  setShowAddMenberModalVisibile() {
    this.setState({
      ShowAddMenberModalVisibile: !this.state.ShowAddMenberModalVisibile
    })
  }

  render() {
    const { isInEditAdd, inputValue } = this.state
    const { taskItemValue = {} } = this.props
    const { projectDetailInfoData = {} } = this.props.model.datas
    const { board_id } = projectDetailInfoData
    const { list_name = '23', list_id, card_data = [1,2,3] } = taskItemValue

    const operateMenu = () => {
      return (
        <Menu onClick={this.handleMenuClick.bind(this)}>
          <Menu.Item key={'1'}  style={{textAlign: 'center',padding:0,margin: 0}}>
            <div className={CreateTaskStyle.elseProjectMemu}>
              重命名
            </div>
          </Menu.Item>
          <Menu.Item key={'2'}  style={{textAlign: 'center',padding:0,margin: 0}}>
            <div className={CreateTaskStyle.elseProjectDangerMenu}>
              删除
            </div>
          </Menu.Item>
        </Menu>
      );
    }

    return (
      <div className={CreateTaskStyle.taskItem}>
        {!isInEditAdd?(
          <div className={CreateTaskStyle.title}>
            <div className={CreateTaskStyle.title_l}>
              <div>这是分组名称</div>
              <div style={{marginRight: 4, marginLeft: 4}}>·</div>
              <div>21</div>
              <Dropdown overlay={operateMenu()}>
                <div className={CreateTaskStyle.titleOperate}>
                  <Icon type="ellipsis" theme="outlined" />
                </div>
              </Dropdown>
            </div>
            <div className={CreateTaskStyle.title_r}>
              <div>子分组</div><div style={{marginRight: 4, marginLeft: 4}}>·</div>2 <Icon type="down" style={{marginLeft:6}} theme="outlined" />
            </div>
          </div>
        ) : (
          <div>
            <Input autoFocus defaultValue={list_name}  placeholder={'修改名称'} className={CreateTaskStyle.createTaskItemInput} onChange={this.inputChange.bind(this)} onPressEnter={this.inputEditOk.bind(this)} onBlur={this.inputEditOk.bind(this)}/>
          </div>
        )}

        <QueueAnim >
          {card_data.map((value,key) => {
            let contain
            if(key%2 !== 0) {
              contain = (
                <ItemOne itemValue={value} {...this.props}
                         itemKey={key}
                         key={key} {...this.props} />
               )
            }else {
              contain = (
                <ItemOne itemValue={value} {...this.props}
                         itemKey={key}
                         key={key} {...this.props} />
               )
            }
            return contain
          })}
          <div  key={'add'} className={CreateTaskStyle.addItem} onClick={this.gotoAddItem.bind(this)}>
            <Icon type="plus-circle-o" />
          </div>
        </QueueAnim>
        <ShowAddMenberModal {...this.props}  modalVisible={this.state.ShowAddMenberModalVisibile} setShowAddMenberModalVisibile={this.setShowAddMenberModalVisibile.bind(this)}/>

      </div>
    )
  }
}
