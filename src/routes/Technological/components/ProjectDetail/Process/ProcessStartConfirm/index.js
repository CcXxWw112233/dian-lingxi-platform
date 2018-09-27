import React from 'react'
import { Card, Input, Button } from 'antd'
import BraftEditor from 'braft-editor'
import ConfirmInfoOne from './ConfirmInfoOne'
import ConfirmInfoTwo from './ConfirmInfoTwo'
import ConfirmInfoThree from './ConfirmInfoThree'
import ConfirmInfoFour from './ConfirmInfoFour'
import ConfirmInfoFive from './ConfirmInfoFive'

import indexStyles from './index.less'

export default class ProcessStartConfirm extends React.Component {
  state = {
    stepContinueDisabled: true,
  }

  nameChange(e) {
    const value = e.target.value
    let flag = true
    if(value) {
      flag = false
    }
    this.setState({
      stepContinueDisabled: flag
    })
  }

  startProcess() {
    this.props.updateDatas({
      processPageFlagStep: '4',
    })
  }
  render() {
    const { stepContinueDisabled } = this.state
    const { datas: { processEditDatas = [] } } = this.props.model
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

    const filterItem = (value) => {
      const { node_type } = value
      let containner = (<div></div>)
       switch (node_type) {
         case '1':
           containner = (<ConfirmInfoOne {...this.props}/>)
           break
         case '2':
           containner = (<ConfirmInfoTwo {...this.props}/>)
           break
         case '3':
           containner = (<ConfirmInfoThree {...this.props}/>)
           break
         case '4':
           containner = (<ConfirmInfoFour {...this.props}/>)
           break
         case '5':
           containner = (<ConfirmInfoFive {...this.props}/>)
           break
         default:
           containner = (<div></div>)
               break
       }
       return containner
    }

    return(
      <div>
        <Card style={{ width: 900, margin: '0 auto',marginTop: 40 }}>
          {/*<div className={indexStyles.toptitle}>*/}
            {/*<div></div>*/}
            {/*<div>投决立项</div>*/}
          {/*</div>*/}
          <div style={{marginTop: 14}}>
            <Input  style={{height: 40,fontSize: 18, color: '#262626'}} onChange={this.nameChange.bind(this)} />
          </div>
          <div className={indexStyles.editorWraper}>
            <BraftEditor {...editorProps} style={{fontSize:12}}/>
          </div>
          <div style={{marginTop: 14}}>
            {processEditDatas.map((value, key) => {
              return (<div key={key}>{filterItem(value)}</div>)
            })}
          </div>
          <div style={{textAlign: 'center',marginTop: 40}} onClick={this.startProcess.bind(this)}>
            <Button disabled={stepContinueDisabled} style={{height: 40,lineHeight: '40px',margin: '0 auto'}} type={'primary'}>开始流程</Button>
          </div>
        </Card>
      </div>
    )
  }
}
