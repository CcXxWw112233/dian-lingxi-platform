import React, { Component } from 'react';
import { reportData } from '../constant'

// 引入 ECharts 主模块
// import echarts from 'echarts/lib/echarts';
import echarts from 'echarts'
// 引入柱状图
import 'echarts/lib/chart/bar';
// 引入提示框和标题组件
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/component/legend';
import { newline, arrayNonRepeatfy } from '../handleOperatorStatiscalReport';

class LineComponent extends Component {

  componentDidMount() {
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('lineComponent'));
    let boardNameData = reportData.map(item => item.board_name)
    let userNameData = reportData.map(item => item.user_name)
    // 绘制图表
    // 指定图表的配置项和数据
    var option = {
      tooltip: {
        data: 'value'
      },
      xAxis: {
        type: 'category',
        data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'],
        axisTick: {
          alignWithLabel: true,
          interval: 0
        },
      },
      yAxis: {
        type: 'value',
      },
      series: [{
        data: [820, 932, 901, 934, 1290, 1330, 1320, 844, 600, 1200, 1200, 1200],
        type: 'line'
      }],
      dataZoom: [{
        type: 'slider',
        show: true, //flase直接隐藏图形
        xAxisIndex: [0],
        left: '9%', //滚动条靠左侧的百分比
        bottom: -2,
        start: 0,//滚动条的起始位置
        end: 45 //滚动条的截止位置（按比例分割你的柱状图x轴长度）
      }],
    }

      // option = newline(option, 5, 'yAxis')
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);
    }
    render() {
      return (
        <div id="lineComponent" style={{ width: 400, height: 380 }}></div>
      );
    }
  }

  export default LineComponent;