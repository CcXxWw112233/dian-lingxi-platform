import React from 'react'
import indexStyles from './index.less'
import { Card, Input, Icon, DatePicker, Dropdown, Button } from 'antd'
import MenuSearchMultiple  from './MenuSearchMultiple'

const { RangePicker } = DatePicker;

//里程碑确认信息
export default class ConfirmInfoFive extends React.Component {
  state = {
    due_time: '',
    excutors: [1,2,3,4,5,6,7],
    isShowBottDetail: false, //是否显示底部详情
  }
  datePickerChange(date, dateString) {
    this.setState({
      due_time:dateString
    })
  }
  setExcutors(data) {
    const { excutors } = this.state
    this.setState({
      excutors: data
    })
  }
  setIsShowBottDetail() {
    this.setState({
      isShowBottDetail: !this.state.isShowBottDetail
    },function () {
      this.funTransitionHeight(element, 500,  this.state.isShowBottDetail)
    })
    const element = document.getElementById('ConfirmInfoOut_1_bott')
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
    element.style.height = type ? targetHeight : 0;
  };

  render() {
    const { due_time, excutors = [], isShowBottDetail } = this.state
    const data = []
    const imgOrAvatar = (img) => {
      return  img ? (
        <div>
          <img src={img} style={{width: 18, height: 18,marginRight:8,borderRadius: 16, margin:'0 8px'}} />
        </div>
      ):(
        <div style={{lineHeight: '18px',height:18,width: 18,borderRadius:18,backgroundColor:'#e8e8e8',marginRight:8,textAlign: 'center',margin:'0 8px',marginTop: 2,}}>
          <Icon type={'user'} style={{fontSize:10,color: '#8c8c8c',}}/>
        </div>
      )
    }

    const imgOrAvatar2 = (img) => {
      return  img ? (
        <div style={{display: 'flex',alignItems: 'center'}}>
          <div style={{width: 26, height: 26,position: 'relative',marginRight:10}}>
            <img src={img} style={{width: 26, height: 26,borderRadius: 22, }} />
            <div style={{position: 'absolute',lineHeight:'10px',height:12,color: '#ffffff',fontSize:10,width:12,bottom:0,right:0,backgroundColor: 'green',borderRadius: 8,textAlign:'center'}}>√</div>
          </div>
          <div>
            <Icon type="swap-right" theme="outlined" style={{fontSize:12,marginRight:10,color: '#8c8c8c'}} />
          </div>
        </div>
      ):(
        <div style={{display: 'flex',alignItems: 'center'}}>
          <div style={{lineHeight: '26px',height:26,width: 26,borderRadius:22,backgroundColor:'#e8e8e8',marginRight:10,textAlign: 'center',marginTop: 2,position: 'relative'}}>
            <Icon type={'user'} style={{fontSize:10,color: '#8c8c8c',}}/>
            <div style={{position: 'absolute',lineHeight:'10px',height:12,color: '#ffffff',fontSize:10,width:12,bottom:0,right:0,backgroundColor: 'green',borderRadius: 8,textAlign:'center'}}>√</div>
          </div>
          <div>
            <Icon type="swap-right" theme="outlined" style={{fontSize:12,marginRight:10,color: '#8c8c8c'}} />
          </div>
        </div>
      )
    }

    return (
      <div className={indexStyles.ConfirmInfoOut_1}>
        <Card style={{width: '100%',backgroundColor: '#f5f5f5'}}>
          <div className={indexStyles.ConfirmInfoOut_1_top}>
            <div className={indexStyles.ConfirmInfoOut_1_top_left}>
              <div className={indexStyles.ConfirmInfoOut_1_top_left_left}>1</div>
              <div className={indexStyles.ConfirmInfoOut_1_top_left_right}>
                <div>这是审批</div>
                <div>审批</div>
              </div>
            </div>
            <div className={indexStyles.ConfirmInfoOut_1_top_right}>
              <div>
                <Dropdown overlay={<MenuSearchMultiple excutors={excutors} execusorList={data} setExcutors={this.setExcutors.bind(this)} />}>
                  {excutors.length? (
                    <div style={{display: 'flex'}}>
                      {excutors.map((value, key)=>{
                        if (key < 6)
                          return(imgOrAvatar())
                      })}
                      {excutors.length >6?(<span style={{color: '#595959'}}>{`等${excutors.length}人`}</span>): ('') }
                    </div>
                  ) : (<span>设置负责人</span>)}
                </Dropdown>

              </div>
              <div style={{position: 'relative', color: due_time? '#595959': '#1890FF' }}>
                {due_time || '设置截止时间'}
                <DatePicker  onChange={this.datePickerChange.bind(this)}
                             placeholder={'选择截止时间'}
                             showTime
                             format="YYYY-MM-DD HH:mm"
                             style={{opacity: 0,height: 16, width: 70,background: '#000000',position: 'absolute',right: 0,zIndex:2,cursor:'pointer'}} />
              </div>
              <div className={isShowBottDetail ? indexStyles.upDown_up: indexStyles.upDown_down}><Icon  onClick={this.setIsShowBottDetail.bind(this)} type="down" theme="outlined" style={{color: '#595959'}}/></div>
            </div>
          </div>
          <div className={isShowBottDetail? indexStyles.ConfirmInfoOut_1_bottShow : indexStyles.ConfirmInfoOut_1_bottNormal} id={'ConfirmInfoOut_1_bott'} >
            <div className={indexStyles.ConfirmInfoOut_1_bott_left}></div>
            <div className={indexStyles.ConfirmInfoOut_1_bott_right} >
              <div className={indexStyles.ConfirmInfoOut_1_bott_right_dec}>这是节点步骤的描述内容，流程启动后不可编辑。借此顺便说明一下：步骤卡片默认会展开正在进行中的几点，可以手动收起可展开搜索节点进行内容查看。font-size:12px; line-height:20px;</div>

              <div className={indexStyles.copy}>
                <div className={indexStyles.title}>
                  审批人:汇签 > 50%
                </div>
                <div className={indexStyles.imglist}>
                  {[1,2,3].map((value, key) => {
                    return(imgOrAvatar2('ss'))
                  })}
                </div>
              </div>

              <div className={indexStyles.ConfirmInfoOut_1_bott_right_operate}>
                <div>转办该审批</div>
                <Button style={{marginRight: 14}}>拒绝</Button>
                <Button >通过</Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    )
  }
}
