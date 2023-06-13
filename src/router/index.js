import Router from "vue-router";
import HomePage from "@/pages/indexpage/homepage/HomePage";
import IndexPage from "@/pages/indexpage/IndexPage";

const router = new Router({
    routes: [
        // {
        //     path: '',
        //     redirect: '/homePage',
        // },
        {
            path: '',
            redirect: '/main',
        },
        {
            path: '',
            name: 'indexPage',
            component: IndexPage,
            children: [
                {
                    path: 'homePage',
                    name: 'homePage',
                    component: HomePage,
                },
            ],
        },
        {
            path: '/login',
            name: 'loginAndRegister',
            component: () => import('@/pages/login/LoginAndRegister'),
            children: [
                {
                    path: '/login',
                    name: 'login',
                    component: () => import('@/pages/login/Login'),
                },
                {
                    path: '/register',
                    name: 'register',
                    component: () => import('@/pages/register/Register'),
                }
            ],
        },
        {
            path: '/main',
            name: 'main',
            component: () => import('@/pages/main/Main')
        },
        {
            path: '/main/classDetail',
            name: 'classDetail',
            component: () => import('@/pages/main/classDetail/ClassDetail')
        },
        {
            path: '/homework',
            name: 'homework',
            component: () => import('@/pages/homework/HomeWork')
        }
    ]
})
//
// router.beforeEach((to, from, next) => {
//     if (to.name !== 'login' || to.name !== 'register') {
//         if (sessionStorage.getItem('ktp_token')) {
//             next();
//         } else {
//             router.replace({name: 'login'})
//         }
//     }
// })

export default router;