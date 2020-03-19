import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import styles from './featurebox.less'
import globalStyles from '@/globalset/css/globalClassName.less'
import { timestampToTimeNormal, timeColor } from '../../../../../utils/util'
import { getOrgNameWithOrgIdFilter } from '../../../../../utils/businessFunction'

@connect(mapStateToProps)
export default class BoardFeaturesItem extends Component {
    static propTypes = {
        prop: PropTypes
    }

    itemClick = () => {
        const { dispatch, itemValue: { id = '', board_id = '', parent_id } } = this.props
        dispatch({
            type: 'publicTaskDetailModal/updateDatas',
            payload: {
                drawerVisible: true,
                card_id: parent_id || id,
            }
        })
        dispatch({
            type: 'workbenchPublicDatas/updateDatas',
            payload: {
                board_id
            }
        })
    }

    filterIcon = ({ rela_type }) => {
        let container = ''
        switch (rela_type) {
            case '1': //任务
                container = (
                    <span className={`${globalStyles.authTheme}`}>&#xe66a;</span>
                )
                break
            case '2': //日程
                container = (
                    <span className={`${globalStyles.authTheme}`}>&#xe68e;</span>
                )
                break
            case '3': //流程
                container = (
                    <span className={`${globalStyles.authTheme}`}>&#xe68c;</span>
                )
                break
            default:
                break
        }
        return container
    }
    filterIcon2 = ({ rela_type, is_realize }) => {
        let container = ''
        switch (rela_type) {
            case '1': //任务
                if (is_realize == '1') {
                    container = (
                        <span className={`${globalStyles.authTheme}`}>&#xe662;</span>
                    )
                } else {
                    container = (
                        <span className={`${globalStyles.authTheme}`}>&#xe661;</span>
                    )
                }

                break
            case '2': //日程
                container = (
                    <span className={`${globalStyles.authTheme}`}>&#xe84d;</span>
                )
                break
            case '3': //流程
                container = (
                    <span className={`${globalStyles.authTheme}`}>&#xe68b;</span>
                )
                break
            default:
                break
        }
        return container
    }
    filterTitle = ({ rela_type, parent_id }) => {
        let container = ''
        switch (rela_type) {
            case '1': //任务
                container = '任务'
                if (parent_id) {
                    container = '子任务'
                }
                break
            case '2': //日程
                container = '日程'

                break
            case '3': //流程
                container = '流程'
                break
            default:
                break
        }
        return container
    }
    renderTime = () => {
        const { itemValue: { rela_type, start_time, due_time, } } = this.props
        let time = ''
        let dec = ''
        if (!due_time && !start_time) {
            return {}
        }
        if (rela_type == '2') {
            return {
                time: timestampToTimeNormal(start_time, '/', true),
                dec: '开始'
            }

        } else {
            return {
                time: timestampToTimeNormal(due_time, '/', true),
                dec: '截止'
            }
        }
    }
    renderBelong = () => {
        const { currentSelectOrganize = {}, currentUserOrganizes, simplemodeCurrentProject = {}, itemValue = {} } = this.props
        let { board_name, org_id } = itemValue
        const isAllOrg = !currentSelectOrganize.id || currentSelectOrganize.id == '0'
        const isAllBoard = !simplemodeCurrentProject.board_id || simplemodeCurrentProject.board_id == '0'
        let org_name = ''
        if (isAllBoard) {
            board_name = `#${board_name}`
        } else {
            return ``
        }
        if (isAllOrg) {
            org_name = `(${getOrgNameWithOrgIdFilter(org_id, currentUserOrganizes)})`
        } else {
            org_name = ''
        }
        return `${board_name} ${org_name}`
    }
    render() {
        const { currentSelectOrganize = {}, currentUserOrganizes, simplemodeCurrentProject = {} } = this.props
        const isAllOrg = !currentSelectOrganize.id || currentSelectOrganize.id == '0'
        const isAllBoard = !simplemodeCurrentProject.board_id || simplemodeCurrentProject.board_id == '0'
        const { itemValue: { id, name, rela_type, start_time, due_time, org_id, is_realize, parent_id, parent_name, board_name } } = this.props
        const use_time = rela_type == '2' ? start_time : due_time
        const belong_name = this.renderBelong()
        console.log('belong_name', belong_name, !!belong_name)
        return (
            <div className={`${!!belong_name ? styles.feature_item2 : styles.feature_item}`} onClick={this.itemClick}>
                <div className={`${styles.feature_item_lf}`}>
                    {this.filterIcon({ rela_type })}
                    <span>{this.filterTitle({ rela_type, parent_id })}</span>
                </div>
                <div className={`${styles.feature_item_middle}  ${globalStyles.global_ellipsis}`}>
                    <div className={`${styles.feature_item_middle_name}  ${globalStyles.global_ellipsis}`}>
                        {this.filterIcon2({ rela_type, is_realize })}
                        <span>
                            {name}
                        </span>
                        <span>{(parent_id && parent_name) && `${parent_name}`}</span>
                    </div>
                    {/* {
                        isAllOrg && (
                            <div className={`${styles.feature_item_middle_orgname}  ${globalStyles.global_ellipsis}`}>
                                #{getOrgNameWithOrgIdFilter(org_id, currentUserOrganizes)}
                            </div>
                        )
                    } */}
                    {!!belong_name && (
                        <div className={`${styles.feature_item_middle_orgname} ${globalStyles.global_ellipsis}`} title={belong_name}>
                            {belong_name}
                        </div>
                    )}

                </div>
                <div className={`${styles.feature_item_rt}`} style={{ color: timeColor(use_time) }}> {this.renderTime().time} {this.renderTime().dec}</div>
            </div>
        )
    }
}
function mapStateToProps(
    {
        simplemode: {
            simplemodeCurrentProject
        },
        technological: {
            datas: { currentUserOrganizes, currentSelectOrganize = {} }
        },
    }) {
    return {
        simplemodeCurrentProject,
        currentUserOrganizes,
        currentSelectOrganize
    }
}