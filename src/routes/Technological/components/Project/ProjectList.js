import React from 'react'
import indexStyle from './index.less'
import globalStyles from '../../../../globalset/css/globalClassName.less'
import { Icon, Menu, Dropdown, Tooltip, Collapse, Card } from 'antd'
const Panel = Collapse.Panel

export default class Projectlist extends React.Component {

  render() {
    const taskMan = [1,2,3,4,5,6,7,8]
    const collectionProject = (
      <Card style={{position: 'relative',height: 'auto'}}>
        <div className={indexStyle.listOutmask}></div>
        <div className={indexStyle.listOut}>
          <div className={indexStyle.left}>
            <div className = {indexStyle.top}>[项目实例]关于工作的一切从未如此一目了然</div>
            <div className ={indexStyle.bottom}>
              {taskMan.map((value, key) => {
                console.log(key)
                if(key < 7) {
                  return (<img src="" key={key} className={indexStyle.taskManImag}></img>)
                }
              })}
              {taskMan.length > 7? (
                <div style={{display: 'flex',fontSize: 12}}>
                  <div className={indexStyle.manwrap} ><Icon type="ellipsis" style={{fontSize:18}}/></div>{taskMan.length}位任务执行人
                </div>
              ) : ('')}
            </div>
          </div>
          <div className={indexStyle.right}>
            <div className={indexStyle.rightItem}>
              <div>27</div>
              <div>剩余任务</div>
            </div>
            <div className={indexStyle.rightItem}>
              <div>27</div>
              <div>已完成</div>
            </div>
            <div className={indexStyle.rightItem}>
              <div>27</div>
              <div>距离下一节点</div>
            </div>
          </div>
        </div>
      </Card>
    )
    const addItem = (
      <div className={indexStyle.addListItem}>
        <Icon type="plus-circle-o" style={{fontSize: 18, color: '#8c8c8c',marginTop: 6}} />
      </div>
    )
    return (
      <div className={indexStyle.projectListOut}>
        <Collapse accordion bordered={false} style={{backgroundColor:'#f5f5f5',marginTop: 30}} defaultActiveKey={['1']}>
          <Panel header="This is panel header 1" key="1"  style={customPanelStyle}>
            {collectionProject}
            {addItem}
          </Panel>
          <Panel header="This is panel header 2" key="2"  style={customPanelStyle}>

          </Panel>
          <Panel header="This is panel header 3" key="3"  style={customPanelStyle}>

          </Panel>
        </Collapse>
      </div>
    )
  }
}
const customPanelStyle = {
  background: '#f5f5f5',
  borderRadius: 4,
  marginBottom: 20,
  border: 0,
  overflow: 'hidden',
};
