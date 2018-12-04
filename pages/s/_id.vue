<template>
    <section class="container">
        <h1>{{schedule.title}}</h1>
        <div v-if="hasFilters">
            <FilterClassTypes v-if="hasFilter('filterClassTypes')" v-model="filters.classTypes"></FilterClassTypes>
        </div>
    </section>
</template>

<script>
    import FilterClassTypes from "@/components/FilterClassTypes"
    import _ from 'lodash'
    export default {
        data: function(){
            return {
                filters: {
                    classTypes: ''
                }
            }
        },
        components: {
            FilterClassTypes
        },
        async fetch (context) {
            const { store, params } = context
            await store.dispatch('schedules/get', params.id)
        },
        methods: {
            hasFilter: function(f){
                let vm = this
              if(f === 'filterClassTypes'){
                  if( ! _.isUndefined(vm.schedule[f]) && parseInt(vm.schedule[f][0]) === -1 ){
                      return true
                  } else if(! _.isUndefined(vm.schedule[f]) && parseInt(vm.schedule[f][0]) !== 0 ){
                      return true
                  }
              }
              return false
            },
          hasFilters: function(){

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