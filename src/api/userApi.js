import {get, post} from "@/api/http";

export function getUser() {
    return get('/userInfo', null);
}

export function getClasses() {
    return get('/classes', null);
}

export function getClassInfo(courseId) {
    return get('/classInfo', {courseId:courseId});
}