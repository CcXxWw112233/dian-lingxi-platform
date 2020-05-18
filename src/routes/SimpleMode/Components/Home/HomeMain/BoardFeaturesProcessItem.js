import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import styles from './featurebox.less'
import globalStyles from '@/globalset/css/globalClassName.less'

@connect(mapStateToProps)
export default class BoardFeaturesProcessItem extends Component {
    static propTypes = {
        prop: PropTypes
    }

    render() {
        return (
            <div className={`${styles.feature_item2}`}>
                <div className={`${styles.feature_item_lf}`}>
                    <span className={`${globalStyles.authTheme}`}>&#xe68c;</span>
                    <span>流程</span>
                </div>
                <div className={`${styles.feature_item_middle}  ${globalStyles.global_ellipsis}`}>
                    <div className={`${styles.feature_item_middle_name}  ${globalStyles.global_ellipsis}`}>
                        <span className={`${globalStyles.authTheme}`}>&#xe68b;</span>
                        <span>
                            我的天
                        </span>
                    </div>
                    <div className={`${styles.feature_item_middle_orgname} ${globalStyles.global_ellipsis}`} title={'#市民公园规划项目(聆悉设计院'}>
                      #市民公园规划项目(聆悉设计院）
                    </div>
                </div>
                <div className={`${styles.feature_item_rt}`} style={{ color: '#FAAD14' }}> 04/20 13:30 截止</div>
                <div className={styles.feature_item_reject}>被驳回</div>
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