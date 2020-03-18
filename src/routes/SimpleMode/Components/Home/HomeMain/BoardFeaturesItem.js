import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import styles from './featurebox.less'
import globalStyles from '@/globalset/css/globalClassName.less'
import { timestampToTimeNormal } from '../../../../../utils/util'
import { getOrgNameWithOrgIdFilter } from '../../../../../utils/businessFunction'

@connect(mapStateToProps)
export default class BoardFeaturesItem extends Component {
    static propTypes = {
        prop: PropTypes
    }

    itemClick = () => {
        const { dispatch, itemValue: { id = '1240203412201672704', board_id = '1240196786681942016' } } = this.props
        dispatch({
            type: 'publicTaskDetailModal/updateDatas',
            payload: {
                drawerVisible: true,
                card_id: id,
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
    filterTitle = ({ rela_type }) => {
        let container = ''
        switch (rela_type) {
            case '1': //任务
                container = '任务'
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
    render() {
        const { currentSelectOrganize = {}, currentUserOrganizes } = this.props
        const isAllOrg = !currentSelectOrganize.id || currentSelectOrganize.id == '0'
        const { itemValue: { id, name, rela_type, start_time, due_time, org_id, is_realize } } = this.props

        return (
            <div className={`${isAllOrg ? styles.feature_item2 : styles.feature_item}`} onClick={this.itemClick}>
                <div className={`${styles.feature_item_lf}`}>
                    {/* <span className={`${globalStyles.authTheme}`}>&#xe66a;</span> */}
                    {this.filterIcon({ rela_type })}
                    <span>{this.filterTitle({ rela_type })}</span>
                </div>
                <div className={`${styles.feature_item_middle}  ${globalStyles.global_ellipsis}`}>
                    <div className={`${styles.feature_item_middle_name}  ${globalStyles.global_ellipsis}`}>
                        {/* <span className={`${globalStyles.authTheme}`}> &#xe661;</span> */}
                        {this.filterIcon2({ rela_type, is_realize })}
                        <span className={`${globalStyles.global_ellipsis}`}>{name}</span>
                    </div>
                    {
                        isAllOrg && (
                            <div className={`${styles.feature_item_middle_orgname}  ${globalStyles.global_ellipsis}`}>
                                #{getOrgNameWithOrgIdFilter(org_id, currentUserOrganizes)}
                            </div>
                        )
                    }
                </div>
                <div className={`${styles.feature_item_rt}`}> {this.renderTime().time} {this.renderTime().dec}</div>
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