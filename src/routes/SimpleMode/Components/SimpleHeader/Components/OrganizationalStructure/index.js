import React from 'react'
import styles from './index.less'
import globalStyles from '../../../../../../globalset/css/globalClassName.less'
import ReactDOM from 'react-dom'
import 'animate.css'
import { connect } from 'dva'
import { OrgStructureModel } from '../../../../../../models/technological/orgStructure'
import OrgStructureCanvas from './components/OrgStructureCanvas'
import RoleMemberPanel from './components/RoleMemberPanel'
import PropTypes from 'prop-types'

/** 组织架构组件
 * @description 用于展示组织架构成员和权限列表，组织架构图
 */
@connect(({ [OrgStructureModel.namespace]: { openPanel } }) => ({
  openPanel
}))
export default class OrganizationalStructure extends React.Component {
  /** props状态的管理，说明来源 */
  static propTypes = {
    /** 是否显示组织架构页面的成员和权限窗口
     * @description 来源是redux
     */
    openPanel: PropTypes.bool
  }

  constructor(props) {
    super(props)
    this.state = {}
  }
  componentDidMount() {
    this.getOrgPermissions()
    this.getRolePermissionsAndMenber()
  }

  /**
   * 组织菜单、功能权限列表
   */
   getOrgPermissions () {
    const {dispatch} = this.props;
    dispatch({
      type: [
        OrgStructureModel.namespace,
        'getOrgPermissions'
      ].join('/'),
      payload: {
      }
    })
   }
   /** 角色信息（包括权限，成员）*/
   getRolePermissionsAndMenber() {
    const {dispatch} = this.props;
    dispatch({
      type: [
        OrgStructureModel.namespace,
        'getRolePermissionsAndMenber'
      ].join('/'),
      payload: {
        org_id:localStorage.getItem('OrganizationId'),
        role_id:'1367020999064817664'
      }
    })
   }

  componentWillUnmount() {}

  backHome = () => {
    const { dispatch } = this.props
    dispatch({
      type: [
        OrgStructureModel.namespace,
        OrgStructureModel.reducers.updateDatas
      ].join('/'),
      payload: {
        openPanel: false
      }
    })
  }

  render() {
    /** 是否显示右侧角色窗口 */
    const { openPanel } = this.props
    return ReactDOM.createPortal(
      <div
        className={`${styles.container} animate_animated animate__fadeInRight animate__faster`}
      >
        <div className={styles.top_operations}>
          <span
            className={`${styles.backBtn} ${globalStyles.authTheme}`}
            onClick={() => this.backHome()}
          >
            &#xe7d7;
          </span>
        </div>

        <OrgStructureCanvas />
        {openPanel && <RoleMemberPanel getRolePermissionsAndMenber={()=>this.getRolePermissionsAndMenber()}></RoleMemberPanel>}
      </div>,
      document.body
    )
  }
}
