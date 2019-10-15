<template>
  <section class="main-wrapper">
      <div class="container">
          <h1>{{ getText('schedule-list/h1') }}</h1>
          <div class="schedules-list">
              <div v-for="s in schedules" class="schedules-list__item" v-on:click.prevent="goToSchedule(s)">
                  <div class="schedules-list__item__inner">
                      <h2>{{s.title}}</h2>
                      <p class="schedules-list__item__meta"><span>{{getClassTypesString(s.classTypes)}}</span> <span>{{ getScheduleAge(s.age)}}</span></p>
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
      let description = `Book you dance trial class at ${this.$store.getters.tenant.name} by selecting `
        if( this.$store.getters.schedules.length > 1 ){
          description += 'a schedule '
        } else {
          description += 'the schedule '
        }
        description += 'and find a class that fits. We offer various types of dance classes such as: '
        let classTypes = _.map(this.$store.getters.class_types, function(c){ return c.name })
        description += _.take(classTypes, 5).join(', ')
        description += '.'
        return {
            title: `${this.$store.getters.tenant.name}`,
            meta: [
                { hid: 'og:title', name: 'og:title', content: this.$store.getters.tenant.name },
                { hid: 'og:site_name', name: 'og:site_name', content: this.$store.getters.tenant.name },
                { hid: 'og:type', name: 'og:type', content: 'website' },
                { hid: 'og:url', name: 'og:url', content: `https://${this.$store.getters.tenant.domain}.studiosuite.io/` },
                { hid: 'description', name: 'description', content: description }
            ]
        }
    },
    methods: {
        getScheduleAge: function(i){
            if( ! _.isUndefined(i) ){
                if( i[0] < 18 && i[1] <=18 ){
                    return this.getText('schedule-list/schedule/ageChildren', { min: i[0], max: i[1] } )
                } else if( i[0] === 0 && i[1] === 19 ) {
                    return this.getText('schedule-list/schedule/ageAny')
                } else {
                    return this.getText('schedule-list/schedule/ageAdults')
                }
            }
            return 'Any age'
        },
        goToSchedule: function(i){
            window.location = `/s/${i.slug}`;
          //this.$router.push({ name: 's-slug', params: { slug: i.slug  }})
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
