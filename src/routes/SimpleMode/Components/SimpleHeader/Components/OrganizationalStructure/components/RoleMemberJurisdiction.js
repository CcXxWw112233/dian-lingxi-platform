import React from 'react'
import styles from './rolememberjurisdiction.less'
import globalStyles from '../../../../../../../globalset/css/globalClassName.less'
import { connect } from 'dva'
import { OrgStructureModel } from '../../../../../../../models/technological/orgStructure'
import { Tree } from 'antd'
const getEffectOrReducerByName = name => `organizationManager/${name}`

@connect(
  ({
    [OrgStructureModel.namespace]: { orgPermissionsList, currentPermissionList }
  }) => ({
    orgPermissionsList,
    currentPermissionList
  })
)
/** 组织架构的右侧角色权限列表
 * @description 用于展示组织架构权限列表
 */
export default class RoleMemberJurisdiction extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  /**
   * 选择权限 key 参数
   */
  selectJurisdiction = key => {
    console.log('选择权限', key)
  }
  /**
   * 保存用户权限
   * @param {*} checkedKeys  权限Id
   * @param {*} e
   */
  onCheck(checkedKeys, e) {
    console.log(checkedKeys.checked)

    const { dispatch, role_id } = this.props
    var data = {
      box_type_ids: '',
      function_data: checkedKeys.checked,
      role_id: role_id
    }
    dispatch({
      type: [OrgStructureModel.namespace, 'savePermission'].join('/'),
      payload: data
    })
  }

  render() {
    const {
      orgPermissionsList = [],
      currentPermissionList,
      canHandle
    } = this.props
    const { TreeNode } = Tree
    return (
      <div
        className={styles.role_Jurisdiction}
        style={{
          overflowY: 'auto',
          position: 'relative'
        }}
      >
        {/* {
            jurisdictionList.map((item,key) => {
                return <div className={styles.role_Jurisdiction_contant}>
                    <div className={`${styles.role_Jurisdiction_icon}`}>
                        <span
                        className={`${styles.role_Jurisdiction_unselect_icon} ${globalStyles.authTheme}`}
                        onClick={this.selectJurisdiction.bind(this, key)}
                        >
                        &#xe661;
                        </span>
                    </div>
                    <span className={`${styles.role_Jurisdiction_title}`}>{item}</span>
                </div>
            })
        } */}
        <Tree
          checkable
          checkStrictly={true}
          // defaultExpandedKeys={[]}
          defaultSelectedKeys={currentPermissionList}
          defaultCheckedKeys={currentPermissionList}
          onSelect={this.onSelect}
          onCheck={this.onCheck.bind(this)}
        >
          {orgPermissionsList.map((item, key) => {
            const child_data = item['child_data'] || []
            return (
              <TreeNode
                disableCheckbox
                title={
                  <span className={`${styles.role_Jurisdiction_title}`}>
                    {item.name}
                  </span>
                }
                key={item.id + '_' + key}
              >
                {child_data.map((value, key) => {
                  return (
                    <TreeNode
                      disableCheckbox={!canHandle}
                      title={
                        <span className={`${styles.role_Jurisdiction_title}`}>
                          {value.name}
                        </span>
                      }
                      key={value.id}
                    ></TreeNode>
                  )
                })}
              </TreeNode>
            )
          })}
        </Tree>
      </div>
    )
  }
}
