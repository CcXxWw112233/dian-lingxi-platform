import React from 'react';
import {connect} from "dva/index";
import { Icon, Tabs } from 'antd'
import indexStyles from './index.less'
import { color_4 } from '../../globalset/js/styles'
import AuthTabPaneContent from './AuthTabPaneContent'
import RoleTabPaneContent from './RoleTabPaneContent'
import BaseInfo from './BaseInfo'

const  TabPane = Tabs.TabPane

const getEffectOrReducerByName = name => `organization/${name}`

const Organization = (options) => {
  const { dispatch, model } = options
  const updateDatas = (payload) => {
    dispatch({
      type: getEffectOrReducerByName('updateDatas') ,
      payload:payload
    })
  }
  const historyGoBack = () => {
    window.history.go(-1)
  }

  const asyncProprs = {
    model,
    updateOrganization(data) {
      dispatch({
        type: getEffectOrReducerByName('updateOrganization'),
        payload: data
      })
    },
    uploadOrganizationLogo(data) {
      dispatch({
        type: getEffectOrReducerByName('uploadOrganizationLogo'),
        payload: data
      })
    },
    getRolePermissions(data) {
      dispatch({
        type: getEffectOrReducerByName('getRolePermissions'),
        payload: data
      })
    },
    saveRolePermission(data) {
      dispatch({
        type: getEffectOrReducerByName('saveRolePermission'),
        payload: data
      })
    },
    createRole(data) {
      dispatch({
        type: getEffectOrReducerByName('createRole'),
        payload: data
      })
    },
    updateRole(data) {
      dispatch({
        type: getEffectOrReducerByName('updateRole'),
        payload: data
      })
    },
    deleteRole(data) {
      dispatch({
        type: getEffectOrReducerByName('deleteRole'),
        payload: data
      })
    },
    copyRole(data) {
      dispatch({
        type: getEffectOrReducerByName('copyRole'),
        payload: data
      })
    },
    setDefaultRole(data) {
      dispatch({
        type: getEffectOrReducerByName('setDefaultRole'),
        payload: data
      })
    },
  }

  return(
    <div className={indexStyles.organizationOut}>
      <div className={indexStyles.main}>
        <div className={indexStyles.back} onClick={historyGoBack}>
          <Icon type="left" theme="outlined" />返回
        </div>
        <div className={indexStyles.topTitle}>
          <Icon type="home" theme="outlined"  style={{color: color_4,fontSize: 32}} />
          <div className={indexStyles.titleName}>组织管理后台</div>
          {/*tabs 页*/}
          <div className={indexStyles.tabsOut}>
            <Tabs defaultActiveKey="1" size='small' tabBarGutter={60} defaultActiveKey={'2'}>
              <TabPane tab="基本信息" key="1">
                 <BaseInfo {...asyncProprs} updateDatas={updateDatas} />
              </TabPane>
              <TabPane tab="角色管理" key="2">
                <RoleTabPaneContent {...asyncProprs} updateDatas={updateDatas}/>
              </TabPane>
              <TabPane tab="权限管理" key="3">
                <AuthTabPaneContent {...asyncProprs} updateDatas={updateDatas}/>
              </TabPane>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
};

function mapStateToProps({ modal, organization, loading }) {
  return { modal, model: organization, loading }
}
export default connect(mapStateToProps)(Organization)
