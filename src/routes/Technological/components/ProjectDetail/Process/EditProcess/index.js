import React from 'react'
import indexStyles from './index.less'
import { Icon, Button } from 'antd'
import EditFormOne from './EditFormOne'

export default class EditProcess extends React.Component {
  state = {}
  render() {
    return (
      <div className={indexStyles.editProcessOut}>
        <div className={indexStyles.editProcessLeft}>
          <div className={indexStyles.title}>
            流程步骤：
          </div>
          {/*itemSelect*/}
          <div className={indexStyles.item}>
            <div className={indexStyles.itemLeft}>1</div>
            <div className={indexStyles.itemRight}>设置步撒是是是多过水电费费骤名称</div>
          </div>
          <div className={indexStyles.addItem}>
            <Icon type="plus-circle-o" />
          </div>
        </div>
        <div className={indexStyles.editProcessMiddle}>
          <div className={indexStyles.title}>
            <div className={indexStyles.left}>步骤类型：</div>
            <div className={indexStyles.right}>
              <div className={indexStyles.selectType}>里程碑</div>
              <div>上传</div>
              <div>填写</div>
              <div>抄送</div>
              <div>审批</div>
            </div>
          </div>
          <div className={indexStyles.editFormCard}>
            <EditFormOne />
          </div>
        </div>
        <div className={indexStyles.editProcessRight}>
          <div></div>
          <Button type={'primary'}style={{marginTop: 36}}>保存模板</Button>
          <Button style={{marginTop: 14}}>直接启动</Button>
          <Button  style={{marginTop: 14, color: 'red'}}>退出编辑</Button>
        </div>
      </div>
    )
  }
}
