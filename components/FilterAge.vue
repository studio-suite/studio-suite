<template>
    <div class="filter filter--age" :class="{'is-null': filter === null}">
        <div>
            <select v-model="filter">
                <option :value="null">{{placeholder || 'How old?'}}</option>
                <option v-for="(option, optionIndex) in options" :key="`filter-age-key-${optionIndex}`" :value="option.value">{{option.label}}</option>
            </select>
        </div>
    </div>
</template>

<script>
    import _ from 'lodash'

    export default {
        name: "FilterAge",
        props: ['value', 'age', 'placeholder', 'available_filters'],
        data: function(){
            let ages  = [{
                value: 1,
                label: '1 year old'
            }]
            _.each(_.range(2, 19), function(i){
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
                let age = this.age
                return _.filter( this.ages, function(a){
                    if( age[0] === age[1] && age[0] === 18 ){
                        return a.value >= 19 && a.value <= 19
                    } else {
                        return a.value >= age[0] && a.value <= age[1]
                    }
                })
            }
        }
    }
</script>

<style scoped>

</style>