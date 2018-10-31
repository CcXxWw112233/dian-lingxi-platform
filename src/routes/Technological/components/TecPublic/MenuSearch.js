import React from 'react'
import MenuSearchStyles from './MenuSearch.less'
import { Icon, Input, Button, DatePicker, Menu } from 'antd'
import { processEditDatasConstant, processEditDatasRecordsConstant, processEditDatasItemOneConstant, processEditDatasRecordsItemOneConstant } from '../ProjectDetail/Process/constant'


const MenuSearch = (props) => {
  const {datas: { processList = []}} = props.model
  const {datas: { currentProcessInstanceId }} = props.model

  const menuSelect = ({ item, key, selectedKeys }) => {
    if(key) {
      props.getProcessInfo({id: key})
    }
  }
  const addProcess = () => {
    props.updateDatas({
      processInfo: {},
      processPageFlagStep: '1',
      node_type: '1', //节点类型
      processCurrentEditStep: 0, //编辑第几步，默认 0
      processEditDatas: JSON.parse(JSON.stringify(processEditDatasConstant)), //json数组，每添加一步编辑内容往里面put进去一个obj,刚开始默认含有一个里程碑的
      processEditDatasRecords: JSON.parse(JSON.stringify(processEditDatasRecordsConstant)) //每一步的每一个类型，记录，数组的全部数据step * type
    })
    props.updateDatas({currentProcessInstanceId: ''})
  }
  return (
    <Menu  style={{padding: 8}}  onClick={menuSelect} selectedKeys={[currentProcessInstanceId]}>
      <Input/>
      {
        processList.map((val, key) => {
          const { name, id } = val
          return (
            <Menu.Item style={{height: 32,lineHeight: '32px'}} key={id}>
              {name}
            </Menu.Item>
          )
        })
      }
      <div onClick={addProcess} style={{minWidth: 160, height: 32,borderTop: '1px solid #f2f2f2', lineHeight:'32px', cursor: 'pointer', margin: '0 auto',textAlign: 'center'}}>
        <Icon type={'plus'}/>
      </div>
    </Menu>
  )
}

export default MenuSearch
