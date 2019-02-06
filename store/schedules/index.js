import axios from 'axios'
import _ from 'lodash'


const state = {
    list: [],
    schedule: {}
}

const getters = {
    list: function(state){
        return state.list
    }
}

const actions = {
    list: async function({commit}){
        try{
            let schedules = await axios.get(`${process.env.VUE_APP_API_BASE}/schedules?tenantId=${process.env.VUE_APP_TENANT_ID}`)
            commit('SET', schedules.data )

        } catch (e) {
            console.log(e)
        }
    },
    get: async function({commit, getters}, id){
        return commit('SET_SCHEDULE', _.find( getters.list, {slug: id} ) )
    }
}

const mutations = {
    SET: function (state, s) {
        state.list = s
    },
    SET_SCHEDULE: function(state, s){
        state.schedule = s
    }
}

export default {
    namespaced: true,
    actions,
    state,
    getters,
    mutations
}