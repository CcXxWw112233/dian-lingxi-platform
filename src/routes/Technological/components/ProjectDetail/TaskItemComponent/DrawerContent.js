import React from 'react'
import DrawerContentStyles from './DrawerContent.less'
import { Icon } from 'antd'
import BraftEditor from 'braft-editor'
import 'braft-editor/dist/braft.css'
const initEditContent = '<p style="font-size: 12px">Hello World!</p>'

let that
export default class DrawContent extends React.Component {
  state = {
    isCheck: true,
    editContent: initEditContent
  }
  render() {
    that = this
    const { isCheck, editContent } = this.state
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
            <div dangerouslySetInnerHTML={{__html: editContent}}></div>
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
  initialContent: '',
  onHTMLChange: function(e){
    console.log(e)
    that.setState({
      editContent: e
    })
  },
  fontSizes: [14],
  controls: [
    'text-color', 'bold', 'italic', 'underline', 'strike-through',
     'text-align', 'headings', 'list_ul',
    'list_ol', 'blockquote', 'code', 'split', 'media'
  ]
}
