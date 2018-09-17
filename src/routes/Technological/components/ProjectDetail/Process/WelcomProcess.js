import React from 'react'
import indexStyles from './index.less'
import { Button, Icon, Input, Dropdown } from 'antd'
import MenuSearchStyles from  '../../TecPublic/MenuSearch.less'

export default class WelcomProcess extends React.Component {
  state = {}
  handleMenuReallyClick = (data) => {
    this.props.chirldrenTaskChargeChange(data)
  }
  render() {

    const MenuSearch = ({ menuSortList = [] }) => {
      return (
        <div className={MenuSearchStyles.menuOneout}>
          <div className={MenuSearchStyles.menuOne}>
            <div style={{width: 160, height: 42, margin: '0 auto'}}>
              <Input placeholder={'请输入'}  style={{width: 160, marginTop: 6}}/>
            </div>
            {menuSortList.map((value, key) => {
              const { user_id, full_name, img } = value
              return(
                <div style={{position: 'relative'}} key={key}  >
                  <div  style={{padding:0,margin: 0, height: 32}} onClick={()=>{this.handleMenuReallyClick.bind(this)}}>
                    <div className={MenuSearchStyles.menuOneitemDiv} >
                      {value.img?(
                        <img src={value.img} className={MenuSearchStyles.avatar} />
                      ):(
                        <div style={{height:20,width: 20,borderRadius:20,backgroundColor:'#f2f2f2',textAlign: 'center'}}>
                          <Icon type={'user'} style={{fontSize:12, color: '#8c8c8c', marginTop: 4,display: 'block'}}/>
                        </div>
                      )}
                      <span >{value.full_name || '名称未设置'}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )
    }
    return (
      <div className={indexStyles.welcomProcessOut}>
        <h1>欢迎使用流程功能</h1>
        <div className={indexStyles.description}>我们倾力打造一款易用的流程管理工具为你的项目带来更直观高效的风险把控体验，使用本功能可将项目范围内的流程统一展示并实时同步进度给相关参与人，避免信息滞后带来的成本耗损与不良后果。</div>
        <div className={indexStyles.description}>在开始管理一个流程之前，我们必须知道这个流程的具体步骤和流转要求，请选择一种方式来开启你的流程：</div>

        <div className={indexStyles.open}>
          <div className={indexStyles.openLeft}>
            <div className={indexStyles.title}>直接以现有的流程模板开始管理...</div>
            <div className={indexStyles.listItem}>
              <div></div>
              <div>适用于你希望管理的事情已存在配置好流程模板的事情；</div>
            </div>
            <div className={indexStyles.listItem}>
              <div></div>
              <div>你之前创建过跟这件事情相关的流程模板；</div>
            </div>
            <Dropdown overlay={MenuSearch({})}>
              <Button style={{width: 110,marginTop: 20}}>选择模板<Icon type={'down'} style={{fontSize: 12}}/></Button>
            </Dropdown>
          </div>

          <div  className={indexStyles.openRight}>
            <div className={indexStyles.title}>没有模板或不了解流程模板是什么...</div>
            <div className={indexStyles.listItem}>
              <div></div>
              <div>跟随指引配置跟此时相关的流程；</div>
            </div>
            <div className={indexStyles.listItem}>
              <div></div>
              <div>按需选择是否保存为模板便于后续管理同类事情；</div>
            </div>
            <Button type={'primary'} style={{width: 190,marginTop: 20}}>引导我开始创建新的流程</Button>
          </div>
        </div>
      </div>
    )
  }
}
