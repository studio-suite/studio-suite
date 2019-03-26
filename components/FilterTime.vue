<template>
    <div class="filter filter--times":class="{'is-null': filter === null}">
        <select v-model="filter">
            <option :value="null">{{placeholder || 'What time?'}}</option>
            <option v-for="(option, optionIndex) in day" :key="`filter-class-types-key-${optionIndex}`" :value="option.value">{{option.label}}</option>
        </select>
    </div>
</template>

<script>
    import _ from 'lodash'

    export default {
        name: "FilterClassTypes",
        props: ['value', 'times', 'placeholder'],
        data: function(){
            return {
                day: [{
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
            }
        }
    }
</script>

<style scoped>

</style>