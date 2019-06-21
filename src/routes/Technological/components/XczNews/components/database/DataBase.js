// 资料库页面 

import React, { Component } from 'react'
import { connect } from 'dva'
import dataBaseStyles from './dataBase.less'
import imgSrc from '@/assets/xczNews/laws.png'
import SearchArticlesList from '../../common/SearchArticlesList'

@connect(({xczNews = []}) => ({
    xczNews, 
}))
export default class DataBase extends Component {

    // 点击操作
    handleClick(id, name) {
        const { dispatch } = this.props;
        dispatch({
            type: 'xczNews/updateDatas',
            payload: {
                dataBaseFlag: false,
            }
        })
        dispatch({
            type: 'xczNews/getHeaderSearch',
            payload: {
                category_ids: id,
            }
        })
    }

    render() {
        const { xczNews, location } = this.props;
        const { dataBase, dataBaseFlag, inputValue } = xczNews;
        // console.log(dataBase)
        // console.log(imgSrc)

        if(dataBaseFlag) {
            return (
                <div className={dataBaseStyles.material}>
                    {
                        dataBase.map(item => {
                            return (
                                <div 
                                    onClick={() => { this.handleClick(item.id, item.name) }}
                                    className={dataBaseStyles.libraries}>
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
        } else {
            return (
                <SearchArticlesList {...{location}} />
            )
        }

        
    }
}
