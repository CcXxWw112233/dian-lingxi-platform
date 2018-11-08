import React from 'react'
import indexStyles from './index.less'
import { Icon } from 'antd'

export default class TeamList extends React.Component{
  render(){
    let templateHtml = ''
    const minHeight = document.body.clientHeight
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
            <Icon type="appstore-o" style={{fontSize:16,marginRight: 16}}/><Icon type="hdd" style={{fontSize:16}}/>
          </div>
        </div>
        <div className={indexStyles.teamList_list_1}>
          {data.map(value => (
            <div className={indexStyles.teamList_list_1_item}>

            </div>
          ))}

        </div>
      </div>
    )
  }

}
