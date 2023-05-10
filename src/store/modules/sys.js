const state = {
    status: 0,
    starttime: null,
    chainKey: null,
    etladdr: '',
    uaddr: '',
    tokenAddr: '',
    stakeStatus: 0,
    stakeMi: 0,
    annmsg: '',
    boxprice: 0
}


var mutations = {
    SETSTATUS: (state, data) => {
        state.status = data.status
        state.starttime = new Date(data.starttime)
        state.chainKey = data.chainKey
        state.etladdr = data.etlAddr
        state.tokenAddr = data.tokenAddr
        state.uaddr = data.uAddr
        state.stakeStatus = data.stakeStatus
        state.stakeMi = data.stakeMi
        state.annmsg = data.annMsg
        state.boxprice = data.boxPrice
    },
}
var actions = {
    setStatus({ commit }, val) {
        commit('SETSTATUS', val)
    }
}


export default {
    namespaced: true,
    state,
    mutations,
    actions
}