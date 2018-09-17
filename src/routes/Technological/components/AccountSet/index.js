import React from 'react';
import {connect} from "dva/index";
import AccountSetMenu from './AccountSetMenu.js'
import indexStyle from './index.less'

const getEffectOrReducerByName = name => `accountSet/${name}`

const AccountSet = (options) => {
  const { accountSet, dispatch } =options
  const menuFormProps = {
    accountSet,
    updateUserInfo(data) {
      dispatch({
        type: getEffectOrReducerByName('updateUserInfo'),
        payload: {
          data
        }
      })
    },
    changePassWord(data) {
      dispatch({
        type: getEffectOrReducerByName('changePassWord'),
        payload: {
          data
        }
      })
    }
  }
  const updateDatas = (payload) => {
    dispatch({
      type: getEffectOrReducerByName('updateDatas') ,
      payload:payload
    })
  }
    return(
      <div>
        <div style={{height: 48,width:1152,margin:'0 auto'}}></div>
        <div  style={{width:1152,margin:'0 auto'}} className={indexStyle.page_card_2}>
          <AccountSetMenu {...menuFormProps} updateDatas={updateDatas}></AccountSetMenu>
        </div>
      </div>
    )
};

export default connect(({ accountSet }) => {
  return {
    accountSet,
  }
})(AccountSet);
