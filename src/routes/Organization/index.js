import React from 'react';
import {connect} from "dva/index";
import { Icon } from 'antd'
import indexStyles from './index.less'
import { color_4 } from '../../globalset/js/styles'

const getEffectOrReducerByName = name => `organization/${name}`

const Organization = (options) => {
  const { dispatch } = options
  const updateDatas = (payload) => {
    dispatch({
      type: getEffectOrReducerByName('updateDatas') ,
      payload:payload
    })
  }

  return(
    <div className={indexStyles.organizationOut}>
      <div className={indexStyles.main}>
        <div className={indexStyles.back}>
          <Icon type="left" theme="outlined" />返回
        </div>
        <div className={indexStyles.topTitle}>
          <Icon type="home" theme="outlined"  style={{color: color_4,fontSize: 32}} />
          <div>组织管理后台</div>
        </div>
      </div>
    </div>
  )
};

function mapStateToProps({ modal, organization, loading }) {
  return { modal, model: organization, loading }
}
export default connect(mapStateToProps)(Organization)
