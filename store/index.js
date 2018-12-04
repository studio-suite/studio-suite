import Vuex from 'vuex'
import Vue from 'vue'

Vue.use(Vuex)

import state from './state'
import actions from './actions'

import schedules from './schedules'
import class_types from './class_types'

import _ from 'lodash'

const store = () => {
    return new Vuex.Store({
        state,
        actions,
        mutations: {
            SET_TENANT: function(state, t){
                console.log('mutation')
                state.tenant = t
            },
            SET_LOGO: function(state, l){
                state.logo = l
            }
        },
        getters: {
            logo: function(state){
                return false
                if( _.isUndefined( state.tenant ) || _.isUndefined( state.tenant.logo ) || state.tenant.logo.length === 0 ) return false
                return {
                    url: state.tenant.logo,
                    aspect: state.logo.PixelHeight > state.logo.PixelWidth ? 'portrait' : ( state.logo.PixelHeight === state.logo.PixelWidth ? 'square' : 'landscape' )
                }
            }
        },
        modules:{
            namespaced: true,
            schedules,
            class_types
        }
    })
}

export default store