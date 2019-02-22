<template>
    <div class="filter filter--class-types">
        <no-ssr><v-select :options="options" :placeholder="placeholder || 'Which class?'" v-model="filter"></v-select></no-ssr>
    </div>
</template>

<script>
    import _ from 'lodash'

    export default {
        name: "FilterClassTypes",
        props: ['value', 'placeholder'],
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