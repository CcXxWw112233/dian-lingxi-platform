//任务
import React from 'react'
import CreateTaskStyle from './CreateTask.less'
import { Icon, Checkbox, Collapse, message, } from 'antd'
import ItemTwoChirldren from './ItemTwoChirldren'
import QueueAnim from  'rc-queue-anim'
import {checkIsHasPermissionInBoard} from "../../../../../utils/businessFunction";
import {MESSAGE_DURATION_TIME, PROJECT_TEAM_CARD_COMPLETE, NOT_HAS_PERMISION_COMFIRN} from "../../../../../globalset/js/constant";
import globalStyle from '../../../../../globalset/css/globalClassName.less'
import {timestampToTimeNormal} from "../../../../../utils/util";

const Panel = Collapse.Panel

export default class ItemTwo extends React.Component {
  state = {
    collapseClose: true, //折叠面板变化回调
  }
  itemOneClick(e) {
    e.stopPropagation();
    if(!checkIsHasPermissionInBoard(PROJECT_TEAM_CARD_COMPLETE)){
      message.warn(NOT_HAS_PERMISION_COMFIRN, MESSAGE_DURATION_TIME)
      return false
    }
    const { itemValue, taskGroupListIndex, taskGroupListIndex_index } = this.props
    const {  datas:{ taskGroupList } } = this.props.model
    const { card_id, is_realize = '0' } = itemValue
    const obj = {
      card_id,
      is_realize: is_realize === '1' ? '0' : '1'
    }
    taskGroupList[taskGroupListIndex]['card_data'][taskGroupListIndex_index]['is_realize'] = is_realize === '1' ? '0' : '1'
    this.props.updateDatas({taskGroupList})
    this.props.completeTask(obj)
  }
  seeDetailInfo(data, e) {
    this.props.setDrawerVisibleOpen(data)
  }
  collapseChange() {
    this.setState({
      collapseClose: !this.state.collapseClose
    })
  }
  render() {
    const { itemValue = {} } = this.props
    const { card_id, card_name, child_data=[], is_realize = '0', executors = [], type='0',start_time, due_time } = itemValue
    let executor = {//任务执行人信息
      user_id: '',
      user_name: '',
      avatar: '',
    }
    if(executors.length) {
      executor = executors[0]
    }
    return (
      <div  key={'2'} className={CreateTaskStyle.item_2} >
        <div className={CreateTaskStyle.item_2_top}  onClick={this.seeDetailInfo.bind(this,{drawContent:itemValue, taskGroupListIndex: this.props.taskGroupListIndex, taskGroupListIndex_index: this.props.taskGroupListIndex_index})}>
          {type === '0'? (
            <div className={is_realize === '1' ? CreateTaskStyle.nomalCheckBoxActive: CreateTaskStyle.nomalCheckBox} onClick={this.itemOneClick.bind(this)}>
              <Icon type="check" style={{color: '#FFFFFF',fontSize:12, fontWeight:'bold'}}/>
            </div>
          ): (
            <div style={{fontSize: 16, color: '#8c8c8c',marginRight: 6}}>
              <i className={globalStyle.authTheme}>&#xe709;</i>
            </div>
          )}
          <div style={{textDecoration:is_realize === '1'? 'line-through': 'none', lineHeight: '24px'}}>
            {card_name}
            <span style={{marginLeft: 6, fontSize: 12,color: '#8c8c8c'}}>
              {type === '1'? `${timestampToTimeNormal(start_time,'/',true)}~${timestampToTimeNormal(due_time,'/',true)}` :('')}
            </span>
            </div>
          <div>
            {executor.user_id? (
              executor.avatar ? (
                <img src={executor.avatar}  style={{width: 24, height: 24}}/>
              ): (
                <div style={{height:24,width: 24,borderRadius:16,paddingTop: 4,backgroundColor:'#e8e8e8',textAlign: 'center',margin:'0 12px',}}>
                  <Icon type={'user'} style={{fontSize:14,color: '#8c8c8c', display: 'block', marginTop: 2}}/>
                </div>
              )
            ): ('')}

          </div>
          <div>
            <Icon type="ellipsis"  style={{fontSize:16}}/>
          </div>
        </div>
        {child_data.length? (
          <div className={CreateTaskStyle.item_2_bott}>
            <Collapse accordion bordered={false} style={{backgroundColor:'#f5f5f5'}} onChange={this.collapseChange.bind(this)}>
              <Panel header={<span style={{color: '#8c8c8c'}}>{`${this.state.collapseClose ? '显示' : '隐藏'}${child_data.length}个子任务`}</span>} key="1"  style={customPanelStyle}>
                <QueueAnim >
                {child_data.map((value, key) => {
                  return(
                    <ItemTwoChirldren ItemTwoChirldrenVaue={value} ItemTwoChirldrenIndex={key}{...this.props} key={key}></ItemTwoChirldren>
                  )
                })}
                </QueueAnim>
              </Panel>
            </Collapse>
          </div>
        ) : (
          ''
        )}


      </div>
    )
  }
}

const customPanelStyle = {
  background: '#f5f5f5',
  borderRadius: 4,
  fontSize:12,
  color: '#8c8c8c',
  border: 0,
  overflow: 'hidden',
};
