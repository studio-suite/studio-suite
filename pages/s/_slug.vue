<template>
    <section class="container page--schedule">
        <div v-if="schedule">
            <h1 class="page-title">{{schedule.title}}</h1>
            <Filters v-if="hasFilters" v-model="filters" :schedule="schedule"></Filters>
            <Schedule :schedule="schedule" :filters="filters" :classes="classes" class="margin-top--2"></Schedule>
        </div>

    </section>
</template>

<script>
    import Filters from '@/components/Filters'
    import Schedule from '@/components/Schedule'
    import axios from 'axios'
    import _ from 'lodash'

    function createCORSRequest(method, url) {
        var xhr = new XMLHttpRequest();
        if ("withCredentials" in xhr) {

            // Check if the XMLHttpRequest object has a "withCredentials" property.
            // "withCredentials" only exists on XMLHTTPRequest2 objects.
            xhr.open(method, url, true);

        } else if (typeof XDomainRequest != "undefined") {

            // Otherwise, check if XDomainRequest.
            // XDomainRequest only exists in IE, and is IE's way of making CORS requests.
            xhr = new XDomainRequest();
            xhr.open(method, url);

        } else {

            // Otherwise, CORS is not supported by the browser.
            xhr = null;

        }
        return xhr;
    }

    export default {
        data: function(){
            return {
                filters: {
                    classTypes: '',
                    instructors: '',
                    days: '',
                    filterTimes: '',
                    age: ''
                }
            }
        },
        components: {
            Filters,
            Schedule
        },
        asyncData: async function({params, $axios}){
            try{
                console.log('params', params)
                let tenantId = process.env.VUE_APP_TENANT_ID.replace('|','%7c')
                let r = await $axios({
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

          hasFilters: function(){
              if( this.schedule.filterAge === 1 ) return true;
              if( this.schedule.filterClassTypes.length > 0 ) return true;
              if( this.schedule.filterDays.length > 0 ) return true;
              if( this.schedule.filterInstructors.length > 0 ) return true;
              if( this.schedule.filterClassTimes.length > 0 ) return true;
              return false
          }
        },
        computed: {
            schedule: function(){
                return _.find( this.$store.getters.schedules, { slug: this.slug } ) || {}
            }
        }
    }
</script>

<style scoped>

</style>