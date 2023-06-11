<template>
  <!--  我的课堂-->
  <div class="main">
    <MainHeader/>
    <div class="class-body">
      <div class="join-button">
        <el-button class="join-class" v-if="$store.state.userInfo.identity === 'student'" type="primary"
                   @click="joinCourseDialogVisible=true">
          <i class="el-icon-plus"></i>加入课程
        </el-button>
        <el-dropdown trigger="click" placement="bottom">
          <el-button class="join-class" v-if="$store.state.userInfo.identity === 'teacher'" type="primary">
            <i class="el-icon-plus"></i>创建/加入课程
          </el-button>


          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="createCourseDialogVisible=true">创建课程</el-dropdown-item>
            <el-dropdown-item @click.native="joinCourseDialogVisible=true">加入课程</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <top-class v-if="$store.state.topClasses.length!==0"/>
      <div class="class-selection-menu">
        <div class="left">
          <el-tabs v-if="$store.state.userInfo.identity==='student'" v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="我学的" name="study"></el-tab-pane>
            <el-tab-pane label="我协助的" name="assist"></el-tab-pane>
          </el-tabs>
          <el-tabs v-if="$store.state.userInfo.identity==='teacher'" v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="我教的" name="teach"></el-tab-pane>
            <el-tab-pane label="我协助的" name="assist"></el-tab-pane>
            <el-tab-pane label="我学的" name="study"></el-tab-pane>
          </el-tabs>
        </div>
        <div class="right">
          <el-button style="height: 42px">归档管理</el-button>
          <el-input placeholder="搜索我学的课程" suffix-icon="el-icon-search" v-model="queryClass" clearable></el-input>
        </div>
      </div>


      <div>
        <div v-show="$store.state.semesterList.length===0" class="none">
          <div class="img-box"><img src="@/assets/img/main/bg-none.png" alt></div>
          暂无课程
        </div>

        <course-list-every-term v-show="$store.state.semesterList.length!==0"
                                v-for="(semester, index) in $store.state.semesterList"
                                :connect="activeName"
                                :semester="semester" :index="index"
                                :key="Math.random()*1000000"/>
      </div>


    </div>
    <RightMenu/>
    <el-dialog
        title="加入课程"
        v-el-drag-dialog
        :visible.sync="joinCourseDialogVisible"
        width="50%"
        :before-close="handleClose">
      <el-form>
        <el-form-item label="加课码" label-width="80px" prop="code">
          <el-input placeholder="请输入课程加课码" v-model="joinClassCode" clearable></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="joinCourseDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="commitJoin">确 认</el-button>
      </span>
    </el-dialog>
    <el-dialog class="create"
               title="创建课程"
               v-el-drag-dialog
               :visible.sync="createCourseDialogVisible"
               width="60%"
               :before-close="handleClose">
      <el-form>
        <el-form-item label="课程名称" label-width="80px" prop="code">
          <el-input v-model="courseForm.name" maxlength="50" clearable></el-input>
        </el-form-item>
        <el-form-item label="教学班级" label-width="80px" prop="code">
          <el-input v-model="courseForm.classes" maxlength="30" clearable></el-input>
        </el-form-item>
        <el-form-item label="选择学年 - 学期" label-width="120px" prop="code">
          <el-col>
            <el-select v-model="courseForm.year" placeholder="请选择学年">
              <el-option label="2021-2022" value="2021-2022"></el-option>
              <el-option label="2022-2023" value="2022-2023"></el-option>
              <el-option label="2023-2024" value="2023-2024"></el-option>
              <el-option label="2019-2020" value="2019-2020"></el-option>
              <el-option label="2020-2021" value="2020-2021"></el-option>
            </el-select>
          </el-col>
          <el-col>
            <el-select v-model="courseForm.term" placeholder="请选择学期">
              <el-option label="全年" value="全年"></el-option>
              <el-option label="第一学期" value="第一学期"></el-option>
              <el-option label="第二学期" value="第二学期"></el-option>
            </el-select>
          </el-col>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="joinCourseDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="createCourse">确 认</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import MainHeader from "@/pages/main/MainHeader";
import TopClass from "@/pages/main/TopClass";
import RightMenu from "@/pages/main/RightMenu";
import CourseListEveryTerm from "@/components/main/CourseListEveryTerm";
import elDragDialog from "@/directive/el-dragDialog";
import {addCourse} from "@/api/courseApi";

export default {
  name: "Main",
  directives: {elDragDialog},
  components: {CourseListEveryTerm, RightMenu, TopClass, MainHeader},
  data() {
    return {
      queryClass: '',
      oldActiveName: '',
      activeName: '',
      createCourseDialogVisible: false,
      joinCourseDialogVisible: false,
      joinClassCode: '',
      selectTerm: '',
      courseForm: {
        name: '',
        classes: '',
        year: '',
        term: '',
      }
    }
  },
  methods: {
    async handleClick(tab, event) {
      if (this.oldActiveName === this.activeName) return;
      this.oldActiveName = tab.name;
      let data = {
        uid: this.$store.state.userInfo.uid,
        connect: tab.name,
      }
      await this.$store.dispatch('getSemesterList', data);
    },
    handleClose(done) {
      done();
    },
    async createCourse() {
      if (this.courseForm.term === null
          || this.courseForm.year === null
          || this.courseForm.classes === null
          || this.courseForm.name === null) return;
      let course = {
        name: this.courseForm.name,
        admin: this.$store.state.userInfo.name,
        adminId: this.$store.state.userInfo.uid,
        classes: this.courseForm.classes,
        semester: this.courseForm.year + ' ' + this.courseForm.term,
        img: 'https://assets.ketangpai.com/theme/min/' + Math.floor(Math.random() * 33 + 1) + '.jpg'
      };
      await addCourse(course)
          // .then(res => {return res.data;})
          .then(data => {
            if (data.status === 200) {
              this.$message.success(data.message);
              this.createCourseDialogVisible = false;
            } else {
              this.$message.error(data.message);
            }
          });
    },
    commitJoin() {
      if (this.joinClassCode === '') {
        this.$message.warning('请输入加课码');
        return;
      }
      this.$store.dispatch('joinCourse', this.joinClassCode)
          .then(data => {
        this.$router.push({
          name: 'classDetail',
          query: {
            courseId: data,
          }
        })
      })
    },
    async loading() {
      if (!localStorage.getItem('ktp_token'))
        await this.$router.replace('login');
      // await this.$store.dispatch("getUserInfo").then(() => {
      this.activeName = this.$store.state.userInfo.identity === 'student' ? 'study' : 'teach';
      this.oldActiveName = this.activeName;
      // }).then(() => {
      this.$store.dispatch('getTopCourses');
      this.$store.dispatch('getSemesterList');
      // })
    }
  },
  created() {
    this.loading()
  },
  mounted() {
    if (this.$store.state.userInfo.avatar === '') {
      this.$forceUpdate();
    }
  }
}
</script>

<style scoped>
.none {
  margin: 0 auto;
  padding: 60px 0;
  width: 100%;
  text-align: center;
}

.img-box img {
  height: 200px;
  display: block;
  margin: 0 auto;
}

.main {
  width: 100%;
  /*height: 100%;*/
}

.class-body {
  width: 1250px;
  margin: 0 auto;
  overflow: hidden;
}

.class-selection-menu {
  margin-top: 30px;
  display: flex;
  justify-content: space-between;
  padding: 20px 0;
}

.class-selection-menu .right {
  display: flex;
  width: 30%;
  justify-content: space-between;
}

/deep/ .right .el-input {
  margin-left: 25px;
}

/deep/ .right .el-input__inner {
  border-radius: 51px;
}


/deep/ .el-tabs__item {
  font-size: 18px;
  color: #3c4043
}

.join-button {
  width: 100%;
  transform: translate(-30px, 20px);
  display: flex;
  justify-content: end;
}

/deep/ .join-class.el-button--primary {
  background-color: #4285f4;
  border-color: #4285f4;
}


/deep/ .el-dialog {
  border-radius: 10px;
  margin-top: 33vh !important;
}

/deep/ .create .el-dialog {
  border-radius: 10px;
  margin-top: 15vh !important;
}

/deep/ .el-dialog__title {
  font-size: 18px;
  color: #3c4043;
  font-weight: 700;
}

/deep/ .el-dialog__body {
  padding: 20px 15px 15px 15px;
  border-top: 1px solid #dadce0;
  border-bottom: 1px solid #dadce0;
}

/deep/ .el-dialog__body .el-input__inner {

}

/deep/ .el-form-item__content {
  display: flex;
  justify-content: space-around;
}
</style>