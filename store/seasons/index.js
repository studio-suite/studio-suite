import axios from 'axios'


const state = () => {
    return {
        list: []
    }
}

const getters = {

}

const actions = {
    list: async function({commit}){
        try{
            let class_types = await axios.get(`${process.env.VUE_APP_API_BASE}/seasons?tenantId=${process.env.VUE_APP_TENANT_ID}`)
            commit('SET', class_types.data )
        } catch (e) {
            console.log(e)
        }
    }
}

const mutations = {
    SET: function (state, s) {
        state.list = s
    }
}

export default {
    namespaced: true,
    actions,
    state,
    getters,
    mutations
}