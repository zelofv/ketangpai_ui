<template>
  <div class="assignment">
    <div class="top">
      <span>共{{ $store.state.homeworks.length }}个活动</span>
      <div v-if="$store.state.thisCourseInfo.connect && $store.state.thisCourseInfo.connect !== 'study'"
           class="teacher-tool">
        <p><i class="el-icon-d-caret"></i>排序</p>
        <el-button><i class="el-icon-finished"></i>批量操作</el-button>
        <p><i class="el-icon-download"></i>下载所有作业<i class="el-icon-arrow-down"></i></p>
        <el-button round type="success" @click="()=>{createVisible = true; formData = newFormData}"><i
            class="el-icon-plus"></i> 添加作业
        </el-button>
      </div>
    </div>
    <div class="assignment-card">
      <ul class="inner">
        <li v-for="(work, index) in $store.state.homeworks" :key="index">
          <assignment-card :work="work"/>
        </li>
      </ul>
    </div>


    <el-dialog class="create"
               title="添加作业"
               v-el-drag-dialog
               :visible.sync="createVisible"
               width="60%"
               :before-close="handleClose">

      <div>
        <el-form>
          <el-form-item label="作业类型" required>
            <el-radio-group v-model="formData.type">
              <el-radio label="个人作业">个人作业</el-radio>
              <el-radio label="小组作业">小组作业</el-radio>
              <el-radio label="评审型作业" disabled>评审型作业 <b style="color: #eb5050">VIP</b></el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="作业标题" required>
            <el-input v-model="formData.title" placeholder="作业标题"></el-input>
          </el-form-item>
          <imcoder-tinymce :value="formData.content"/>
          <el-form-item label="活动类型标签">
            <el-input v-model="formData.label" style="width: 30%"></el-input>
          </el-form-item>
          <el-form-item label="应用环节" style="display: inline-block">
            <el-select v-model="formData.link" placeholder="请选择">
              <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="所属章节" style="display: inline-block">
            <el-select v-model="formData.section" placeholder="请选择">
            </el-select>
          </el-form-item>
        </el-form>
        <div style="color: rgb(255, 96, 0);">
          <el-switch v-model="formData.published" active-color="#13ce66"></el-switch>
          是否立即发布
        </div>
        <div v-show="formData.published" style="width: 100%; background-color: #f8f9fa">
          <el-form style="padding: 10px 0 10px 20px">
            <el-form-item required label="发布时间" style="display: inline-block">
              <el-date-picker v-model="formData.start"
                              type="datetime"
                              placeholder="选择日期时间">
              </el-date-picker>
            </el-form-item>
            <el-form-item required label="截止日期" style="display: inline-block">
              <el-date-picker v-model="formData.deadline"
                              type="datetime"
                              placeholder="选择日期时间">
              </el-date-picker>
            </el-form-item>
            <el-form-item required label="作业提交格式">
              <el-radio-group v-model="formData.commitType">
                <el-radio label="all">所有格式(支持文档、图片、音视频等共80种格式)</el-radio>
                <el-radio label="doc">查看文档格式(支持doc、docx、pdf格式，系统可以对学生提交的作业自动查重)</el-radio>
                <el-radio label="limit">限制学生文档格式(指定学生文档格式)</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item required label="总分">
              <el-input v-model="formData.total" style="width: 30%"></el-input>
            </el-form-item>
          </el-form>
        </div>

      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="createVisible = false">取 消</el-button>
        <el-button type="primary" @click="commitHomework">确 认</el-button>
      </span>

    </el-dialog>
  </div>
</template>

<script>
import AssignmentCard from "@/components/main/AssignmentCard";
import elDragDialog from "@/directive/el-dragDialog";
import ImcoderTinymce from "@/components/ImcoderTinymce";

export default {
  name: "Assignment",
  directives: {elDragDialog},
  components: {ImcoderTinymce, AssignmentCard},
  data() {
    return {
      createVisible: false,
      formData: {
        type: '个人作业',
        title: '',
        content: '',
        label: '作业',
        link: '',
        section: '',
        courseId: this.$store.state.thisCourseInfo.courseId,
        start: new Date(),
        deadline: null,
        total: '0',
        published: false,
        commitType: 'all',
      },
      newFormData: {
        type: '个人作业',
        title: '',
        content: '',
        label: '作业',
        link: '',
        section: '',
        courseId: this.$store.state.thisCourseInfo.courseId,
        start: new Date(),
        deadline: null,
        total: '0',
        published: false,
        commitType: 'all',
      },
      options: [
        {value: 0, label: '课前'},
        {value: 1, label: '课中'},
        {value: 2, label: '课后'},
        {value: 3, label: '期中'},
        {value: 4, label: '期末'},
      ]
    }
  },
  methods: {
    handleClose(done) {
      done();
    },
    async commitHomework() {
      if (this.formData.title === '') {
        this.$message.error('请输入作业名称');
        return;
      }
      if (this.formData.published === false) {
        if (this.formData.total === '0') this.formData.total = '100';
        this.formData.start = null;
      } else {
        if (this.formData.deadline === null) return;
        if (typeof this.formData.start !== "string") {
          if (this.formData.start.getTime() >= this.formData.deadline.getTime()) {
            this.$message.error('作业结束时间不能小于当前时间');
            return;
          }
        }
        if (this.formData.total === '0') this.formData.total = '100';
      }
      this.formData.courseId = this.$store.state.thisCourseInfo.courseId;
      if (await this.$store.dispatch('addHomework', this.formData)) {
        this.createVisible = false;
      }
      this.$forceUpdate();
    },
  },
}
</script>

<style scoped>
.assignment {
  width: 100%;
}

.assignment-card {
  border-radius: 8px;
  padding-top: 16px;
  border: 1px solid #e7ebf0;
}

.top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
}


.teacher-tool {
  display: flex;
  font-size: 16px;
  font-weight: 500;
  color: #4285f4;
}

.teacher-tool p {
  cursor: pointer;
  display: flex;
  align-items: center;
  margin: 0 20px;
}

.teacher-tool p i {
  margin: 0 5px;
}

.inner li {
  padding: 10px 16px 5px 16px;
}

/deep/ .el-button--success {
  background-color: #33d5a6;
}

/deep/ .el-form-item__content {
  display: flex;
  flex-direction: row;
  height: 40px;
  align-items: center;
  margin-right: 10px;
}

</style>