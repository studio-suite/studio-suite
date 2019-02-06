<template>
    <section class="container">
        <h1>{{schedule.title}}</h1>
        <Filters v-if="hasFilters" v-model="filters" :schedule="schedule"></Filters>
        <!--<Schedule :schedule="schedule" :filters="filters" :classes="classes" class="margin-top&#45;&#45;2"></Schedule>-->
    </section>
</template>

<script>
    import Filters from '@/components/Filters'
    import Schedule from '@/components/Schedule'
    import axios from 'axios'
    import _ from 'lodash'
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
        asyncData: async function(context){
            try{
                let { data } = await axios.get(`${process.env.VUE_APP_API_BASE}/classes?tenantId=${process.env.VUE_APP_TENANT_ID}&`)
                return { classes: [] }
            } catch (e) {
                return { classes: [] }
            }
        },
        async fetch (context) {
            const { store, params } = context
            await store.dispatch('schedules/get', params.slug )
        },
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
                return this.$store.state.schedules.schedule
            }
        }
    }
</script>

<style scoped>

</style>