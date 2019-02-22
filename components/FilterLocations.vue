<template>
    <div class="filter filter--location">
        <no-ssr><v-select :options="options" :placeholder="placeholder || 'Which location?'" v-model="filter"></v-select></no-ssr>
    </div>
</template>

<script>
    import _ from 'lodash'

    export default {
        name: "FilterLocations",
        props: ['value', 'placeholder'],
        mounted: function(){

        },
        computed: {
            options: function(){
              return _.map(this.locations, function(i){
                  return {
                      label: i.name,
                      value: i.id
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
            locations: function(){
                return _.orderBy(this.$store.state.locations.list, ['name'])
            }
        },
        methods: {
        }
    }
</script>

<style scoped>

</style>