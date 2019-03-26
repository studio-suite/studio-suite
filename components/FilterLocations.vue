<template>
    <div class="filter filter--location" :class="{'is-null': filter === null}">
        <div>
            <select v-model="filter">
                <option :value="null">{{placeholder || 'Which location?'}}</option>
                <option v-for="(option, optionIndex) in options" :key="`filter-class-types-key-${optionIndex}`" :value="option.value">{{option.label}}</option>
            </select>
        </div>
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