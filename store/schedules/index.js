import axios from 'axios'
import _ from 'lodash'
import Schedule from '@/models/Schedule'

const state = () => {
    return {
        list: []
    }
}

const getters = {
    all: function(state){
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
    get: async function({commit, getters}, slug){
        return _.find( getters.list, { slug: slug } )
    }
}

const mutations = {
    SET: function (state, s) {
        state.list = _.map( s, function(i){
            return new Schedule(i).toObject()
        })
    }
    /*,
    SET_SCHEDULE: function(state, s){
        if( ! _.isUndefined( _.find( state.list, {slug: s.id} ) ) ){
            state.list[_.findKey( state.list, {slug: s.id} )] = new Schedule(s).toObject()
        } else {
            state.list.push(new Schedule(s).toObject())
        }
    }*/
}

export default {
    namespaced: true,
    actions,
    state,
    getters,
    mutations
}