import React, { Component } from 'react'
import { connect } from 'dva/index'
import { Tabs, Menu } from 'antd'
import indexStyles from './index.less'
import ProjectRole from './ProjectRole'
import OrgnizationRole from './OrgnizationRole'
import BaseInfo from './BaseInfo'
import { getUrlQueryString } from '../../utils/util'
import NounDefinition from './NounDefinition'
import { ORGANIZATION, PROJECTS } from '../../globalset/js/constant'
import { currentNounPlanFilterName } from '../../utils/businessFunction'
import FnManagement from './FnManagement'
import ProjectTempleteScheme from './projectTempleteScheme/ProjectTempleteSchemeModal'
import globalStyles from '@/globalset/css/globalClassName.less'
import WorkFlowTemplete from './WorkFlowTemplete/index'
import CustomFields from './CustomFields'

const TabPane = Tabs.TabPane

const getEffectOrReducerByName = name => `organizationManager/${name}`

// const Organization = (options) => {
//   const { dispatch, model = {}, showBackBtn = true } = options
//   const { datas: { tabSelectKey } } = model
//   const updateDatas = (payload) => {
//     dispatch({
//       type: getEffectOrReducerByName('updateDatas'),
//       payload: payload
//     })
//   }

//   const routingJump = (path) => {
//     dispatch({
//       type: getEffectOrReducerByName('routingJump'),
//       payload: {
//         route: path,
//       }
//     })
//   }
//   const historyGoBack = () => {
//     // window.history.go(-1)
//     const nextPath = getUrlQueryString(window.location.href, 'nextpath')
//     // console.log(nextPath)
//     if (nextPath) {
//       routingJump(nextPath)
//     } else {
//       routingJump('/technological/workbench')
//       // window.history.go(-1)
//     }
//   }

//   const asyncProprs = {
//     model,
//     dispatch,
//     getFnManagementList(data) {
//       dispatch({
//         type: getEffectOrReducerByName('getFnManagementList'),
//         payload: data
//       })
//     },
//     setFnManagement(data) {
//       dispatch({
//         type: getEffectOrReducerByName('setFnManagement'),
//         payload: data
//       })
//     },
//     updateOrganization(data) {
//       dispatch({
//         type: getEffectOrReducerByName('updateOrganization'),
//         payload: data
//       })
//     },
//     uploadOrganizationLogo(data) {
//       dispatch({
//         type: getEffectOrReducerByName('uploadOrganizationLogo'),
//         payload: data
//       })
//     },
//     getRolePermissions(data) {
//       dispatch({
//         type: getEffectOrReducerByName('getRolePermissions'),
//         payload: data
//       })
//     },
//     saveRolePermission(data) {
//       dispatch({
//         type: getEffectOrReducerByName('saveRolePermission'),
//         payload: data
//       })
//     },
//     createRole(data) {
//       dispatch({
//         type: getEffectOrReducerByName('createRole'),
//         payload: data
//       })
//     },
//     updateRole(data) {
//       dispatch({
//         type: getEffectOrReducerByName('updateRole'),
//         payload: data
//       })
//     },
//     deleteRole(data) {
//       dispatch({
//         type: getEffectOrReducerByName('deleteRole'),
//         payload: data
//       })
//     },
//     copyRole(data) {
//       dispatch({
//         type: getEffectOrReducerByName('copyRole'),
//         payload: data
//       })
//     },
//     setDefaultRole(data) {
//       dispatch({
//         type: getEffectOrReducerByName('setDefaultRole'),
//         payload: data
//       })
//     },
//     savePermission(data) {
//       dispatch({
//         type: getEffectOrReducerByName('savePermission'),
//         payload: data
//       })
//     },
//     getPermissions(data) {
//       dispatch({
//         type: getEffectOrReducerByName('getPermissions'),
//         payload: data
//       })
//     },
//     getNounList(data) {
//       dispatch({
//         type: getEffectOrReducerByName('getNounList'),
//         payload: data
//       })
//     },
//     saveNounList(data) {
//       dispatch({
//         type: getEffectOrReducerByName('saveNounList'),
//         payload: data
//       })
//     },
//   }

//   const onTabClick = (key) => {
//     updateDatas({
//       tabSelectKey: key
//     })
//   }

//   const handleChangeNavStatus = ({ key }) => {
//     updateDatas({
//       tabSelectKey: key
//     })
//   }

//   // ?????????????????????????????????
//   const renderManagementNavList = () => {
//     return (
//       <Menu
//         selectedKeys={[tabSelectKey]}
//         onClick={handleChangeNavStatus}
//         getPopupContainer={triggerNode => triggerNode.parentNode} style={{ minWidth: '228px', textAlign: 'center' }}>
//         <Menu.Item key="1">????????????</Menu.Item>
//         <Menu.Item key="2">{`${currentNounPlanFilterName(ORGANIZATION)}??????`}</Menu.Item>
//         <Menu.Item key="3">{`${currentNounPlanFilterName(PROJECTS)}??????`}</Menu.Item>
//         <Menu.Item key="4">????????????</Menu.Item>
//         <Menu.Item key="5">????????????</Menu.Item>
//         <Menu.Item key="6">{`${currentNounPlanFilterName(PROJECTS)}????????????`}</Menu.Item>
//       </Menu>
//     )
//   }

//   const renderManagementContainer = () => {
//     let mainContent = (<div></div>)
//     switch (tabSelectKey) {
//       case '1':
//         mainContent = (<div><BaseInfo {...asyncProprs} updateDatas={updateDatas} /></div>)
//         break;
//       case '2':
//         mainContent = (<div><OrgnizationRole {...asyncProprs} updateDatas={updateDatas} /></div>)
//         break
//       case '3':
//         mainContent = (<div><ProjectRole {...asyncProprs} updateDatas={updateDatas} /></div>)
//         break
//       case '4':
//         mainContent = (<div><NounDefinition {...asyncProprs} updateDatas={updateDatas} /></div>)
//         break
//       case '5':
//         mainContent = (<div><FnManagement {...asyncProprs} updateDatas={updateDatas}></FnManagement></div>)
//         break
//       case '6':
//         mainContent = (<div><ProjectTempleteScheme /></div>)
//         break
//       default:
//         break;
//     }
//     return mainContent
//   }

//   return (
//     <div className={indexStyles.organizationOut}>
//       <div className={indexStyles.main}>
//         {
//           showBackBtn && (
//             <div className={indexStyles.back} onClick={historyGoBack}>
//               <Icon type="left" theme="outlined" />??????
//           </div>
//           )}
//         <div className={indexStyles.orgManagementWrapper}>
//           {/* ???????????? */}
//           <div className={indexStyles.org_managementNav}>
//             {renderManagementNavList()}
//           </div>
//           {/* ???????????? */}
//           <div className={`${indexStyles.org_managementContainer} ${globalStyles.global_vertical_scrollbar}`}>
//             {renderManagementContainer()}
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// };

class Organization extends Component {
  componentDidMount() {
    const session_tab_key = window.sessionStorage.getItem(
      'orgManagerTabSelectKey'
    )
    if (session_tab_key) {
      this.updateDatas({ tabSelectKey: session_tab_key })
      window.sessionStorage.removeItem('orgManagerTabSelectKey')
    }
  }

  routingJump = path => {
    this.props.dispatch({
      type: getEffectOrReducerByName('routingJump'),
      payload: {
        route: path
      }
    })
  }

  historyGoBack = () => {
    // window.history.go(-1)
    const nextPath = getUrlQueryString(window.location.href, 'nextpath')
    // console.log(nextPath)
    if (nextPath) {
      this.routingJump(nextPath)
    } else {
      this.routingJump('/technological/workbench')
      // window.history.go(-1)
    }
  }

  updateDatas = payload => {
    this.props.dispatch({
      type: getEffectOrReducerByName('updateDatas'),
      payload: payload
    })
  }

  onTabClick = key => {
    this.updateDatas({
      tabSelectKey: key
    })
  }

  handleChangeNavStatus = ({ key }) => {
    this.updateDatas({
      tabSelectKey: key
    })
  }

  // ?????????????????????????????????
  renderManagementNavList = () => {
    const { model = {}, currentUserOrganizes = [] } = this.props
    const {
      datas: { tabSelectKey }
    } = model
    const org_id = localStorage.getItem('OrganizationId')
    const { apply_scenes } =
      currentUserOrganizes.find(item => item.id == org_id) || {}
    return (
      <Menu
        selectedKeys={[tabSelectKey]}
        onClick={this.handleChangeNavStatus}
        getPopupContainer={triggerNode => triggerNode.parentNode}
        style={{ minWidth: '228px', textAlign: 'center' }}
      >
        <Menu.Item key="1">????????????</Menu.Item>
        {/* <Menu.Item key="2">{`${currentNounPlanFilterName(
          ORGANIZATION
        )}??????`}</Menu.Item> */}
        <Menu.Item key="3">{`${currentNounPlanFilterName(
          PROJECTS
        )}??????`}</Menu.Item>
        <Menu.Item key="4">????????????</Menu.Item>
        {/* <Menu.Item key="5">????????????</Menu.Item> */}
        {/* <Menu.Item key="6">{`${currentNounPlanFilterName(PROJECTS)}??????`}</Menu.Item> */}
        {apply_scenes == '0' && <Menu.Item key="6">{`????????????`}</Menu.Item>}
        <Menu.Item key="7">{`???????????????`}</Menu.Item>
        <Menu.Item key="8">{`???????????????`}</Menu.Item>
      </Menu>
    )
  }

  renderManagementContainer = () => {
    const { model, dispatch } = this.props
    const {
      datas: { tabSelectKey }
    } = model
    const asyncProprs = {
      model,
      dispatch,
      getFnManagementList(data) {
        dispatch({
          type: getEffectOrReducerByName('getFnManagementList'),
          payload: data
        })
      },
      setFnManagement(data) {
        dispatch({
          type: getEffectOrReducerByName('setFnManagement'),
          payload: data
        })
      },
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
      },
      saveNounList(data) {
        dispatch({
          type: getEffectOrReducerByName('saveNounList'),
          payload: data
        })
      }
    }
    let mainContent = <div></div>
    switch (tabSelectKey) {
      case '1':
        mainContent = (
          <div>
            <BaseInfo {...asyncProprs} updateDatas={this.updateDatas} />
          </div>
        )
        break
      case '2':
        mainContent = (
          <div>
            <OrgnizationRole {...asyncProprs} updateDatas={this.updateDatas} />
          </div>
        )
        break
      case '3':
        mainContent = (
          <div>
            <ProjectRole {...asyncProprs} updateDatas={this.updateDatas} />
          </div>
        )
        break
      case '4':
        mainContent = (
          <div>
            <NounDefinition {...asyncProprs} updateDatas={this.updateDatas} />
          </div>
        )
        break
      case '5':
        mainContent = (
          <div>
            <FnManagement
              {...asyncProprs}
              updateDatas={this.updateDatas}
            ></FnManagement>
          </div>
        )
        break
      case '6':
        mainContent = (
          <div>
            <ProjectTempleteScheme />
          </div>
        )
        break
      case '7':
        mainContent = (
          <div>
            <WorkFlowTemplete />
          </div>
        )
        break
      case '8':
        mainContent = (
          <div>
            <CustomFields />
          </div>
        )
        break
      default:
        break
    }
    return mainContent
  }

  render() {
    const { showBackBtn = true } = this.props
    const height = document.getElementById('org_managementContainer')
      ? document.getElementById('org_managementContainer').offsetHeight
      : ''
    return (
      <div id={'organizationOut'} className={indexStyles.organizationOut}>
        <div className={indexStyles.main}>
          {/* {showBackBtn && (
            <div className={indexStyles.back} onClick={this.historyGoBack}>
              <Icon type="left" theme="outlined" />
              ??????
            </div>
          )} */}
          <div className={indexStyles.orgManagementWrapper}>
            {/* ???????????? */}
            <div
              className={indexStyles.org_managementNav}
              style={{ height: height / 2 - 100 + 'px' }}
            >
              {this.renderManagementNavList()}
            </div>
            {/* ???????????? */}
            <div
              id={'org_managementContainer'}
              className={`${indexStyles.org_managementContainer} ${globalStyles.global_vertical_scrollbar}`}
            >
              {this.renderManagementContainer()}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps({
  modal,
  organizationManager,
  loading,
  technological: {
    datas: { currentUserOrganizes = [] }
  }
}) {
  return { modal, model: organizationManager, loading, currentUserOrganizes }
}
export default connect(mapStateToProps)(Organization)
