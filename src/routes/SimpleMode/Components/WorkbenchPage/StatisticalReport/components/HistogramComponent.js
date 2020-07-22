import React, { Component } from 'react';
import { connect } from 'dva'
// 引入 ECharts 主模块
import echarts from 'echarts'
// 引入柱状图
import 'echarts/lib/chart/bar';
// 引入提示框和标题组件
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/component/legend';

import { getReportCardWorktime } from '../../../../../../services/technological/statisticalReport';
import { isApiResponseOk } from '../../../../../../utils/handleResponseData';

import echartTheme from '../echartTheme.json'

@connect(mapStateToProps)
class HistogramComponent extends Component {

  // 获取图表配置项
  getChartOptions = (props) => {
    const { legend = [], users = [], series = [] } = props
    let newSeries = [...series]
    newSeries = newSeries.map(item => {
      // 将字符串data转换成number
      let data = item.data.map(chgStr => {
        let n = Number(chgStr)
        return n
      })
      let new_item = {
        ...item, 
        type: 'bar',
        stack: '项目',
        // label: {
        //   show: true,
        //   position: 'inside',
        //   formatter: function (params) {
        //     if (params.value > 0) {
        //       return params.value;
        //     } else {
        //       return '';
        //     }
        //   },
        // },
        data: data,
      }
      return new_item
    })    
    // 指定图表的配置项和数据
    let option = {
      tooltip: {
        trigger: 'item',
        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
          type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        },
        extraCssText: "max-width:200px;max-height:200px;overflow:auto;white-space:pre-wrap;word-break:break-all;",
        enterable: true,
        // showContent: true,
        // showDelay: 2,
        // formatter: function (params) {

        //     let res='<div><p>时间：'+params[0].name+'</p></div>' 
        //     for(let i = 0; i < params.length; i++){
        //       res+='<p>'+params[i].seriesName+':'+params[i].data+'</p>'
        //     }
        //     return res;
        // },
      },
      legend: {
        data: legend,
        type: 'scroll', //分页类型
        left: 16,
        formatter: function (params) { //标签输出形式 ---请开始你的表演
          var index = 10;
          var newstr = '';
          for (var i = 0; i < params.length; i += index) {
            var tmp = params.substring(i, i + index);
            newstr += tmp + '\n';
          }
          if (newstr.length > 20)
            return newstr.substring(0, 20) + '...';
          else
            return '\n' + newstr;
        },
        triggerEvent: true,
        tooltip: {
          show: true,
          enterable: true,
        },
        animation: true,
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          // type: 'category',
          data: users,
          // axisTick: {
          //   alignWithLabel: true,
          //   interval: 0
          // },
        }
      ],
      yAxis: [
        {
          type: 'value',
          axisLabel: {
            // formatter: '{value} (h)'
          },
          name: "(时)", //坐标名字

          nameLocation: "start",//坐标位置，支持start,end，middle
  
          nameTextStyle: {//字体样式
  
            fontSize: 12,//字体大小
    
          }
        }
      ],
      series: newSeries
    };

    return option
  }

  // 获取工时统计结果
  getReportCardWorktime = () => {
    echarts.registerTheme('walden',echartTheme)
    let myChart = echarts.init(document.getElementById('histogramComponent'),'walden');
    myChart.clear()
    myChart.showLoading({
      text: 'loading',
      color: '#5B8FF9',
      textColor: '#000',
      maskColor: 'rgba(255, 255, 255, 0.2)',
      zlevel: 0,
    })
    getReportCardWorktime().then(res => {
      if (isApiResponseOk(res)) {
        let option = this.getChartOptions(res.data)
        // option = newline(option, 3, 'xAxis')
        // 使用刚指定的配置项和数据显示图表。
        myChart.hideLoading()
        myChart.setOption(option);
      }
    })
  }

  resizeTTY = () => {
    echarts.registerTheme('walden',echartTheme)
    let myChart = echarts.init(document.getElementById('histogramComponent'),'walden');
    myChart.resize()
  }

  componentDidMount() {
    this.getReportCardWorktime()
    window.addEventListener('resize', this.resizeTTY)
  }

  componentWillReceiveProps(nextProps) {
    const { board_id } = this.props.simplemodeCurrentProject
    const { board_id: next_board_id } = nextProps.simplemodeCurrentProject
    if (board_id != next_board_id) {
      this.getReportCardWorktime()
    }
    window.addEventListener('resize', this.resizeTTY)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeTTY)
  }
  
  render() {
    return (
      <div id="histogramComponent" style={{ width: this.props.width - 100, height: 580 }}></div>
    );
  }
}

export default HistogramComponent;

function mapStateToProps ({
  simplemode: {
      simplemodeCurrentProject = {}
  }
}) {
  return {
    simplemodeCurrentProject
  }
}

// 柱状图类型
HistogramComponent.defaultProps = {

}

