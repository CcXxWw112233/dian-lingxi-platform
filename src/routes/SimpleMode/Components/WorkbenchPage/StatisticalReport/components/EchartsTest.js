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

class EchartsTest extends Component {

  arrayNonRepeatfy = (arr, key = 'id') => {
    let temp_arr = []
    let temp_id = []
    for (let i = 0; i < arr.length; i++) {
      if (!temp_id.includes(arr[i])) {//includes 检测数组是否有某个值
        temp_arr.push(arr[i]);
        temp_id.push(arr[i])
      }
    }
    return temp_arr
  }

  componentDidMount() {
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('main'));
    // 绘制图表
    var data = []
    let boardNameData = reportData.map(item => item.board_name)
    let userNameData = reportData.map(item => item.user_name)
    let workTimeData = reportData.map(item => item.work_time)
    console.log(this.arrayNonRepeatfy(userNameData), 'sssssssssssss_userNameData')
    // 指定图表的配置项和数据
    var option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
          type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        }
      },
      legend: {
        data: this.arrayNonRepeatfy(boardNameData),
        type: 'scroll', //分页类型
        left: 16
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          data: this.arrayNonRepeatfy(userNameData),
          axisTick: {
            alignWithLabel: true,
            interval: 0
          },
        }
      ],
      yAxis: [
        {
          type: 'value'
        }
      ],
      series: [
        {
          name: '沙田项目',
          type: 'bar',
          stack: '项目',
          data: [320, 332, 301, 334, 390, 330, 320]
        },
        {
          name: '西塘项目',
          type: 'bar',
          stack: '项目',
          data: [120, 132, 101, 134, 90, 230, 210]
        },
        {
          name: '我的天',
          type: 'bar',
          stack: '项目',
          data: [220, 182, 191, 234, 290, 330, 310]
        },
        {
          name: '111',
          type: 'bar',
          stack: '项目',
          data: [220, 182, 191, 234, 290, 3300, 310]
        },
        {
          name: '222',
          type: 'bar',
          stack: '项目',
          data: [220, 82, 191, 234, 290, 330, 310]
        },
        {
          name: '333',
          type: 'bar',
          stack: '项目',
          data: [220, 182, 91, 234, 290, 330, 310]
        },
        {
          name: '444',
          type: 'bar',
          stack: '项目',
          data: [220, 182, 191, 2304, 290, 330, 310]
        },
        {
          name: '555',
          type: 'bar',
          stack: '项目',
          data: [220, 182, 191, 234, 290, 30, 310]
        },
        {
          name: '666',
          type: 'bar',
          stack: '项目',
          data: [220, 182, 191, 234, 290, 30, 310]
        },
        {
          name: '777',
          type: 'bar',
          stack: '项目',
          data: [220, 182, 191, 234, 290, 30, 310]
        },
        {
          name: '888',
          type: 'bar',
          stack: '项目',
          data: [220, 182, 191, 234, 290, 30, 310]
        },
        {
          name: '999',
          type: 'bar',
          stack: '项目',
          data: [220, 182, 191, 234, 290, 30, 310]
        },
      ]
    };


    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
  }
  render() {
    return (
      <div id="main" style={{ width: 400, height: 380 }}></div>
    );
  }
}

export default EchartsTest;