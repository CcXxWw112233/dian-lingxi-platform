// 资料库页面 

import React, { Component } from 'react'
import dataBaseStyles from './dataBase.less'

export default class DataBase extends Component {
    render() {
        return (
            <div className={dataBaseStyles.material}>
                <div className={dataBaseStyles.libraries}>
                    <div className={dataBaseStyles.img}></div>
                    <p>政策法规库</p>
                </div>
                <div className={dataBaseStyles.libraries}>
                    <div className={dataBaseStyles.img}></div>
                    <p>政策法规库</p>
                </div>
                <div className={dataBaseStyles.libraries}>
                    <div className={dataBaseStyles.img}></div>
                    <p>政策法规库</p>
                </div>
                <div className={dataBaseStyles.libraries}>
                    <div className={dataBaseStyles.img}></div>
                    <p>政策法规库</p>
                </div>
            </div>
        )
    }
}
