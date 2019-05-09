import axios from 'axios'


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
    get: async function({commit}, id){
        try{
            let { data } = await axios.get(`${process.env.VUE_APP_API_BASE}/get-class?classId=${id}`)
            commit('SET', data )
        } catch (e) {
            console.log(e)
        }
    }
}

const mutations = {
    SET: function (state, s) {
        state.list.push(s)
    }
}

export default {
    namespaced: true,
    actions,
    state,
    getters,
    mutations
}