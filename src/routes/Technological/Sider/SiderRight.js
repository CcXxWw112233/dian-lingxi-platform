import React from 'react'
import {  Icon, Layout, Menu, Input, Avatar} from 'antd';
import indexStyles from './index.less'
import glabalStyles from '../../../globalset/css/globalClassName.less'
import GroupChat from './comonent/GroupChat'
import InitialChat from './comonent/InitialChat'

const { Sider } = Layout;

export default class SiderRight extends React.Component {
  state={
    collapsed: true
  }

  onCollapse(bool) {
    this.setState({
      collapsed: bool
    })
  }

  render() {
    const { collapsed } = this.state

    const data = [{id: '123',type:'1'},{id: '321', type: '0'}]

    return (
      <Sider
        collapsible
        onCollapse={this.onCollapse.bind(this)}
        className={indexStyles.siderRight} collapsible defaultCollapsed={true} collapsedWidth={56} width={300} theme={'light'}
      >
        <div className={indexStyles.contain_1}>
          <div className={`${glabalStyles.authTheme} ${indexStyles.left}`}>&#xe795;</div>
          <div className={indexStyles.right}>通知</div>
        </div>
        <div className={indexStyles.contain_2} style={{display:collapsed?'none':'flex'}}>
          <div className={`${glabalStyles.authTheme} ${indexStyles.left}`}>
            &#xe710;
          </div>
          <div className={indexStyles.right}>
            <input className={indexStyles.input} placeholder={'查找团队成员或项目'} />
          </div>
        </div>
        <div className={`${indexStyles.contain_3}`} style={{display: collapsed?'block': 'none'}}>
          {data.map((value, key) => {
            return (
              <div key={key}>
                <InitialChat itemValue={value} />
              </div>
            )
          })}
        </div>
        <div className={`${indexStyles.contain_3}`} style={{display: !collapsed?'block': 'none'}}>
          {data.map((value, key) => {
            return (
              <div key={key}>
                <GroupChat collapsed={collapsed} itemValue={value} />
              </div>
            )
          })}
        </div>
      </Sider>
    )
  }
}
