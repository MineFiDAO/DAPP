import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [{
    path: '/',
    redirect:'/store',
    name: 'index',
    component: () =>
        import('@/views/index'),
},
//用于静态首页
{
    path: '/home.html',
    name: 'home'    
},
{
    path: '/store',
    name: 'store',
    component: () =>
        import('@/views/store'),
},
{
    path: '/store/goods/:nodeid',
    name: 'goods',
    component: () =>
        import('@/views/store/goods'),
},
{
    path: '/store/goodsconfirm/:nodeid',
    name: 'goodsconfirm',
    component: () =>
        import('@/views/store/goodsconfirm'),
},
{
    path: '/fund/:tab?',
    name: 'fund',
    component: () =>
        import('@/views/fund'),
},
{
    path: '/user/tgindex',
    name: 'tgindex',
    component: () =>
        import('@/views/user/tgindex'),
},
{
    path: '/user/myprofitlog/:type/:p1?/:p2?',
    name: 'myprofitlog',
    component: () =>
        import('@/views/user/myprofitlog'),
},
{
    path: '/user/waitprofitlog',
    name: 'waitprofitlog',
    component: () =>
        import('@/views/user/waitprofitlog'),
},
{
    path: '/user/dayAvgProfit',
    name: 'dayAvgProfit',
    component: () =>
        import('@/views/user/dayAvgProfit'),
}

    // {
    //     path: '/demo',
    //     name: 'demo',
    //     component: () =>
    //         import('@/views/demo'),
    // },
    // {
    //     path: '/gametest',
    //     name: 'gametest',
    //     component: () =>
    //         import('@/views/gametest'),
    // },
    // {
    //     path: '/gamereturn',
    //     name: 'gamereturn',
    //     component: () =>
    //         import('@/views/gamereturn'),
    // }

]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

export default router