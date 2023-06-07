import {post} from "@/api/http";


export function addHomework(homework) {
    return post('/addHomework', homework);
}

export function commitHomework(homework) {
    return post('/commitHomework', homework);
}

export function getHomeworkList(courseId, uid, connect) {
    return post('/getHomeworkList', {cid:courseId, uid, connect});
}

export function  getHomeworkInfo(uid, hid) {
    return post('/getHomeworkInfo', {uid,hid});
}