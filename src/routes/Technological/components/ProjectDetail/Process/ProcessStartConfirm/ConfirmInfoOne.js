import React from 'react'
import indexStyles from './index.less'
import { Card, Input, Icon, DatePicker, Dropdown, Button } from 'antd'
import MenuSearchMultiple  from './MenuSearchMultiple'

const { RangePicker } = DatePicker;

//里程碑确认信息
export default class ConfirmInfoOne extends React.Component {
  state = {
    due_time: '',
    excutors: [1,2,3,4,5,6,7],
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
  render() {
    const { due_time, excutors = [] } = this.state
    const data = []
    const imgOrAvatar = (img) => {
      return  img ? (
        <div>
          <img src={img} style={{width: 18, height: 18,marginRight:8,borderRadius: 16, margin:'0 8px'}} />
        </div>
      ):(
        <div style={{lineHeight: '18px',height:18,width: 16,borderRadius:18,backgroundColor:'#e8e8e8',marginRight:8,textAlign: 'center',margin:'0 8px',marginTop: 2,}}>
          <Icon type={'user'} style={{fontSize:10,color: '#8c8c8c',}}/>
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
                <div>这是里程碑</div>
                <div>里程碑</div>
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
              <div><Icon type="down" theme="outlined" style={{color: '#595959'}}/></div>
            </div>
          </div>
          <div className={indexStyles.ConfirmInfoOut_1_bott}>
            <div className={indexStyles.ConfirmInfoOut_1_bott_left}></div>
            <div className={indexStyles.ConfirmInfoOut_1_bott_right}>
              <div className={indexStyles.ConfirmInfoOut_1_bott_right_dec}>这是节点步骤的描述内容，流程启动后不可编辑。借此顺便说明一下：步骤卡片默认会展开正在进行中的几点，可以手动收起可展开搜索节点进行内容查看。font-size:12px; line-height:20px;</div>
              <div className={indexStyles.ConfirmInfoOut_1_bott_right_operate}>
                <div>重新指派推进人</div>
                <Button type={'primary'}>完成</Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    )
  }
}
