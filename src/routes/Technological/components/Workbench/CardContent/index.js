import { Card } from 'antd'
import indexstyles from '../index.less'
import TaskItem from './TaskItem'
import ProcessItem from './ProcessItem'
import FileItem from './FileItem'

const CardContent = (props) => {
  const data = [1,2,3,4,5,6,7,8,9]
  const { title } = props
  return (
    <div className={indexstyles.cardDetail}>
      <div className={indexstyles.contentTitle}>{title}</div>
      <div className={indexstyles.contentBody}>
        {data.map((value, key) => {
          return (
            <TaskItem key={key} />
          )
        })}
      </div>
    </div>
  )

}

export default CardContent
