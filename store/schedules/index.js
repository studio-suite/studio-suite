import axios from 'axios'
import _ from 'lodash'
import Schedule from '@/models/Schedule'

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

const listSchedulesByTenant = `
            query listSchedulesByTenant($limit: Int, $nextToken: String, $tenantID: String){
                listSchedulesByTenant(
                    limit: $limit,
                    nextToken: $nextToken,
                    tenantID: $tenantID
                ){
                    items{
                        id
                        title
                        slug
                        style
                        status
                        start
                        startSpecific
                        startDays
                        stop
                        stopDays
                        stopSpecific
                        limit
                        limitType
                        classTypes
                        instructors
                        locations
                        age
                        filterClassTypes
                        filterInstructors
                        filterLocations
                        filterAge
                        filterDays
                        filterTimes
                        modal
                        modalOptions{
                            classTypes
                            instructors
                            ages
                            days
                            locations
                            times
                        }
                        appearance{
                            show_title
                            show_ending
                            show_duration
                            show_excerpt
                            show_instructors
                            show_classTypes
                            show_empty
                            show_weekdays
                            labelNothingToShow
                            labelFilterClassTypes
                            labelFilterInstructors
                            labelFilterLocations
                            labelFilterDays
                            labelFilterAge
                            labelFilterTimes
                            colorText
                            colorBg
                            colorPrimary
                            colorDays0
                            colorDays1
                            colorDays2
                            colorDays3
                            colorDays4
                            colorDays5
                            colorDays6
                        }
                        created
                        updated
                        headline
                        description
                        language{
                            i
                            l
                        }
                    },
                    nextToken
                 }
            }
        `;

const actions = {
    list: async function({commit}){
        try{
          let operation = {
            query: listSchedulesByTenant,
            operationName: 'listSchedulesByTenant',
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
            commit('SET', list.data.data.listSchedulesByTenant.items )

        } catch (e) {
            console.log(e)
            await axios.get(`${process.env.VUE_APP_API_BASE}/schedules?tenantId=${process.env.VUE_APP_TENANT_ID}`).then(function(schedules){
              commit('SET', schedules.data )
            }).catch(function(e){
              console.log(e)
            })

        }
    },
    get: async function({commit, getters}, slug){
        return _.find( getters.list, { slug: slug } )
    }
}

const mutations = {
    SET: function (state, s) {
        state.list = _.map( s, function(i){
            return new Schedule(i).toObject()
        })
    }
    /*,
    SET_SCHEDULE: function(state, s){
        if( ! _.isUndefined( _.find( state.list, {slug: s.id} ) ) ){
            state.list[_.findKey( state.list, {slug: s.id} )] = new Schedule(s).toObject()
        } else {
            state.list.push(new Schedule(s).toObject())
        }
    }*/
}

export default {
    namespaced: true,
    actions,
    state,
    getters,
    mutations
}
