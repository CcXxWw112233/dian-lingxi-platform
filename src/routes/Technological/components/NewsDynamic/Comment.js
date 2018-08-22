import React from 'react';
import { Card, Icon, Input, Button, Mention, Upload } from 'antd'
import CommentStyles from './Comment.less'

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
      <div className={CommentStyles.out}>
        <div>
          <img src="" className={CommentStyles.avartarImg} />
        </div>
        <Dragger {...props}>
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
                  <span><Icon type="copyright"  onClick={this.MentionSpacerClick.bind(this)}/></span><span><Icon type="smile-o"/></span><span></span><span><Icon type="database" /></span>
                </div>
                <div  className={CommentStyles.functionBar_right}>
                  <Button type={'primary'} style={{height:24,width: 58,marginRight: 12}}>发布</Button>
                </div>
              </div>
            </div>
          </div>

        </Dragger>
      </div>
    )
  }
}


