import React, { Component } from 'react'
import indexStyles from './index.less'
import globalStyle from '@/globalset/css/globalClassName.less'
import { Button } from 'antd'
import { miletonesUserGuide } from '@/services/technological/gantt.js'
import { isApiResponseOk } from '../../../../../../utils/handleResponseData'
export default class index extends Component {

    constructor(props) {
        super(props)
        this.state = {
            not_show_create_guide: true
        }
    }

    componentDidMount() {
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
        const { not_show_create_guide } = this.state
        return (
            <div>
                {
                    not_show_create_guide ? (
                        <div></div>
                    ) : (
                            <div className={`${indexStyles.miletone_guide}`} >
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
