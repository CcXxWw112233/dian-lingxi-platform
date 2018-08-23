import React from 'react'
import DrawerContentStyles from './DrawerContent.less'
import { Icon } from 'antd'
import BraftEditor from 'braft-editor'
import 'braft-editor/dist/braft.css'

export default class DrawContent extends React.Component {
  state = {
    isCheck: true
  }
  handleEditChange = (content) => {
    console.log(content)
  }

  handleEditRawChange = (rawContent) => {
    console.log(rawContent)
  }
  render() {
    const { isCheck } = this.state
    return(
      <div className={DrawerContentStyles.DrawerContentOut}>

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

        <div className={DrawerContentStyles.divContent_1}>
          <div className={DrawerContentStyles.contain_4}>
            点击卡片上的任意内容可进入编辑模式，例如通过修改项目归属来进行跨项目移动任务、给任务指派负责人、设置任务截止时间、设置任务提醒等等等，此处是任务的描述，可以添加富文本内容，无论是链接 http://new-di.com 还是图文并茂↓都支持：
          </div>
        </div>
        <div className={DrawerContentStyles.editorWraper}>
          <BraftEditor {...editorProps} style={{fontSize:12}}/>
        </div>
      </div>
    )
  }

}


const editorProps = {
  height: 0,
  contentFormat: 'html',
  initialContent: '<p style="font-size: 12px">Hello World!</p>',
  onChange: this.handleEditChange,
  onRawChange: this.handleEditRawChange,
  fontSizes: [12],
  controls: [
    'text-color', 'bold', 'italic', 'underline','font-size',, 'strike-through',
     'text-align', 'headings', 'list_ul',
    'list_ol', 'blockquote', 'code', 'split', 'media'
  ]
}

const   excludeControls = [
  'undo','redo', 'split', 'font-size', 'font-family', 'line-height', 'letter-spacing',
  'indent','text-color', 'bold', 'italic', 'underline',  'underline', 'strike-through',
  'superscript', 'subscript', 'remove-styles', 'emoji', 'text-align', 'split', 'headings', 'list_ul',
  'list_ol', 'blockquote', 'code', 'split', 'link', 'split', 'hr', 'split', 'media', 'clear'
]
