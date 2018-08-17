import React from 'react'
import indexStyle from './index.less'
import { Icon, Menu, Dropdown, Tooltip, Modal, Checkbox } from 'antd'

export default class Header extends React.Component {

  state = {
    ellipsisShow: false,//是否出现...菜单
    dropdownVisibleChangeValue: false,//是否出现...菜单辅助判断标志
  }
  setProjectInfoDisplay() {
    this.props.updateDatas({ projectInfoDisplay: !this.props.model.datas.projectInfoDisplay })
  }

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
    this.setState({
      ellipsisShow: false,
      dropdownVisibleChangeValue:false
    })
    if('4' === key) {
      this.confirm()
    }
  }
  //...菜单变化点击
  ellipsisClick(e) {
    e.stopPropagation();
  }
  setEllipsisShow() {
    this.setState({
      ellipsisShow: true
    })
  }
  setEllipsisHide() {
    this.setState({
      ellipsisShow: false
    })
  }
  onDropdownVisibleChange(visible){
    this.setState({
      dropdownVisibleChangeValue: visible,
    })
  }

  render() {
    const {datas: { projectInfoDisplay } } = this.props.model
    const { ellipsisShow, dropdownVisibleChangeValue} = this.state
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
      <div className={indexStyle.headout}>
         <div className={indexStyle.left}>
           <div className={indexStyle.left_top} onMouseLeave={this.setEllipsisHide.bind(this)} onMouseOver={this.setEllipsisShow.bind(this)}>
              <Icon type="left-square-o" className={indexStyle.projectNameIcon}/>
               <span className={indexStyle.projectName}>关于工作的关于工ss作的一切从未如此一目了然</span>
               <Icon className={indexStyle.star} type="star" style={{margin: '6px 0 0 8px',fontSize: 20,color: '#FAAD14'}} />
               <Dropdown overlay={menu} trigger={['click']} onVisibleChange={this.onDropdownVisibleChange.bind(this)} >
                 <Icon type="ellipsis"  style={{fontSize:24,margin: '4px 0 0 8px',display: (ellipsisShow || dropdownVisibleChangeValue) ? 'inline-block': 'none'}}/>
               </Dropdown>
           </div>
           <div className={indexStyle.displayProjectinfo} onClick={this.setProjectInfoDisplay.bind(this)}>
             {projectInfoDisplay ? (
               <span><Icon type="left" style={{marginRight:2}}/>收起项目信息</span>
             ):(
               <span>查看项目信息<Icon type="right" style={{marginLeft:2}}/></span>
             )}

           </div>
         </div>
        <div className={indexStyle.right}>
          <div className={indexStyle.right_top} >
            <span>招标</span>
            <span>流程</span>
            <span>任务</span>
            <span>文档</span>
          </div>
          <div className={indexStyle.right_bott}>
            <span>按分组名称排列 <Icon type="down"  style={{fontSize:14,color:'#bfbfbf'}}/></span>
            <Icon type="appstore-o"  style={{fontSize:14,marginTop:18,marginLeft:14}}/><Icon type="appstore-o" style={{fontSize:14,marginTop:18,marginLeft:16}}/><Icon type="appstore-o" style={{fontSize:14,marginTop:18,marginLeft:16}}/>
          </div>
        </div>
      </div>
    )
  }
}
{/*<div className={indexStyle.out}>*/}
  {/*<Dropdown overlay={menu}>*/}
    {/*<div className={indexStyle.left}>全部项目 <Icon type="down"  style={{fontSize:14,color:'#595959'}}/></div>*/}
  {/*</Dropdown>*/}
  {/*<div className={indexStyle.right}>*/}
    {/*<Dropdown overlay={menu_2}>*/}
      {/*<div>按参与关系排序 <Icon type="down"  style={{fontSize:14,color:'#595959'}}/></div>*/}
    {/*</Dropdown>*/}
    {/*<Icon type="appstore-o"  style={{fontSize:20,marginTop:14,marginLeft:14}}/><Icon type="appstore-o" style={{fontSize:20,marginTop:14,marginLeft:16}}/><Icon type="appstore-o" style={{fontSize:20,marginTop:14,marginLeft:16}}/>*/}
  {/*</div>*/}
{/*</div>*/}
