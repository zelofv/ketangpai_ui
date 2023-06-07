<template>
  <div class="class-card-box">
    <ClassCard v-for="(course,index) in courses" :key="index" :course="course"/>
  </div>
</template>

<script>
import ClassCard from "@/components/main/ClassCard";
export default {
  name: "ClassCardBox",
  components: {ClassCard},
  props: ["courses"],
}
</script>

<style scoped>

.class-card-box {
  width: 100%;
  height: 100%;
  margin: 8px -10px 0 -10px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}

.is-top-card-box {
  max-height: 350px; /*顶部固定*/
overflow-y: scroll;
}
</style>