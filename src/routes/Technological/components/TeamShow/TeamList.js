import React from 'react'
import indexStyles from './index.less'
import { Icon } from 'antd'
import TeamListTypeOne from './TeamListTypeOne'
import TeamListTypeTwo from './TeamListTypeTwo'

export default class TeamList extends React.Component{
  state={
    showType: '2', //表现形式1 ， 2

  }
  setShowType(showType) {
    this.setState({
      showType
    })
  }
  render(){
    const { showType } = this.state
    const data = [1,2,3,4]
    return(
      <div className={indexStyles.teamListOut}>
        <div className={indexStyles.head}>
          <div className={indexStyles.head_left}>
            <div>
              全部项目 <Icon type="down"  style={{fontSize:14,color:'#595959'}}/>
            </div>
            <div>
               默认排序 <Icon type="down"  style={{fontSize:14,color:'#595959'}}/>
            </div>
          </div>

          <div className={indexStyles.head_right}>
            <Icon onClick={this.setShowType.bind(this, '1')} type="appstore-o" style={{fontSize:16,marginRight: 16, color: showType === '1' ? '#262626':'#8c8c8c'}}/><Icon type="bars" onClick={this.setShowType.bind(this, '2')} style={{fontSize:18, color: showType === '2' ? '#262626':'#8c8c8c'}} />
          </div>
        </div>
        <div className={showType === '1' ? indexStyles.teamList_list_1 : indexStyles.teamList_list_2}>
          {data.map((value, key ) => (
            showType === '1' ? (
              <TeamListTypeOne itemValue={value} itemKey={key} key={key} />
            ): (
              <TeamListTypeTwo itemValue={value} itemKey={key} key={key} />
            )
          ))}
        </div>
      </div>
    )
  }

}
