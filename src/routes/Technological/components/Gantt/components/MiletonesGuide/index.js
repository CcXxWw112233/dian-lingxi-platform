import React, { Component } from 'react'
import indexStyles from './index.less'
import globalStyle from '@/globalset/css/globalClassName.less'
import { Button } from 'antd'
import { miletonesUserGuide } from '@/services/technological/gantt.js'
import { isApiResponseOk } from '../../../../../../utils/handleResponseData'
import { connect } from 'dva'

@connect(({ technological: { datas: {
    gantt_board_id
} } }) => ({ gantt_board_id }))
export default class index extends Component {

    constructor(props) {
        super(props)
        this.state = {
            not_show_create_guide: true,
            position_type: '0', // 0/1 极简模式/工作台
        }
    }

    componentDidMount() {
        this.miletonesUserGuide()
        this.setPositionType()
    }

    setPositionType = () => {
        if (window.location.hash.indexOf('/technological/simplemode') == -1) {
            this.setState({
                position_type: 1
            })
        }
    }

    miletonesUserGuide = () => {
        miletonesUserGuide().then(res => {
            if (isApiResponseOk(res)) {
                this.setState({
                    not_show_create_guide: res.data
                })
            }
        })
    }
    quit = () => {
        this.setState({
            not_show_create_guide: true
        })
    }

    render() {
        const { not_show_create_guide, position_type } = this.state
        return (
            <div>
                {
                    not_show_create_guide ? (
                        <div></div>
                    ) : (
                            <div className={`${indexStyles.miletone_guide} ${position_type == '0' ? indexStyles.position_1 : indexStyles.position_2}`} >
                                <div className={indexStyles.top}>
                                    <div className={`${globalStyle.authTheme} ${indexStyles.smile}`}>&#xe847;</div>
                                    <div className={indexStyles.title}>点击日期可以建立里程碑</div>
                                </div>
                                <div className={indexStyles.bottom}>
                                    <Button type={'primary'} size={'small'} onClick={this.quit} >我知道了</Button>
                                </div>
                                <div className={indexStyles.triangle}></div>
                            </div>
                        )
                }
            </div>
        )
    }
}
