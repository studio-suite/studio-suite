import axios from 'axios'
import Location from "@/models/Location"
import { map } from "lodash"
const state = () => {
    return {
        list: []
    }
}
const getters = {
    all: function(s){
        return s.list
    }
}

const listLocationsByTenant = `
            query listLocationsByTenant($limit: Int, $nextToken: String, $tenantID: String){
                listLocationsByTenant(
                    limit: $limit,
                    nextToken: $nextToken,
                    tenantID: $tenantID
                ){
                    items{
                      id
                      name
                      address{
                          address1
                          address2
                          zip
                          countryCode
                          city
                          state
                      }
                      schedule{
                          days{
                              d
                              i{
                                  s
                                  e
                              }
                          }
                          empty
                          specific{
                              d
                              i{
                                  s
                                  e
                              }
                          }
                      }
                      created
                      updated
                      timezone
                      email
                      phone
                      url
                      coords
                  },
                  nextToken
                 }
            }
        `;

const actions = {
  list: async function ({commit}) {
    try {
      let operation = {
        query: listLocationsByTenant,
        operationName: 'listLocationsByTenant',
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
      commit('SET', list.data.data.listLocationsByTenant.items)

    } catch (e) {
      console.log(e)
      await axios.get(`${process.env.VUE_APP_API_BASE}/locations?tenantId=${process.env.VUE_APP_TENANT_ID}`).then(function (schedules) {
        commit('SET', schedules.data)
      }).catch(function (e) {
        console.log(e)
      })
    }
  }
}

const mutations = {
    SET: function (st, s) {
        st.list = map( s, function(location){
          return new Location(location).toObject()
        })
    }
}

export default {
    namespaced: true,
    actions,
    state,
    getters,
    mutations
}
