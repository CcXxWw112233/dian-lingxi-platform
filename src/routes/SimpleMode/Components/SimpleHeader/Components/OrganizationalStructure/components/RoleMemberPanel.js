import React from 'react'
import styles from './rolememberpanel.less'

/** 组织架构的右侧角色权限和成员列表
 * @description 用于展示组织架构的成员和权限列表
 */
export default class RoleMemberPanel extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    return <div className={styles.role_panel}>成员和权限</div>
  }
}
