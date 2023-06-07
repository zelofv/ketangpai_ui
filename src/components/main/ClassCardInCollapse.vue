<template>
  <div class="collapse-class-card">
    <el-avatar :size="50" :src="course.img"></el-avatar>
    <div class="content">
      <h3>{{ course.name }}</h3>
      <p>{{ course.classes }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "ClassCardInCollapse",
  props: ['course'],
}
</script>

<style scoped>
.collapse-class-card {
  padding: 12px 12px 0;
  display: flex;
}
.content {
  width: 200px;
  margin-left: 16px;
}
h3, p {
  display: -webkit-box; /* 将对象作为弹性伸缩盒子模型显示 */
  overflow: hidden;
  -webkit-line-clamp: 1; /* 限制在一块元素显示的文本的行数 */
  -webkit-box-orient: vertical; /* 设置或检索伸缩盒对象的子元素的排列方式 */
}

h3 {
  font-size: 16px;
  font-weight: 500;
  color: #3c4043;
  line-height: 28px;
}
p {
  font-size: 14px;
  font-weight: 400;
  color: #74787c;
  line-height: 22px;
}
</style>