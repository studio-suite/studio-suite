<template>
    <div class="schedule" :class="schedule_classes">
        <SchedulePlainList v-if="schedule.style === 0" :classes="classes_list"></SchedulePlainList>
    </div>
</template>

<script>
    import _ from 'lodash'
    import moment from 'moment'
    import SchedulePlainList from '@/components/SchedulePlainList'
    export default {
        name: "Schedule",
        props: ['schedule', 'filters', 'classes'],
        components: {
            SchedulePlainList
        },
        computed: {
            classes_list: function(){
                let classes = []
                let vm = this
                for( let day = moment(vm.schedule_start); day.isBefore(vm.schedule_stop); day.add(1, 'days') ){
                    let date = day.format('YYYY-MM-DD')
                    _.each(this.classes, function(i){
                        if( ! vm.isClassBlocked(i, date) && ! vm.isDayBlockedBySeason(i, date) && ! vm.isDayBlockedByLocation(i, date) ){
                            let instances = vm.buildInstances( i, date )
                            if( ! _.isUndefined( instances ) ){
                                _.each(instances, function(ii){
                                    classes.push(ii)
                                })
                            }
                        }
                        /*if( i.schedule.empty.indexOf(date) === 0 && ( _.isUndefined( i.schedule.specific ) || _.isUndefined( _.find(i.schedule.specific, {d: date } ) ) ) ){
                            _.each(i.schedule.days)




                        }*/
                    })

                }

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
                if( this.schedule.start === 1 ) return moment().format('YYYY-MM-DD')
                if( this.schedule.start === 2 ) return moment(this.schedule.startSpecific).format('YYYY-MM-DD')
                return moment().format('YYYY-MM-DD')
            },
            schedule_stop: function(){
                if( this.schedule.stop === 1 ) return moment(this.schedule.stopSpecific).format('YYYY-MM-DD')
                return moment().add(this.schedule.stopDays, 'days').format('YYYY-MM-DD')
            }
        },
        methods: {
            buildInstances: function(classObj, date){
                let instances = []
                let dayIntervals = _.find(classObj.schedule.days, {d: parseInt(moment(date).format('e'))})
                if( ! _.isUndefined( dayIntervals ) ){
                    _.each(dayIntervals.i, function(i){
                        instances.push(i)
                    })
                }
                /*let specificIntervals = _.find(classObj.schedule.days, {d: date})
                if( ! _.isUndefined( specificIntervals ) ){
                    _.each(specificIntervals, function(i){
                        instances.push([ (i[0]/60).toString().replace('.',':'), (i[1]/60).toString().replace('.',':') ])
                    })
                }*/
                console.log('class', classObj)
                instances = _.map(instances, function(i){
                    let starting_time = parseInt(i.s / 60) + ':' + i.s % 60
                    return {
                        ...classObj,
                        duration: i.e - i.s,
                        starting_time: `${date}T${starting_time}`,
                    }
                })
                console.log('instances', instances)
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
                if(  ! _.isUndefined( c.empty ) && c.empty.indexOf(d) >= 0 ){
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
                    if( ! _.isUndefined( locationSchedule.empty ) && locationSchedule.empty.indexOf(d) >= 0 ){
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
                if( ! _.isUndefined( c.seasonId ) ){
                    let validSeason = _.find( this.$store.state.seasons.list, { id: c.seasonId } )
                    if( ! _.isUndefined( validSeason ) ){
                        return moment(validSeason.range[0]).isBefore(d) && moment(validSeason.range[1]).isAfter(d)
                    }
                }
                return false
            }
        }
    }
</script>

<style scoped>

</style>