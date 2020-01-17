import axios from 'axios'
import _ from 'lodash'

export default {
    async nuxtServerInit ({ dispatch, commit }) {
        try{
            let tenant = await axios.get( `${process.env.VUE_APP_API_BASE}/tenant?id=${process.env.VUE_APP_TENANT_ID}`)
            commit('SET_TENANT', tenant.data)
            if( ! _.isUndefined(tenant.data.logo) && !_.isEmpty(tenant.data.logo) ){
                await dispatch('getLogo', tenant.data.logo)
            }

            await dispatch('getIntegrations')
            await dispatch('schedules/list')
            await dispatch('class_types/list')
            await dispatch('instructors/list')
            await dispatch('locations/list')
            await dispatch('seasons/list')
            await dispatch('magnets/list')
        } catch (e) {
            console.log(e)
        }
    },
    getIntegrations: async function({commit}){
        try{
            let integrations = await axios.get( `${process.env.VUE_APP_API_BASE}/integrations?tenantId=${process.env.VUE_APP_TENANT_ID}` )
            commit( 'SET_INTEGRATIONS', integrations.data )
        } catch (e) {
            console.log("integrations", e)
        }
    },
    getLogo: async function({commit}, logo){
        try{
            let logoJson = await axios.get(encodeURI(`https://${process.env.VUE_APP_IMGIX_URL}/${logo}?fm=json`))
            commit('SET_LOGO', logoJson.data)
        } catch (e) {
            console.log(e)
        }
    }
}