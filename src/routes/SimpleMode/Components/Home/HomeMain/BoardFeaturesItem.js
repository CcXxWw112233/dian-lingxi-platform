import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import styles from './featurebox.less'
import globalStyles from '@/globalset/css/globalClassName.less'
import { timestampToTimeNormal } from '../../../../../utils/util'

@connect(mapStateToProps)
export default class BoardFeaturesItem extends Component {
    static propTypes = {
        prop: PropTypes
    }

    filterIcon = ({ type }) => {
        let container = ''
        switch (type) {
            case '0': //任务
                container = (
                    <span className={`${globalStyles.authTheme}`}>&#xe66a;</span>
                )
                break
            case '1': //日程
                container = (
                    <span className={`${globalStyles.authTheme}`}>&#xe68e;</span>
                )
                break
            case '2': //流程
                container = (
                    <span className={`${globalStyles.authTheme}`}>&#xe68c;</span>
                )
                break
            default:
                break
        }
        return container
    }
    filterIcon2 = ({ type, is_realize }) => {
        let container = ''
        switch (type) {
            case '0': //任务
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
            case '1': //日程
                container = (
                    <span className={`${globalStyles.authTheme}`}>&#xe84d;</span>
                )
                break
            case '2': //流程
                container = (
                    <span className={`${globalStyles.authTheme}`}>&#xe68b;</span>
                )
                break
            default:
                break
        }
        return container
    }
    render() {
        const { currentSelectOrganize = {} } = this.props
        const isAllOrg = !currentSelectOrganize.id || currentSelectOrganize.id == '0'
        const type = '0'
        const is_realize = '1'
        return (
            <div className={`${isAllOrg ? styles.feature_item2 : styles.feature_item}`}>
                <div className={`${styles.feature_item_lf}`}>
                    {/* <span className={`${globalStyles.authTheme}`}>&#xe66a;</span> */}
                    {this.filterIcon({ type })}
                    <span>日程</span>
                </div>
                <div className={`${styles.feature_item_middle}  ${globalStyles.global_ellipsis}`}>
                    <div className={`${styles.feature_item_middle_name}  ${globalStyles.global_ellipsis}`}>
                        {/* <span className={`${globalStyles.authTheme}`}> &#xe661;</span> */}
                        {this.filterIcon2({ type, is_realize })}
                        <span className={`${globalStyles.global_ellipsis}`}>开会讨论收购亚马逊具体事宜</span>
                    </div>
                    {
                        isAllOrg && (
                            <div className={`${styles.feature_item_middle_orgname}  ${globalStyles.global_ellipsis}`}>
                                #这是一个组织
                            </div>
                        )
                    }
                </div>
                <div className={`${styles.feature_item_rt}`}> {timestampToTimeNormal(new Date().getTime(), '/', true)}</div>
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