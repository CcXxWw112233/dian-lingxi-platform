import React, { Component } from 'react'
import { connect } from 'dva'
import BoardFeaturesItem from './BoardFeaturesItem'
import globalStyles from '@/globalset/css/globalClassName.less'
import styles from './featurebox.less'

@connect(mapStateToProps)
export default class BoardFeatures extends Component {
    render() {
        const { board_statics_list = [] } = this.props
        return (
            <div>
                {
                    board_statics_list.length ? (
                        board_statics_list.map(value => {
                            return (
                                <BoardFeaturesItem itemValue={value} />
                            )
                        })
                    ) : (
                            <div className={`${globalStyles.authTheme} ${styles.nodataArea}`}>
                                <div className={`${globalStyles.authTheme} ${styles.alarm}`}>&#xe6fb;</div>
                                <div className={`${styles.title}`}>暂无待办事项</div>
                            </div>
                        )
                }
                <div className={styles.feature_item}></div>
            </div>
        )
    }
}

//  建立一个从（外部的）state对象到（UI 组件的）props对象的映射关系
function mapStateToProps(
    {
        simplemode: {
            simplemodeCurrentProject,
            board_statics_list
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