import React, { Component } from 'react'
import ContentFilter from './components/contentFilter'
import { Dropdown } from 'antd'
import indexStyles from './index.less'
import { connect } from 'dva'
import globalStyles from  '@/globalset/css/globalClassName.less'
@connect(mapStateToProps)
export default class GroupListHeadSet extends Component {
    constructor(props) {
        super(props)
        this.state = {
           dropdownVisible: false
        }
    }

    setGroupViewType = (group_view_type_new) => {
        const { dispatch, group_view_type } = this.props
        if(group_view_type == group_view_type_new) {
            return
        }
        dispatch({
            type: 'gantt/updateDatas',
            payload: {
                group_view_type: group_view_type_new
            }
        })
    }
    onVisibleChange = (bool) => {
        this.setDropdownVisible(bool)
    }
    setDropdownVisible = (bool) => {
        this.setState({
            dropdownVisible: bool
        })
    }
    render() {
        const { dropdownVisible } = this.state
        const { target_scrollLeft, target_scrollTop, group_view_type='0' } = this.props
        const selected = `${indexStyles.button_nomal_background} ${indexStyles.type_select}`
        return (
            <div className={indexStyles.groupHeadSet} style={{ left: target_scrollLeft, top: target_scrollTop}}>
                <div className={indexStyles.set_content}>
                   <div className={indexStyles.set_content_left}>
                      <div onClick={() => this.setGroupViewType('0')} className={`${indexStyles.set_content_left_left} ${globalStyles.authTheme} ${group_view_type == '0' && selected}`}>&#xe604;</div>
                      <div onClick={() => this.setGroupViewType('1')} className={`${indexStyles.set_content_left_right} ${globalStyles.authTheme}  ${group_view_type == '1' && selected}`}>&#xe7b2;</div>
                   </div>
                   <Dropdown
                         overlay={<ContentFilter  dropdownVisible={dropdownVisible} setDropdownVisible={this.setDropdownVisible} />} 
                         trigger={['click']} 
                         visible={dropdownVisible}
                         onVisibleChange={this.onVisibleChange}>
                        <div className={indexStyles.set_content_right}>
                            <div className={`${indexStyles.set_content_right_left} ${globalStyles.authTheme}`}>&#xe8bd;</div>
                            <div className={`${indexStyles.set_content_right_middle} ${globalStyles.authTheme}`}>内容过滤</div>
                            <div className={`${indexStyles.set_content_left_right} ${globalStyles.authTheme}`}>&#xe7ee;</div>
                        </div>
                   </Dropdown>
                </div>
            </div>
        )
    }
}
function mapStateToProps({ gantt: { datas: { target_scrollLeft = [], target_scrollTop = [], group_view_type } }, }) {
    return { target_scrollLeft, target_scrollTop, group_view_type }
}
