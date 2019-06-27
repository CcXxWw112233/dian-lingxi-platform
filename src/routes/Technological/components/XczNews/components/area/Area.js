// 地区页面

import React, { Component } from 'react'
import { connect } from 'dva'
import areaStyles from './area.less'
import { Select, Input } from 'antd'
import globalStyles from '@/globalset/css/globalClassName.less'
import SearchArticlesList from '../../common/SearchArticlesList'

const { Option } = Select;
const Search = Input.Search;

@connect(({ xczNews = [] }) => ({
    xczNews,
}))
export default class Area extends Component {

    state = {
        click_more: false, // 是否显示展开更多城市列表 默认为flase
        click_more_text: false, // 控制文字展开还是显示全部内容 默认为false 展开全部内容
        select_active: false, // 控制选项的高亮效果
    }


     // handleProvinceChange 省级的选择
     handleProvinceChange(value) {
        const { dispatch, xczNews } = this.props;
        const { cityData = {}, defaultCityValue } = xczNews;
        dispatch({
            type: 'xczNews/updateDatas',
            payload: {
                provinceValue: value,
                defaultProvinceValue: value,
                defaultCityValue: 'cityTown',
                area_ids: value,
                defaultArr: [],
            }
        })
        dispatch({
            type: 'xczNews/getAreasArticles',
            payload: {

            }
        })
        console.log(value)
        // console.log(value)
    }


    // handleCityChange 市级的选择
    handleCityChange(value) {
        const { dispatch, xczNews } = this.props;
        const { defaultCityValue } = xczNews;
        dispatch({
            type: 'xczNews/updateDatas',
            payload: {
                cityValue: value,
                area_ids: value,
                defaultCityValue: value,
                defaultArr: []
            }
        })
        dispatch({
            type: 'xczNews/getAreasArticles',
            payload: {
                
            }
        })
    }

    // handleClickMore 点击展开更多城市列表 以及显示或者收起文字内容
    handleClickMore() {
        const { click_more, click_more_text } = this.state;
        this.setState({
            click_more: !click_more,
            click_more_text: !click_more_text
        })
    }

    // handleSelectCity 每一个省级地区的点击选择事件
    handleSelectProvinceCity(id) {
        // console.log(id)
        const { dispatch, xczNews } = this.props;
        dispatch({
            type: 'xczNews/updateDatas',
            payload: {
                area_ids: id,
                provinceValue: id,
                defaultProvinceValue: id,
                defaultArr: [],
            }
        })
        dispatch({
            type: 'xczNews/getAreasArticles',
            payload: {
                
            }
        })
    }

     // handleSelectCity 每一个市级地区的点击选择事件
     handleSelectCity(id, parentId) {
        console.log(parentId)
        const { dispatch } = this.props;
        dispatch({
            type: 'xczNews/updateDatas',
            payload: {
                area_ids: id,
                cityValue: id,
                defaultCityValue: id,
                defaultProvinceValue: parentId,
                provinceValue: parentId,
                defaultArr: [],
            }
        })
        dispatch({
            type: 'xczNews/getAreasArticles',
            payload: {
                
            }
        })
    }

     // renderSimpleInfo 未展开更多列表
     rendereSimpleInfo() {
        const { xczNews } = this.props;
        const { cityList = [], area_ids } = xczNews;
        return (
            <div className={areaStyles.ul} style={{ maxHeight: 180, overflow: 'hidden' }}>
                {
                    cityList && cityList.length && cityList.map(item => {
                        return (
                            <div className={areaStyles.li}>
                                <span className={areaStyles.province}>
                                    <b 
                                        onClick={ () => { this.handleSelectProvinceCity(item.id) } }
                                        className={`${areaStyles.a} ${ area_ids && item.id == area_ids && areaStyles.active}`} 
                                        id={item.id}>{item.name}</b>
                                </span>
                                <span className={areaStyles.downtown}>
                                    {
                                        item.child.map(key => {
                                            return (
                                                <b 
                                                    onClick={ () => { this.handleSelectCity(key.id, key.parent_id) } } 
                                                    className={`${areaStyles.a} ${ area_ids && key.id == area_ids && areaStyles.active}`} id={key.id}>{key.name}</b>
                                            )
                                        })
                                    }
                                </span>  
                            </div>
                        )
                    })
                    
                }
            </div>
        )
    }

    // renderAllInfo 展开全部列表
    renderAllInfo() {
        const { xczNews } = this.props;
        const { cityList = [], area_ids } = xczNews;
        return (
            <div className={areaStyles.ul}>
                {
                    cityList && cityList.length && cityList.map(item => {
                        return (
                            <div className={areaStyles.li}>
                                <span className={areaStyles.province}>
                                    <b 
                                        className={`${areaStyles.a} ${ area_ids && item.id == area_ids && areaStyles.active}`}
                                        onClick={ () => { this.handleSelectProvinceCity(item.id) } }>{item.name}</b>
                                </span>
                                <span className={areaStyles.downtown}>
                                    {
                                        item.child.map(key => {
                                            return (
                                                <b 
                                                    onClick={ () => { this.handleSelectCity(key.id) } } 
                                                    className={`${areaStyles.a} ${ area_ids && key.id == area_ids && areaStyles.active}`} id={key.id}>{key.name}</b>
                                            )
                                        })
                                    }
                                </span>  
                            </div>
                        )
                    })
                    
                }
            </div>
        )
    }

    // renderInfo
    renderInfo() {
        const { click_more } = this.state;
        return click_more ? this.renderAllInfo() : this.rendereSimpleInfo()
    }

    //未展开更多列表的文字内容
    renderMoreSimple() {
        return (
            <>
                <span onClick={ () => { this.handleClickMore() } }>展开城市列表</span>
                <div className={`${globalStyles.authTheme} ${areaStyles.down}`}>&#xe7ee;</div>
            </>
        )
    }

    // 展开更多城市列表，需要收起
    renderMoreBack() {
        return (
            <>
                <span onClick={ () => { this.handleClickMore() } }>收起城市列表</span>
                <div className={`${globalStyles.authTheme} ${areaStyles.down}`}>&#xe7ed;</div>
            </>
        )
    }

    // renderMoreText
    renderMoreText() {
        const { click_more_text } = this.state;
        return click_more_text ? this.renderMoreBack() : this.renderMoreSimple()
    }


    render() {
        const { xczNews, location } = this.props;
        const { cityList = [], provinceData = [], cityData = {}, provinceValue, cityValue, defaultCityValue, defaultProvinceValue } = xczNews;
        let cityValueArr = cityData && cityData[provinceValue];
        let select_city_key = Object.keys(cityData); // 拿到所有省级的id,
        // console.log(select_city_key)


        return (
            <React.Fragment>
                <div className={areaStyles["city_list"]}>
                    <div className={areaStyles.wrapper}>
                        <div className={areaStyles.choose}>
                        <Select
                            value={defaultProvinceValue} 
                            // defaultValue={defaultProvinceValue} 
                            onChange={(value) => { this.handleProvinceChange(value) }} 
                        >

                                <Option value="province" key="province" disabled>省份</Option>
                                {
                                    provinceData && provinceData.length && provinceData.map(item => {
                                        return (
                                            <Option value={item.id} key={item.id}>{item.name}</Option>
                                        )
                                    })
                                }

                            </Select>
                            <Select 
                                value={ defaultCityValue }
                                onChange={(value) => { this.handleCityChange(value, parentId) }}
                                disabled={ provinceValue ? false : true }
                            >
                                <Option value="cityTown" key="cityTown" disabled>城市</Option>
                            {
                                select_city_key.indexOf(provinceValue) !== -1 ? (
                                    cityValueArr.map(item => {
                                        return (
                                            <Option value={item.id} key={item.id}>{item.name}</Option>
                                        )
                                    })
                                ) : (
                                    <Option value="cityTown" key="cityTown" disabled>城市</Option>
                                )
                            
                            }
                            </Select>
                            <span className={`${globalStyles.authTheme} ${areaStyles.position}` }>&#xe669;</span>
                        </div>
                        <Search
                            placeholder="搜索地区"
                            onSearch={value => console.log(value)}
                            style={{ width: 147, height: 32 }}
                        />
                    </div>
                    <div className={areaStyles.areas}>
                        { this.renderInfo() }
                    </div>
                    <div className={areaStyles.mask}>
                        { this.renderMoreText() }
                    </div>
                </div>
                
                {/* 文章详情 */}
                <SearchArticlesList { ...{location} }/>
            
            </React.Fragment>
        )
    }
}
