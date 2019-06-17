// 热点页面

import React, { Component } from 'react'
import mainStyles from './hot.less'
import { connect } from 'dva'
import HotArticlesList from './HotArticlesList'
import { Row, Col, Radio, Icon} from 'antd';

const RadioGroup = Radio.Group;

@connect(({xczNews = []}) => ({
    xczNews, 
}))
export default class Hot extends Component {

    state = {
        selected_tab_id: 0, //热点Tabs的选项切换高亮效果
        expandForm: false, // 展开更多
    }

    // 热点点击的显示对应的内容
    handleHotContent = ({ id }) => {
        this.setState({
            selected_tab_id: id
        })
        const { dispatch } = this.props
        dispatch({
          type: 'xczNews/getHotArticles',
          payload: {
            hotspot_id: id,
            default_page_size: 5,
          }
        })
    }

    // 点击更多
    handleClickMore = () => {
        // console.log(111111111111)
        const { expandForm } = this.state;
        this.setState({
            expandForm: !expandForm,
        });
    }

    // 展开更多
    renderForm() {
        const { expandForm } = this.state;
        return expandForm ? this.renderAllForm() : this.renderSimpleForm();
    }

    // renderSimpleForm 未展开更多
    renderSimpleForm() {
        const { xczNews } = this.props;
        const { hotTabs = [], hotArticlesList = [] } = xczNews;
        return (
            <div className={mainStyles.list} style={{ maxHeight: 130 }}>
                <Row style={{ width: '100%' }}>
                    <Col span={12}>
                        <RadioGroup>
                            {
                                hotTabs.map((item, index) => {
                                    return index == 10 ? (
                                        <>
                                            <Radio.Button
                                                // className={`${item.id == selected_tab_id || selected_tab_id == index  ? mainStyles.current : ''}`} 
                                                value={item.id}
                                                onChange={ () => { this.handleHotContent({ id: item.id }) } }
                                            >{ item.name }</Radio.Button>
                                            <Radio.Button 
                                                onChange={ () => { this.handleClickMore() } }
                                                value="more">
                                                更多
                                                <Icon type="down" />
                                            </Radio.Button>
                                        </>
                                    ) : (
                                        <Radio.Button
                                            // className={`${item.id == selected_tab_id || selected_tab_id == index  ? mainStyles.current : ''}`} 
                                            value={item.id}
                                            onChange={ () => { this.handleHotContent({ id: item.id }) } }
                                        >{ item.name }</Radio.Button>
                                    )
                                })
                            }
                        </RadioGroup>
                    </Col>
                </Row>
            </div>
        )
    }

    // 展开全部 renderAllForm
    renderAllForm() {
        const { xczNews } = this.props;
        const { hotTabs = [], hotArticlesList = [] } = xczNews;
        return (
            <div className={mainStyles.list}>     
                <Row style={{ width: '100%' }}>
                    <Col span={12}>
                        <RadioGroup>
                            {
                                hotTabs.map((item, index) => {
                                    return (
                                        <Radio.Button
                                            // className={`${item.id == selected_tab_id || selected_tab_id == index  ? mainStyles.current : ''}`} 
                                            value={item.id}
                                            onChange={ () => { this.handleHotContent({ id: item.id }) } }
                                        >{ item.name }</Radio.Button>     
                                    )
                                })
                            }
                        </RadioGroup>
                    </Col>
                </Row>
            </div>
        )
    }

    render() {
        const { xczNews } = this.props;
        const { hotArticlesList = [] } = xczNews;
        return (
            <div className={mainStyles.mainContainer}>

                { this.renderForm() }

                <HotArticlesList {...{hotArticlesList}} />
            </div>
        )
    }
}
