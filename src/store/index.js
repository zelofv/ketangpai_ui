import Vue from "vue";
import Vuex from 'vuex';
import {getUser} from "@/api/userApi";
import {
    cancelTopCourse, getAllCourses,
    getCourseByCourseId,
    getCourseListBySemester,
    getSemesterList,
    getTopCourses, joinCourse,
    topCourse
} from "@/api/courseApi";
import {Msg} from "@/util/message";
import {addHomework, commitHomework, getHomeworkInfo, getHomeworkList} from "@/api/homeworkApi";

Vue.use(Vuex)

const actions = {
     async getUserInfo(context) {
         let user = JSON.parse(sessionStorage.getItem('user'));
         if (user) {
             state.userInfo = user;
             return;
         }
         await getUser()
             .then(res => {
                 context.commit('getUserInfo', res.data);
             })
     },
    getCourseInfo(context, courseId) {
        getCourseByCourseId(courseId)
            .then(res => {
                context.commit('getCourseInfo', res.data);
            })
    },
    getTopCourses(context) {
        getTopCourses(context.state.userInfo.uid)
            .then(res => {
                context.commit('getTopCourses', res.data);
            })
    },

    push(context, page) {
        if (page.this.$route.name === page.name) return;
        context.commit('push', page);
    },
    replace(context, page) {
        if (page.this.$route.name === page.name) return;
        context.commit('replace', page);
    },
    async cancelTopCourse(context, course) {
        if (!course.top) {
            return;
        }
        let data = await cancelTopCourse(course.courseId, context.state.userInfo.uid)
            .then(data => {
                if (data.status !== 200) {
                    return data;
                } else {
                    context.dispatch('getTopCourses');
                }
            })
        if (data) return data;
    },
    async topCourse(context, course) {
        if (course.top) {
            return;
        }
        let data = await topCourse(course.courseId, context.state.userInfo.uid)
            .then(data => {
                if (data.status !== 200) {
                    return data;
                } else {
                    context.dispatch('getTopCourses');
                }
            })
        if (data) return data;
    },
    joinCourse(context, code) {
        return joinCourse(code, context.state.userInfo.uid)
            .then(res => {
                if (res) {
                    if (res.status === 200) {
                        Msg.success(res.message);
                    } else if (res.status === 410) {
                        Msg.warning(res.message);
                    } else {
                        Msg.error(res.message);
                    }
                    return res.data;
                }
            })
    },
    getCoursesBySemester(context, data) {
        return getCourseListBySemester(data.uid, data.connect, data.semester)
            .then(res => {
                if (res && res.status !== 200) {
                    Msg.error(res.message);
                } else {
                    return res.data;
                }
            })
    },
    getAllCourses(context) {
        getAllCourses(context.state.userInfo.uid)
            .then(res => {
                if (res && res.status !== 200) {
                    Msg.error(res.message);
                } else {
                    return res.data;
                }
            }).then(data => {
            context.commit('getAllCourses', data)
        })
    },
    addHomework(context, homework) {
        if (homework.published === true) {
            context.dispatch('commitHomework', homework);
        } else {
            if (homework.start !== null) {
                homework.start = homework.start.getTime();
            }
            if (homework.deadline !== null) {
                homework.deadline = homework.deadline.getTime();
            }

            return addHomework(homework)
                .then(res => {
                    if (res && res.status !== 200) {
                        Msg.error(res.message);
                    } else {
                        return true;
                    }
                })
        }
    },
    commitHomework(context, homework) {

        if (homework.start !== null) {
            homework.start = homework.start.getTime();
        }
        if (homework.deadline !== null) {
            homework.deadline = homework.deadline.getTime();
        }
        return commitHomework(homework)
            .then(res => {
                if (res && res.status !== 200) {
                    Msg.error(res.message);
                } else {
                    return true;
                }
            })
    },
    getHomeworkList(context, courseId) {
        getHomeworkList(courseId, context.state.userInfo.uid, context.state.thisCourseInfo.connect)
            .then(res => {
                if (res && res.status !== 200) {
                    Msg.error(res.message);
                } else {
                    return res.data;
                }
            }).then(data => {
            context.commit('getHomeworkList', data)
        })
    },
    getHomeworkInfo(context, params) {
        getHomeworkInfo(params.uid, params.hid)
            .then(res => {
                if (res && res.status !== 200) {
                    Msg.error(res.message);
                } else {
                    return res.data;
                }
            }).then(data => {
            context.commit('getHomeworkInfo', data)
        })
    }
}

const mutations = {
    getUserInfo(state, data) {
        sessionStorage.setItem('user', JSON.stringify(data))
        state.userInfo = data;
    },
    getCourseInfo(state, data) {
        state.thisCourseInfo = data;
    },
    getTopCourses(state, data) {
        state.topClasses = data;
    },
    getAllCourses(state, data) {
        state.littleTeachList = [];
        state.littleAssistList = [];
        state.littleStudyList = [];
        for (let course of data) {
            if (course.connect === 'teach') {
                state.littleTeachList.push(course)
            } else if (course.connect === 'study') {
                state.littleStudyList.push(course)
            } else if (course.connect === 'assist') {
                state.littleAssistList.push(course)
            }
        }
    },
    getCoursesBySemester(state, data) {

    },
    getHomeworkInfo(state, data) {
        state.thisHomeworkInfo = data;
    },
    getHomeworkList(state, data) {
        state.homeworks = data;
    },
    push(state, page) {
        page.this.$router.push({
            name: page.name,
        }).catch(alert);
    },
    replace(state, page) {
        page.this.$router.replace({
            name: page.name,
        }).catch(alert);
    }
}

const state = {
    login: false,
    userInfo: {
        avatar: '',
        deleted: false,
        email: '',
        identity: '',
        name: '',
        password: '',
        phone: '',
        school: '',
        sid: '',
        time: '',
        uid: ''
    },
    thisCourseInfo: {
        courseId: '',
        name: '',
        admin: '',
        adminId: '',
        classes: '',
        semester: '',
        mode: '',
        description: '',
        place: '',
        code: '',
        period: '',
        img: '',
        studentCount: '',
        connect: '',
    },
    classInfo: {},
    semesterList: [],
    topClasses: [],
    littleAssistList: [],
    littleTeachList: [],
    littleStudyList: [],
    homeworks: [],
    thisHomeworkInfo: {},
}

const getters = {}

export default new Vuex.Store({
    actions, mutations, state, getters
})