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
import { getReportBoardStatus } from '../../../../../../services/technological/statisticalReport';
import { isApiResponseOk } from '../../../../../../utils/handleResponseData';
import echartTheme from '../echartTheme.json'
@connect(mapStateToProps)
class PieComponent extends Component {

  getChartOptions = (props) => {
    const { status = [], count = [] } = props
    let data = [...count]
    data = data.map((item,index) => {
      let new_item = {
        value: item,
        name: status[index]
      }
      return new_item
    })
    let option = {
      tooltip: {
        trigger: 'item',
        formatter: '{b} : {c} ({d}%)'
      },
      legend: {
        orient: 'vertical',
        left: 16,
        data: status,
        type: 'scroll',
      },
      // color: ['#5B8FF9', '#5AD8A6', '#5D7092', '#F6BD16'],
      series: [
        {
          // name: '访问来源',
          type: 'pie',
          radius: '55%',
          center: ['50%', '60%'],
          data: data,
          label: {
            normal: {
              formatter: function(params) {
                if (params.value > 0) {
                  return params.value;
                } else {
                  return '';
                }
              },
              position: 'inside',
            },
          },
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
    return option
  }

  getReportBoardStatus = () => {
    echarts.registerTheme('walden',echartTheme)
    let myChart = echarts.init(document.getElementById('pieContent'),'walden');
    myChart.clear()
    myChart.showLoading({
      text: 'loading',
      color: '#5B8FF9',
      textColor: '#000',
      maskColor: 'rgba(255, 255, 255, 0.2)',
      zlevel: 0,
    })
    getReportBoardStatus().then(res => {
      if (isApiResponseOk(res)) {
        let option = this.getChartOptions(res.data)
        // 使用刚指定的配置项和数据显示图表。
        myChart.hideLoading()
        myChart.setOption(option);
      }
    })
  }

  resizeTTY = () => {
    echarts.registerTheme('walden',echartTheme)
    let myChart = echarts.init(document.getElementById('pieContent'),'walden');
    myChart.resize()
  }


  componentDidMount() {
    this.getReportBoardStatus()
    window.addEventListener('resize', this.resizeTTY)
  }

  componentWillReceiveProps(nextProps) {
    const { board_id } = this.props.simplemodeCurrentProject
    const { board_id: next_board_id } = nextProps.simplemodeCurrentProject
    if (board_id != next_board_id) {
      this.getReportBoardStatus()
    }
    window.addEventListener('resize', this.resizeTTY)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeTTY)
  }

  render() {
    return (
      <div id="pieContent" style={{ width: this.props.width - 100, height: 580 }}></div>
    );
  }
}

export default PieComponent;

function mapStateToProps ({
  simplemode: {
      simplemodeCurrentProject = {}
  }
}) {
  return {
    simplemodeCurrentProject
  }
}