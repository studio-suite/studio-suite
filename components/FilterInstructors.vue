<template>
    <div class="filter filter--instructors" :class="{'is-null': filter === null}">
        <div>
            <select v-model="filter">
                <option :value="null">{{placeholder || 'Which instructor?'}}</option>
                <option v-for="(option, optionIndex) in options" :key="`filter-class-types-key-${optionIndex}`" :value="option.value">{{option.label}}</option>
            </select>
        </div>
    </div>
</template>

<script>
    import _ from 'lodash'

    export default {
        name: "FilterInstructors",
        props: ['value', 'placeholder', 'available_filters'],
        mounted: function(){

        },
        computed: {
            options: function(){
                let instructors = JSON.parse( JSON.stringify( this.instructors ) )
                if( ! _.isUndefined( this.available_filters ) && ! _.isNull( this.available_filters ) && this.available_filters.length > 0 && this.available_filters[0] !== '0' ){
                    let available = this.available_filters
                    instructors = _.filter(instructors, function(ct){
                        return available.indexOf( ct.id ) >= 0
                    })
                }
              return _.map(instructors, function(i){
                  return {
                      label: `${i.firstName} ${i.lastName}`,
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
            instructors: function(){
                return _.orderBy(this.$store.state.instructors.list, ['name'])
            }
        },
        methods: {
        }
    }
</script>

<style scoped>

</style>