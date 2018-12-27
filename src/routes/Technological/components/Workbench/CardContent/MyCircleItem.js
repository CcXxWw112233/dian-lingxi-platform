import React from 'react'
import indexstyles from '../index.less'
import { Icon, Avatar } from 'antd'
import globalStyles from '../../../../../globalset/css/globalClassName.less'
import { timestampToTimeNormal } from '../../../../../utils/util'
import Cookies from 'js-cookie'
import {model} from "../../../../../models/page";

function tomyfirend(e,id) {
  e.preventDefault();
  document.getElementById('imIFram').contentWindow.postMessage({type:'contact', to: id}, 'http://www.new-di.com/')
  console.log("to my firend.");
}
function tomygroup(e, id) {
  e.preventDefault();
  document.getElementById('imIFram').contentWindow.postMessage({type:'group', to: id}, 'http://www.new-di.com/im/')
  console.log("to my group");
}

export default class MyCircleItem extends React.Component {
   state = {
     isShowBottDetail: '1', //是否显示底部详情 1,2,3 1默认 2开 3关
     isShowBottDetail_2: '1',
     users: [],
   }
  setIsShowBottDetail(id) {
    const element = document.getElementById(id)
    const { isShowBottDetail } = this.state
    this.setState({
      isShowBottDetail: isShowBottDetail === '3'?'2':'3'
    },function () {
      this.funTransitionHeight(element, 500,  this.state.isShowBottDetail)
    })
  }
  setIsShowBottDetail_2(id) {
    const element = document.getElementById(id)
    const { isShowBottDetail_2 } = this.state
    this.setState({
      isShowBottDetail_2: isShowBottDetail_2 === '3'?'2':'3'
    },function () {
      this.funTransitionHeight(element, 500,  this.state.isShowBottDetail_2)
    })
  }
   funTransitionHeight = function(element, time, type) { // time, 数值，可缺省
    if (typeof window.getComputedStyle == "undefined") return;
    const height = window.getComputedStyle(element).height;
    element.style.transition = "none";    // 本行2015-05-20新增，mac Safari下，貌似auto也会触发transition, 故要none下~
    element.style.height = "auto";
    const targetHeight = window.getComputedStyle(element).height;
    element.style.height = height;
    element.offsetWidth;
    if (time) element.style.transition = "height "+ time +"ms";
    element.style.height = type==='2' ? targetHeight : 0;
  };
   setUsers({ datalist=[] }) {
     this.setState({
       users: datalist
     })
   }

   toChat({id, type}, e) {
     e.preventDefault();
     console.log(id, type)
     document.getElementById('imIFram').contentWindow.postMessage({type: type, to: id}, 'http://www.new-di.com/im/')
   }

  render() {
    const { itemValue = {}, itemKey,  model = {} } = this.props
    const { datas: { projectUserList = [], orgMembers = [], imData ={} }} = model
    const { isShowBottDetail, isShowBottDetail_2, users = [] } = this.state
    const { access_token, username } = imData
    return (
      <div className={indexstyles.myCircleItem}>
        <div className={indexstyles.hideScrolloutercontainer_1} >
         <div className={`${indexstyles.left} ${indexstyles.hideScrollinnercontainer_1}`}>
           {/*项目圈*/}
           <div className={indexstyles.circleGroup}>
             <div className={indexstyles.circleGroup_top} onClick={this.setIsShowBottDetail.bind(this, 'bott_1')}>
               <div>
                项目圈
               </div>
               <div className={indexstyles.circleGroup_top_caret}
                    className={`${indexstyles.circleGroup_top_caret} ${isShowBottDetail !=='1' ? (isShowBottDetail === '2' ?indexstyles.upDown_up: indexstyles.upDown_down) : ''}`}>
                 <Icon  type="caret-down" style={{fontSize: 16}} />
               </div>
             </div>
             <div id={'bott_1'} className={`${indexstyles.circleGroup_bott} ${isShowBottDetail !== '3'? indexstyles.ConfirmInfoOut_1_bottShow : indexstyles.ConfirmInfoOut_1_bottNormal}`} >
               {projectUserList.map((value, key) => {
                 const { users=[], board_name, board_id } = value
                 return (
                   <div className={indexstyles.left_item} onClick={this.setUsers.bind(this,{ datalist:users})}>
                     <div>{board_name}</div>
                     <div onClick={this.toChat.bind(this, {type: 'group', id: board_id})}>
                       <Icon type="folder-open" />
                     </div>
                   </div>
                 )
               })}
             </div>
           </div>
           {/*组织圈*/}
           <div className={indexstyles.circleGroup}>
             <div className={indexstyles.circleGroup_top} onClick={this.setIsShowBottDetail_2.bind(this, 'bott_2')}>
               <div>
                 组织圈
               </div>
               <div className={indexstyles.circleGroup_top_caret}
                    className={`${indexstyles.circleGroup_top_caret} ${isShowBottDetail_2 !=='1' ? (isShowBottDetail_2 === '2' ?indexstyles.upDown_up: indexstyles.upDown_down) : ''}`}>
                 <Icon  type="caret-down" style={{fontSize: 16}} />
               </div>
             </div>
             <div id={'bott_2'} className={`${indexstyles.circleGroup_bott} ${isShowBottDetail_2 !== '3'? indexstyles.ConfirmInfoOut_1_bottShow : indexstyles.ConfirmInfoOut_1_bottNormal}`} >
               {orgMembers.map((value, key) => {
                 const { name, org_id, members } = value
                 return (
                   <div className={indexstyles.left_item} key={key} onClick={this.setUsers.bind(this,{ datalist:members})}>
                     <div>{name}</div>
                     <div onClick={this.toChat.bind(this, {type: 'group', id: org_id})}>
                       <Icon type="folder-open" />
                     </div>
                   </div>
                 )
               })}
             </div>
           </div>
        </div>
        </div>
        <div className={indexstyles.middle}></div>
        <div className={indexstyles.hideScrolloutercontainer_2}>
          <div className={`${indexstyles.right} ${indexstyles.hideScrollinnercontainer_2}`}>
            {users.map((value, key) => {
              const { name, full_name, avatar, id, member_id, mobile, email } = value
              return (
                <div className={indexstyles.right_item}>
                  <div className={indexstyles.avatar}>
                    <Avatar icon="user" src={avatar}/>
                  </div>
                  <div className={indexstyles.name}>
                    {name || full_name || mobile || email}
                  </div>
                  <div className={indexstyles.commit} onClick={this.toChat.bind(this, {type: 'contact', id: id})}>
                    <Icon type="folder-open" />
                  </div>
                </div>
              )
            })}

          </div>
        </div>

      </div>
    )
  }
}
