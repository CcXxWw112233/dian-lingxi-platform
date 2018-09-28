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

  nameChange(e) {
    const value = e.target.value
    const { datas: { templateInfo = {} } } = this.props.model
    templateInfo['name'] = value
    this.props.updateDatas({
      templateInfo
    })
  }

  startProcess() {
    const { datas: { processEditDatas, templateInfo = {}  } } = this.props.model
    const { name, description, id } = templateInfo
    this.props.createProcess({
      description,
      name,
      nodes: JSON.stringify(processEditDatas),
      template_id: id,
    })
  }
  render() {
    const that = this
    const { datas: { processEditDatas = [], templateInfo = {} } } = this.props.model
    const { name, description } = templateInfo

    const editorProps = {
      height: 0,
      contentFormat: 'html',
      initialContent: description,
      onHTMLChange:(e) => {
        const { datas:{ templateInfo = {} } } = this.props.model
        templateInfo['description'] = e
        this.props.updateDatas({templateInfo})
      },
      fontSizes: [14],
      controls: [
        'text-color', 'bold', 'italic', 'underline', 'strike-through',
        'text-align', 'list_ul',
        'list_ol', 'blockquote', 'code', 'split', 'media'
      ]
    }

    const filterItem = (value, key) => {
      const { node_type } = value
      let containner = (<div></div>)
       switch (node_type) {
         case '1':
           containner = (<ConfirmInfoOne itemKey={key} itemValue={value} {...this.props}/>)
           break
         case '2':
           containner = (<ConfirmInfoTwo  itemKey={key} itemValue={value} {...this.props}/>)
           break
         case '3':
           containner = (<ConfirmInfoThree  itemKey={key} itemValue={value} {...this.props}/>)
           break
         case '4':
           containner = (<ConfirmInfoFour  itemKey={key} itemValue={value} {...this.props}/>)
           break
         case '5':
           containner = (<ConfirmInfoFive  itemKey={key} itemValue={value} {...this.props}/>)
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
            <Input defaultValue={name} style={{height: 40,fontSize: 18, color: '#262626'}} onChange={this.nameChange.bind(this)} />
          </div>
          <div className={indexStyles.editorWraper}>
            <BraftEditor {...editorProps} style={{fontSize:12}}/>
          </div>
          <div style={{marginTop: 14}}>
            {processEditDatas.map((value, key) => {
              return (<div key={key}>{filterItem(value, key)}</div>)
            })}
          </div>
          <div style={{textAlign: 'center',marginTop: 40}} onClick={this.startProcess.bind(this)}>
            <Button disabled={!!!name} style={{height: 40,lineHeight: '40px',margin: '0 auto'}} type={'primary'}>开始流程</Button>
          </div>
        </Card>
      </div>
    )
  }
}
