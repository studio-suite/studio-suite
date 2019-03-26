<template>
    <div class="schedule" :class="schedule_classes">
        <SchedulePlainList v-if="schedule.style === 0" :classes="classes_list" :schedule="schedule" @openClassModal="openClassModal"></SchedulePlainList>
        <ScheduleCompactList v-if="schedule.style === 1" :classes="classes_list" :schedule="schedule" @openClassModal="openClassModal"></ScheduleCompactList>
        <ScheduleWeekly
                v-if="schedule.style === 2"
                :classes="classes_list"
                :schedule="schedule"
                :start="schedule_start"
                :stop="schedule_stop"
                @openClassModal="openClassModal"></ScheduleWeekly>
        <ClassModal :visible="showModal" :ts="ts" :classId="classId" @closeModal="showModal = false"></ClassModal>
    </div>
</template>

<script>
    import _ from 'lodash'
    import moment from 'moment'
    import SchedulePlainList from '@/components/SchedulePlainList'
    import ScheduleCompactList from '@/components/ScheduleCompactList'
    import ScheduleWeekly from '@/components/ScheduleWeekly'
    import ClassModal from '@/components/ClassModal'
    export default {
        name: "Schedule",
        props: ['schedule', 'filters', 'classes'],
        components: {
            SchedulePlainList,
            ScheduleCompactList,
            ScheduleWeekly,
            ClassModal
        },
        data: function(){
          return {
              showModal: false,
              classId: null,
              ts: null
          }
        },
        computed: {
            classes_list: function(){
                let classes = []
                let vm = this
                for( let day = moment(vm.schedule_start); day.isBefore(vm.schedule_stop); day.add(1, 'days') ){
                    let date = day.format('YYYY-MM-DD')
                    _.each(vm.classes, function(i){
                        if( ! vm.isClassBlocked(i, date) && ! vm.isDayBlockedBySeason(i, date) && ! vm.isDayBlockedByLocation(i, date) ){
                            let instances = vm.buildInstances( i, date )
                            if( ! _.isUndefined( instances ) ){
                                _.each(instances, function(ii){
                                    classes.push(ii)
                                })
                            }
                        }
                    })

                }
                // Filter by day of the week
                if( ! _.isUndefined( vm.filters ) && ! _.isUndefined( vm.filters.days ) && ! _.isNull( vm.filters.days ) && ! _.isUndefined( vm.filters.days ) && ! _.isNull( vm.filters.days ) ){
                    classes = _.filter( classes, function(c){
                        return parseInt( moment(c.starting_time).utcOffset(0).format('d') ) === parseInt(vm.filters.days )
                    })
                }
                // Filter by time of the day
                if( ! _.isUndefined( vm.filters ) && ! _.isUndefined( vm.filters.times ) && ! _.isNull( vm.filters.times ) && ! _.isUndefined( vm.filters.times ) && ! _.isNull( vm.filters.times ) ){
                    classes = _.filter( classes, function(c){
                        let h = parseInt( moment(c.starting_time).utcOffset(0).format('H') )
                        switch ( vm.filters.times ) {
                            case 0 : return  h <= 11
                            case 1 : return h > 11 && h <= 16
                            case 2 : return h > 16 && h <= 23
                            default: return false
                        }
                    })
                }
                // Limit classes by number
                vm.schedule.limitType === 1 ? classes.splice(0, vm.schedule.limit || 9999999) : classes
                return classes
            },
            schedule_classes: function(){
                let out = ''
                if( this.schedule.style === 0 ) out += 'schedule--style--plain-list';
                if( this.schedule.style === 1 ) out += 'schedule--style--compact-list';
                if( this.schedule.style === 2 ) out += 'schedule--style--weekly-schedule';
                return out
            },
            schedule_start: function(){
                if( this.schedule.start === 1 ) return moment(this.schedule.startSpecific).format('YYYY-MM-DD')
                if( this.schedule.start === 2 ) return moment().add( this.schedule.startDays, 'days').format('YYYY-MM-DD')
                return moment().format('YYYY-MM-DD')
            },
            schedule_stop: function(){
                if( this.schedule.style === 2 ) return moment(this.schedule_start).add(7, 'days').format('YYYY-MM-DD')
                if( this.schedule.stop === 1 ) return moment(this.schedule.stopSpecific).format('YYYY-MM-DD')
                return moment().add(this.schedule.stopDays, 'days').format('YYYY-MM-DD')
            }
        },
        methods: {
            openClassModal: function(v){
                if( ! _.isNull( v ) ){
                    this.classId = v.classId
                    this.ts = v.ts
                    this.showModal = true
                } else {
                    this.classId = null
                    this.ts = null
                    this.showModal = false
                }
            },
            buildInstances: function(classObj, date){
                let instances = []
                let dayIntervals = !_.isUndefined( classObj.schedule ) && !_.isUndefined( classObj.schedule.specific ) && ! _.isEmpty( classObj.schedule.specific ) && ! _.isUndefined( _.find( classObj.schedule.specific, { d: date } ) ) ? _.find( classObj.schedule.specific, { d: date } ) : _.find(classObj.schedule.days, {d: parseInt(moment(date).format('e'))})
                if( ! _.isUndefined( dayIntervals ) ){
                    _.each(dayIntervals.i, function(i){
                        instances.push(i)
                    })
                }
                instances = _.map(instances, function(i){
                    let h = parseInt( i.s / 60 )
                        h = h < 10 ? `0${h}` : h
                    let min = i.s % 60
                        min = min < 10 ? `0${min}` : min
                    let starting_time = h + ':' + min
                        h = parseInt( i.e / 60 )
                    h = h < 10 ? `0${h}` : h
                        min = i.s % 60
                        min = min < 10 ? `0${min}` : min
                    let ending_time = h + ':' + min
                    return {
                        ...classObj,
                        duration: i.e - i.s,
                        starting_time: `${date}T${starting_time}Z`,
                        ending_time: `${date}T${ending_time}Z`,
                    }
                })
                return instances.length > 0 ? instances : undefined
            },
            startsInInterval: function(start, end){
                return start.s >= end.s
            },
            fitsIntervals: function(d, interval, intervals ){
                let vm = this
                if( !_.isUndefined( intervals ) ){
                    _.each(intervals, function(i){
                        if( vm.startsInInterval(interval, i) ){
                            return true
                        }
                    })
                } else {
                    return undefined
                }
            },
            isClassBlocked: function(c, d){
                if(  ! _.isUndefined( c.schedule.empty ) && c.schedule.empty.indexOf(d) >= 0 ){
                    return true
                }
                let validDays = _.find( c.schedule.days, {d: parseInt(moment(d).format('e')) } )
                let specificDays = _.isUndefined( c.specific ) ? undefined : _.find( c.schedule.specific, {d: parseInt(moment(d).format('e')) } )
                return _.isUndefined(validDays) && _.isUndefined( specificDays ) || _.isUndefined( validDays ) && !_.isUndefined( specificDays )
            },
            isDayBlockedByLocation: function(c, d){
                let vm = this
                let locationSchedule = _.find(this.$store.state.locations.list, {id: c.locationId })
                try{

                    if( ! _.isUndefined( locationSchedule.schedule ) && ! _.isUndefined( locationSchedule.schedule.empty ) && locationSchedule.schedule.empty.indexOf(d) >= 0 ){
                        return true
                    }
                    let validSpecific = ! _.isUndefined( locationSchedule.specific ) ? _.find( locationSchedule.specific,  {d: parseInt(moment(d).format('e')) }) : undefined
                        validSpecific = !_.isUndefined( validSpecific ) ? vm.fitsIntervals( d, validSpecific.i, c.schedule.specific ) : validSpecific
                    let validDays = _.find( locationSchedule.schedule.days, {d: parseInt(moment(d).format('e')) } )
                        validDays = !_.isUndefined( validDays ) ? vm.fitsIntervals( d, validSpecific.i, c.schedule.days ) : validDays
                    return !_.isUndefined(validDays) || _.isUndefined( validDays ) && !_.isUndefined( validSpecific )
                } catch (e) {
                    return false
                }
            },
            isDayBlockedBySeason: function(c, d){
                let blocked  = false
                let vm = this
                if( ! _.isUndefined( c.seasonsIds ) && ! _.isEmpty( c.seasonsIds ) ){
                    _.each( c.seasonsIds, function(season){
                        let validSeason = _.find( vm.$store.state.seasons.list, { id: season } )
                        if( ! blocked && ! _.isUndefined( validSeason ) && ( moment(validSeason.range[0]).isAfter(d) || moment(validSeason.range[1]).isBefore(d) ) ){
                            blocked = true
                        }
                    })
                }
                return blocked
            }
        }
    }
</script>

<style scoped>

</style>