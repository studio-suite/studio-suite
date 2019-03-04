<template>
  <section class="main-wrapper">
      <div class="container">
          <h1>Schedules</h1>
          <div class="schedules-list">
              <div v-for="s in schedules" class="schedules-list__item" v-on:click.prevent="goToSchedule(s)">
                  <div class="schedules-list__item__inner">
                      <h2>{{s.title}}</h2>
                      <p class="schedules-list__item__meta"><span>{{getClassTypesString(s.classTypes)}}</span> <span>{{s.age | schedule_age}}</span></p>
                      <i class="far fa-arrow-right fa-2x schedules-list__item__link"></i>
                  </div>
              </div>
          </div>
      </div>
  </section>
</template>

<script>
import Logo from '~/components/Logo.vue'
import _ from 'lodash'

export default {
  components: {
    Logo
  },
    head () {
        return {
            title: `${this.$store.getters.tenant.name}`
        }
    },
    filters: {
      schedule_age: function(i){
          if( ! _.isUndefined(i) ){
              if( i[0] < 18 && i[1] <=18 ){
                  return `Ages ${i[0]} to ${i[1]}`
              } else {
                  return 'Adults only'
              }
          }
          return 'Any Age'
      }
    },
    methods: {
        goToSchedule: function(i){
            //window.location = `/s/${i}`;
          this.$router.push({ name: 's-slug', params: { slug: i.slug  }})
        },
      getClassTypesString: function(i){
          let out = 'All class types'
          if( _.isUndefined(i) ){
              let class_types = _.map(this.$store.state.class_types.list, function(i){ return i.name })
              if( class_types.length > 2 ){
                  let left = class_types.length - 2
                  out = class_types.splice(0, 2).join(', ') + ` + ${left} others`
              } else {
                  out = class_types.join(', ')
              }

          }
          return out
      }
    },
    computed: {
      schedules: function(){
          return this.$store.state.schedules.list
      }
    }
}
</script>

<style>
</style>
