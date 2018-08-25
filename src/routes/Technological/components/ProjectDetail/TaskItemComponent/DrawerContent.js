import React from 'react'
import DrawerContentStyles from './DrawerContent.less'
import { Icon, Tag, Input  } from 'antd'
import BraftEditor from 'braft-editor'
import 'braft-editor/dist/braft.css'
import DCAddChirlrenTask from './DCAddChirlrenTask'

const initEditContent = '<p style="font-size: 14px">这是第一次</p>'

let that
export default class DrawContent extends React.Component {
  state = {
    isCheck: true,
    editContent: initEditContent,
    isInEdit: false,
    tagArray: [122,111,555,888],
    isInAddTag: false
  }

  //有关于富文本编辑---------------start
  editWrapClick(e) {
    e.stopPropagation();
  }
  goEdit(e) {
    e.stopPropagation();
    this.setState({
      isInEdit: true
    })
  }
  drawerContentOutClick(e) {
    this.setState({
      isInEdit: false
    })
  }
  //有关于富文本编辑---------------end

  //标签-------------start
  randomColorArray() {
    const colorArr = ['magenta','red','volcano','orange','gold','lime','green','cyan','blue','geekblue','purple']
    const n =  Math.floor(Math.random() * colorArr.length + 1)-1;
    return colorArr[n]
  }
  tagClose(e) {
  }
  addTag() {
    this.setState({
      isInAddTag: true
    })
  }
  tagAddComplete(e) {
    this.setState({
      isInAddTag: false
    })
  }
  //标签-------------end

  render() {
    that = this
    const { isCheck, editContent, isInEdit, tagArray, isInAddTag } = this.state
    const editorProps = {
      height: 0,
      contentFormat: 'html',
      initialContent: editContent,
      onHTMLChange:(e) => {
        this.setState({
          editContent: e
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
      <div className={DrawerContentStyles.DrawerContentOut} onClick={this.drawerContentOutClick.bind(this)}>

        <div className={DrawerContentStyles.divContent_1}>
          <div className={DrawerContentStyles.contain_1}>
            <div className={DrawerContentStyles.left}>
               <span>项目实例 </span> <Icon type="right" /> <span>任务看板形态</span>
            </div>
            <div className={DrawerContentStyles.right}>
              <Icon type="ellipsis" style={{fontSize: 20,marginTop:2}} />
            </div>
          </div>
        </div>

        <div className={DrawerContentStyles.divContent_2}>
           <div className={DrawerContentStyles.contain_2}>
             <div className={isCheck? DrawerContentStyles.nomalCheckBoxActive: DrawerContentStyles.nomalCheckBox} style={{width: 24, height: 24}}>
               <Icon type="check" style={{color: '#FFFFFF',fontSize:16, fontWeight:'bold',marginTop: 2}}/>
             </div>
             <div className={DrawerContentStyles.contain_2_title}>安康市大家可能速度看是多么安康市大家可能速度看是多么安</div>
           </div>
        </div>

        <div className={DrawerContentStyles.divContent_1}>
          <div className={DrawerContentStyles.contain_3}>
            <span>认领</span>&nbsp;或&nbsp;<span>指派负责人</span>&nbsp;&nbsp;|&nbsp;&nbsp;设置<span>&nbsp;开始</span>&nbsp;或&nbsp;<span>截止时间</span>&nbsp;&nbsp;|&nbsp;&nbsp;<span>设置提醒</span>
          </div>
        </div>

        {/*富文本*/}
        {!isInEdit ? (
          <div className={DrawerContentStyles.divContent_1} >
            <div className={DrawerContentStyles.contain_4} onClick={this.goEdit.bind(this)}>
              <div dangerouslySetInnerHTML={{__html: editContent}}></div>
            </div>
          </div>
        ) : (
          <div className={DrawerContentStyles.editorWraper} onClick={this.editWrapClick.bind(this)}>
            <BraftEditor {...editorProps} style={{fontSize:12}}/>
          </div>
        ) }

        {/*关联*/}
        <div className={DrawerContentStyles.divContent_1}>
          <div className={DrawerContentStyles.contain_6}>
            <div className={DrawerContentStyles.contain_6_add} onClick={this.addTag.bind(this)}>
              <Icon type="plus" style={{marginRight: 4}}/>关联内容
            </div>
          </div>
        </div>

        {/*标签*/}
        <div className={DrawerContentStyles.divContent_1}>
          <div className={DrawerContentStyles.contain_5}>
            {tagArray.map((value, key) => {
              return(
                <Tag closable onClose={this.tagClose.bind(this)} key={key} color={this.randomColorArray()}>{value}</Tag>
              )
            })}
            <div>
              {!isInAddTag ? (
                <div className={DrawerContentStyles.contain_5_add} onClick={this.addTag.bind(this)}>
                  <Icon type="plus" style={{marginRight: 4}}/>标签
                </div>
              ) : (
                <Input placeholder={'标签'} style={{height: 22, fontSize: 14, color: '#8c8c8c',minWidth: 62, maxWidth: 100}} onPressEnter={this.tagAddComplete.bind(this)} onBlur={this.tagAddComplete.bind(this)}/>
              ) }
            </div>

          </div>
        </div>

        <div className={DrawerContentStyles.spaceLine}></div>

        {/*添加子任务*/}
        <DCAddChirlrenTask />

        <div className={DrawerContentStyles.spaceLine}></div>


      </div>
    )
  }

}

