<template>
  <div class="top-box">
    <div>Overview of</div>
    <div class="select">
      <el-select v-model="value" class="m-2" placeholder="Select" size="large" style="width: 240px">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </div>
    <div>for</div>
    <div class="select">
      <el-select
        v-model="value1"
        class="m-2"
        placeholder="Select"
        size="large"
        style="width: 240px"
      >
        <el-option
          v-for="item in options1"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </div>
  </div>
  <div class="main">
    <div class="item">
      <div id="item-top" class="box"></div>
    </div>
    <div class="item">
      <div id="item-bottom" class="box"></div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
// 引入 echarts 核心模块，核心模块提供了 echarts 使用必须要的接口。
import * as echarts from 'echarts/core'
// 引入柱状图图表，图表后缀都为 Chart
import { LineChart, PieChart } from 'echarts/charts'
// 引入提示框，标题，直角坐标系，数据集，内置数据转换器组件，组件后缀都为 Component
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  LegendComponent
} from 'echarts/components'
// 标签自动布局、全局过渡动画等特性
import { LabelLayout, UniversalTransition } from 'echarts/features'
// 引入 Canvas 渲染器，注意引入 CanvasRenderer 或者 SVGRenderer 是必须的一步
import { CanvasRenderer } from 'echarts/renderers'

const value = ref('Option1')
const value1 = ref('Option1')

const options = [
  {
    value: 'Option1',
    label: 'past 12 months'
  },
  {
    value: 'Option2',
    label: 'past 4 weeks'
  },
  {
    value: 'Option3',
    label: 'past 7 days'
  },
  {
    value: 'Option4',
    label: 'past 24 hours'
  }
]
const options1 = [
  {
    value: 'Option1',
    label: 'students'
  },
  {
    value: 'Option2',
    label: 'teachers'
  },
  {
    value: 'Option3',
    label: 'all users'
  }
]
// 注册必须的组件
echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  LineChart,
  PieChart,
  LabelLayout,
  UniversalTransition,
  CanvasRenderer,
  LegendComponent
])

// 绘制折线图
const setLine = () => {
  let myChart = echarts.init(document.getElementById('item-top'))

  // 绘制图表

  const option = {
    title: {
      text: 'Usage History',
      left: 'center'
    },
    tooltip: {
      trigger: 'item'
    },

    xAxis: {
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        data: [150, 230, 224, 218, 135, 147, 260],
        type: 'line'
      }
    ]
  }
  myChart.setOption(option)
}

const setPie = () => {
  let myChart = echarts.init(document.getElementById('item-bottom'))

  // 绘制图表

  const option = {
    title: {
      text: 'Usage distrubution',
      left: 'center'
    },
    tooltip: {
      trigger: 'item'
    },
    legend: {
      orient: 'vertical',
      right: '30%'
    },
    series: [
      {
        type: 'pie',
        radius: '80%',
        data: [
          { value: 1048, name: 'image' },
          { value: 735, name: 'chatbot' }
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  }
  myChart.setOption(option)
}
onMounted(() => {
  setLine()
  setPie()
})
</script>
<style scoped lang="scss">
.top-box {
  display: flex;
  flex-direction: row;
  align-items: center;
  font-size: 20px;
  margin-left: 5%;
  .select {
    margin: 0 10px;
  }
}
.main {
  display: flex;
  flex-direction: column;
  margin-top: 20px;
  align-items: center;
  .item {
    width: 90%;
    height: 400px;
    .box {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
