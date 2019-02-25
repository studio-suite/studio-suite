<template>
    <div>
        <div v-if="classes.length > 0" class="weekly_schedule" :class="{ 'weekly_schedule--weekdays-only' : schedule.appearance.show_weekdays }">
            <div v-for="day in 7" class="weekly_schedule__day" v-if="(schedule.appearance.show_weekdays && day <= 5) || !schedule.appearance.show_weekdays">
                <div class="weekly_schedule__day-title">
                    {{day | getDayName(day)}}
                </div>
                <div class="weekly_schedule__day-classes">
                    <article v-for="event in getDayEvents(day)" class="class" v-on:click.prevent="openModal(event, event.starting_time)">
                        <h2>{{event.title}} <i class="fas fa-play"></i></h2>
                        <div class="meta">
                            <div>{{ event.starting_time | moment( getClassTimeFormat() ) }} <template v-if="schedule.appearance.show_ending">- {{ event.ending_time | moment( getClassTimeFormat() ) }}</template></div>
                            <div v-if="schedule.appearance.show_duration">{{event.duration}} minutes</div>
                            <div v-if="getClassClassTypes(event.classTypesIds)">{{getClassClassTypes(event.classTypesIds)}}</div>
                        </div>
                    </article>
                </div>
            </div>

        </div>
        <div v-if="classes.length === 0" class="empty">
            {{schedule.appearance.labelNothingToShow}}
        </div>
    </div>
</template>

<script>
    import _ from 'lodash'
    import moment from 'moment'
    export default {
        name: "ScheduleCompactList",
        props: ['classes', 'schedule', 'start', 'stop'],
        computed: {
          classes_by_day: function(){
              return _.groupBy( this.classes, function(i){
                  return moment(i.starting_time).utcOffset(0).format('YYYY-MM-DDT00:00:00Z')
              })
          },
            week: function(){
              let week = []

              return week
            }
        },
        filters: {
          getDayName: function(d){
              return moment().utcOffset(0).day(d > 6 ? 0 : d).format('dddd')
          }
        },
        methods: {
            getDayEvents: function(d){
              return _.filter( this.classes, function(c){
                  return parseInt( moment(c.starting_time).utcOffset(0).format('d') ) === (d > 6 ? 0 : d)
              })
            },
            openClassPage: function(slug, sdate){
                this.$router.push({
                    path: `/${slug}`,
                    query: {
                        ts:  parseInt( moment(sdate).utcOffset(0).format('X') )
                    }
                } )
            },
            openModal: function(c, sdate){
                if( this.schedule.modal === 1 ){
                    this.openClassPage(c.slug, sdate)
                } else if( this.schedule.modal === 0 ){
                    this.$emit('openClassModal', {
                        classId: c.id,
                        ts: parseInt( moment(sdate).utcOffset(0).format('X') )
                    })
                }
            }
        }
    }
</script>

<style scoped>

</style>