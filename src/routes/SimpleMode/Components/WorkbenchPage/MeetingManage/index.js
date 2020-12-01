import React from 'react'
import styles from './index.less'
import Manage from './components/manage'
import UseRoomHistory from './components/useRoomHistory'
import InPayment from './components/InPayment'
import { Popover, Button } from 'antd'

export default class ManageMain extends React.Component {
  pakageLink = [
    {
      label: '智屏安卓版',
      key: '1',
      value:
        'https://dian-lingxi-public.oss-cn-beijing.aliyuncs.com/apps/meeting-manage/meeting-manage-tv.apk'
    },
    {
      label: '门牌安卓版',
      key: '2',
      value:
        'https://dian-lingxi-public.oss-cn-beijing.aliyuncs.com/apps/meeting-manage/meeting-manage.apk'
    },
    {
      label: '门牌Windows版',
      key: '3',
      value:
        'https://dian-lingxi-public.oss-cn-beijing.aliyuncs.com/apps/meeting-manage/meeting-manage.exe'
    }
  ]
  state = {
    activeKey: 'history',
    tabs: [
      { label: '会议资源', key: 'manage' },
      { label: '使用记录', key: 'history' },
      { label: '应收账单', key: 'inOrder' },
      { label: '应付账单', key: 'outOrder' }
    ]
  }

  setActiveKey = ({ key }) => {
    // console.log(key)
    this.setState({
      activeKey: key
    })
  }
  render() {
    const { workbenchBoxContent_height = 700 } = this.props
    return (
      <div
        className={styles.meeting_container}
        style={{ height: workbenchBoxContent_height }}
      >
        <div className={styles.meeting_container_title}>
          <div className={styles.manageTabs}>
            {this.state.tabs.map(item => {
              return (
                <div
                  key={item.key}
                  className={`${
                    item.key === this.state.activeKey ? styles.active : ''
                  } ${styles.item_tabs}`}
                  onClick={() => this.setActiveKey(item)}
                >
                  {item.label}
                </div>
              )
            })}
          </div>
          <Popover
            trigger="click"
            title={null}
            placement="leftTop"
            content={this.pakageLink.map(item => {
              return (
                <div
                  className={styles.pakage_item}
                  onClick={() => this.downloadPakage(item)}
                  key={item.key}
                >
                  {item.label}
                </div>
              )
            })}
          >
            <Button className={styles.downloadPakage}>下载客户端</Button>
          </Popover>
        </div>
        {this.state.activeKey === 'manage' && <Manage {...this.props} />}
        {this.state.activeKey === 'history' && (
          <UseRoomHistory {...this.props} />
        )}
        {this.state.activeKey === 'inOrder' && <InPayment {...this.props} />}
      </div>
    )
  }
}
