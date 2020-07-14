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

class BarDiagramentComponent extends Component {

  componentDidMount() {
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('barDiagramContent'));
    let boardNameData = reportData.map(item => item.board_name)
    let userNameData = reportData.map(item => item.user_name)
    // 绘制图表
    // 指定图表的配置项和数据
    var option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
          type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        },
        // position: function (pos, params, dom, rect, size) {
        //   // 鼠标在左侧时 tooltip 显示到右侧，鼠标在右侧时 tooltip 显示到左侧。
        //   var obj = { top: 60 };
        //   obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 5;
        //   return obj;
        // }
      },
      legend: {
        data: arrayNonRepeatfy(boardNameData),
        type: 'scroll',
        left: 16
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'value',
      },
      yAxis: {
        type: 'category',
        data: arrayNonRepeatfy(userNameData),
        axisLabel: true
      },
      series: [
        {
          name: '沙田项目',
          type: 'bar',
          stack: '项目',
          label: {
            show: arrayNonRepeatfy(boardNameData).length > 10 ? false : true,
            position: 'inside'
          },
          data: [32, 33, 30, 34, 39, 30, 30],
        },
        {
          name: '西塘项目',
          type: 'bar',
          stack: '项目',
          label: {
            show: arrayNonRepeatfy(boardNameData).length > 10 ? false : true,
            position: 'inside'
          },
          data: [10, 12, 11, 14, 9, 23, 20]
        },
        {
          name: '我的天',
          type: 'bar',
          stack: '项目',
          label: {
            show: arrayNonRepeatfy(boardNameData).length > 10 ? false : true,
            position: 'insideRight'
          },
          data: [20, 12, 11, 24, 20, 30, 10]
        },
        {
          name: '111',
          type: 'bar',
          stack: '项目',
          label: {
            show: arrayNonRepeatfy(boardNameData).length > 10 ? false : true,
            position: 'insideRight'
          },
          data: [20, 12, 11, 24, 20, 33, 30]
        },
        {
          name: '222',
          type: 'bar',
          stack: '项目',
          label: {
            show: arrayNonRepeatfy(boardNameData).length > 10 ? false : true,
            position: 'insideRight'
          },
          data: [20, 8, 19, 23, 29, 30, 30]
        },
        {
          name: '333',
          type: 'bar',
          stack: '项目',
          label: {
            show: arrayNonRepeatfy(boardNameData).length > 10 ? false : true,
            position: 'insideRight'
          },
          data: [20, 12, 9, 23, 29, 30, 30]
        },
        {
          name: '444',
          type: 'bar',
          stack: '项目',
          label: {
            show: arrayNonRepeatfy(boardNameData).length > 10 ? false : true,
            position: 'insideRight'
          },
          data: [20, 12, 11, 24, 90, 33, 30]
        },
        {
          name: '555',
          type: 'bar',
          stack: '项目',
          label: {
            show: arrayNonRepeatfy(boardNameData).length > 10 ? false : true,
            position: 'insideRight'
          },
          data: [20, 12, 11, 24, 20, 30, 30]
        },
        {
          name: '666',
          type: 'bar',
          stack: '项目',
          label: {
            show: arrayNonRepeatfy(boardNameData).length > 10 ? false : true,
            position: 'insideRight'
          },
          data: [20, 12, 11, 24, 20, 30, 30]
        },
        {
          name: '777',
          type: 'bar',
          stack: '项目',
          label: {
            show: arrayNonRepeatfy(boardNameData).length > 10 ? false : true,
            position: 'insideRight'
          },
          data: [20, 12, 11, 24, 20, 30, 30]
        },
        {
          name: '888',
          type: 'bar',
          stack: '项目',
          label: {
            show: arrayNonRepeatfy(boardNameData).length > 10 ? false : true,
            position: 'insideRight'
          },
          data: [20, 12, 11, 24, 20, 30, 30]
        },
        {
          name: '999',
          type: 'bar',
          stack: '项目',
          label: {
            show: arrayNonRepeatfy(boardNameData).length > 10 ? false : true,
            position: 'insideRight'
          },
          data: [20, 12, 11, 24, 20, 30, 30]
        },
      ]
    };

    option = newline(option, 5, 'yAxis')
    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
  }
  render() {
    return (
      <div id="barDiagramContent" style={{ width: 400, height: 380 }}></div>
    );
  }
}

export default BarDiagramentComponent;