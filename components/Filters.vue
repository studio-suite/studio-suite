<template>
    <div class="filters">
        <FilterAge v-if="hasFilter('filterAge')" v-model="filters.age" :age="schedule.age"></FilterAge>
        <FilterClassTypes v-if="hasFilter('filterClassTypes')" v-model="filters.classTypes"></FilterClassTypes>
        <FilterInstructors v-if="hasFilter('filterInstructors')" v-model="filters.instructors"></FilterInstructors>
        <FilterDays v-if="hasFilter('filterDays')" v-model="filters.days" :days="schedule.filterDays"></FilterDays>
        <FilterTime v-if="hasFilter('filterTimes')" v-model="filters.times" :times="schedule.filterTimes"></FilterTime>
    </div>
</template>

<script>
    import FilterClassTypes from "@/components/FilterClassTypes"
    import FilterDays from "@/components/FilterDays"
    import FilterTime from "@/components/FilterTime"
    import FilterAge from "@/components/FilterAge"
    import FilterInstructors from "@/components/FilterInstructors"
    import _ from 'lodash'
    export default {
        name: "Filters",
        components: {
            FilterClassTypes,
            FilterDays,
            FilterTime,
            FilterAge,
            FilterInstructors
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
            hasFilter: function(f){
                let vm = this
                try{
                    if(f === 'filterClassTypes' || f === 'filterInstructors'){
                        if( parseInt(vm.schedule[f][0]) === -1 ) return true
                        if( parseInt(vm.schedule[f][0]) !== 0 ) return true
                    }  else if(f === 'filterDays' || f === 'filterTimes'){
                        return vm.schedule[f].length > 0
                    } else if(f === 'filterAge'){
                        return vm.schedule[f] > 0
                    }
                } catch (e) {
                    return false
                }
            }
        },
    }
</script>

<style scoped>

</style>