<template>
    <div class="filter">
        <no-ssr><v-select :options="options" placeholder="How old is your child?"></v-select></no-ssr>
    </div>
</template>

<script>
    import _ from 'lodash'

    export default {
        name: "FilterClassTypes",
        props: ['value', 'age'],
        data: function(){
            let ages  = [{
                value: 1,
                label: '1 year old'
            }]
            _.each(_.range(2, 18), function(i){
              ages.push({
                  value: i,
                  label: `${i} years old`
              })
            });
            ages.push({
                value: 19,
                label: 'Adults'
            });
            return {
                ages: _.orderBy(ages, ['value'])
            }
        },
        computed: {
            filter: {
                get: function(){
                   return this.value
                },
                set: function(i){
                    this.$emit('input', i)
                }
            },
            options: function(){
                let vm = this
                return _.filter(vm.ages, function(i){
                    return true
                    return _.range(vm.age[0], vm.age[1]).indexOf(i.value) >= 0
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