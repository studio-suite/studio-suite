<template>
    <div class="filter filter--age">
        <no-ssr><v-select :options="options" :placeholder="placeholder || 'How old?'" v-model="filter"></v-select></no-ssr>
    </div>
</template>

<script>
    import _ from 'lodash'

    export default {
        name: "FilterClassTypes",
        props: ['value', 'age', 'placeholder'],
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
        }
    }
</script>

<style scoped>

</style>