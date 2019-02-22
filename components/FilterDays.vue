<template>
    <div class="filter filter--days">
        <no-ssr><v-select :options="options" :placeholder="placeholder || 'Which day?'"  v-model="filter"></v-select></no-ssr>
    </div>
</template>

<script>
    import _ from 'lodash'

    export default {
        name: "FilterClassTypes",
        props: ['value', 'days', 'placeholder'],
        data: function(){
            return {
                week: [{
                    value: 1,
                    label: 'Monday'
                },{
                    value: 2,
                    label: 'Tuesday'
                },{
                    value: 3,
                    label: 'Wednesday'
                },{
                    value: 4,
                    label: 'Thursday'
                },{
                    value: 5,
                    label: 'Friday'
                },{
                    value: 6,
                    label: 'Saturday'
                },{
                    value: 0,
                    label: 'Sunday'
                }]
            }
        },
        computed: {
            options: function(){
              return _.map(this.days_list, function(i){
                  return {
                      label: i.label,
                      value: i.value
                  }
              })
            },
            filter: {
                get: function(){
                   return this.value
                },
                set: function(i){
                    this.$emit('input', i)
                }
            },
            days_list: function(){
                let vm = this
                return _.filter(this.week, function(i){
                    return vm.days.indexOf(i.value) >= 0
                })
            }
        },
        methods: {
            getDayName: function(i){
                if( i === 0 ) return 'Sunday'
                if( i === 1 ) return 'Monday'
                if( i === 2 ) return ''
                if( i === 3 ) return ''
                if( i === 4 ) return ''
                if( i === 5 ) return ''
                return 'Saturday'
            }
        }
    }
</script>

<style scoped>

</style>