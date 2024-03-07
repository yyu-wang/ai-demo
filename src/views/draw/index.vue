<template>
  <div class="draw">
    <div class="left">
      <div class="item">
        <div class="title">{{ t('draw.model') }}</div>
        <el-radio-group v-model="model" fill="#4460dc" text-color="#ffffff">
          <el-radio-button label="dall-e-2">Dall-e-2</el-radio-button>
          <el-radio-button label="dall-e-3">Dall-e-3</el-radio-button>
        </el-radio-group>
      </div>
      <div class="item" v-if="isDall3">
        <div class="title">{{ t('draw.pictureStyle') }}</div>
        <el-radio-group v-model="style" fill="#4460dc" text-color="#ffffff">
          <el-radio-button label="vivid">{{ t('draw.vivid') }}</el-radio-button>
          <el-radio-button label="natural">{{ t('draw.natural') }}</el-radio-button>
        </el-radio-group>
      </div>
      <div class="item">
        <div class="title">{{ t('draw.pictureQuality') }}</div>
        <el-radio-group v-model="quality" fill="#4460dc" text-color="#ffffff">
          <el-radio-button label="standard">{{ t('draw.standard') }}</el-radio-button>
          <el-radio-button label="hd">{{ t('draw.hd') }}</el-radio-button>
        </el-radio-group>
      </div>
      <div class="item">
        <div class="title">{{ t('draw.pictureSize') }}</div>
        <el-radio-group v-model="size" fill="#4460dc" text-color="#ffffff">
          <el-radio-button v-for="(item, index) in sizeList" :key="index" :label="item">{{
            item
          }}</el-radio-button>
        </el-radio-group>
      </div>
      <div class="item">
        <div class="title">{{ t('draw.pictureType') }}</div>
        <el-radio-group v-model="type" fill="#4460dc" text-color="#ffffff">
          <el-radio-button
            v-for="(item, index) in typeList"
            :key="index"
            :label="t(`draw.type.${item}`)"
            >{{ t(`draw.type.${item}`) }}</el-radio-button
          >
        </el-radio-group>
      </div>
      <div class="item">
        <div class="title">{{ t('draw.mainColors') }}</div>
        <el-radio-group v-model="color" :fill="colorFill" :text-color="textColor">
          <el-radio-button
            v-for="(item, index) in colorList"
            :key="index"
            :label="t(`draw.color.${item.label}`)"
            >{{ t(`draw.color.${item.label}`) }}</el-radio-button
          >
        </el-radio-group>
      </div>
    </div>
    <div class="right">
      <div class="prompt-box">
        <div class="title">{{ t('draw.describe') }}</div>
        <el-input
          v-model="prompt"
          :autosize="{ minRows: 4, maxRows: 6 }"
          :maxlength="maxlength"
          :placeholder="t('draw.describeInfo')"
          show-word-limit
          type="textarea"
        />
        <div class="btn-box">
          <el-button type="primary" @click="generateFn">{{ t('draw.generate') }}</el-button>
        </div>
      </div>
      <div class="title">{{ t('draw.Preview') }}</div>
      <div v-if="imgUrl">
        <el-image :style="imageStyle" class="image" :preview-src-list="[imgUrl]" :src="imgUrl" />
      </div>
      <div class="image_tip" v-else>{{ t('draw.imageText') }}</div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import { useGlobalStore } from '@/stores/modules/global'
import { nextTick } from 'process'

const globalStore = useGlobalStore()
const { t } = useI18n()

const model = ref<string>('dall-e-2') //模型
const prompt = ref<string>() //描述
const style = ref<string>('vivid') //风格
const type = ref<string>(t('draw.type.default')) //类型
const size = ref<string>('256x256') //大小
const quality = ref<string>('standard') //质量
const dall2 = ['256x256', '512x512', '1024x1024']
const dall3 = ['1024x1024', '1792x1024', '1024x1792']
const sizeList = ref(dall2) //图片大小列表
const isDall3 = ref(false) //是否展示3的专属类型
const color = ref(t('draw.color.default')) //主要颜色

const maxlength = ref(1000)
// 图片大小样式
const imageStyle = ref({
  width: '256px',
  height: '256px'
})

const imgUrl = ref('')
//类型数组
const typeList = [
  'default',
  'cartoon',
  'comic',
  'animation',
  'line',
  'abstract',
  'impression',
  'minimalism',
  'handDrawn',
  'classical',
  'oilPainting',
  'watercolor',
  'ukiyoE',
  'realistic',
  'pixel'
]
//主要颜色数组
const colorList = [
  {
    label: 'default',
    color: '#4460dc'
  },
  {
    label: 'red',
    color: 'red'
  },
  {
    label: 'blue',
    color: 'blue'
  },
  {
    label: 'green',
    color: 'green'
  },
  {
    label: 'yellow',
    color: 'yellow'
  },
  {
    label: 'purple',
    color: 'purple'
  },
  {
    label: 'orange',
    color: 'orange'
  },
  {
    label: 'pink',
    color: 'pink'
  },
  {
    label: 'gray',
    color: 'gray'
  },
  {
    label: 'black',
    color: 'black'
  },
  {
    label: 'white',
    color: 'white'
  }
]
const colorFill = ref('#4460dc')
const textColor = ref('#ffffff')
// 根据选中的颜色来设置
watch(
  () => color.value,
  (newValue) => {
    colorList.forEach((item) => {
      if (newValue === t(`draw.color.${item.label}`)) {
        colorFill.value = item.color
        if (
          newValue === 'White' ||
          newValue === '白色' ||
          newValue === 'Yellow' ||
          newValue === '黃色' ||
          newValue === '黄色'
        ) {
          textColor.value = '#676767'
        } else {
          textColor.value = '#ffffff'
        }
      }
    })
  }
)
// 根据模型选择图片尺寸
watch(
  () => model.value,

  (newValue) => {
    if (newValue === 'dall-e-2') {
      sizeList.value = dall2
      size.value = '256x256'
      isDall3.value = false
      maxlength.value = 1000
    } else {
      sizeList.value = dall3
      size.value = '1024x1024'
      isDall3.value = true
      maxlength.value = 4000
    }
  }
)
// 根据语言切换默认值
watch(
  () => globalStore.language,
  () => {
    type.value = ref(t('draw.type.default')).value //类型
    color.value = ref(t('draw.color.default')).value //主要颜色
  }
)
//
const isPrompt = () => {
  // in 動漫 style, with primary color: 🔴 紅色, with secondary color: 🟢 綠色
  // 採用卡通風格,主色為🔴 紅色,次要顏色為🔵 藍色
  let isFlag = true
  if (!prompt.value) {
    isFlag = false
    ElMessage({
      message: `${t('tip.inputText') + t('draw.describe')}`,
      type: 'error'
    })
  }
  return isFlag
}
const dataConstruction = () => {
  let obj = {}
  // dall-e-2参数没有quality style参数
  let str = ''
  if (type.value !== t('draw.type.default')) {
    console.log('type.value', type.value)
    str = t('draw.typeText1') + type.value + t('draw.typeText2')
  }
  if (color.value !== t('draw.color.default')) {
    str = str + t('draw.colorText') + color.value
  }

  if (model.value === 'dall-e-2') {
    obj = {
      model: model.value,
      prompt: prompt.value + str,
      size: size.value
    }
  } else {
    obj = {
      model: model.value,
      prompt: prompt.value + str,
      style: style.value,
      size: size.value,
      quality: quality.value
    }
  }
  return obj
}
// 生成按钮
const generateFn = () => {
  if (!isPrompt()) return
  console.log('2222', dataConstruction())
}
</script>
<style lang="scss" scoped>
@import './index.scss';
</style>
