<template>
  <div class="markdown-content">
    <Markdown
      :source="modelValue"
      :plugins="plugins"
      :html="true"
      :typographer="true"
      :xhtml-out="true"
      :breaks="true"
    />
  </div>
</template>
<script setup>
import { reactive } from 'vue'
import Markdown from 'vue3-markdown-it'
import MarkdownItStrikethroughAlt from 'markdown-it-strikethrough-alt'
import { full as emoji } from 'markdown-it-emoji'
import MarkdownItDeflist from 'markdown-it-deflist'
import MarkdownItSub from 'markdown-it-sub'
import MarkdownItSup from 'markdown-it-sup'
import MarkdownItAbbr from 'markdown-it-abbr'
import MarkdownItAnchor from 'markdown-it-anchor'
import MarkdownItFootnote from 'markdown-it-footnote'
import MarkdownItHighlightjs from 'markdown-it-highlightjs'
import MarkdownItIns from 'markdown-it-ins'
import MarkdownItMark from 'markdown-it-mark'
import MarkdownItTaskLists from 'markdown-it-task-lists'
import MarkdownItTocDoneRight from 'markdown-it-toc-done-right'
defineProps({
  modelValue: [String, Number] // 父组件传过来的值
})
const plugins = reactive([
  {
    plugin: MarkdownItAbbr
  },
  {
    plugin: MarkdownItSub
  },
  {
    plugin: MarkdownItSup
  },
  {
    plugin: MarkdownItDeflist
  },
  {
    plugin: emoji
  },
  {
    plugin: MarkdownItStrikethroughAlt
  },
  {
    plugin: MarkdownItAnchor
  },
  {
    plugin: MarkdownItFootnote
  },
  {
    plugin: MarkdownItHighlightjs
  },
  {
    plugin: MarkdownItIns
  },
  {
    plugin: MarkdownItMark
  },
  {
    plugin: MarkdownItTaskLists
  },
  {
    plugin: MarkdownItTocDoneRight
  }
])
</script>
<style scoped>
.markdown-content {
  padding: 0 15px;
  line-height: 2;
}

.markdown-content table {
  margin: 20px auto;
  width: 90%;
}

.markdown-content table,
.markdown-content table td {
  border: 1px solid #eee;
  text-align: center;
}

.markdown-content img {
  width: 90%;
}

.markdown-content blockquote {
  border-left: 5px solid #eee;
  padding-left: 20px;
}
</style>
