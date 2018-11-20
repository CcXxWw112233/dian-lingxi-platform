import React from 'react';
import {connect} from "dva/index";
import { Icon, Tabs } from 'antd'
import indexStyles from './index.less'
import { color_4 } from '../../globalset/js/styles'
import ProjectRole from './ProjectRole'
import OrgnizationRole from './OrgnizationRole'
import BaseInfo from './BaseInfo'
import { getUrlQueryString } from '../../utils/util'
import NounDefinition from "./NounDefinition";

const  TabPane = Tabs.TabPane

const getEffectOrReducerByName = name => `organization/${name}`

const Organization = (options) => {
  const { dispatch, model = {} } = options
  const { datas: { tabSelectKey }} = model
  const updateDatas = (payload) => {
    dispatch({
      type: getEffectOrReducerByName('updateDatas') ,
      payload:payload
    })
  }
  const routingJump = (path) => {
    dispatch({
      type: getEffectOrReducerByName('routingJump') ,
      payload:{
        route:path,
      }
    })
  }
  const historyGoBack = () => {
    // window.history.go(-1)
    const nextPath = getUrlQueryString(window.location.href, 'nextpath')
    console.log(nextPath)
    routingJump(nextPath)
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
    savePermission(data) {
      dispatch({
        type: getEffectOrReducerByName('savePermission'),
        payload: data
      })
    },
    getPermissions(data) {
      dispatch({
        type: getEffectOrReducerByName('getPermissions'),
        payload: data
      })
    },
    getNounList(data) {
      dispatch({
        type: getEffectOrReducerByName('getNounList'),
        payload: data
      })
    }
  }
  const onTabClick = (key)=>{
    updateDatas({
      tabSelectKey: key
    })
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
            <Tabs defaultActiveKey="1" size='small' tabBarGutter={60} activeKey={tabSelectKey} onTabClick={onTabClick}>
              <TabPane tab="基本信息" key="1">
                 <BaseInfo {...asyncProprs} updateDatas={updateDatas} />
              </TabPane>
              <TabPane tab="组织角色" key="2">
                <OrgnizationRole {...asyncProprs} updateDatas={updateDatas} />
                {/*<RoleTabPaneContent {...asyncProprs} updateDatas={updateDatas}/>*/}
              </TabPane>
              <TabPane tab="项目角色" key="3">
                <ProjectRole {...asyncProprs} updateDatas={updateDatas}/>
                {/*<AuthTabPaneContent {...asyncProprs} updateDatas={updateDatas}/>*/}
              </TabPane>
              {/*<TabPane tab="名词定义" key="4">*/}
                {/*<NounDefinition {...asyncProprs} updateDatas={updateDatas}/>*/}
              {/*</TabPane>*/}
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
