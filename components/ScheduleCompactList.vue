<template>
    <div class="classes_by_day">
        <div v-for="(day_classes, index) in classes_by_day" class="classes_by_day__day">
            <div class="classes_by_day__date">
                <div>
                    <span>{{ index | moment_location('D', getTimezone(day_classes[0].locationId) ) }}</span>
                    {{ index | moment_location('ddd', getTimezone(day_classes[0].locationId) ) }}
                </div>
            </div>
            <div class="class_list">
                <article v-for="c in day_classes" class="class">
                    <div class="class__content">
                        <div>
                            <small>{{c.starting_time | moment_location('dddd, MMMM D, YYYY', getTimezone(c.locationId))}}</small>
                            <h2>{{c.title}}</h2>
                            <div class="details">
                                <span class="margin-right--05"><i class="far fa-clock margin-right--025"></i> {{ c.starting_time | moment_location( getClassTimeFormat(), getTimezone(c.locationId) ) }} <template v-if="schedule.appearance.show_ending">- {{ c.ending_time | moment_location( getClassTimeFormat(), getTimezone(c.locationId) ) }}</template></span>
                                <span class="margin-right--05" v-if="schedule.appearance.show_duration"><i class="middot" v-if="schedule.appearance.show_duration"></i>{{c.duration}} minutes</span>
                                <span class="no-wrap" v-if="schedule.appearance.show_classTypes"><i class="middot" v-if="getClassClassTypes(c.classTypesIds)"></i> {{getClassClassTypes(c.classTypesIds)}}</span>
                            </div>
                        </div>
                    </div>
                    <div v-if="schedule.modal !== 2" class="class__buttons">
                        <div>
                            <nuxt-link :to="{ path: `/${c.slug}`, params: { slug: c.slug }, query: { ts: getClassTs(c.starting_time, c.locationId) } }" v-if="schedule.appearance.show_excerpt" class="btn-class-details">{{ getText('schedule/details') }}</nuxt-link>
                            <a v-if="canBook(c)" href="#" class="btn-class-book" v-on:click.prevent="openModal(c, c.starting_time)">{{ getText('schedule/book') }}</a>
                        </div>
                    </div>
                </article>
            </div>
        </div>
        <div v-if="classes.length === 0" class="empty">
            {{schedule.appearance.labelNothingToShow}}
        </div>
    </div>
</template>

<script>
    import _ from 'lodash'
    import moment from 'moment-timezone'
    export default {
        name: "ScheduleCompactList",
        props: ['classes', 'schedule'],
        computed: {
          classes_by_day: function(){
              let vm = this
              return _.groupBy( this.classes, function(i){
                  return moment.tz(i.starting_time, vm.getTimezone(i.locationId)).format('YYYY-MM-DD')
              })
          }
        },
        filters: {
            moment_location: function(v, f, tz){
                return moment.tz(v, tz).format(f)
            }
        },
        methods: {
            canBook: function(c){
                return parseInt( moment.tz(c.starting_time, this.getTimezone(c.locationId)).format('X') ) > parseInt( moment().tz(this.getTimezone(c.locationId)).format('X') )
            },
            getClassTs: function(sdate, lId){
                return parseInt( moment.tz(sdate, this.getTimezone(lId)).format('X') )
            },
            getTimezone: function(id){
              try{
                let l = _.find( this.$store.getters.locations, { id: id } )
                return l.timezone || 'Europe/London'
              } catch (e){
                return 'Europe/London'
              }
            },
            openModal: function(c, sdate){
                this.$emit('openClassModal', {
                    classId: c.id,
                    ts: parseInt( moment.tz(sdate, this.getTimezone(c.locationId)).format('X') )
                })
            }
        }
    }
</script>

<style scoped>

</style>
