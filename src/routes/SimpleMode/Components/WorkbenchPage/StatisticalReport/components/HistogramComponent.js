import React, { Component } from 'react'
import { Chart,Tooltip,Interval, Legend } from "bizcharts";
import { connect } from 'dva'
import { reportData } from '../constant'

@connect()
export default class HistogramComponent extends Component {
  render() {
    // const data = [
    //   { name: 'London', 月份: 'Jan.', 月均降雨量: 18.9 },
    //   { name: 'London', 月份: 'Feb.', 月均降雨量: 28.8 },
    //   { name: 'London', 月份: 'Mar.', 月均降雨量: 39.3 },
    //   { name: 'London', 月份: 'Apr.', 月均降雨量: 81.4 },
    //   { name: 'London', 月份: 'May', 月均降雨量: 47 },
    //   { name: 'London', 月份: 'Jun.', 月均降雨量: 20.3 },
    //   { name: 'London', 月份: 'Jul.', 月均降雨量: 24 },
    //   { name: 'London', 月份: 'Aug.', 月均降雨量: 35.6 },
    //   { name: 'Berlin', 月份: 'Jan.', 月均降雨量: 12.4 },
    //   { name: 'Berlin', 月份: 'Feb.', 月均降雨量: 23.2 },
    //   { name: 'Berlin', 月份: 'Mar.', 月均降雨量: 34.5 },
    //   { name: 'Berlin', 月份: 'Apr.', 月均降雨量: 99.7 },
    //   { name: 'Berlin', 月份: 'May', 月均降雨量: 52.6 },
    //   { name: 'Berlin', 月份: 'Jun.', 月均降雨量: 35.5 },
    //   { name: 'Berlin', 月份: 'Jul.', 月均降雨量: 37.4 },
    //   { name: 'Berlin', 月份: 'Aug.', 月均降雨量: 42.4 },
    // ];
    // const scale = {
    //   sales:{
    //     min: 0, // 定义数值范围的最小值
    //     max: 10000, // 定义数值范围的最大值
    //     ticks: [0, 500, 1000, 1500], // 用于指定坐标轴上刻度点的文本信息，当用户设置了 ticks 就会按照 ticks 的个数和文本来显示。
    //     tickInterval: 500, // 用于指定坐标轴各个标度点的间距，是原始数据之间的间距差值，tickCount 和 tickInterval 不可以同时声明。
    //     tickCount: 5, // 定义坐标轴刻度线的条数，默认为 5
    //   }
    // };
    return (
      <div>
        <Chart height={380} padding={[24,24,50,60]} data={reportData} autoFit={true}>
          <Interval
            adjust={[
              {
                type: 'stack',
              },
            ]}
            color="board_name"
            position="user_name*work_time"
            label={['work_time', { position: 'middle', offset: 0, style: { fill: '#fff' }, layout: { type: 'limit-in-shape' } }]}
          />
          <Legend 
            position={'top-left'}
            offsetX={24}
            type={'scroll'}
          />
          <Tooltip shared />
        </Chart>
      </div>
    )
  }
}
