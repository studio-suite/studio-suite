<template>
    <div class="filter">
        <no-ssr><v-select :options="options" placeholder="Which class?"></v-select></no-ssr>
    </div>
</template>

<script>
    import _ from 'lodash'

    export default {
        name: "FilterClassTypes",
        props: ['value'],
        mounted: function(){

        },
        computed: {
            options: function(){
              return _.map(this.class_types, function(i){
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
            class_types: function(){
                return _.orderBy(this.$store.state.class_types.list, ['name'])
            }
        },
        methods: {
        }
    }
</script>

<style scoped>

</style>