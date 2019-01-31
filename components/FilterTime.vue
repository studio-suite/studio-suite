<template>
    <div class="filter">
        <no-ssr><v-select :options="options" placeholder="What time?"></v-select></no-ssr>
    </div>
</template>

<script>
    import _ from 'lodash'

    export default {
        name: "FilterClassTypes",
        props: ['value', 'times'],
        data: function(){
            return {
                day: [{
                    value: 0,
                    label: 'Morning'
                },{
                    value: 1,
                    label: 'Evening'
                },{
                    value: 2,
                    label: 'Afternoon'
                }]
            }
        },
        computed: {
            options: function(){
              return _.map(this.times_list, function(i){
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
            times_list: function(){
                let vm = this
                return _.filter(this.day, function(i){
                    return vm.times.indexOf(i.value) >= 0
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