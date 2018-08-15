import React from 'react'
import indexStyle from './index.less'
import globalStyles from '../../../../globalset/css/globalClassName.less'
import { Icon, Menu, Dropdown, Tooltip, Collapse, Card, Modal,Checkbox } from 'antd'

export default class CollectionProject extends React.Component{
  state = {
    starType: 'star-o',
    starOpacity: 0.6,
    isSoundsEvrybody: false
  }

  //星星样式变化start-------------------------
  starMouseOver() {
    if(this.state.starType === 'star'){
      return false
    }
    this.setState({
      starType: 'star-o',
      starOpacity: 1
    })
  }
  starMouseLeave() {
    if(this.state.starType === 'star'){
      return false
    }
    this.setState({
      starType: 'star-o',
      starOpacity: 0.6
    })
  }
  starClick() {
    this.setState({
      starType: this.state.starType === 'star' ? 'star-o' : 'star',
      starOpacity: 1
    })
  }
  //星星样式变化end-------------------------

  //出现confirm-------------start
  setIsSoundsEvrybody(e){
    this.setState({
      isSoundsEvrybody: e.target.checked
    })
  }
  confirm() {
    Modal.confirm({
      title: '确认要退出该项目吗？',
      content: <div style={{color:'rgba(0,0,0, .8)',fontSize: 14}}>
                  <span >退出后将无法获取该项目的相关动态</span>
                  <div style={{marginTop:20,}}>
                    <Checkbox style={{color:'rgba(0,0,0, .8)',fontSize: 14, }} onChange={this.setIsSoundsEvrybody.bind(this)}>通知项目所有参与人</Checkbox>
                  </div>
               </div>,
      okText: '确认',
      cancelText: '取消',
      onOk()  {
      }
    });
  }
  //出现confirm-------------end

  //菜单按钮点击
  handleMenuClick(e) {
    const { key } = e
    console.log(e)
    if('4' === key) {
      this.confirm()
    }
  }
  render() {
    const taskMan = [1,2,3,4,5,6,7,8]
    const { starType,starOpacity } = this.state
    const menu = (
      <Menu onClick={this.handleMenuClick.bind(this)}>
        <Menu.Item key={'1'}  style={{textAlign: 'center',padding:0,margin: 0}}>
          <div className={indexStyle.elseProjectMemu}>
            邀请成员加入
          </div>
        </Menu.Item>
        <Menu.Item key={'2'} style={{textAlign: 'center',padding:0,margin: 0}}>
          <div className={indexStyle.elseProjectMemu}>
            项目归档
          </div>
        </Menu.Item>
        <Menu.Item key={'3'}  style={{textAlign: 'center',padding:0,margin: 0}}>
          <div className={indexStyle.elseProjectMemu}>
            删除项目
          </div>
        </Menu.Item>
        <Menu.Item key={'4'}  style={{textAlign: 'center',padding:0,margin: 0}}>
          <div className={indexStyle.elseProjectDangerMenu}>
            退出项目
          </div>
        </Menu.Item>
      </Menu>
    );
    return (
      <Card style={{position: 'relative',height: 'auto'}}>
        <div className={indexStyle.listOutmask}></div>
        <div className={indexStyle.listOut} onClick={this.props.routingJump.bind(null,'/technological/projectDetail')}>
          <div className={indexStyle.left}>
            <div className = {indexStyle.top}>
              <span>[项目实例]关于切从未如此一目了然</span>
              <span className={indexStyle.nameHoverMenu} >
                <Icon className={indexStyle.star}
                      onMouseOver={this.starMouseOver.bind(this)}
                      onMouseLeave={this.starMouseLeave.bind(this)}
                      onClick={this.starClick.bind(this)}
                      type={starType} style={{margin: '0 0 0 8px',opacity: starOpacity,color: '#FAAD14 '}} />
                  <Dropdown overlay={menu} trigger={['click']} >
                    <Icon type="ellipsis"  style={{fontSize:18,margin: '0 0 0 8px'}}/>
                  </Dropdown>
              </span>
            </div>
            <div className ={indexStyle.bottom}>
              {taskMan.map((value, key) => {
                if(key < 7) {
                  return (<img src="" key={key} className={indexStyle.taskManImag}></img>)
                }
              })}
              {taskMan.length > 7? (
                <div style={{display: 'flex',fontSize: 12}}>
                  <div className={indexStyle.manwrap} ><Icon type="ellipsis" style={{fontSize:18}}/></div>{taskMan.length}位任务执行人
                </div>
              ) : ('')}
            </div>
          </div>
          <div className={indexStyle.right}>
            <div className={indexStyle.rightItem}>
              <div>27</div>
              <div>剩余任务</div>
            </div>
            <div className={indexStyle.rightItem}>
              <div style={{color: '#8c8c8c'}}>27</div>
              <div>已完成</div>
            </div>
            <div className={indexStyle.rightItem}>
              <div >27</div>
              <div>距离下一节点</div>
            </div>
          </div>
        </div>
      </Card>
    )
  }
}
