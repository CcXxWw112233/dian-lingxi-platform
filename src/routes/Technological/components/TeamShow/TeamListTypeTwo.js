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
      <div>
        <div  className={indexStyles.teamList_list_2_item}>
          <div  className={indexStyles.teamList_list_2_item_left}></div>
          <div className={indexStyles.teamList_list_2_item_right}>
            <div className={indexStyles.teamList_list_2_item_right_title}>
              <div className={indexStyles.title}>
                撒大声地撒大声地
              </div>
              <div  className={indexStyles.edit}>
                <Icon type="edit" style={{marginRight: 4}}/>编辑
              </div>
            </div>
            <div className={indexStyles.teamList_list_2_item_right_detail}>
              askdhasd=asdas 撒大声地撒大声地
              askdhasd=asdas 撒大声地撒大声地
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
        </div>
        <div className={indexStyles.teamList_list_2_item_line}></div>
      </div>

    )
  }

}
