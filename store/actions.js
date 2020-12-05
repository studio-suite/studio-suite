import axios from 'axios'
import _ from 'lodash'

const getTenantById = `
  query getTenantById($id: ID!){
    getTenantById( id: $id ){
      id
      name
      domain
      logo
      dateFormat
      currency{
        code
        format
      }
      colors{
        bg
        bgContent
        text
        accent
      }
      created
      updated
      siteId
      language{
        i
        l
      }
      algoliaPublicApiKey
    }
  }
`

export default {
    async nuxtServerInit({dispatch, commit}, ctx) {
        try {
            console.log('ctx', process.env.VUE_APP_APPSYNC_URL)
            let tenant = await axios({
                method: 'POST',
                url: process.env.VUE_APP_APPSYNC_URL,
                data: JSON.stringify({
                    query: getTenantById,
                    operationName: 'getTenantById',
                    variables: {
                        id: process.env.VUE_APP_TENANT_ID
                    }
                }),
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': process.env.VUE_APP_APPSYNC_KEY,
                }
            }).then(function (r) {
                return r.data.data.getTenantById
            })
            commit('SET_TENANT', tenant)
            if (!_.isUndefined(tenant.logo) && !_.isEmpty(tenant.logo)) {
                await dispatch('getLogo', tenant.logo)
            }
        } catch (e) {
            console.log(e)
            await axios.get(`${process.env.VUE_APP_API_BASE}/tenant?id=${process.env.VUE_APP_TENANT_ID}`).then(function (tenant) {
                if (!_.isUndefined(tenant.data) && !_.isEmpty(tenant.data) && !_.isNull(tenant.data)) {
                    commit('SET_TENANT', tenant.data)
                    if (!_.isUndefined(tenant.data.logo) && !_.isEmpty(tenant.data.logo)) {
                        dispatch('getLogo', tenant.data.logo)
                    }
                }
            }).catch(function (e) {
                console.log(e)
            })
        }

        try {
            await dispatch('getIntegrations')
            await dispatch('schedules/list')
            await dispatch('class_types/list')
            await dispatch('instructors/list')
            await dispatch('locations/list')
            await dispatch('seasons/list')
            //await dispatch('magnets/list')
        } catch (e) {
            console.log(e)
        }
    },
    getIntegrations: async function ({commit}) {
        try {
            let integrations = await axios.get(`${process.env.VUE_APP_API_BASE}/integrations?tenantId=${process.env.VUE_APP_TENANT_ID}`)
            commit('SET_INTEGRATIONS', integrations.data)
        } catch (e) {
            console.log("integrations", e)
        }
    },
    getLogo: async function ({commit}, logo) {
        try {
            let logoJson = await axios.get(encodeURI(`https://${process.env.VUE_APP_IMGIX_URL}/${logo}?fm=json`))
            commit('SET_LOGO', logoJson.data)
        } catch (e) {
            console.log(e)
        }
    },
    setGoogleMapsReady: function ({commit}) {
        commit('SET_GOOGLE_MAPS_READY')
    }
}
