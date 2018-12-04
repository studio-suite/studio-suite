import axios from 'axios'
import _ from 'lodash'

export default {
    async nuxtServerInit ({ dispatch, commit }) {
        try{
            let tenant = await axios.get( `${process.env.VUE_APP_API_URL_TENANT}?id=${process.env.VUE_APP_TENANT_ID}`)
            commit('SET_TENANT', tenant.data)
            if( ! _.isUndefined(tenant.data.logo) && tenant.data.logo.length > 0 ){
                let logo = await axios.get(encodeURI(`https://${process.env.VUE_APP_IMGIX_URL}/${tenant.data.logo}?fm=json`))
                commit('SET_LOGO', logo.data)
            }
            await dispatch('schedules/list')
            await dispatch('class_types/list')
        } catch (e) {
            console.log(e)
        }
    }
}