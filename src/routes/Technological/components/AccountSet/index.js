import React from 'react'
import { connect } from 'dva/index'
import AccountSetMenu from './AccountSetMenu.js'
import indexStyle from './index.less'

const getEffectOrReducerByName = name => `accountSet/${name}`

const AccountSet = options => {
  const { model, dispatch } = options
  const menuFormProps = {
    model,
    dispatch,
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
    },
    updateDatas(data) {
      dispatch({
        type: 'updateDatas',
        payload: data
      })
    },
    simplGetUserInfo(data) {
      dispatch({
        type: getEffectOrReducerByName('simplGetUserInfo'),
        payload: {}
      })
    },

    getVerificationcode(data, calback) {
      dispatch({
        type: getEffectOrReducerByName('getVerificationcode'),
        payload: {
          data,
          calback
        }
      })
    },
    checkMobileIsRegisted(data) {
      dispatch({
        type: getEffectOrReducerByName('checkMobileIsRegisted'),
        payload: { data }
      })
    },
    checkEmailIsRegisted(data) {
      dispatch({
        type: getEffectOrReducerByName('checkEmailIsRegisted'),
        payload: { data }
      })
    },
    getUserInfo(data) {
      dispatch({
        type: getEffectOrReducerByName('getUserInfo'),
        payload: data
      })
    },
    formSubmit(data) {
      dispatch({
        type: getEffectOrReducerByName('formSubmit'),
        payload: data
      })
    },
    unBindWechat(data) {
      dispatch({
        type: getEffectOrReducerByName('unBindWechat'),
        payload: data
      })
    }
  }
  const updateDatas = payload => {
    dispatch({
      type: getEffectOrReducerByName('updateDatas'),
      payload: payload
    })
  }
  return (
    <div>
      <div style={{ height: 48, width: 1152, margin: '0 auto' }}></div>
      <div
        style={{ width: 1152, margin: '0 auto' }}
        className={indexStyle.page_card_2}
      >
        <AccountSetMenu
          {...menuFormProps}
          updateDatas={updateDatas}
        ></AccountSetMenu>
      </div>
    </div>
  )
}

//  ??????????????????????????????state????????????UI ????????????props?????????????????????
function mapStateToProps({ modal, accountSet, loading }) {
  return { modal, model: accountSet, loading }
}
export default connect(mapStateToProps)(AccountSet)
