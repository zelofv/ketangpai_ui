<template>
  <div>
    <editor v-model="value" :init="init" :disabled="disabled"></editor>
  </div>
</template>

<script>
import tinymce from "tinymce/tinymce";
import Editor from "@tinymce/tinymce-vue";
import "tinymce/themes/silver/index";
import "tinymce/plugins/image/plugin";
import "tinymce/plugins/media/plugin";
import "tinymce/plugins/table/plugin";
import "tinymce/plugins/lists/plugin";
import "tinymce/plugins/wordcount/plugin";
import "tinymce/plugins/preview/plugin";
import "tinymce/plugins/code/plugin";
import "tinymce/plugins/link/plugin";
import "tinymce/plugins/advlist/plugin";
import "tinymce/plugins/codesample/plugin";
import "tinymce/plugins/fullscreen/plugin";
import "tinymce/plugins/searchreplace/plugin";
import "tinymce/plugins/autolink/plugin";
import "tinymce/plugins/directionality/plugin";
import "tinymce/plugins/visualblocks/plugin";
import "tinymce/plugins/visualchars/plugin";
import "tinymce/plugins/template/plugin";
import "tinymce/plugins/charmap/plugin";
import "tinymce/plugins/nonbreaking/plugin";
import "tinymce/plugins/insertdatetime/plugin";
import "tinymce/plugins/autosave/plugin";
import "tinymce/plugins/autoresize/plugin";
import "@/tinymce/langs/zh-Hans"
import 'tinymce/icons/default/icons'
import 'tinymce/models/dom/model'
import '@/tinymce/skins/ui/oxide/skin.css'
import '@/tinymce/skins/ui/oxide/skin.min.css'
import '@/tinymce/skins/ui/oxide/skin.shadowdom.css'
import '@/tinymce/skins/ui/oxide/skin.shadowdom.min.css'
import '@/tinymce/skins/ui/oxide/content.css'
import '@/tinymce/skins/ui/oxide/content.min.css'
import '@/tinymce/skins/ui/oxide/content.inline.css'
import '@/tinymce/skins/ui/oxide/content.inline.min.css'

export default {
  name: "ImcoderTinymce",
  components: {Editor},
  props: {
    value: {
      type: String,
      default: ""
    },
    disabled: {
      type: Boolean,
      default: false
    },
    // 默认插件 这里写的比较全，基本上是全部了
    plugins: {
      type: [String, Array],
      default:
          "preview searchreplace autolink directionality visualblocks visualchars fullscreen image link media template code codesample table charmap nonbreaking insertdatetime advlist lists wordcount autosave autoresize"
    },
    // 默认工具栏 这里写的比较全，基本上是全部了
    toolbar: {
      type: [String, Array],
      // default:
      //     "code undo redo restoredraft | cut copy paste pastetext | forecolor backcolor bold italic underline strikethrough link codesample | alignleft aligncenter alignright alignjustify outdent indent lineheight formatpainter | \
      // styleselect formatselect fontselect fontsizeselect | bullist numlist | blockquote subscript superscript removeformat | \
      // table image media charmap pagebreak insertdatetime | bdmap fullscreen preview"
      default:
          "forecolor backcolor bold italic underline codesample fullscreen alignleft aligncenter alignright formatpainter \
       blockquote table image pagebreak bdmap link preview"
    }
  },
  data() {
    return {
      init: {
        // language_url: require("@/tinymce/langs/zh-Hans"), // 中文语言包路径
        language: "zh-Hans",
        // skin_url: "./tinymce/skins/ui/oxide",
        height: 300,
        min_height: 300,
        max_height: 300,
        toolbar_mode: "wrap",
        plugins: this.plugins,
        toolbar: this.toolbar,
        content_style: "p {margin: 5px 0;}",
        fontsize_formats: "12px 14px 16px 18px 24px 36px 48px 56px 72px",
        font_formats:
            "微软雅黑=Microsoft YaHei,Helvetica Neue,PingFang SC,sans-serif;苹果苹方=PingFang SC,Microsoft YaHei,sans-serif;宋体=simsun,serif;仿宋体=FangSong,serif;黑体=SimHei,sans-serif;Arial=arial,helvetica,sans-serif;Arial Black=arial black,avant garde;Book Antiqua=book antiqua,palatino;",
        branding: false,
        //此处为图片上传处理函数，这个直接用了base64的图片形式上传图片，
        //如需ajax上传可参考https://www.tiny.cloud/docs/configure/file-image-upload/#images_upload_handler
        images_upload_handler: (blobInfo, success, failure) => {
          const img = "data:image/jpeg;base64," + blobInfo.base64();
          success(img);
        }
      },
    }
  },
  mounted() {
    tinymce.init({}); // 这里传个空对象就可以了
  },
}
</script>

<style scoped>

</style>