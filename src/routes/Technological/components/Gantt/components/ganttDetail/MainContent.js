import React from 'react'
import indexStyles from './index.less'
import NameChangeInput from '../../../../../../components/NameChangeInput'
import { Dropdown, Icon } from 'antd'
import MeusearMutiple from '../../../Workbench/CardContent/Modal/TaskItemComponent/components/MeusearMutiple'
import ExcutorList from '../../../Workbench/CardContent/Modal/TaskItemComponent/components/ExcutorList'

export default class MainContent extends React.Component {
  state = {}

  componentDidMount() {}

  componentWillReceiveProps(nextProps) {}

  //标题
  titleTextAreaChangeBlur(e) {
    this.setState({
      titleIsEdit: false
    })
  }
  setTitleIsEdit(titleIsEdit, e) {
    e.stopPropagation();
    this.setState({
      titleIsEdit: titleIsEdit
    })
  }
  setChargeManIsSelf() {
    const { datas: { drawContent = {} } } = this.props.model
    const { card_id, executors=[] } = drawContent
    const userInfo = JSON.parse(localStorage.getItem('userInfo'))
    const { id, full_name, fullName, email, mobile, avatar } = userInfo
    executors[0] = {
      user_id: id,
      user_name: full_name || fullName || mobile || email,
      avatar: avatar
    }
    this.props.addTaskExecutor({
      card_id,
      users: id
    })
  }
  chirldrenTaskChargeChange(data) {
    const { datas: { drawContent = {}, projectDetailInfoData = {} } } = this.props.model
    const { card_id, executors=[] } = drawContent
    //单个任务执行人
    const { user_id, full_name, avatar } = data
    // executors[0] = {
    //   user_id,
    //   user_name: full_name,
    //   avatar: avatar
    // }
    // this.props.addTaskExecutor({
    //   card_id,
    //   users: user_id
    // })

    //  多个任务执行人
    const excutorData = projectDetailInfoData['data'] //所有的人
    let newExecutors = []
    const { selectedKeys = [] } = data
    for(let i = 0; i < selectedKeys.length; i++) {
      for(let j = 0; j < excutorData.length; j++) {
        if(selectedKeys[i] === excutorData[j]['user_id']) {
          newExecutors.push(excutorData[j])
        }
      }
    }
    drawContent['executors'] = newExecutors
    //用于判判断任务执行人菜单是否显示
    const that = this
    setTimeout(function () {
      const { excutorsOut_left = {}} = that.refs
      const excutorsOut_left_width = excutorsOut_left.clientWidth
      that.setState({
        excutorsOut_left_width
      })
    }, 300)

    this.props.addTaskExecutor({
      card_id,
      users: selectedKeys.join(',')
    })

  }

  render() {
    const { titleIsEdit } = this.state
    console.log('ssss',titleIsEdit )
    const { titile = '这是标题'} = this.props
    const { executors = [], data = [] } = this.props
    return(
      <div>
        {/*标题*/}
        <div className={indexStyles.divContent_2}>
          <div className={indexStyles.contain_2}>
            {!titleIsEdit ? (
              <div className={indexStyles.contain_2_title} onClick={this.setTitleIsEdit.bind(this, true)}>{titile}</div>
            ) : (
              <NameChangeInput
                autosize
                onBlur={this.titleTextAreaChangeBlur.bind(this)}
                onClick={this.setTitleIsEdit.bind(this, true)}
                setIsEdit={this.setTitleIsEdit.bind(this, false)}
                autoFocus={true}
                goldName={titile}
                maxLength={100}
                nodeName={'textarea'}
                style={{display: 'block', fontSize: 20, color: '#262626', resize: 'none', marginLeft: -4, padding: '0 4px'}}
              />
            )}
          </div>
        </div>
        {/*任务负责人*/}
        <div className={indexStyles.divContent_1}>
          <div className={indexStyles.contain_3}>
            <div>
              {!executors.length ? (
                <div>
                  <span onClick={this.setChargeManIsSelf.bind(this)}>认领</span>&nbsp;<span style={{color: '#bfbfbf'}}>或</span>&nbsp;
                  <Dropdown overlay={<MeusearMutiple listData={data} keyCode={'user_id'}searchName={'name'} currentSelect = {executors} chirldrenTaskChargeChange={this.chirldrenTaskChargeChange.bind(this)}/>}>
                    <span>指派负责人</span>
                  </Dropdown>
                </div>
              ) : (
                <div className={indexStyles.excutorsOut}>
                  <Dropdown overlay={<MeusearMutiple listData={data} keyCode={'user_id'}searchName={'name'} currentSelect = {executors} chirldrenTaskChargeChange={this.chirldrenTaskChargeChange.bind(this)}/>}>
                    <div className={indexStyles.excutorsOut_left} ref={'excutorsOut_left'}>
                      {executors.map((value, key) => {
                        const { avatar, name, user_name, user_id } = value
                        return (
                          <div style={{display: 'flex', alignItems: 'center'}} key={user_id}>
                            {avatar? (
                              <img style={{ width: 20, height: 20, borderRadius: 20, marginRight: 4}} src={avatar} />
                            ) : (
                              <div style={{width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 20, backgroundColor: '#f5f5f5', marginRight: 4, }}>
                                <Icon type={'user'} style={{fontSize: 12, color: '#8c8c8c'}}/>
                              </div>
                            )}
                            <div style={{overflow: 'hidden', verticalAlign: ' middle', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 80, marginRight: 8}}>{name || user_name || '佚名'}</div>
                          </div>
                        )
                      })}
                    </div>
                  </Dropdown>

                  <Dropdown overlay={<ExcutorList listData={executors}/>}>
                    <div className={indexStyles.excutorsOut_right} style={{backgroundColor: (typeof excutorsOut_left_width ==='number'&& excutorsOut_left_width > 340) || (typeof excutorsOut_left_width_new ==='number'&& excutorsOut_left_width_new > 340) ?'#f5f5f5': ''}}>
                      <Icon type="ellipsis" style={{marginTop: 2, display: (typeof excutorsOut_left_width ==='number'&& excutorsOut_left_width > 340) || (typeof excutorsOut_left_width_new ==='number'&& excutorsOut_left_width_new > 340)?'block': 'none'}} />
                    </div>
                  </Dropdown>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }
}
