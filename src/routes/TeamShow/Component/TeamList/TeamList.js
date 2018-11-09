import React from 'react'
import indexStyles from './index.less'
import { Icon, Button, Pagination  } from 'antd'
import TeamListTypeOne from './TeamListTypeOne'
import TeamListTypeTwo from './TeamListTypeTwo'

export default class TeamList extends React.Component{
  state={
    showType: '1', //表现形式1 ， 2

  }
  setShowType(showType) {
    this.setState({
      showType
    })
  }
  gotoEditTeamShow() {
    this.props.routingJump('/teamShow/editTeamShow')
  }
  render(){
    const { showType } = this.state
    const { datas: {teamShowList=[], total} } = this.props.model
    return(
      <div className={indexStyles.teamListOut}>
        <div className={indexStyles.head}>
          <div className={indexStyles.head_left}>
             <Button style={{fontSize: 14,}} size={'small'} onClick={this.gotoEditTeamShow.bind(this)}>发布管理</Button>
          </div>

          <div className={indexStyles.head_right}>
            <div style={{marginRight: 16,}}>
              默认排序 <Icon type="down"  style={{fontSize:14,color:'#595959'}}/>
            </div>
            <Icon onClick={this.setShowType.bind(this, '1')} type="appstore-o" style={{fontSize:16,marginRight: 16, color: showType === '1' ? '#262626':'#8c8c8c'}}/><Icon type="bars" onClick={this.setShowType.bind(this, '2')} style={{fontSize:18, color: showType === '2' ? '#262626':'#8c8c8c'}} />
          </div>
        </div>
        <div className={showType === '1' ? indexStyles.teamList_list_1 : indexStyles.teamList_list_2}>
          {teamShowList.map((value, key ) => (
            showType === '1' ? (
              <TeamListTypeOne itemValue={value} itemKey={key} key={key} {...this.props}/>
            ): (
              <TeamListTypeTwo itemValue={value} itemKey={key} key={key} {...this.props}/>
            )
          ))}
        </div>
        <div style={{marginTop: 40}}>
          <Pagination
            total={total}
            pageSize={20}
            defaultCurrent={1}
          />
        </div>
      </div>
    )
  }

}
