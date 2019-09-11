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
        props: ['value', 'placeholder', 'available_filters'],
        mounted: function(){

        },
        computed: {
            options: function(){
                let locations = JSON.parse( JSON.stringify( this.locations ) )
                if( ! _.isUndefined( this.available_filters ) && ! _.isNull( this.available_filters ) && this.available_filters.length > 0 && this.available_filters[0] !== '*' ){
                    let available = this.available_filters
                    locations = _.filter(locations, function(ct){
                        return available.indexOf( ct.id ) >= 0
                    })
                }
              return _.map(locations, function(i){
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