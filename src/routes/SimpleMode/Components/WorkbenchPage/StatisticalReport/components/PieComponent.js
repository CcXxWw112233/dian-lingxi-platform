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

class PieComponent extends Component {

  componentDidMount() {
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('pieContent'));
    let boardNameData = reportData.map(item => item.board_name)
    let userNameData = reportData.map(item => item.user_name)
    // 绘制图表
    // 指定图表的配置项和数据
    var option = {
      title: {
        text: '내가 웃는게 아니야',
        subtext: '纯属虚构',
        left: 'right'
      },
      tooltip: {
        trigger: 'item',
        formatter: '{b} : {c} ({d}%)'
      },
      legend: {
        orient: 'vertical',
        left: 16,
        data: ['已逾期', '已完成', '未开始', '进行中'],
        type: 'scroll',
      },
      color: ['#5D7092', '#F6BD16', '#5B8FF9', '#5AD8A6'],
      series: [
        {
          // name: '访问来源',
          type: 'pie',
          radius: '55%',
          center: ['50%', '60%'],
          data: [
            { value: 335, name: '已逾期' },
            { value: 310, name: '已完成' },
            { value: 234, name: '未开始' },
            { value: 135, name: '进行中' },
          ],
          // label: {
          //   normal: {
          //     formatter: '{c}',
          //     position: 'inside'
          //   }
          // },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };

    // option = newline(option, 5, 'yAxis')
    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
  }
  render() {
    return (
      <div id="pieContent" style={{ width: 400, height: 380 }}></div>
    );
  }
}

export default PieComponent;