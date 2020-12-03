import axios from 'axios'

const state = () => {
  return {
    list: []
  }
}

const getters = {
  all: function (state) {
    return state.list
  }
}
const listClassTypesByTenant = `
            query listClassTypesByTenant($limit: Int, $nextToken: String, $tenantID: String){
                listClassTypesByTenant(
                    limit: $limit,
                    nextToken: $nextToken,
                    tenantID: $tenantID
                ){
                    items{
                      id
                      name
                      color
                      description
                      locationId
                  },
                  nextToken
                 }
            }
        `;
const actions = {
  list: async function ({commit}) {
    try {
      let operation = {
        query: listClassTypesByTenant,
        operationName: 'listClassTypesByTenant',
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
      commit('SET', list.data.data.listClassTypesByTenant.items)

    } catch (e) {
      console.log(e)
      await axios.get(`${process.env.VUE_APP_API_BASE}/class-types?tenantId=${process.env.VUE_APP_TENANT_ID}`).then(function (schedules) {
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
