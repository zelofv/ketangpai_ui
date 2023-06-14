import vue from '@/main'
function buttonRequestProgressStart (text) {
    if(text==undefined||text=="")
      text="正在努力加载中,请稍后..."
    const loading = vue.$loading({
      lock: true,
      text: text,
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0.1)'
    });
}
function  buttonRequestProgressClose() {
  const loading = vue.$loading({})
  loading.close();
}
function toggleFullScreen(element) {
  if (isFullscreen()) {
     if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    return false;
    } else {
      if (element.requestFullscreen) {
        element.requestFullscreen();
      } else if (element.webkitRequestFullScreen) {
        element.webkitRequestFullScreen();
      } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
      } else if (element.msRequestFullscreen) {
        // IE11
        element.msRequestFullscreen();
      }
      return true;
 }
}
function isFullscreen(){
  var explorer = window.navigator.userAgent.toLowerCase();
  if(explorer.indexOf('chrome')>0){//webkit
    if (document.body.scrollHeight === window.screen.height && document.body.scrollWidth === window.screen.width) {
     return true;
    } else {
      return false;
    }
  }else{//IE 9+  fireFox
    if (window.outerHeight === window.screen.height && window.outerWidth === window.screen.width) {
      return true;
    } else {
      return false;
    }
  }
}

export default {
  // Vue.js的插件应当有一个公开方法 install这个方法的第一个参数是 Vue 构造器，第二个参数是一个可选的选项对象。
  install: function (Vue) {
    Vue.prototype.buttonRequestProgressStart = (text) => buttonRequestProgressStart(text)
    Vue.prototype.buttonRequestProgressClose = () => buttonRequestProgressClose()
    Vue.prototype.toggleFullScreen=(element)=>toggleFullScreen(element)
  }
}

