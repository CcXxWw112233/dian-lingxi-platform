import React from 'react'
import indexStyles from './index.less'
import { Icon } from 'antd'

export default class TeamListTypeOne extends React.Component{
  componentWillMount() {
    const { itemKey  } = this.props
    //设置底部可伸缩部分id
    this.setState({
      description_Id: `description_${itemKey * 100 + 1}`
    })
  }
  render(){
    let templateHtml = ''
    const minHeight = document.body.clientHeight
    return(
      <div className={indexStyles.teamList_list_1_item}>
        <div  className={indexStyles.edit}>
          <Icon type="edit" style={{marginRight: 4}}/>编辑
        </div>
        <div className={indexStyles.logo}>
        </div>
        <div className={indexStyles.title}>
          撒大声地撒大声地
        </div>
        <div className={indexStyles.description} >
          askdhasd=asdas 撒大声地撒大声地
          askdhasd=asdas 撒大声地撒大声地
          askdhasd=asdas 撒大声地撒大声地
          askdhasd=asdas 撒大声地撒大声地
          askdhasd=asdas 撒大声地撒大声地
          askdhasd=asdas 撒大声地撒大声地
          askdhasd=asdas 撒大声地撒大声地
          askdhasd=asdas 撒大声地撒大声地
        </div>
      </div>
    )
  }

}
