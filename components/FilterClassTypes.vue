<template>
    <div class="filter filter--class-types" :class="{'is-null': filter === null}">
        <div>
            <select v-model="filter">
                <option :value="null" v-text="placeholder || 'Which class?'"></option>
                <option v-for="(option, optionIndex) in options" :key="`filter-class-types-key-${optionIndex}`" :value="option.value" v-text="option.label"></option>
            </select>
        </div>
    </div>
</template>

<script>
    import _ from 'lodash'

    export default {
        name: "FilterClassTypes",
        props: ['value', 'placeholder', 'available_filters'],
        mounted: function(){

        },
        computed: {
            options: function(){
                let class_types = JSON.parse( JSON.stringify( this.class_types ) )
                if( ! _.isUndefined( this.available_filters ) && ! _.isNull( this.available_filters ) && this.available_filters.length > 0 && this.available_filters[0] !== '0' ){
                    let available = this.available_filters
                    class_types = _.filter(class_types, function(ct){
                        return available.indexOf( ct.id ) >= 0
                    })
                }
                return _.map(class_types, function(i){
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