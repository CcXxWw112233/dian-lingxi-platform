import React, { Component } from 'react'
import styles from './index.less'
import globalStyles from '@/globalset/css/globalClassName.less'

import { Breadcrumb } from 'antd'
const BreadcrumbItem = Breadcrumb.Item

export default class FolderBread extends Component {

    constructor(props) {
        super(props)
        this.state = {
            folder_breads: [1, 2, 3, 4, 5, 6], //文件夹面包屑
        }
    }

    renderSeparator = () => {
        return (
            <span className={`${globalStyles.authTheme}`}>&#xe7ed;</span>
        )
    }

    render() {
       const { folder_breads = [] } = this.state

        return (
            <div>
                <Breadcrumb separator={'>'}>
                    {
                        folder_breads.map((item, index) => {
                            return (
                                <BreadcrumbItem>
                                   <span>{index}</span>
                                </BreadcrumbItem>
                            )
                        })
                    }
                </Breadcrumb>
            </div>
        )
    }
}
