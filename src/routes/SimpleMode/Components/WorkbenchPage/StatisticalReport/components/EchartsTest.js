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

class EchartsTest extends Component {

  componentDidMount() {
    let myChart = echarts.init(document.getElementById('main'));

    var data = [
        [0, 16, 5, {
            name: '资产名称1',
            num: 16,
            persent: '35%'
        }],
        [16, 18, 5, {
            name: '资产名称2',
            num: 16,
            persent: '35%'
        }],
        [18, 26, 5, {
            name: '资产名称3',
            num: 16,
            persent: '35%'
        }],
        [26, 32, 5, {
            name: '资产名称4',
            num: 16,
            persent: '35%'
        }],
        [32, 56, 5, {
            name: '资产名称5',
            num: 16,
            persent: '35%'
        }],
        [56, 62, 5, {
            name: '资产名称6',
            num: 16,
            persent: '35%'
        }]
    ];
    var colorList = ['#4f81bd', '#c0504d', '#9bbb59', '#604a7b', '#948a54', '#e46c0b'];

    data = echarts.util.map(data, function(item, index) {
        return {
            value: item,
            itemStyle: {
                normal: {
                    color: colorList[index]
                }
            }
        };
    });

    // console.log(data, echarts.util,'sssssssssssssss_data')

    function renderItem(params, api) {
        var yValue = api.value(2);
        var start = api.coord([api.value(0), yValue]);
        var size = api.size([api.value(1) - api.value(0), yValue]);
        var style = api.style();

        return {
            type: 'rect',
            shape: {
                x: start[0],
                y: start[1],
                width: size[0],
                height: size[1]
            },
            style: style
        };
    }

    let option = {
        tooltip: {
            formatter: (params, ticket, callback) => {
                let info = params.data.value[3];
                let name = info.name;
                let num = info.num;
                let persent = info.persent;
                return `
                <div>
                    <div>${name}</div>
                    <div>${num}(${persent})</div>
                </div>
                `
            }
        },
        xAxis: {
            show: false
        },
        yAxis: {
            show: false
        },
        series: [{
            type: 'custom',
            renderItem: renderItem,
            label: null,
            dimensions: ['from', 'to', 'profit'],
            encode: {
                x: [0, 1],
                y: 2,
                tooltip: [0, 1, 2],
                itemName: 3
            },
            data: data
        }]
    };
    myChart.setOption(option);
  }
  render() {
    return (
      <div id="main" style={{ width: 400, height: 380 }}></div>
    );
  }
}

export default EchartsTest;