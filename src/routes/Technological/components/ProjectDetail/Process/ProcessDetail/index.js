import React from 'react'
import indexStyles from './index.less'
import { Icon } from 'antd'
import DetailConfirmInfoTwo from './DetailConfirmInfoTwo'

import sssimg from '../../../../../../assets/yay.jpg'

const bodyHeight = document.querySelector('body').clientHeight
export default class ProcessDetail extends React.Component {
  state = {}
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
  initCanvas() {
    const defaultProps = {
      canvaswidth: 210,// 画布宽度
      canvasheight: 210,// 画布高度
      x0: 105,
      y0: 105,
      r: 96,
      lineWidth: 16,
      strokeStyle: '#ffffff',
      LinearGradientColor1: '#3EECED',
      LinearGradientColor2: '#499BE6'
    }
    const {
      x0,//原点坐标
      y0,
      r,// 半径
      lineWidth, // 画笔宽度
      strokeStyle, //画笔颜色
      LinearGradientColor1, //起始渐变颜色
      LinearGradientColor2, //结束渐变颜色
      Percentage,// 进度百分比
    } = defaultProps
    let ele = document.getElementById("time_graph_canvas")
    let circle = ele.getContext("2d");

    //创建多个圆弧
    const length = 6
    for (let i = 0; i < length; i++) {
      circle.beginPath();//开始一个新的路径
      circle.save()
      circle.lineWidth = lineWidth;
      circle.strokeStyle = i % 2 === 0 ? 'green': 'red';
      circle.arc(x0, y0, r,0.6* Math.PI + i*1.83/length* Math.PI ,  0.6* Math.PI + i*1.83/length* Math.PI + 1.83/length* Math.PI - 0.03*Math.PI, false);///用于绘制圆弧context.arc(x坐标，y坐标，半径，起始角度，终止角度，顺时针/逆时针)
      circle.stroke();//对当前路径进行描边
      circle.restore()
      circle.closePath()
    }
    circle.beginPath();//开始一个新的路径
    circle.save()
    circle.font = '14px Arial'
    circle.fillStyle='#8c8c8c'
    circle.textAlign = 'center'
    circle.fillText(`逾期1天`,105,90);
    circle.restore()
    circle.closePath()

    circle.beginPath();//开始一个新的路径
    circle.save()
    circle.font = '20px Arial'
    circle.fillStyle='#595959'
    circle.textAlign = 'center'
    circle.fillText(`2/4`,105,114);
    circle.restore()
    circle.closePath()

    const img = document.getElementById('node_img')
    circle.drawImage(img,20,20);
  }






  render() {
    const data = [1, 2, 3, 4,7,8,9,10]

    return (
      <div className={indexStyles.processDetailOut_out} style={{minHeight: bodyHeight}}>
        <div className={indexStyles.processDetailOut}>
        <div className={indexStyles.topTitle}>
          <div className={indexStyles.topTitle_left}>
            <div></div>
            <div>项目施工方招募确认</div>
          </div>
          <div className={indexStyles.topTitle_right}>
           <Icon type={'ellipsis'} style={{fontSize: 14, color: '#8c8c8c'}}/>
          </div>
        </div>

        <div className={indexStyles.userJoin}>
          {data.map((value, key) => {
            const { avatar, email, full_name, mobile, user_id, user_name } = value
            if(key < 7) {
              return (
                avatar? (
                  <img src={avatar} key={key} className={indexStyles.taskManImag}></img>
                ):(
                  <div className={indexStyles.taskManImag} >
                    <Icon type={'user'} style={{color: '#8c8c8c'}}/>
                  </div>
                )
              )
            }
          })}
          {data.length > 7? (
            <div style={{display: 'flex',fontSize: 12}}>
              <div className={indexStyles.manwrap} ><Icon type="ellipsis" style={{fontSize:18, marginTop: 2}}/></div>{data.length}位任务执行人
            </div>
          ) : ('')}
        </div>

        <div className={indexStyles.description}>
          这是一段示例简介：项目负责人一定是公司执行合伙人，如项目来源于公司员工需要与公司执行合伙人共同负责项目发起，项目负责人一定是公司执行合伙人方能进入公司的业务流程。项目来源已合伙人身份进入公司业务流程，执行合伙人可以指定公司业务人进行发起初审项目申请，申请表发至公司每位执行合伙人每周例会或者其他会议上进行投票表决是否初步立项。
        </div>

        <div className={indexStyles.bottContainer}>
          <div className={indexStyles.bottContainer_left}>
            <div className={indexStyles.circle} style={{position: 'relative'}}>
              <div style={{ width: 210, height: 210}}>
                <canvas id="time_graph_canvas" width={210} height={210}></canvas>
              </div>
              <img id="node_img" src={sssimg} style={{position: 'absolute',width: 20, height: 20,bottom: 0,left:95}}/>
            </div>
          </div>
          <div className={indexStyles.bottContainer_right}>
            <div className={indexStyles.news}>
              <div className={indexStyles.newsTitle}>最新动态</div>
              <div className={indexStyles.newsList}>
                {[1,2,2,3].map((value, key) => {
                  return(<div className={indexStyles.newsItem}>
                    <div className={indexStyles.newsItem_left}>
                      <div className={indexStyles.newsItem_left_l}></div>
                      <div className={indexStyles.newsItem_left_r}>呵呵呵呵呵呵呵呵呵呵呵呵呵呵呵呵呵呵呵呵呵呵呵呵呵呵呵呵呵呵呵呵呵呵呵呵呵呵呵呵呵呵呵呵呵呵呵呵呵呵呵呵呵呵呵呵呵呵呵呵呵呵呵呵呵呵呵呵呵呵呵呵</div>
                    </div>
                    <div className={indexStyles.newsItem_right}>2018-8-8 24:00</div>
                  </div>)
                })}
                <div className={indexStyles.seeAllList}>
                  <div></div>
                  <div>查看全部</div>
                  <div></div>
                </div>
              </div>
            </div>
            <div className={indexStyles.processPoint}>
              <div className={indexStyles.processPointTitle}>
                 步骤详情
              </div>
              <div className={indexStyles.processPointItem}>
                <DetailConfirmInfoTwo />
              </div>
              <div className={indexStyles.processPointItem}>
                <DetailConfirmInfoTwo />
              </div>
            </div>
          </div>
        </div>


      </div>
      </div>
    )
  }
}
