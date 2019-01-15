import React from 'react'
import indexStyle from './index.less'
import { Icon, Menu, Dropdown, Tooltip } from 'antd'
import {PROJECTS} from "../../../../globalset/js/constant";
import {currentNounPlanFilterName} from "../../../../utils/businessFunction";
import EditCardDrop from './HeaderComponent/EditCardDrop'
import globalStyles from '../../../../globalset/css/globalClassName.less'

export default class Header extends React.Component {
  state = {
    visibleEdit: false,
  }
  onVisibleChangeEdit(bool) {
    this.setState({
      visibleEdit: bool
    })
  }
  render() {
    const { visibleEdit } = this.state
    const menu = (
      <Menu>
        <Menu.Item key={'1'}>
          全部{currentNounPlanFilterName(PROJECTS)}
        </Menu.Item>
        <Menu.Item key={'2'} disabled>
          <Tooltip placement="top" title={'即将上线'}>
            已归档{currentNounPlanFilterName(PROJECTS)}
          </Tooltip>
        </Menu.Item>
      </Menu>
    );
    const menu_2 = (
      <Menu>
        <Menu.Item key={'1'}>
          按{currentNounPlanFilterName(PROJECTS)}排序
        </Menu.Item>
        <Menu.Item key={'2'} disabled>
          <Tooltip placement="top" title={'即将上线'}>
            按起止时间排序
          </Tooltip>
        </Menu.Item>
        <Menu.Item key={'3'} disabled>
          <Tooltip placement="top" title={'即将上线'}>
            按状态排序
          </Tooltip>
        </Menu.Item>
        <Menu.Item key={'4'} disabled>
          <Tooltip placement="top" title={'即将上线'}>
            手动排序
          </Tooltip>
        </Menu.Item>
      </Menu>
    );
    return (
      <div className={indexStyle.headerOut}>

        <div className={indexStyle.left}>
          <Dropdown visible={visibleEdit}
                    // trigger={['click']}
                    onVisibleChange={this.onVisibleChangeEdit.bind(this)}
                    overlay={<EditCardDrop {...this.props} visibleEdit={visibleEdit}/>}>
          <div>编辑卡片 <i className={globalStyles.authTheme}>&#xe6ca;</i></div>
          </Dropdown>
        </div>

        {/*<div className={indexStyle.right}>*/}
          {/*/!*<div style={{marginRight: 12}}>按{currentNounPlanFilterName(PROJECTS)}排序 <Icon type="down"  style={{fontSize:14,color:'#595959'}}/></div>*!/*/}
          {/*/!*<div>全部{currentNounPlanFilterName(PROJECTS)} <Icon type="down"  style={{fontSize:14,color:'#595959'}}/></div>*!/*/}
          {/*<div>全部项目  <Icon type="down"  style={{fontSize:14,color:'#595959'}}/></div>*/}
          {/*<Icon type="appstore-o" style={{fontSize:14,marginTop:18,marginLeft:16}}/>*/}
        {/*</div>*/}
      </div>
    )
  }
}
