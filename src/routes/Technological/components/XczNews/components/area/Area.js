// 地区页面

import React, { Component } from 'react'
import areaStyles from './area.less'
import { Select, Input } from 'antd';
import globalStyles from '@/globalset/css/globalClassName.less'

const { Option } = Select;
const Search = Input.Search;

export default class Area extends Component {

    handleChange(value) {
        console.log(`selected ${value}`)
    }

    render() {
        return (
            <React.Fragment>
                <div className={areaStyles["city_list"]}>
                    <div className={areaStyles.wrapper}>
                        <div className={areaStyles.choose}>
                            <Select 
                                defaultValue="nationwide" 
                                onChange={this.handleChange} 
                            >
                                <Option value="nationwide" disabled>全国</Option>
                                <Option value="China">中国</Option>
                                <Option value="Korea">韩国</Option>
                                <Option value="America">美国</Option>
                            </Select>

                            <Select 
                                defaultValue="province" 
                                onChange={this.handleChange} 
                            >
                                <Option value="province" disabled>--</Option>
                                <Option value="guangdong">广东</Option>
                                <Option value="zhejiang">浙江</Option>
                                <Option value="jiangxi">江西</Option>
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
                        <ul>
                            <li style={{ marginLeft: -40 }}>
                                <span className={areaStyles.province}>
                                    <a href="#">安徽</a>
                                </span>
                                <span className={areaStyles.downtown}>
                                    <a href="#">合肥</a> 
                                    <a href="#">芜湖</a>
                                    <a href="#">蚌埠</a>
                                    <a href="#">阜阳</a>
                                    <a href="#">淮南</a> 
                                    <a href="#">安庆</a>
                                </span>  
                            </li>
                            <li style={{ marginLeft: -40 }}>
                                <span className={areaStyles.province}>
                                    <a href="#">福建</a>
                                </span>
                                <span className={areaStyles.downtown}>
                                    <a href="#">福州</a> 
                                    <a href="#">厦门</a>
                                    <a href="#">莆田</a>
                                    <a href="#">漳州</a>
                                    <a href="#">宁德</a> 
                                    <a href="#">三明</a>
                                    <a href="#">福州</a> 
                                    <a href="#">厦门</a>
                                    <a href="#">莆田</a>
                                    <a href="#">漳州</a>
                                    <a href="#">宁德</a> 
                                    <a href="#">三明</a>
                                    <a href="#">福州</a> 
                                    <a href="#">厦门</a>
                                    <a href="#">莆田</a>
                                    <a href="#">漳州</a>
                                    <a href="#">宁德</a> 
                                    <a href="#">三明</a>
                                </span>  
                            </li>
                            <li style={{ marginLeft: -40 }}>
                                <span className={areaStyles.province}>
                                    <a href="#">安徽</a>
                                </span>
                                <span className={areaStyles.downtown}>
                                    <a href="#">合肥</a> 
                                    <a href="#">芜湖</a>
                                    <a href="#">蚌埠</a>
                                    <a href="#">阜阳</a>
                                    <a href="#">淮南</a> 
                                    <a href="#">安庆</a>
                                </span>  
                            </li>
                        </ul>
                    </div>
                    <div className={areaStyles.mask}>
                        <span>展开城市列表</span>
                        <div className={`${globalStyles.authTheme} ${areaStyles.down}`}>&#xe7ee;</div>
                    </div>
                </div>
                <div className={areaStyles.mainContainer}>
                    我的天
                </div>
            </React.Fragment>
        )
    }
}
