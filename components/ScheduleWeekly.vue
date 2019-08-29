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
                            <div>{{ event.starting_time | moment_location( getClassTimeFormat(), getTimezone(event.locationId) ) }} <template v-if="schedule.appearance.show_ending">- {{ event.ending_time | moment_location( getClassTimeFormat(), getTimezone(event.locationId) ) }}</template></div>
                            <div v-if="schedule.appearance.show_duration">
                                <template v-if="event.duration / 60 > 1">
                                    <template v-if="Math.ceil( event.duration / 60 ) > 1">{{Math.ceil( event.duration / 60 )}} hours </template>
                                    <template v-else>1 hour</template>
                                    <template v-if="event.duration % 60 > 0"> {{event.duration % 60}} minutes</template>
                                </template>
                                <template v-else-if="event.duration / 60 === 1">1 hour</template>
                                <template v-else>
                                    {{event.duration}} minutes
                                </template>
                            </div>
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
    import moment from 'moment-timezone'
    export default {
        name: "ScheduleCompactList",
        props: ['classes', 'schedule', 'start', 'stop'],
        computed: {
          classes_by_day: function(){
              let vm = this
              return _.groupBy( this.classes, function(i){
                  return moment.tz(i.starting_time, vm.getTimezone(i.locationId)).format()
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
            },
            moment_location: function(v, f, tz){
                return moment.tz(v, tz).format(f)
            }
        },
        methods: {
            getDayEvents: function(d){
                let vm = this
              return _.filter( this.classes, function(c){
                  return parseInt( moment.tz(c.starting_time, vm.getTimezone(c.locationId)).format('d') ) === (d > 6 ? 0 : d)
              })
            },
            openModal: function(c, sdate){
                this.$emit('openClassModal', {
                    classId: c.id,
                    ts: parseInt( moment.tz(sdate, this.getTimezone(c.locationId)).format('X') )
                })
            },
            getTimezone: function(id){
                let l = _.find( this.$store.getters.locations, { id: id } )
                return l.timezone || 'Europe/London'
            },
            getClassTs: function(sdate, lId){
                return parseInt( moment.tz(sdate, this.getTimezone(lId)).format('X') )
            },
        }
    }
</script>

<style scoped lang="sass">

</style>