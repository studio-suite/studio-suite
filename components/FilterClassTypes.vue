<template>
    <div class="filter filter--class-types" :class="{'is-null': filter === null}">
        <select v-model="filter">
            <option :value="null" v-text="placeholder || 'Which class?'"></option>
            <option v-for="(option, optionIndex) in options" :key="`filter-class-types-key-${optionIndex}`" :value="option.value" v-text="option.label"></option>
        </select>
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