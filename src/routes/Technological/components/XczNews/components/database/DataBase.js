// 资料库页面 

import React, { Component } from 'react'
import { connect } from 'dva'
import dataBaseStyles from './dataBase.less'
import imgSrc from '@/assets/xczNews/laws.png'

@connect(({xczNews = []}) => ({
    xczNews, 
}))
export default class DataBase extends Component {
    render() {
        const { xczNews } = this.props;
        const { dataBase } = xczNews;
        // console.log(dataBase)
        // console.log(imgSrc)
        return (
            <div className={dataBaseStyles.material}>
                {
                    dataBase.map(item => {
                        return (
                            <div className={dataBaseStyles.libraries}>
                                <div className={dataBaseStyles.img}>
                                    <img src={imgSrc}/>
                                </div>
                                <p>{ item.name }</p>
                            </div>
                        )
                    })
                }
            </div>
        )
    }
}
