<template>
  <div class="card">
    <div class="left">
      <img src="@/assets/img/main/classdetail/homework.png" alt>
      <span>作业</span>
    </div>
    <div class="right">
      <h6 @click="toHomework">{{ homework.title }}</h6>
      <div v-show="homework.published">
                <span>
                  提交截止时间：{{ deadline }}
                  <div class="cutting-line"></div>
                  <span v-show="parseInt(this.homework.start) >= parseInt(this.homework.deadline)">已结束</span>
                </span>
        <div v-show="parseInt(this.homework.start) >= parseInt(this.homework.deadline)" class="cutting-line"></div>
        <span>{{ homework.type }}</span>
      </div>
      <div v-show="!homework.published">
                <span>
                  <span>未发布</span>
                </span>
        <div class="cutting-line"></div>
        <span>个人作业</span>
      </div>
      <p v-show="homework.published">
        <span v-if="homework.commited" class="finish">已批改 {{ homework.score }}</span>
        <span v-show="homework.commited" class="finish">未批改</span>
        <span v-show="$store.state.thisCourseInfo.connect==='study'&&!homework.commited" class="finish">未提交</span>
      </p>
    </div>
    <el-button class="teacher-choice" @click="toHomework"
               v-show="homework.published&&!homework.commited && $store.state.thisCourseInfo.connect==='study'"
               type="primary">提交作业
    </el-button>
    <div v-show="$store.state.thisCourseInfo.connect ==='teach'" class="teacher-choice">
      <div v-show="homework.published">
        <h6>{{ homework.checked }}</h6>
        <div class="title">
          已批完
        </div>
      </div>
      <div v-show="homework.published">
        <h6>{{ homework.unchecked }}</h6>
        <div class="title">
          未批完
        </div>
      </div>
      <div v-show="homework.published">
        <h6>{{ homework.uncommit }}</h6>
        <div class="title">
          未交
        </div>
      </div>
      <div v-show="!homework.published" class="commit" @click="showForm">
        <i class="el-icon-position"></i>
        发布
      </div>
      <div class="cutting-line-bigger"></div>
      <el-dropdown trigger="click" placement="bottom">
        <div class="more">
          <i class="el-icon-more"></i>
          更多
        </div>

        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>编辑</el-dropdown-item>
          <el-dropdown-item>移动到章节</el-dropdown-item>
          <el-dropdown-item>保存到备课区</el-dropdown-item>
          <el-dropdown-item>删除</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
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
            <el-radio-group v-model="homework.type">
              <el-radio label="个人作业">个人作业</el-radio>
              <el-radio label="小组作业">小组作业</el-radio>
              <el-radio label="评审型作业" disabled>评审型作业 <b style="color: #eb5050">VIP</b></el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="作业标题" required>
            <el-input v-model="homework.title" placeholder="作业标题"></el-input>
          </el-form-item>
          <imcoder-tinymce :value="homework.content"/>
          <el-form-item label="活动类型标签">
            <el-input v-model="homework.label" style="width: 30%"></el-input>
          </el-form-item>
          <el-form-item label="应用环节" style="display: inline-block">
            <el-select v-model="homework.link" placeholder="请选择">
              <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="所属章节" style="display: inline-block">
            <el-select v-model="homework.section" placeholder="请选择">
            </el-select>
          </el-form-item>
        </el-form>
        <div style="width: 100%;">
          <el-form style="padding: 10px 0 10px 20px">
            <el-form-item required label="发布时间" style="display: inline-block">
              <el-date-picker v-model="homework.start"
                              type="datetime"
                              placeholder="选择日期时间">
              </el-date-picker>
            </el-form-item>
            <el-form-item required label="截止日期" style="display: inline-block">
              <el-date-picker v-model="homework.deadline"
                              type="datetime"
                              placeholder="选择日期时间">
              </el-date-picker>
            </el-form-item>
            <el-form-item required label="作业提交格式">
              <el-radio-group v-model="homework.commitType">
                <el-radio label="all">所有格式(支持文档、图片、音视频等共80种格式)</el-radio>
                <el-radio label="doc">查看文档格式(支持doc、docx、pdf格式，系统可以对学生提交的作业自动查重)</el-radio>
                <el-radio label="limit">限制学生文档格式(指定学生文档格式)</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item required label="总分">
              <el-input v-model="homework.total" style="width: 30%"></el-input>
            </el-form-item>
          </el-form>
        </div>

      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="createVisible = false">取 消</el-button>
        <el-button type="primary" @click="commit">发 布</el-button>
      </span>

    </el-dialog>

  </div>
</template>

<script>
import ImcoderTinymce from "@/components/ImcoderTinymce";
import elDragDialog from "@/directive/el-dragDialog";
import {Msg} from "@/util/message";

export default {
  name: "AssignmentCard",
  directives: {elDragDialog},
  components: {ImcoderTinymce},
  props: ['work'],
  data() {
    return {
      homework: this.work,
      createVisible: false,
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
    toHomework() {
      this.$router.push({
        name: 'homework',
        query: {
          courseId: this.$route.query.courseId,
          homeworkId: this.homework.hid
        },
        params: {
          'homework': this.homework
        }
      })
    },
    handleClose(done) {
      done();
    }
    ,
    showForm() {
      this.homework.start = new Date();
      this.createVisible = true;
    }
    ,
    commit() {
      if (this.homework.title === '') {
        Msg.error('请输入作业名称');
        return;
      }

      if (this.homework.deadline === null) {
        Msg.error(('请选择截止时间'));
        return;
      }
      if (this.homework.start >= this.homework.deadline) {
        Msg.error('作业结束时间不能小于当前时间');
        return;
      }
      if (this.homework.total === '0') this.homework.total = '100';

      this.homework.published = true;
      if (this.$store.dispatch('commitHomework', this.homework)) {
        this.createVisible = false;
        this.$forceUpdate();
      }
    }
  },
  computed: {
    deadline() {
      return new Date(parseInt(this.homework.deadline)).toLocaleString();
    }
  }
}
</script>

<style scoped>
.card {
  width: 100%;
  display: flex;
}

.left {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 40px;
  margin-left: 20px;
}

.left img {
  height: 45px;
  max-width: 45px;
  margin-bottom: 12px;
}

.left span {
  line-height: 18px;
  color: #3c4043;
  font-size: 15px;
  margin: 5px 0 2px;
}

.right h6 {
  font-size: 18px;
  margin-bottom: 15px;
  max-width: 500px;
  cursor: pointer;
  color: #212121;
}

.right div span {
  color: #5f6368;
  font-size: 14px;
}

.cutting-line, .cutting-line-bigger {
  display: inline-block;
  width: 1px;
  height: 1em;
  margin: 0 8px;
  background-color: #dadce0;
  position: relative;
}

.cutting-line-bigger {
  height: 3em;
}

.right p {
  padding-top: 8px;
}

.right p span {
  font-size: 14px;
  color: #4285f4;
}

.teacher-choice {
  position: absolute;
  right: 40px;
  display: flex;
}

.teacher-choice div {
  color: #747980;
  cursor: pointer;
  margin: 0 10px;
  display: flex;
  flex-direction: column;
  text-align: center;
  font-size: 14px;
}

.teacher-choice div i {
  font-size: 28px;
}

.teacher-choice div.more i {
  font-size: 18px;
  padding: 5px 0;
}

.teacher-choice div h6 {
  font-size: 24px;
  color: #4285f4;
}
</style>