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
                        <span className={`${globalStyles.authTheme} ${areaStyles.position}` }>&#xe616;</span>
                    </div>
                    <Search
                        placeholder="搜索地区"
                        onSearch={value => console.log(value)}
                        style={{ width: 147, height: 32 }}
                    />
                </div>
            </div>
        )
    }
}
