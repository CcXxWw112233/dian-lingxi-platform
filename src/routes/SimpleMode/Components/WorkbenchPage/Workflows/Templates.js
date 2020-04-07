import React, { Component } from 'react'
import globalStyles from '@/globalset/css/globalClassName.less'
import styles from './index.less'
import { Tooltip, Button } from 'antd'

export default class Templates extends Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }
    renderTemplateList = () => {
        const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
        return (
            data.map(value => {
                return (
                    <div className={styles.template_item}>
                        <div className={styles.template_item_top}>
                            <div className={`${globalStyles.authTheme} ${styles.template_logo}`}>
                                &#xe682;
                            </div>
                            <div className={`${globalStyles.authTheme} ${styles.template_dec}`}>
                                <div className={`${styles.template_dec_title}`}>
                                    <span className={`${styles.template_dec_title_instance} `}>请假模板1请假模板2请假模板3请假模板4</span>
                                    <span className={`${styles.template_dec_title_org}`}>#组织名称真的很长很长，长到我也不知道么搞了</span>
                                </div>
                                <div className={`${styles.template_dec_step}`}>共三步骤</div>
                            </div>
                        </div>
                        <div className={styles.template_item_bott}>
                            <Tooltip title={'开始流程'}>
                                <div className={`${globalStyles.authTheme} ${styles.template_operate}`}>&#xe796;</div>
                            </Tooltip>
                            <Tooltip title={'编辑模板'}>
                                <div className={`${globalStyles.authTheme} ${styles.template_operate} ${styles.template_operate_split}`}>&#xe7e1;</div>
                            </Tooltip>
                            <Tooltip title={'删除模板'}>
                                <div className={`${globalStyles.authTheme} ${styles.template_operate}`}>&#xe7c3;</div>
                            </Tooltip>
                        </div>
                    </div>
                )
            })
        )
    }
    renderNodata = () => {
        return (
            <div className={styles.tempalte_nodata}>
                <div className={`${globalStyles.authTheme} ${styles.tempalte_nodata_logo}`} >&#xe703;</div>
                <div className={styles.tempalte_nodata_dec}>还没有模版，赶快新建一个吧</div>
                <div className={styles.tempalte_nodata_operate}>
                    <Button type="primary" style={{ width: 182 }} ghost>新建模板</Button>
                </div>
            </div>
        )
    }
    render() {
        return (
            <>
                <div className={styles.templates_top}>
                    <div className={`${styles.templates_top_title}`}>流程模板</div>
                    <div className={`${globalStyles.authTheme} ${styles.templates_top_add}`}>&#xe8fe;</div>
                </div>
                <div className={`${styles.templates_contain} ${globalStyles.global_vertical_scrollbar}`}>
                    {/* {this.renderTemplateList()} */}
                    {this.renderNodata()}
                </div>
            </>
        )
    }
}
