import { Card } from 'antd'
import indexstyles from '../index.less'
import TaskItem from './TaskItem'
import ProcessItem from './ProcessItem'
import FileItem from './FileItem'

const CardContent = (props) => {
  const data = [1,2,3,4,5,6,7,8,9]
  const { datas = {} } = props.model
  const { responsibleTaskList=[], uploadedFileList=[], joinedProcessList=[], backLogProcessList=[] } = datas
  const { title, CardContentType } = props

  const filterItem = (CardContentType) => {
    let contanner = (<div></div>)
    switch (CardContentType) {
      case 'task':
        contanner = (
          responsibleTaskList.length? (
            responsibleTaskList.map((value, key)=> (
              <TaskItem key={key} itemValue={value}itemKey={key} {...props}/>
            ))
          ):(
            <div style={{marginTop: 12}}>暂无数据</div>
          )

        )
        break
      case 'waitingDoFlows': //待处理的流程
        contanner = (
          backLogProcessList.length? (
            backLogProcessList.map((value, key)=> (
              <ProcessItem key={key}  itemValue={value} {...props} />
            ))
          ):(
            <div style={{marginTop: 12}}>暂无数据</div>
          )

        )
        break
      case 'joinedFlows': //参与的流程
        contanner = (
          joinedProcessList.length?(
            joinedProcessList.map((value, key)=> (
              <ProcessItem key={key}  itemValue={value} {...props} />
            ))
          ):(
            <div style={{marginTop: 12}}>暂无数据</div>
          )
        )
        break
      case 'file':
        contanner = (
          uploadedFileList.length? (
            uploadedFileList.map((value, key)=> (
              <FileItem key={key}  itemValue={value} {...props} />
            ))
          ):(
            <div style={{marginTop: 12}}>暂无数据</div>
          )
        )
        break
      default:
        break
    }
    return contanner
  }
  return (
    <div className={indexstyles.cardDetail}>
      <div className={indexstyles.contentTitle}>{title}</div>
      <div className={indexstyles.contentBody}>
        {filterItem(CardContentType)}
      </div>
    </div>
  )

}

export default CardContent
