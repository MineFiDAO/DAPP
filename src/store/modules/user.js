import { getItem, setItem, removeItem } from '@/utils/storage'
import wc from '@/utils/conwallet'
import Vue from 'vue'
const USERINFOKEY = 'userinfo'
const state = {
    userInfo: (() => {
        var userinfo = getItem(USERINFOKEY)
        if (userinfo) {
            return userinfo
        }

        return {}
    })() || null,
    NftInfo: null,
    isShowLogin: false,
    wctype: getWalletConType() || null,
    isLogon: isLogon()

}

var mutations = {
    USER_SIGNIN: (state, data) => {
        state.isLogon = true
        // state.userInfo = { cer: data.cer, addr: data.addr, wid: data.wid }
        state.userInfo = { addr: data.addr, wid: data.wid }
        state.isShowLogin = false
        setItem(USERINFOKEY, state.userInfo)
        console.log('login success.')
        console.log(state.userInfo)
    },
    USER_SIGNOUT: (state) => {
        console.log('user sign out...')
        state.isLogon = false
        state.userInfo = {}
        removeItem(USERINFOKEY)
        wc.killSession(()=>{
            window.location.reload()
        })
        localStorage.removeItem('walletConType')
        Vue.prototype.bus.$emit('signout')
    },
    USER_SETLoginUI: (state, data) => {
        state.isShowLogin = data
    },
    USER_SETWCTYPE: (state, data) => {
        state.wctype = data
        localStorage.setItem('walletConType', data)
    }
}

var actions = {
    userLogin({ commit }, userInfo) {
        console.log(userInfo)
        commit('SIGN_IN', userInfo)
    },
    userLogout({ commit }) {
        commit('USER_SIGNOUT')
    },
    usersetloginui({ commit }, data) {
        commit('USER_SIGNOUT', data)
    }
}

function getWalletConType() {
    var wctype = localStorage.getItem('walletConType')
    return wctype
}

function isLogon() {
    var userinfo = getItem(USERINFOKEY)
    if (userinfo) {
        return userinfo.wid != null
    } else {
        return false
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}