<template>
  <div class="class-detail">
    <div class="class-navigate">
      <div class="class-navigate-content">
        <i @click="openDrawer" class="el-icon-s-unfold"></i>
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{name: 'main'}">我的课堂</el-breadcrumb-item>
          <el-breadcrumb-item>课程内容</el-breadcrumb-item>
        </el-breadcrumb>
        <HeaderRight/>
      </div>
    </div>
    <div class="body">
      <div class="class-header">
        <div class="header-top">
          <div class="top"
               :style="{backgroundImage: 'url('+ $store.state.thisCourseInfo.img +')',backgroundSize:'cover' }">
            <div class="teacher-setting"
                 v-if="$store.state.thisCourseInfo && $store.state.thisCourseInfo.connect !== 'study'">
              <p><i class="el-icon-setting"></i>课程设置</p>
              <p><i class="el-icon-document"></i>课堂评价</p>
              <p><i class="el-icon-document-copy"></i>打包下载</p>
              <p><i class="el-icon-user"></i>成员管理</p>
              <p><i class="el-icon-postcard"></i>更换皮肤</p>

            </div>
            <div class="top-content">
              <h1>{{ $store.state.thisCourseInfo.name }}</h1>
              <h2>{{ $store.state.thisCourseInfo.classes }}</h2>
            </div>
            <div class="join-code">
              <img src="@/assets/img/main/qrcode.svg" alt>
              <span>加课码:{{ $store.state.thisCourseInfo.code }}</span>
              <span>已有{{ $store.state.thisCourseInfo.studentCount }}人加入</span>
            </div>
            <el-button v-if="$store.state.thisCourseInfo && $store.state.thisCourseInfo.connect === 'study'"
                       disabled round icon="el-icon-video-play">暂无课堂
            </el-button>
            <div class="teacher-share" v-else>
              <p><i class="el-icon-view"></i>学生视角</p>
              <p><i class="el-icon-share"></i>分享 & 评审</p>
              <el-button class="shang-ke" round icon="el-icon-video-play">开始上课</el-button>
            </div>
          </div>
          <div class="center">
            <div class="button-group">
              <div v-for="(button,index) in submodule" :key="index" :class="modulename === button.name? 'active':''"
                   @click="isActive(button.name, button.routerName)">{{ button.title }}
              </div>
              <!--            <div :key="2" @click="isActive(key)"></div>-->
              <!--            <div :key="3" @click="isActive(key)"></div>-->
              <!--            <div :key="4" @click="isActive(key)"></div>-->
            </div>
          </div>
        </div>

      </div>
      <div class="class-body">
        <course-content/>
      </div>
    </div>


    <el-drawer
        title=""
        :visible.sync="drawer"
        direction="ltr"
        :before-close="handleClose">
      <div slot="title" style="width: 100%; text-align: center">
        <img src="@/assets/img/logo/logo-blue.png" alt="课堂派-logo" height="24px">
      </div>
      <ul>
        <li>我的课堂</li>
        <li v-if="$store.state.userInfo.identity ==='teacher'">备课区</li>
        <li v-if="$store.state.userInfo.identity ==='teacher'">虚拟教研室</li>
      </ul>
      <el-collapse v-model="activeNames" @change="handleChange">
        <el-collapse-item title="我学的课程" name="study">
          <class-card-in-collapse v-for="(course,index) in $store.state.littleStudyList" :key="index" :course="course"/>
        </el-collapse-item>
        <el-collapse-item title="我协助的课程" name="assist">
          <class-card-in-collapse v-for="(course,index) in $store.state.littleAssistList" :key="index"
                                  :course="course"/>
        </el-collapse-item>
        <el-collapse-item v-if="$store.state.userInfo.identity ==='teacher'" title="我教的课程" name="teach">
          <class-card-in-collapse v-for="(course,index) in $store.state.littleTeachList" :key="index" :course="course"/>
        </el-collapse-item>
      </el-collapse>
    </el-drawer>
  </div>
</template>

<script>
import HeaderRight from "@/components/header/HeaderRight";
import Logo from "@/components/header/Logo";
import ClassCardInCollapse from "@/components/main/ClassCardInCollapse";
import CourseContent from "@/pages/main/classDetail/couseContent/CourseContent";

export default {
  name: "ClassDetail",
  components: {CourseContent, ClassCardInCollapse, Logo, HeaderRight},
  data() {
    return {
      submodule: [
        {name: 'CourseContent', title: '课程学习', routerName: ''},
        {name: 'SingleStudentAnalysis', title: '学情分析', routerName: ''},
        {name: 'Score', title: '成绩管理', routerName: ''},
        {name: 'CourseSetting', title: '课程介绍', routerName: ''},
      ],
      drawer: false,
      activeNames: [''],
      modulename: 'CourseContent',
      courseId: '',
    }
  },
  methods: {
    openDrawer() {
      this.drawer = true;
      if (this.once) return;
      this.once = true;
      console.log(this.once)
      this.$store.dispatch('getAllCourses');
    },
    isActive(e) {
      this.modulename = e;
    },
    handleClose(done) {
      done();
      // this.$confirm('确认关闭？')
      //     .then(_ => {
      //       done();
      //     })
      //     .catch(_ => {});
    },
    handleChange(val) {
      console.log(val);
    },
    beforeGet() {
      if (!this.$route || !this.$route.query.courseId) this.$router.replace({name: 'main'});
      let k = 0;
      for (let queryKey in this.$route.query) {
        k++;
      }
      if (k === 0 && this.$route.query.courseId) this.$router.replace({name: 'main'});
      else {
        this.courseId = this.$route.query.courseId
      }
    },
    async loading() {
      if (!sessionStorage.getItem('ktp_token'))
        await this.$router.replace('login');
      this.beforeGet();
      await this.$store.dispatch("getUserInfo")
      await this.$store.dispatch("getCourseInfo", {courseId: this.$route.query.courseId, uid:this.$store.state.userInfo.uid});
    }
  },
  created() {
    this.loading();
  },
  mounted() {

  }
}
</script>

<style scoped>
.class-navigate .class-navigate-content {
  z-index: 200;
}

.class-navigate {
  height: 71px;
  width: 100%;
  margin-bottom: 12px;
  box-sizing: border-box;
  background-color: #fff;
  box-shadow: 0 0 10px #ccc;
}

.class-navigate-content {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 70px;
  line-height: 70px;
  padding: 0 30px;
  margin: 0 auto;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-between;
  align-items: center;
  background-color: #fff;
  box-shadow: 0 1px 0 0 #dfdfdf;
}

.class-navigate-content i {
  font-size: 20px;
}

/deep/ .el-breadcrumb {
  width: 83%;
}

/deep/ .el-breadcrumb__item .el-breadcrumb__inner {
  font-size: 16px;
  font-weight: 400;
  color: #1f2023;
}

/deep/ .el-drawer__close-btn {
  position: absolute;
  float: left;
}

/deep/ .el-drawer__header {
  padding: 12px !important;
  margin: 0 !important;
}

/deep/ .el-drawer {
  width: 310px !important;
}

.el-drawer__body ul {
  padding-bottom: 10px;
}

.el-drawer__body ul li {
  cursor: pointer;
  padding: 0 12px;
  height: 46px;
  line-height: 46px;
  font-size: 17px;
  font-weight: 500;
  color: #1f2023;
}

.el-drawer__body ul li:hover {
  background-color: rgb(236, 243, 254);
}

.el-collapse {
  border: none;
}

/deep/ .el-collapse-item__header {
  padding: 0 12px;
  font-size: 16px;
  font-weight: 500;
}

/deep/ .el-collapse-item__content {
  padding-bottom: 5px;
}

.body {
  width: 1350px;
  margin: 0 auto;
  overflow: hidden;
}

.class-header {
  width: 100%;
}

.header-top {
  width: 100%;
  border: 1px solid #dadce0;
  border-radius: 8px;
  box-shadow: 0 2px 4px 0 #00000019;
}

.top {
  color: white;
  width: 100%;
  border-radius: 8px 8px 0 0;
  padding: 25px;
  background-color: #6D7790;
  position: relative;
}

.class-header .top .top-content {
  padding-top: 5px;
  margin-bottom: 15px;
  align-items: center;
}

.top-content h1 {
  font-size: 36px;
  line-height: 40px;
}

.top-content h2 {
  margin-top: 5px;
  font-size: 20px;
  line-height: 32px;
  font-weight: 400;
}

.join-code {
  height: 16px;
  line-height: 16px;
  display: flex;
  margin-top: 70px;
}

.join-code img, .join-code span {
  cursor: pointer;
}

.join-code span:nth-child(2) {
  margin-left: 5px;
}

.join-code span:nth-child(3) {
  margin-left: 20px;
}

/deep/ .header-top .top > .el-button {
  position: absolute;
  right: 30px;
  bottom: 25px;
  display: flex;
  align-items: center;
}

.shang-ke {
  color: #ff6000;
}

/deep/ .header-top .top .el-button i {
  font-size: 18px;
  margin-right: 5px;
}

.center {
  height: 66px;
}

.button-group {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.button-group div {
  cursor: pointer;
  height: 40px;
  line-height: 40px;
  margin: 0 24px;
  text-align: center;
  font-size: 22px;
  padding: 1px 5px;
}

.button-group div.active {
  background: #e8f0ff;
  color: #4285f4;
  border-radius: 10px;
}

.class-body {
  margin-top: 15px;
}

.teacher-share {
  position: absolute;
  display: flex;
  right: 30px;
  bottom: 20px;
}

.teacher-share p {
  cursor: pointer;
  display: flex;
  align-items: center;
  margin-right: 30px;
}

.teacher-share p i {
  margin-right: 5px;
}

.teacher-setting {
  position: absolute;
  right: 28px;
}

.teacher-setting p {
  display: inline;
  cursor: pointer;
  margin-left: 15px;
}
.teacher-setting p i{
  display: inline;
  margin-right: 5px;
}


</style>