// 聊天模块滚动条位置设置
export function setScrollTopFn(ref: any, nextTick: any) {
  nextTick(() => {
    if (ref.value) {
      ref.value.scrollTop = ref.value.scrollHeight
    }
  })
}
