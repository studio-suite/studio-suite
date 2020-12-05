import Vuex from 'vuex'
import Vue from 'vue'
import Tenant from '@/models/Tenant'
Vue.use(Vuex)

import state from './state'
import actions from './actions'

import schedules from './schedules'
import class_types from './class_types'
import instructors from './instructors'
import locations from './locations'
import seasons from './seasons'
import classes from './classes'
import magnets from './magnets'

import _ from 'lodash'

const store = () => {
    return new Vuex.Store({
        state,
        actions,
        mutations: {
            SET_TENANT: function(state, t){
                state.tenant = new Tenant(t).toObject()
            },
            SET_LOGO: function(state, l){
                state.logo = l
            },
            SET_INTEGRATIONS: function(state, i){
                state.integrations = true
                let stripe = _.find( i, function(s){
                    return s.type === 'stripe'
                })
                if( ! _.isUndefined( stripe )){
                    state.stripePublic = stripe.clientId
                }
                let ga = _.find( i, function(s){
                    return s.type === 'analytics'
                })
                if( ! _.isUndefined( ga )){
                    state.ga = ga.apiKey
                }
                let fb = _.find( i, function(s){
                    return s.type === 'facebook'
                })
                if( ! _.isUndefined( fb )){
                    state.fb = fb.apiKey
                }
            },
            SET_GOOGLE_MAPS_READY: function(state){
                state.isGoogleLoaded = true
            }
        },
        getters: {
            logo: function(state){
                if( _.isUndefined( state.tenant ) || _.isUndefined( state.tenant.logo ) || _.isNull( state.tenant.logo ) || state.tenant.logo.length === 0 ) return false
                return {
                    url: state.tenant.logo,
                    aspect: state.logo.PixelHeight > state.logo.PixelWidth ? 'portrait' : ( state.logo.PixelHeight === state.logo.PixelWidth ? 'square' : 'landscape' )
                }
            },
            class_types: function(state, getters){
                return getters['class_types/all']
            },
            instructors: function(state, getters){
                return getters['instructors/all']
            },
            locations: function(state, getters){
                return getters['locations/all']
            },
            classes: function(state, getters){
                return getters['classes/all']
            },
            schedules: function(state, getters){
                return getters['schedules/all']
            },
            magnets: function(state, getters){
                return getters['magnets/all']
            },
            tenant: function(state){
                return state.tenant
            },
            tenantId: function(state){
                return state.tenant.id
            },
            ga: function(state){
                return state.ga
            },
            fb: function(state){
                return state.fb
            },
            tenantUrl: function(state){
              return `https://${state.tenant.domain}.studiosuite.io`
            },
            stripePublicApiKey: function(state){
                return state.stripePublic
            },
            isGoogleLoaded: function(state){
                return state.isGoogleLoaded
            },
          integrations: function (state){
              return state.integrations
          }
        },
        modules:{
            namespaced: true,
            schedules,
            class_types,
            instructors,
            locations,
            seasons,
            classes,
            magnets
        }
    })
}

export default store
