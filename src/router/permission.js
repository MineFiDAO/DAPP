import router from '@/router'

import store from '@/store'


router.beforeEach((to, from, next) => {
    if (to.matched.length <= 0) {
        next("/")
    }

    if (to.path.indexOf('/user/') != -1) {
        let isLogin = store.state.user.isLogon
        if (isLogin) {
            next()
        } else {
            router.loginFromPath = to.path
            console.log('redirect to login page from page ' + to.path)
            next()
        }
    } else {
        next()
    }
})