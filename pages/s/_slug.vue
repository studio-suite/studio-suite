<template>
    <section class="main-wrapper">
        <div class="container page--schedule">
            <div v-if="schedule">
                <h1 class="page-title" v-if="schedule.appearance.show_title">{{schedule.headline || schedule.title}}</h1>
                <div class="page-description margin-bottom--3" v-if="schedule.description" v-html="schedule.description ? marked(schedule.description) : ''"></div>
                <Filters v-if="hasFilters" v-model="filters" :schedule="schedule"  class="margin-bottom--3"></Filters>
                <Schedule :schedule="schedule" :filters="filters" :classes="classes_filtered"></Schedule>
            </div>
        </div>
    </section>
</template>

<script>
    import Filters from '@/components/Filters'
    import Schedule from '@/components/Schedule'
    import axios from 'axios'
    import _ from 'lodash'
    import marked from "marked"

    export default {
        data: function(){
            return {
                filters: {
                    classTypes: null,
                    instructors: null,
                    locations: null,
                    days: null,
                    times: null,
                    age: null
                }
            }
        },
        head () {
            let head = {
                title: `${this.schedule.title} | ${this.$store.getters.tenant.name}`,
                meta: [
                    { hid: 'og:title', name: 'og:title', content: this.schedule.title },
                    { hid: 'og:site_name', name: 'og:site_name', content: this.$store.getters.tenant.name },
                    { hid: 'og:type', name: 'og:type', content: 'website' },
                    { hid: 'og:url', name: 'og:url', content: `https://${this.$store.getters.tenant.domain}.studiosuite.io/s/${this.schedule.slug}` },
                ]
            }

            if( ! _.isUndefined( this.schedule.description ) && ! _.isEmpty( this.schedule.description ) ){
                head.meta.push({ hid: 'og:description', name: 'og:description', content: this.schedule.description })
                head.meta.push({ hid: 'description', name: 'description', content: this.schedule.description })
            }

            return head
        },
        components: {
            Filters,
            Schedule
        },
        asyncData: async function({params}){
            try{
                let tenantId = process.env.VUE_APP_TENANT_ID.replace('|','%7c')
                let r = await axios({
                    method: 'GET',
                    url: `${process.env.VUE_APP_API_BASE}/classes?tenantId=${tenantId}&scheduleSlug=${params.slug}`,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                //console.log('response', r)
                return {
                    classes: r.data || [],
                    slug: params.slug
                }
            } catch (e) {
                return {
                    classes: [],
                    slug: params.slug
                }
            }
        },
        /*async fetch (context) {
            const { store, params } = context
            await store.dispatch('schedules/get', params.slug )
        },*/
        methods: {
            marked: function(v){
                return marked(v)
            },
          hasFilters: function(){
              if( ! _.isEmpty( this.schedule.filterAge ) ) return true;
              if( ! _.isEmpty( this.schedule.filterClassTypes ) && this.schedule.filterClassTypes[0] !== '0' ) return true;
              if( ! _.isEmpty( this.schedule.filterInstructors ) && this.schedule.filterInstructors[0] !== '0' ) return true;
              if( ! _.isEmpty( this.schedule.filterLocations ) && this.schedule.filterLocations[0] !== '0' ) return true;
              if( ! _.isEmpty( this.schedule.filterDays ) &&  this.schedule.filterDays[0] !== -1 ) return true;
              if( ! _.isEmpty( this.schedule.filterTimes ) &&  this.schedule.filterTimes[0] !== -1 ) return true;
              return false
          }
        },
        computed: {
            classes_filtered: function(){
                let vm = this
                let out = vm.classes
                out = _.filter( out, function(i){
                    let test = true
                    if( ! _.isUndefined( vm.filters.age ) && ! _.isNull( vm.filters.age ) ){
                        if( parseInt( vm.filters.age ) === 19 ){
                            if( i.age[0] !== 18 && i.age[1] !== 18 ){
                                test = false
                            }
                        } else {
                            if( _.range( i.age[0], i.age[1] + 1 ).indexOf( vm.filters.age ) === -1 ){
                                test = false
                            }
                        }
                    }
                    if( ! _.isUndefined( vm.filters.classTypes ) && ! _.isNull( vm.filters.classTypes ) ){
                        if( _.isUndefined( i.classTypesIds ) || i.classTypesIds.indexOf(vm.filters.classTypes) === -1 ){
                            test = false
                        }
                    }
                    if( ! _.isUndefined( vm.filters.locations ) && ! _.isNull( vm.filters.locations ) ){
                        if( i.locationId.indexOf(vm.filters.locations) === -1 ){
                            test = false
                        }
                    }
                    if( ! _.isUndefined( vm.filters.instructors ) && ! _.isEmpty( vm.filters.instructors ) ){
                        if( _.isUndefined( i.instructorsIds ) || i.instructorsIds.indexOf(vm.filters.instructors) === -1 ){
                            test = false
                        }
                    }
                    return test
                })
                return out
            },
            schedule: function(){
                return _.find( this.$store.getters.schedules, { slug: this.slug } ) || {}
            }
        }
    }
</script>

<style scoped>

</style>