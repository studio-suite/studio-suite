<template>
    <div class="filters-wrapper">
        <label for="filters"><i class="far fa-filter margin-right--1"></i> <span v-show="!show_filters">Show</span><span v-show="show_filters">Hide</span> Filters</label>
        <input v-model="show_filters" type="checkbox" id="filters"/>
        <div class="filters-container" :class="{ 'filters-container--visible' : show_filters }">
            <div class="filters" :class="`filters--count-${filtersCount()}`">
                <FilterAge v-show="hasFilter('filterAge')" v-model="filters.age" :age="schedule.age" :placeholder="schedule.appearance.labelFilterAge"></FilterAge>
                <FilterClassTypes v-show="hasFilter('filterClassTypes')" v-model="filters.classTypes" :placeholder="schedule.appearance.labelFilterClassTypes" :available_filters="schedule.filterClassTypes"></FilterClassTypes>
                <FilterDays v-show="hasFilter('filterDays')" v-model="filters.days" :days="schedule.filterDays" :placeholder="schedule.appearance.labelFilterDays"></FilterDays>
                <FilterLocations v-show="hasFilter('filterLocations')" v-model="filters.locations" :placeholder="schedule.appearance.labelFilterLocations" :available_filters="schedule.filterLocations"></FilterLocations>
                <FilterTime v-show="hasFilter('filterTimes')" v-model="filters.times" :times="schedule.filterTimes" :placeholder="schedule.appearance.labelFilterTimes" :available_filters="schedule.filterTimes"></FilterTime>
                <FilterInstructors v-show="hasFilter('filterInstructors')" v-model="filters.instructors" :placeholder="schedule.appearance.labelFilterInstructors" :available_filters="schedule.filterInstructors"></FilterInstructors>
            </div>
        </div>
    </div>
</template>

<script>
    import FilterClassTypes from "@/components/FilterClassTypes"
    import FilterDays from "@/components/FilterDays"
    import FilterTime from "@/components/FilterTime"
    import FilterAge from "@/components/FilterAge"
    import FilterInstructors from "@/components/FilterInstructors"
    import FilterLocations from "@/components/FilterLocations"
    import _ from 'lodash'
    export default {
        name: "Filters",
        components: {
            FilterClassTypes,
            FilterLocations,
            FilterDays,
            FilterTime,
            FilterAge,
            FilterInstructors
        },
        data: function(){
          return {
              show_filters: false
          }
        },
        watch: {
          value: {
              handler: function(n){
                  this.show_filters = false
              },
              deep: true
          }
        },
        props: ['value', 'schedule'],
        computed: {
            filters: {
                get: function(){
                    return this.value
                },
                set: function (i) {
                    this.$emit('input', i)
                }
            }
        },
        methods: {
            filtersCount: function(){
                let vm = this
                let count = 0
                count += vm.hasFilter('filterClassTypes') ? 1 : 0
                count += vm.hasFilter('filterLocations') ? 1 : 0
                count += vm.hasFilter('filterInstructors') ? 1 : 0
                count += vm.hasFilter('filterDays') ? 1 : 0
                count += vm.hasFilter('filterTimes') ? 1 : 0
                count += vm.hasFilter('filterAge') ? 1 : 0
                return count
            },
            hasFilter: function(f){
                let vm = this
                switch ( f ){
                    case 'filterClassTypes' : return ! _.isEmpty( vm.schedule.filterClassTypes ) && vm.schedule.filterClassTypes[0] !== '0'
                    case 'filterInstructors' : return ! _.isEmpty( vm.schedule.filterInstructors ) && vm.schedule.filterInstructors[0] !== '0'
                    case 'filterLocations' : return ! _.isEmpty( vm.schedule.filterLocations ) && vm.schedule.filterLocations[0] !== '0'
                    case 'filterDays' : return ! _.isEmpty( vm.schedule.filterDays ) &&  vm.schedule.filterDays[0] !== -1
                    case 'filterTimes' : return ! _.isEmpty( vm.schedule.filterTimes ) &&  vm.schedule.filterTimes[0] !== -1
                    case 'filterAge' : return  vm.schedule.filterAge === 1
                    default : return false
                }
            }
        },
    }
</script>

<style scoped>

</style>