<template>
  <div class="class-card">
    <span v-if="course.mode !== null" class="mixture-class">{{ course.mode }}</span>
    <div @click="push('classDetail')" class="top-card"
         :style="{backgroundImage: 'url('+ course.img +')',backgroundSize:'cover' }">
      <p>{{ course.semester }}</p>
      <h3>{{ course.name }}</h3>
      <p>{{ course.classes }}</p>
      <div class="qrcode-content">
        <img src="@/assets/img/main/qrcode.svg" alt>
        <span>课堂码:{{ course.code }}</span>
      </div>
    </div>
    <div @click="push('classDetail')" class="content-card">

    </div>
    <div class="card-bottom">
      <div v-if="course.connect==='study'" class="left">
        <span class="study">学</span>
        <span> 负责人:{{ course.admin }} </span>
      </div>
      <div v-else class="left">
        <span v-if="course.connect ==='teach'">教</span>
        <span v-else>协</span>
        <span> 成员:{{ course.studentCount }}人 </span>
      </div>
      <div class="right">
        <span @click="topCourse" v-if="!course.top"><img src="@/assets/img/main/top-class.svg" alt>置顶</span>
        <span @click="cancelTopCourse" v-else>取消置顶</span>

        <el-dropdown trigger="click" placement="top">
         <span class="el-dropdown-link">
           <i class="el-icon-more"></i>
          </span>
          <el-dropdown-menu v-if="course.connect === 'study'" slot="dropdown">
            <el-dropdown-item>退课</el-dropdown-item>
            <el-dropdown-item>归档</el-dropdown-item>
          </el-dropdown-menu>
          <el-dropdown-menu v-else-if="course.connect==='teach'" slot="dropdown">
            <el-dropdown-item>删除</el-dropdown-item>
            <el-dropdown-item>编辑</el-dropdown-item>
            <el-dropdown-item>归档</el-dropdown-item>
            <el-dropdown-item>复制成新课程</el-dropdown-item>
            <el-dropdown-item>复制到已有课程</el-dropdown-item>
            <el-dropdown-item>打包下载</el-dropdown-item>
            <el-dropdown-item>复制到教研室</el-dropdown-item>
            <el-dropdown-item>转让</el-dropdown-item>
          </el-dropdown-menu>
          <el-dropdown-menu v-else slot="dropdown">
            <el-dropdown-item>编辑</el-dropdown-item>
            <el-dropdown-item>归档</el-dropdown-item>
            <el-dropdown-item>复制成新课程</el-dropdown-item>
            <el-dropdown-item>复制到已有课程</el-dropdown-item>
            <el-dropdown-item>打包下载</el-dropdown-item>
            <el-dropdown-item>复制到教研室</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>

<script>

import {Msg} from "@/util/message";

export default {
  name: "ClassCard",
  props: ['course'],
  data() {
    return {
    };
  },
  methods: {
    async cancelTopCourse() {
      let data = await this.$store.dispatch('cancelTopCourse', this.course);
      if (data) {
        if (data.status !== 200) {
          Msg.error(data.message);
        }
      }
    },
    async topCourse() {
      let data = await this.$store.dispatch('topCourse', this.course);
      if (data) {
        if (data.status !== 200) {
          Msg.error(data.message);
        }
      }
    },
    push(pageName) {
      this.$router.push({
        name: pageName,
        query: {
          courseId:this.course.courseId,
        },
        params: {
          course:this.course
        }
      })
    }
  }
}
</script>

<style scoped>

.class-card {
  width: 275px;
  height: 240px;
  margin: 11px;
  background: #fff;
  border: 1px solid #e2e6ed;
  position: relative;
  border-radius: 8px;
  overflow: hidden;
}

.mixture-class {
  width: 65px;
  height: 30px;
  border-radius: 0 0 0 8px;
  border-bottom: 2px solid #fff;
  border-left: 2px solid #fff;
  line-height: 30px;
  font-size: 15px;
  text-align: center;
  position: absolute;
  top: 0;
  right: 0;
  background: linear-gradient(270deg, #fac966 0, #ffe1ad);
  color: #6b512e;
}

.top-card {
  color: white;
  padding: 20px 25px;
  background-color: cornflowerblue;
  height: 65%;
}

.top-card p {
  font-size: 13px;
  line-height: 18px;
}

.top-card p:nth-child(1) {
  opacity: .6;
}

.top-card h3 {
  margin-top: 5px;
  font-size: 21px;
  font-weight: 500;
  line-height: 35px;
  display: -webkit-box; /* 将对象作为弹性伸缩盒子模型显示 */
  overflow: hidden;
  -webkit-line-clamp: 1; /* 限制在一块元素显示的文本的行数 */
  -webkit-box-orient: vertical; /* 设置或检索伸缩盒对象的子元素的排列方式 */
}

.top-card .qrcode-content {
  height: 16px;
  line-height: 16px;
  display: flex;
  margin-top: 20px;
}

.class-card img {
  width: 16px;
  margin-right: 6px;
}

.content-card {
  padding: 0 20px 16px;
  height: 45px;
}

.card-bottom {
  display: flex;
  padding: 8px 14px 12px;
  justify-content: space-between;
  /*line-height: 14px;*/
  font-size: 14px;
  font-weight: 400;
}

.card-bottom .left span:nth-child(1) {
  background-color: #4285f4;
  border: 1px solid #fff;
  color: #fff;
  padding: 2px;
  font-size: 13px;
  margin-right: 3px;
}

.card-bottom .left span.study {
  background-color: #fff;
  border: 1px solid #4285f4;
  color: #4285f4;
}

.card-bottom .right {
  display: flex;
  align-items: center;
}

.card-bottom .right span {
  display: flex;
  height: 16px;
  align-items: center;
  line-height: 16px;
}

.card-bottom .right i {
  width: 16px;
  height: 16px;
  line-height: 16px;
  margin-left: 10px;
  color: #606266;
}

.top-card, .content-card, .card-bottom .left span:nth-child(2), .card-bottom .right span {
  cursor: pointer;
}

.el-dropdown-menu {
  padding: 5px 0;
}

.el-dropdown-menu__item {
  font-size: 16px;
}
</style>