import React from 'react'
import { Card, Input } from 'antd'
import BraftEditor from 'braft-editor'
import ConfirmInfoOne from './ConfirmInfoOne'

import indexStyles from './index.less'

export default class ProcessStartConfirm extends React.Component {
  state = {

  }
  render() {
    const editorProps = {
      height: 0,
      contentFormat: 'html',
      initialContent: '',
      onHTMLChange:(e) => {
        // const { datas:{ drawContent = {} } } = this.props.model
        // drawContent['description'] = e
        // this.props.updateDatas({drawContent})
      },
      fontSizes: [14],
      controls: [
        'text-color', 'bold', 'italic', 'underline', 'strike-through',
        'text-align', 'list_ul',
        'list_ol', 'blockquote', 'code', 'split', 'media'
      ]
    }

    return(
      <div>
        <Card style={{ width: 900, margin: '0 auto',marginTop: 40 }}>
          <div className={indexStyles.toptitle}>
            <div></div>
            <div>投决立项</div>
          </div>
          <div style={{marginTop: 14}}>
            <Input  style={{height: 40,fontSize: 18, color: '#262626'}}/>
          </div>
          <div className={indexStyles.editorWraper}>
            <BraftEditor {...editorProps} style={{fontSize:12}}/>
          </div>
          <div style={{marginTop: 14}}>
            <ConfirmInfoOne {...this.props}/>
          </div>
        </Card>
      </div>
    )
  }
}
