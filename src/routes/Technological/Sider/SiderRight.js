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

  setCollapsed() {
    this.setState({
      collapsed: !this.state.collapsed
    })
  }

  render() {
    const { collapsed } = this.state

    const data = [{id: '123',type:'1'},{id: '321', type: '0'}]

    return (
      <div  id={'siderRight'} className={indexStyles.siderRight}>
      <Sider
        collapsible
        onCollapse={this.onCollapse.bind(this)}
        className={indexStyles.siderRight} collapsible defaultCollapsed={true} collapsed={collapsed} trigger={null} collapsedWidth={56} width={300} theme={'light'}
      >
        <div className={indexStyles.siderRightInner} style={{width:collapsed?56:300}}>
          <div className={indexStyles.contain_1} onClick={this.setCollapsed.bind(this)}>
            <div className={`${glabalStyles.authTheme} ${indexStyles.left}`}>&#xe795;</div>
            <div className={indexStyles.right}>通知</div>
          </div>
          <div style={{height: document.documentElement.clientHeight - 58, padding:'20px 12px'}}>
            <iframe
              src={`http://www.new-di.com/im`}
              frameBorder="0"
              width="100%"
              height="100%"
              id={'iframImCircle'}
            ></iframe>
          </div>
          {/*<div className={indexStyles.contain_2} style={{display:collapsed?'none':'flex'}}>*/}
            {/*<div className={`${glabalStyles.authTheme} ${indexStyles.left}`}>*/}
              {/*&#xe710;*/}
            {/*</div>*/}
            {/*<div className={indexStyles.right}>*/}
              {/*<input className={indexStyles.input} placeholder={'查找团队成员或项目'} />*/}
            {/*</div>*/}
          {/*</div>*/}
          {/*<div className={`${indexStyles.contain_3}`} style={{display: collapsed?'block': 'none'}}>*/}
            {/*{data.map((value, key) => {*/}
              {/*return (*/}
                {/*<div key={key}>*/}
                  {/*<InitialChat itemValue={value} />*/}
                {/*</div>*/}
              {/*)*/}
            {/*})}*/}
          {/*</div>*/}
          {/*<div className={`${indexStyles.contain_3}`} style={{display: !collapsed?'block': 'none'}}>*/}
            {/*{data.map((value, key) => {*/}
              {/*return (*/}
                {/*<div key={key}>*/}
                  {/*<GroupChat collapsed={collapsed} itemValue={value} />*/}
                {/*</div>*/}
              {/*)*/}
            {/*})}*/}
          {/*</div>*/}
        </div>
      </Sider>
      </div>
    )
  }
}
