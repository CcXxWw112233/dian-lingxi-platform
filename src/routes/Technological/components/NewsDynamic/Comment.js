import React from 'react';
import { Card, Icon, Input, Button, Mention, Upload, Tooltip } from 'antd'
import CommentStyles from './Comment.less'
import 'emoji-mart/css/emoji-mart.css'
import { Picker } from 'emoji-mart'
import CommentListItem from './CommentListItem'

// const TextArea = Input.TextArea
const Dragger = Upload.Dragger

export default class Comment extends React.Component {
  state = {
    editText: ''
  }
  MentionSpacerClick() {
  }
  MentionEditorChange(e) {
    console.log(e.target)
  }
  render() {
    const { leftSpaceDivWH = 40 } = this.props
    const props = {
      name: 'file',
      multiple: true,
      action: '//jsonplaceholder.typicode.com/posts/',
      onChange(info) {
        const status = info.file.status;
        if (status !== 'uploading') {
          console.log(info.file, info.fileList);
        }
        if (status === 'done') {
        } else if (status === 'error') {
        }
      },
    };
    return (
      <div>
        <div className={CommentStyles.out}>
          <div style={{width: leftSpaceDivWH, height: leftSpaceDivWH}}>
          </div>
          <div className={CommentStyles.right}>
            <CommentListItem />
          </div>
        </div>
        <div className={CommentStyles.out}>
          <div>
            <img src="" className={CommentStyles.avartarImg} style={{width: leftSpaceDivWH, height: leftSpaceDivWH}} />
          </div>
          {/*<Dragger {...props} >*/}
          <div className={CommentStyles.right}>
            <div className={CommentStyles.comment}>
              {/*<textarea minrows = {1}  maxrows = {6}  className={CommentStyles.textArea}></textarea>*/}
              <Mention
                  multiLines={true}
                  onChange ={this.MentionEditorChange.bind(this)}
                  className={CommentStyles.mention}
                  style={{ width: '100%',border:' none', outline: 'none', height: 48}}
                  suggestions={['afc163', 'benjycui', 'yiminghe', 'RaoHai', '中文', 'にほんご']}
                />
              <div className={CommentStyles.functionBar}>
                  <div  className={CommentStyles.functionBar_left}>
                    {/*<Icon type="copyright"  onClick={this.MentionSpacerClick.bind(this)}/>*/}
                      <Tooltip title="该功能尚未上线，敬请期待">
                        <span style={{fontSize: 16, color: '#8c8c8c'}}>@</span>
                      </Tooltip>
                      <Tooltip title="该功能尚未上线，敬请期待">
                        <span><Icon type="smile-o" style={{marginTop: 10, color: '#8c8c8c'}}/></span>
                      </Tooltip>
                      <span></span>
                      <Tooltip title="该功能尚未上线，敬请期待">
                        <span className={CommentStyles.dragSpan}><Icon type="database" style={{fontSize: 14, color: '#8c8c8c'}} /> 选择或拖拽文件</span>
                      </Tooltip>
                      {/*<Dragger {...props} className={CommentStyles.drag}>*/}
                        {/*<span className={CommentStyles.dragSpan}><Icon type="database" /> 选择或拖拽文件</span>*/}
                      {/*</Dragger>*/}
                    </div>
                  <div  className={CommentStyles.functionBar_right}>
                    <Button type={'primary'} style={{height:24,width: 58,marginRight: 12}}>发布</Button>
                  </div>
                </div>
              </div>
          </div>
          {/*</Dragger>*/}
        </div>
      </div>
    )
  }
}


