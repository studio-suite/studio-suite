<template>
    <div class="filter filter--times">
        <no-ssr><v-select :options="day" :placeholder="placeholder || 'What time?'" v-model="filter"></v-select></no-ssr>
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