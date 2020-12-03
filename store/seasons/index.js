import axios from 'axios'


const state = () => {
    return {
        list: []
    }
}

const getters = {

}
const listSeasonsByTenant = `
            query listSeasonsByTenant($limit: Int, $nextToken: String, $tenantID: String){
                listSeasonsByTenant(
                    limit: $limit,
                    nextToken: $nextToken,
                    tenantID: $tenantID
                ){
                    items{
                      id
                      name
                      locationId
                      range
                  },
                  nextToken
                 }
            }
        `;
const actions = {
  list: async function ({commit}) {
    try {
      let operation = {
        query: listSeasonsByTenant,
        operationName: 'listSeasonsByTenant',
        variables: {
          tenantID: process.env.VUE_APP_TENANT_ID
        }
      };
      const headers = {
        'Content-Type': 'application/json',
        'x-api-key': process.env.VUE_APP_APPSYNC_KEY,
      }
      let list = await axios({
        method: 'POST',
        url: process.env.VUE_APP_APPSYNC_URL,
        data: JSON.stringify(operation),
        headers: headers
      })
      commit('SET', list.data.data.listSeasonsByTenant.items)

    } catch (e) {
      console.log(e)
      await axios.get(`${process.env.VUE_APP_API_BASE}/seasons?tenantId=${process.env.VUE_APP_TENANT_ID}`).then(function (schedules) {
        commit('SET', schedules.data)
      }).catch(function (e) {
        console.log(e)
      })
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
