<template>
    <div class="filter filter--times":class="{'is-null': filter === null}">
        <div>
            <select v-model="filter">
                <option :value="null">{{placeholder || 'What time?'}}</option>
                <option v-for="(option, optionIndex) in day" :key="`filter-class-types-key-${optionIndex}`" :value="option.value">{{option.label}}</option>
            </select>
        </div>
    </div>
</template>

<script>
    import _ from 'lodash'

    export default {
        name: "FilterTime",
        props: ['value', 'times', 'placeholder', 'available_filters'],
        computed: {
            day: function(){
                let times = [{
                    value: 0,
                    label: 'Morning'
                },{
                    value: 1,
                    label: 'Afternoon'
                },
                {
                    value: 2,
                    label: 'Evening'
                }]
                let available = this.available_filters
                if( ! _.isUndefined( available ) && ! _.isNull( available ) && available.length > 0 && available[0] !== '0' ){
                    times = _.filter( times, function(t){
                        return available.indexOf(t.value) >= 0
                    })
                }
                return times
            },
            filter: {
                get: function(){
                   return this.value
                },
                set: function(i){
                    this.$emit('input', i)
                }
            }
        }
    }
</script>

<style scoped>

</style>