import React from 'react'
// import indexStyles from '../../../../ProjectDetail/Process/ProcessDetail/index.less'
import { Icon  } from 'antd'
import DetailConfirmInfoTwo from '../../../../ProjectDetail/Process/ProcessDetail/DetailConfirmInfoTwo'
import DetailConfirmInfoOne from '../../../../ProjectDetail/Process/ProcessDetail/DetailConfirmInfoOne'
import DetailConfirmInfoThree from '../../../../ProjectDetail/Process/ProcessDetail/DetailConfirmInfoThree'
import DetailConfirmInfoFour from '../../../../ProjectDetail/Process/ProcessDetail/DetailConfirmInfoFour'
import DetailConfirmInfoFive from '../../../../ProjectDetail/Process/ProcessDetail/DetailConfirmInfoFive'
import user from '../../../../../../../assets/workbench/person_group@2x.png'
import sssimg from '../../../../../../../assets/yay.jpg'
import { timestampToHM } from '../../../../../../../utils/util'
import { currentNounPlanFilterName } from '../../../../../../../utils/businessFunction'
import { FLOWS } from '../../../../../../../globalset/js/constant'

const bodyHeight = document.querySelector('body').clientHeight
export default class ProccessContent extends React.Component {
  state = {
    isShowAll: false, //是否查看全部
 }
 constructor(props) {
   super(props)
   this.initCanvas = this.initCanvas.bind(this)
 }
 componentDidMount() {
   this.initCanvas()
 }
 componentDidUpdate() {
   this.initCanvas()
 }

 setIsShowAll() {
   this.setState({
     isShowAll: !this.state.isShowAll
   })
 }

 initCanvas() {
   const { datas: { processInfo = {}, processEditDatas=[] }} = this.props.model
   const { curr_node_sort } = processInfo
   const defaultProps = {
     canvaswidth: 138, // 画布宽度
     canvasheight: 138, // 画布高度
     x0: 102,
     y0: 103,
     r: 69,
     lineWidth: 14,
     strokeStyle: '#ffffff',
     LinearGradientColor1: '#3EECED',
     LinearGradientColor2: '#499BE6'
   }
   const {
     x0, //原点坐标
     y0,
     r, // 半径
     lineWidth, // 画笔宽度
     strokeStyle, //画笔颜色
     LinearGradientColor1, //起始渐变颜色
     LinearGradientColor2, //结束渐变颜色
     Percentage, // 进度百分比
   } = defaultProps
   let ele = document.getElementById("time_graph_canvas")
   let circle = ele.getContext("2d");
   circle.clearRect(0, 0, 138, 138);//清空
   //创建多个圆弧
   const length = processEditDatas.length
   for (let i = 0; i < length; i++) {
     circle.beginPath();//开始一个新的路径
     circle.save()
     circle.lineWidth = lineWidth;
     let color = 'rgba(83,196,26,1)'
     if( Number(curr_node_sort) === Number(processEditDatas[i].sort)){
       color = 'rgba(24,144,255,1)'
     }else if(Number(processEditDatas[i].sort) < Number(curr_node_sort)){
       color = 'rgba(83,196,26,1)'
     }else if(Number(processEditDatas[i].sort) > Number(curr_node_sort)){
       color = '#f2f2f2'
     }
     circle.strokeStyle = color; //curr_node_sort
     circle.arc(x0, y0, r, 0.6* Math.PI + i*1.83/length* Math.PI, 0.6* Math.PI + i*1.83/length* Math.PI + 1.83/length* Math.PI - 0.03*Math.PI, false);///用于绘制圆弧context.arc(x坐标，y坐标，半径，起始角度，终止角度，顺时针/逆时针)
     circle.stroke();//对当前路径进行描边
     circle.restore()
     circle.closePath()
   }
 }

 render() {
   console.log('🐶🐶🐶🐶🐶', this.props.model.datas)
   const { isShowAll } = this.state
   const { datas: { processInfo = {}, processEditDatas=[], processDynamics = [] }} = this.props.model
   const { name, description, status } = processInfo //status 1 正在进行 2,暂停 3完成
   console.log('ssss')
   const data  = this.props.model.datas &&
   this.props.model.datas.projectDetailInfoData &&
   this.props.model.datas.projectDetailInfoData.data?this.props.model.datas.projectDetailInfoData.data:[]

   const fillAvatar = (data) => {
      let num = data.length
      let res = data.reduce((r, c, i) => {
        return [
          ...r,
          c.avatar?<img key={i} title={c.name} style={{width: '18px', height: '18px', borderRadius: '9px', marginLeft: '5px'}}  src={c.avatar}/>:<img src={user} title={c.name}  key={`div${i}`} style={{width: '18px', height: '18px', borderRadius: '9px', backgroundColor: 'gray', marginLeft: '5px'}} />
        ]
      }, [])
      let container = (
        <div style={{fontSize:'12px',
        fontFamily:'PingFangSC-Regular',
        fontWeight:'400',
        color:'rgba(89,89,89,1)'}}> {res} 「{num}」位流程参与人</div>
      )

      return container
   }

   const filterForm = (value, key) => {
     const { node_type } = value
     let container = (<div></div>)
     switch (node_type) {
       case '1':
         container = (<DetailConfirmInfoOne {...this.props} itemKey={key} itemValue={value} />)
         break;
       case '2':
         container = (<DetailConfirmInfoTwo {...this.props} itemKey={key} itemValue={value} />)
         break;
       case '3':
         container = (<DetailConfirmInfoThree {...this.props} itemKey={key} itemValue={value} />)
         break;
       case '4':
         container = (<DetailConfirmInfoFour {...this.props} itemKey={key} itemValue={value} />)
         break;
       case '5':
         container = (<DetailConfirmInfoFive {...this.props} itemKey={key} itemValue={value} />)
         break;
       default:
         container = (<div></div>)
         break
     }
     return container
   }

   return (
    <div>
      <canvas style={{float: 'left'}} id="time_graph_canvas" width={210} height={210}></canvas>
      <img id="node_img" src={sssimg} style={{position: 'absolute', width: 20, height: 20, top: 236, left: 120}}/>
      <div style={{height: '210px', padding: '32px 34px 32px 0', display: 'flex', flexDirection: 'column', justifyContent: 'space-around'}}>
        <div style={{color: '#262626', fontSize: '20px'}}>{name}</div>
        {fillAvatar(data)}
        <div style={{fontSize:'12px',
        fontFamily: 'PingFangSC-Regular',
        fontWeight:'400',
        color:'rgba(89,89,89,1)'}}>这是一段示例简介：项目负责人一定是公司执行合伙人，如项目来源于公司员工需要与公司执行合伙人共同负责项目发起，项目负责人一定是公司执行合伙人方能进入公司的业务流程。项目来源已合伙人身份进入公司业务流程，执行合伙人可以指定公司业务人进行发起初审项目申请，申请表发至公司每位执行合伙人每周例会或者其他会议上进行投票表决是否初步立项。</div>
      </div>
      <div style={{padding: '36px 34px 0 36px'}}>
        {processEditDatas.map((value, key) => {
          return (
            <div key={key}>
              {filterForm(value, key)}
            </div>
          )
        })}
      </div>
    </div>
   )
 }
}
