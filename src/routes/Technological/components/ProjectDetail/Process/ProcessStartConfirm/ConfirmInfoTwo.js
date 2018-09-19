import React from 'react'
import indexStyles from './index.less'
import { Card, Input, Icon, DatePicker, Dropdown, Button, Upload, message } from 'antd'
import MenuSearchMultiple  from './MenuSearchMultiple'
import globalStyles from '../../../../../../globalset/css/globalClassName.less'

const { RangePicker } = DatePicker;
const Dragger = Upload.Dragger;

//里程碑确认信息
export default class ConfirmInfoTwo extends React.Component {
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
    const element = document.getElementById('ConfirmInfoOut_1_bott')
    this.setState({
      isShowBottDetail: !this.state.isShowBottDetail
    },function () {
      this.funTransitionHeight(element, 500,  this.state.isShowBottDetail)
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
      element.style.height = type ? targetHeight : 0;
  };

  //文件名类型
  judgeFileType(fileName) {
    let themeCode = ''
    const type = fileName.substr(fileName.lastIndexOf(".")).toLowerCase()
    switch (type) {
      case '.xls':
        themeCode = '&#xe6d5;'
        break
      case '.png':
        themeCode = '&#xe6d4;'
        break
      case '.xlsx':
        themeCode = '&#xe6d3;'
        break
      case '.ppt':
        themeCode = '&#xe6d2;'
        break
      case '.gif':
        themeCode = '&#xe6d1;'
        break
      case '.jpeg':
        themeCode = '&#xe6d0;'
        break
      case '.pdf':
        themeCode = '&#xe6cf;'
        break
      case '.docx':
        themeCode = '&#xe6ce;'
        break
      case 'txt':
        themeCode = '&#xe6cd;'
        break
      case '.doc':
        themeCode = '&#xe6cc;'
        break
      case '.jpg':
        themeCode = '&#xe6cb;'
        break
      default:
        themeCode = ''
        break
    }
    return themeCode
  }

  render() {
    const that = this
    const { due_time, excutors = [], isShowBottDetail } = this.state
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
    const dragProps = {
      name: 'file',
      multiple: true,
      withCredentials:true,
      action: '//jsonplaceholder.typicode.com/posts/',
      beforeUpload() {

      },
      onChange(info) {
        const status = info.file.status;
        const element = document.getElementById('ConfirmInfoOut_1_bott')
        that.funTransitionHeight(element, 500,  true)
        if (status !== 'uploading') {
          console.log(info.file, info.fileList);
        }
        if (status === 'done') {
          message.success(`${info.file.name} file uploaded successfully.`);
        } else if (status === 'error') {
          message.error(`${info.file.name} file upload failed.`);
        }
      },
    }


    return (
      <div className={indexStyles.ConfirmInfoOut_1}>
        <Card style={{width: '100%',backgroundColor: '#f5f5f5'}}>
          <div className={indexStyles.ConfirmInfoOut_1_top}>
            <div className={indexStyles.ConfirmInfoOut_1_top_left}>
              <div className={indexStyles.ConfirmInfoOut_1_top_left_left}>1</div>
              <div className={indexStyles.ConfirmInfoOut_1_top_left_right}>
                <div>这是上传</div>
                <div>上传</div>
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
              <div className={indexStyles.fileList}>
                {['11.jpg','22.png'].map((value, key) => {
                  return(
                    <span style={{cursor: 'pointer', lineHeight: '33px', marginRight: 40}}><i className={globalStyles.authTheme} style={{fontStyle: 'normal',fontSize: 22, color: '#1890FF', marginRight: 8, cursor: 'pointer' }} dangerouslySetInnerHTML={{__html: this.judgeFileType(value)}}></i>{value}</span>
                  )
                })}
              </div>
              <div className={indexStyles.uploadAreaOut}>
                <Upload {...dragProps} style={{width: '748px'}}>
                  <div className={indexStyles.uploadArea}>
                    <div className={indexStyles.uploadArea_left}></div>
                    <div className={indexStyles.uploadArea_right}>
                      <div style={{color: '#1890FF', fontSize: 16}}>拖拽文件到此开始上传</div>
                      <div style={{color: '#8c8c8c', fontSize: 12}}>20MB以内，3个文件，文档，图像，视频格式</div>
                    </div>
                  </div>
                </Upload>
              </div>
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
