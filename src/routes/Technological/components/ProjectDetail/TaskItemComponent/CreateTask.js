import React from 'react'
import CreateTaskStyle from './CreateTask.less'
import TaskItem from './TaskItem'
import CreateItem from './CreateItem'
import DrawerContent from './DrawerContent'
import { Drawer } from 'antd'

const documentWidth = document.querySelector('body').offsetWidth

export default class CreateTask extends React.Component {

  state = {
    // drawerVisible: false,
  }
  constructor(){
    super();
    this.state = {
      /*定义两个值用来存放当前元素的left和top值*/
      needX:0,
      needY:0
    }
    /*定义两个值用来存放鼠标按下的地方距离元素上侧和左侧边界的值*/
    this.disX = 0;
    this.disY = 0;
  }
  /*定义鼠标下落事件*/
  fnDown(e){
    /*事件兼容*/
    let event = e || window.event;
    /*事件源对象兼容*/
    let target = this.refs.outerMost//event.target || event.srcElement;
    /*获取鼠标按下的地方距离元素左侧和上侧的距离*/
    this.disX = event.clientX - target.offsetLeft;
    this.disY = event.clientY - target.offsetTop;
    /*定义鼠标移动事件*/
    document.onmousemove = this.fnMove.bind(this);
    /*定义鼠标抬起事件*/
    document.onmouseup = this.fnUp.bind(this);
  }
  /*定义鼠标移动事件*/
  fnMove(e){
    /*事件兼容*/
    let event = e|| window.event ;
    /*事件源对象兼容*/
    let target = event.target || event.srcElement;

    //在查看任务时不可挪动
    const { datas:{ drawerVisible  } } = this.props.model
    if(drawerVisible) {
      return false
    }


    //可以改变position位置的判断
    if(!this.props.model.datas.taskGroupList) {
      return false
    }
    if(this.state.needX < 0 && (event.clientX - this.disX) < -(this.props.model.datas.taskGroupList.length * 314)){
       return false
    }
    if(this.state.needX > documentWidth / 2 && (event.clientX - this.disX) > documentWidth / 2){
      return false
    }
    this.setState({
      needX:event.clientX - this.disX,
      needY:event.clientY - this.disY
    });
  }
  fnUp(){
    document.onmousemove = null;
    document.onmuseup = null;
  }

  // 右方抽屉弹窗---start
  setDrawerVisibleOpen(data) {
    // this.setState({
    //   drawerVisible: true,
    // })
    this.props.updateDatas({
      drawerVisible: true,
    })
    const { drawContent:{ card_id }} = data
    this.props.getCardCommentList(card_id)
    this.props.updateDatas(data)
  }
  setDrawerVisibleClose() {
    // this.setState({
    //   drawerVisible: false,
    // })
    this.props.updateDatas({
      drawerVisible: false,
    })
  }
  //右方抽屉弹窗---end
  //
  chirldrEnstopPropagation(e) {
    e.stopPropagation();
  }
  render() {
    const { datas:{ taskGroupList = [], drawerVisible = false }, drawContent  } = this.props.model
    return (
      <div className={CreateTaskStyle.outerMost}
           style={{
             left:this.state.needX,
            }}
           onMouseDown={this.fnDown.bind(this)}
           ref={'outerMost'}
      >
        {taskGroupList.map((value, key) => {
            return (
              <TaskItem key={key} taskItemValue={value}
                        itemKey={key}
                        taskGroupListIndex={key}
                        {...this.props}
                        setDrawerVisibleOpen={this.setDrawerVisibleOpen.bind(this)} ></TaskItem>
            )
          })}
          <CreateItem  {...this.props}  ></CreateItem>
        <Drawer
          placement="right"
          closable={false}
          onClose={this.setDrawerVisibleClose.bind(this)}
          visible={drawerVisible} //this.state.drawerVisible
          width={520}
          destroyOnClose
          zIndex={1}
          maskStyle={{top: 64}}
          style={{marginTop: 64,}}
        >
          <DrawerContent
            {...this.props}
            setDrawerVisibleClose={this.setDrawerVisibleClose.bind(this)}
          />
        </Drawer>
      </div>
    )
  }
}
