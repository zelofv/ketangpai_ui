import {get, post} from "@/api/http";


export function getCourseByCourseId(courseId) {
    return post('/getCourseByCourseId', courseId);
}
export function addCourse(course) {
    return post('/addCourse', course);
}

export function getTopCourses(uid) {
    return get('/getTopCourses', {uid: uid});
}

export function joinCourse(code, uid) {
    return post('/joinCourse',{code, uid});
}

export function cancelTopCourse(courseId, uid) {
    return post('/cancelTopCourse', {courseId: courseId, uid: uid});
}

export function topCourse(courseId, uid) {
    return post('/topCourse', {courseId: courseId, uid: uid});
}

export function getSemesterList(uid, connect) {
    return post('/getSemesterList', {uid,connect});
}

export function getCourseListBySemester(uid, connect, semester) {
    return post('/getCourseListBySemester', {uid, connect, semester});
}

export function getAllCourses(uid) {
    return post('getAllCourses', {uid})
}