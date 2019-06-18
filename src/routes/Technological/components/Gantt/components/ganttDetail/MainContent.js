import React from 'react'
import indexStyles from './index.less'
import NameChangeInput from '../../../../../../components/NameChangeInput'
import { Dropdown, Icon, Progress, Avatar, DatePicker, Button } from 'antd'
import MeusearMutiple from '../../../Workbench/CardContent/Modal/TaskItemComponent/components/MeusearMutiple'
import ExcutorList from '../../../Workbench/CardContent/Modal/TaskItemComponent/components/ExcutorList'
import BraftEditor from 'braft-editor'
import Cookies from 'js-cookie'
import TaskItem from './components/TaskItem'
import globalStyle from '../../../../../../globalset/css/globalClassName.less'
import {timestampToTimeNormal, timeToTimestamp} from "../../../../../../utils/util";
import {REQUEST_DOMAIN_FILE} from "../../../../../../globalset/js/constant";

export default class MainContent extends React.Component {
  state = {
    excutors_out_left_width: 0,
    isInEditBraftEditor: false,
  }

  constructor(prop) {
    super(prop)
    this.excutors_out_left_ref = React.createRef()
  }

  componentDidMount() {}

  componentWillReceiveProps(nextProps) {

  }

  //标题
  titleChangeBlur(e) {
    this.setState({
      titleIsEdit: false
    })
  }
  setTitleIsEdit = (titleIsEdit) => {
    this.setState({
      titleIsEdit: titleIsEdit
    })
  }

  chirldrenTaskChargeChange(data) {
    const { users } = this.props
    const new_users = users.map(item => {
      item['user_id'] = item['id']
      return item
    })
    let newExecutors = []
    const { selectedKeys = [] } = data

    newExecutors.map((item, index) => {

    })

    for(let i = 0; i < selectedKeys.length; i++) {
      for(let j = 0; j < new_users.length; j++) {
        if(selectedKeys[i] === new_users[j]['user_id']) {
          newExecutors.push(new_users[j])
        }
      }
    }
    //用于判判断任务执行人菜单是否显示
    const that = this
    setTimeout(function () {
      const { excutorsOut_left = {}} = that.refs
      const excutors_out_left_width = excutorsOut_left.clientWidth
      that.setState({
        excutors_out_left_width
      })
    }, 300)

    //执行接口请求
    // this.props.addTaskExecutor({
    //   card_id,
    //   users: selectedKeys.join(',')
    // })

  }

  //截止时间
  endDatePickerChange(e, timeString) {
    const due_timeStamp = timeToTimestamp(timeString)
    this.setState({
      due_time: due_timeStamp
    })
  }
  disabledDueTime = (due_time) => {
    const now_time = new Date().getTime()
    const newStartTime = now_time.toString().length > 10 ? Number(now_time).valueOf() / 1000 : Number(now_time).valueOf()
    return Number(due_time.valueOf()) / 1000 < newStartTime;
  }

  //有关于富文本编辑---------------start
  editWrapClick = (e) => {
    e.stopPropagation();
  }
  goEditBrafit = () => {
    // e.stopPropagation();
    // if(e.target.nodeName.toUpperCase() === 'IMG') {
    //   const src = e.target.getAttribute('src')
    // }
    console.log('sssss', 1111)
    this.setState({
      isInEditBraftEditor: true
    })
  }
  quitBrafitEdit = (e) => {
    e.stopPropagation();
    const { description = '' } = this.props
    this.setState({
      isInEditBraftEditor: false,
      // brafitEditHtml: description,
    })

  }
  saveBrafitEdit = (e) => {
    e.stopPropagation();
    let { brafitEditHtml } = this.state
    if(typeof brafitEditHtml === 'object') {
      brafitEditHtml = brafitEditHtml.toHTML()
    }
    this.setState({
      isInEditBraftEditor: false,
    })
    this.setState({
      description: brafitEditHtml,
    })
    // const updateObj ={
    //   description: brafitEditHtml,
    // }
    // this.props.updateTask({updateObj})
  }
  isJSON = (str) => {
    if (typeof str === 'string') {
      try {
        var obj=JSON.parse(str);
        if(str.indexOf('{')>-1){
          return true;
        }else{
          return false;
        }

      } catch(e) {
        return false;
      }
    }
    return false;
  }
  myUploadFn = (param) => {
    const serverURL = `${REQUEST_DOMAIN_FILE}/upload`
    const xhr = new XMLHttpRequest()
    const fd = new FormData()

    const successFn = (response) => {
      // 假设服务端直接返回文件上传后的地址
      // 上传成功后调用param.success并传入上传后的文件地址
      if(xhr.status === 200 && this.isJSON(xhr.responseText)) {
        if(JSON.parse(xhr.responseText).code === '0') {
          param.success({
            url: JSON.parse(xhr.responseText).data ? JSON.parse(xhr.responseText).data.url : '',
            meta: {
              // id: 'xxx',
              // title: 'xxx',
              // alt: 'xxx',
              loop: false, // 指定音视频是否循环播放
              autoPlay: false, // 指定音视频是否自动播放
              controls: true, // 指定音视频是否显示控制栏
              // poster: 'http://xxx/xx.png', // 指定视频播放器的封面
            }
          })
        }else {
          errorFn()
        }
      }else {
        errorFn()
      }

    }

    const progressFn = (event) => {
      // 上传进度发生变化时调用param.progress
      param.progress(event.loaded / event.total * 100)
    }

    const errorFn = (response) => {
      // 上传发生错误时调用param.error
      param.error({
        msg: '图片上传失败!'
      })
    }

    xhr.upload.addEventListener("progress", progressFn, false)
    xhr.addEventListener("load", successFn, false)
    xhr.addEventListener("error", errorFn, false)
    xhr.addEventListener("abort", errorFn, false)

    fd.append('file', param.file)
    xhr.open('POST', serverURL, true)
    xhr.setRequestHeader('Authorization', Cookies.get('Authorization'))
    xhr.setRequestHeader('refreshToken', Cookies.get('refreshToken'))
    xhr.send(fd)
  }
  descriptionHTML(e) {
    if(e.target.nodeName.toUpperCase() === 'IMG') {
      const src = e.target.getAttribute('src')
      this.setState({
        previewFileType: 'img',
        previewFileSrc: src
      })
    }else if(e.target.nodeName.toUpperCase() === 'VIDEO') {
      const src = e.target.getAttribute('src')
      this.setState({
        previewFileType: 'video',
        previewFileSrc: src
      })
    }
  }
  //有关于富文本编辑---------------end

  render() {
    const { titleIsEdit,
      excutors_out_left_width = 0,
      due_time,
      isInEditBraftEditor,
      brafitEditHtml,
    } = this.state
    let {
      description
    } = this.state
    description = (!description || description == '<p></p>') ? '<p>添加备注</p>': description
    const {
      data = [],
      titile = '这是标题',
      users = [],
      executors = [],
    } = this.props

    const new_users = users.map(item => {
      item['user_id'] = item['id']
      return item
    })

    const editorState = BraftEditor.createEditorState(brafitEditHtml)

    const editorProps = {
      contentStyle: {minHeight: 100, height: 'auto'},
      height: 100,
      contentFormat: 'html',
      value: editorState,
      media: {uploadFn: this.myUploadFn},
      onChange: (e) => {
        // const { datas:{ drawContent = {} } } = this.props.model
        // drawContent['description'] = e
        // this.props.updateTaskDatas({drawContent})
        this.setState({
          brafitEditHtml: e
        })
      },
      fontSizes: [14],
      controls: [
        'text-color', 'bold', 'italic', 'underline', 'strike-through',
        'text-align', 'list_ul',
        'list_ol', 'blockquote', 'code', 'split', 'media'
      ]
    }

    return(
      <div className={indexStyles.miletone_out}>
        {/*标题*/}
        <div className={indexStyles.contain1}>
          {!titleIsEdit ? (
            <div className={`${indexStyles.contain1_title} ${indexStyles.pub_hover}`} onClick={this.setTitleIsEdit.bind(this, true)}>{titile}</div>
          ) : (
            <NameChangeInput
              onBlur={this.titleChangeBlur.bind(this)}
              setIsEdit={this.setTitleIsEdit.bind(this, false)}
              autoFocus={true}
              goldName={titile}
              maxLength={100}
              nodeName={'input'}
              size={'large'}
              style={{fontSize: 20, color: '#262626'}}
            />
          )}
        </div>
        <div className={indexStyles.contain2}>
          {/*进度*/}
          <div className={indexStyles.contain2_item}>
            <div className={indexStyles.contain2_item_left}>
              <span className={globalStyle.authTheme}>&#xe7b2;</span>
              <span>进度</span>
            </div>
            <div className={`${indexStyles.contain2_item_right} ${indexStyles.pub_hover}`} style={{lineHeight: '28px'}}>
              <Progress percent={30} strokeColor={'#FAAD14'}/>
            </div>
          </div>
          {/*负责人*/}
          <div className={indexStyles.contain2_item}>
            <div className={indexStyles.contain2_item_left}>
              <span className={globalStyle.authTheme}>&#xe7b2;</span>
              <span>负责人</span>
            </div>
            {!executors.length? (
              <Dropdown overlay={<MeusearMutiple listData={new_users} keyCode={'user_id'}searchName={'name'} currentSelect = {executors} chirldrenTaskChargeChange={this.chirldrenTaskChargeChange.bind(this)}/>}>
                <div className={`${indexStyles.contain2_item_right} ${indexStyles.pub_hover}`}>添加负责人</div>
              </Dropdown>
            ) : (
              <div className={`${indexStyles.contain2_item_right} ${indexStyles.pub_hover} ${indexStyles.excutorsOut}`}>
                <Dropdown overlay={<MeusearMutiple listData={new_users} keyCode={'user_id'}searchName={'name'} currentSelect = {executors} chirldrenTaskChargeChange={this.chirldrenTaskChargeChange.bind(this)}/>}>
                  <div className={indexStyles.excutorsOut_left} ref={this.excutors_out_left_ref}>
                    {executors.map((value, key) => {
                      const { avatar, name, user_name, user_id } = value
                      return (
                        <div className={indexStyles.avatar_item}>
                          <div className={indexStyles.avatar_item_avatar}>
                            <Avatar src={avatar} size={28}>{name || user_name}</Avatar>
                          </div>
                          <div className={indexStyles.avatar_item_name}>{name || user_name}</div>
                        </div>
                      )
                    })}
                  </div>
                </Dropdown>

                <Dropdown overlay={<ExcutorList listData={executors}/>}>
                  <div className={indexStyles.excutorsOut_right} style={{backgroundColor: (typeof excutors_out_left_width ==='number'&& excutors_out_left_width > 340) || (typeof excutors_out_left_width ==='number'&& excutors_out_left_width > 340) ?'#f5f5f5': ''}}>
                    <i className={globalStyle.authTheme} >&#xe66f;</i>
                  </div>
                </Dropdown>
              </div>
            )}

          </div>
          {/*截至时间*/}
          <div className={indexStyles.contain2_item}>
            <div className={indexStyles.contain2_item_left}>
              <span className={globalStyle.authTheme}>&#xe7b2;</span>
              <span>截至时间</span>
            </div>
            <div className={`${indexStyles.contain2_item_right} ${indexStyles.pub_hover}`}>
              <span style={{position: 'relative'}}>{due_time ? timestampToTimeNormal(due_time, '/', true) : '添加时间'}
                <DatePicker
                  disabledDate={this.disabledDueTime.bind(this)}
                  placeholder={'截止时间'}
                  format="YYYY/MM/DD HH:mm"
                  showTime={{format: 'HH:mm'}}
                  onChange={this.endDatePickerChange.bind(this)}
                  style={{opacity: 0, width: !due_time? 50 : 100, cursor: 'pointer', height: 20, background: '#000000', position: 'absolute', right: 0, zIndex: 1}} />
              </span>
            </div>

          </div>
          {/*添加备注*/}
          <div className={`${indexStyles.contain2_item} ${indexStyles.contain2_item_2}`}>
            <div className={indexStyles.contain2_item_left}>
              <span className={globalStyle.authTheme}>&#xe7b2;</span>
              <span>备注</span>
            </div>
            <div className={`${indexStyles.contain2_item_right}`} style={{height: 'auto'}} >
              {!isInEditBraftEditor ? (
                <div className={`${indexStyles.divContent_1} ${indexStyles.pub_hover}`} onClick={() => this.goEditBrafit()}>
                  <div className={indexStyles.contain_4} onClick={this.descriptionHTML.bind(this)} >
                    <div style={{cursor: 'pointer'}} dangerouslySetInnerHTML={{__html: typeof description === 'object'? description.toHTML() :description}}></div>
                  </div>
                </div>
              ) : (
                <div>
                  <div className={indexStyles.editorWraper} onClick={this.editWrapClick.bind(this)} style={{border: '1px solid rgba(0,0,0,.08)', borderRadius: 4}}>
                    <BraftEditor {...editorProps} style={{fontSize: 12}}/>
                  </div>
                  <div style={{marginTop: 20, textAlign: 'right'}}>
                    <Button size={'small'} style={{fontSize: 12, marginRight: 16}} type={'primary'} onClick={this.saveBrafitEdit.bind(this)}>保存</Button>
                    <Button size={'small'} style={{fontSize: 12}} onClick={this.quitBrafitEdit.bind(this)}>取消</Button>
                  </div>
                </div>
              ) }
            </div>
          </div>
          {/*进度*/}
          <div className={indexStyles.contain2_item} >
            <div className={indexStyles.contain2_item_left} style={{width: 200}}>
              <span className={globalStyle.authTheme}>&#xe7b2;</span>
              <span>关联任务 · 24/80</span>
            </div>
            <div className={`${indexStyles.contain2_item_right}`}></div>
          </div>
        </div>
        <div className={`${indexStyles.contain3}`}>
          <div className={indexStyles.contain3_inner}>
            <TaskItem />
          </div>
        </div>
      </div>
    )
  }
}
// const executors = [
//   {
//     id: "1131757491328258048",
//     full_name: "15289749459",
//     mobile: "15289749459",
//     wechat: "5oeS5b6X5bm96buY",
//     create_time: "1558666",
//     update_time: "1559006",
//     is_deleted: "0",
//     avatar: "https://newdi-test-public.oss-cn-beijing.aliyuncs.com/2019-05-24/1a2fe01214664937ad4a95fa4c75ade0.jpg",
//     avatar_icon: "2019-05-24/1a2fe01214664937ad4a95fa4c75ade0.jpg",
//     name: "15289749459",
//     user_id: "1131757491328258048",
//   }, {
//     id: '1121',
//     user_id: '111',
//     name: 's11s',
//     avatar: '',
//   },
// ]
// const users = executors
