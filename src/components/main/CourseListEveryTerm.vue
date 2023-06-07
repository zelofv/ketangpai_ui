<template>

    <div class="course-list" :style="listStyle">
      <div class="course-list-title">
        <h2>{{ semester }}</h2>
        <span v-show="showList" @click="foldList"><i class="el-icon-caret-top"></i>收起</span>
        <span v-show="!showList" @click="unfoldList"><i class="el-icon-caret-bottom"></i>展开</span>
      </div>
      <ClassCardBox :courses="courseList" v-if="showList"/>
    </div>

</template>

<script>
import ClassCardBox from "@/components/main/ClassCardBox";

export default {
  name: "CourseListEveryTerm",
  props: ['semester','index', 'connect'],
  components: {ClassCardBox},
  data() {
    return {
      showList: false,
      listStyle: "",
      courseList: [],
    }
  },
  computed: {
    queryData() {
      return {
        uid: this.$store.state.userInfo.uid,
        connect:this.connect,
        semester:this.semester,
      }
    }
  },
  methods: {
    unfoldList() {
      this.listStyle = "height: auto;";
      this.showList = !this.showList;

      this.$store.dispatch('getCoursesBySemester', this.queryData)
          .then(res=> {
            this.courseList = res;
          });
    },
    foldList() {
      this.listStyle = '';
      this.showList = !this.showList;
    }
  },
  created() {
    if(this.index===0) {
      this.unfoldList();
    }
  },
}
</script>

<style scoped>
.course-list {
  width: 100%;
  border: 1px solid #dadce0;
  background-color: #f8f9fa;
  margin-bottom: 25px;
  border-radius: 8px;
  padding: 20px;
  transition: .3s ease;
}

.course-list-title {
  /*margin-bottom: 15px;*/
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.course-list-title h2 {
  color: #000;
  font-size: 17px;
  font-weight: 400;
}

.course-list-title span {
  cursor: pointer;
  user-select: none;
  color: #4285f4;
  padding-right: 20px;
}

.course-list-title span:hover {
  color: rgb(104, 157, 246);
}

.course-list-title i {
  margin-right: 5px;
}

</style>