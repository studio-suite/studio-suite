<template>
    <div class="schedule" :class="schedule_classes">
        <div v-show="ready">
            <SchedulePlainList v-if="schedule.style === 0" :classes="classes_list" :schedule="schedule" @openClassModal="openClassModal"></SchedulePlainList>
            <ScheduleCompactList v-if="schedule.style === 1" :classes="classes_list" :schedule="schedule" @openClassModal="openClassModal"></ScheduleCompactList>
            <ScheduleWeekly v-if="schedule.style === 2" :classes="classes_list" :schedule="schedule" :start="schedule_start" :stop="schedule_stop" @openClassModal="openClassModal"></ScheduleWeekly>
        </div>
        <div v-show="!ready"></div>
        <ClassModal :visible="showModal" :ts="ts" :classId="classId" @closeModal="showModal = false"></ClassModal>
    </div>
</template>

<script>
    import _ from 'lodash'
    import moment from 'moment-timezone';
    import SchedulePlainList from '@/components/SchedulePlainList'
    import ScheduleCompactList from '@/components/ScheduleCompactList'
    import ScheduleWeekly from '@/components/ScheduleWeekly'
    import ClassModal from '@/components/ClassModal'

    import algoliasearch from 'algoliasearch'

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
              ts: null,
              bookings: [],
              bookings_page: 0,
              bookings_pages: 0,
              bookings_count: 0,
              ready: false
          }
        },
        computed: {
            available_classes: function(){
                let vm = this
                let classes = _.map( vm.classes, function(i){
                    let bookings = _.filter( vm.bookings, { classId: i.id })
                    bookings = _.groupBy(bookings, 'ts')
                    bookings = _.map( bookings, function(objs, bb){
                        return {
                            ts: bb,
                            count: _.sumBy(objs, 'count')
                        }
                    })
                    bookings = _.filter( bookings, function(bb){
                        return bb.count >= i.capacity
                    })
                    return {
                        ...i,
                        fully_booked: _.map(bookings, function(b){
                            return b.ts
                        })
                    }
                })
                return classes
            },
            classes_list: function(){
                let classes = []
                let count = 100
                let vm = this
                for( let day = moment(vm.schedule_start); day.isBefore(vm.schedule_stop); day.add(1, 'days') ){
                    let date = day.format('YYYY-MM-DD')
                    _.each(vm.available_classes, function(i){
                        if( ! vm.isClassBlocked(i, date) && ! vm.isDayBlockedBySeason(i, date) && ! vm.isDayBlockedByLocation(i, date) && count > 0 ){
                            let instances = vm.buildInstances( i, date )
                            if( ! _.isUndefined( instances ) ){
                                _.each(instances, function(ii){
                                    if( count > 0 ){
                                        classes.push(ii)
                                        count--
                                    }
                                })
                            }
                        }
                    })

                }

                classes = _.orderBy( classes, ['starting_time'] )

                // Filter by day of the week
                if( ! _.isUndefined( vm.filters ) && ! _.isUndefined( vm.filters.days ) && ! _.isNull( vm.filters.days ) && ! _.isUndefined( vm.filters.days ) && ! _.isNull( vm.filters.days ) ){
                    classes = _.filter( classes, function(c){
                        return parseInt( moment.tz(c.starting_time, vm.getTimezone(c.locationId)).format('d') ) === parseInt(vm.filters.days )
                    })
                }
                // Filter by time of the day
                if( ! _.isUndefined( vm.filters ) && ! _.isUndefined( vm.filters.times ) && ! _.isNull( vm.filters.times ) && ! _.isUndefined( vm.filters.times ) && ! _.isNull( vm.filters.times ) ){
                    classes = _.filter( classes, function(c){
                        let h = parseInt( moment.tz(c.starting_time, vm.getTimezone(c.locationId)).format('H') )
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
                if( this.schedule.stop === 1 ) return moment(this.schedule.stopSpecific).add(1, 'day').format('YYYY-MM-DD')
                return moment().add(this.schedule.stopDays, 'days').format('YYYY-MM-DD')
            }
        },
        mounted: function(){
            let vm = this
            vm.ready = true
            vm.getBookings()
        },
        watch: {
            bookings: function(nv){
                let vm = this
                if( nv.length < vm.bookings_count ){
                    vm.getBookings(vm.bookings_page)
                }
            }
        },
        methods: {
            getBookings: function(page){
                let vm = this
                let client = algoliasearch( '04QHF1E2Q9', this.$store.getters.tenant.algoliaPublicApiKey );
                let index = client.initIndex('ss_prod_bookings');
                let filters = ''
                let min = parseInt( moment(`${vm.schedule_start}T00:00:00Z`).format('X') )
                let max = parseInt( moment( `${vm.schedule_stop}T23:59:59Z` ).format('X') )
                filters += `ts:${min} TO ${max}`
                index.search({
                        hitsPerPage: 1000,
                        page: page || 0,
                        filters: `${filters} AND status>=1`
                    },
                    function searchDone(err, content) {
                        if (err) throw err;
                        vm.bookings = _.concat(vm.bookings, content.hits)
                        vm.bookings_count = content.nbHits
                        vm.bookings_pages = content.nbPages
                        vm.bookings_page++
                    }
                );
            },
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
                let tz = _.find( this.$store.getters.locations, { id: classObj.locationId } )
                    tz = ! _.isUndefined( tz ) ? tz.timezone : 'Europe/London'
                let instances = []
                let dayIntervals =  _.find(classObj.schedule.days, {d: parseInt(moment.tz(date, tz).format('e'))})
                    dayIntervals = ! _.isUndefined( dayIntervals ) ? [ dayIntervals ] : []
                if( ! _.isUndefined( classObj.schedule ) && ! _.isUndefined( classObj.schedule.specific ) && ! _.isEmpty( classObj.schedule.specific ) ){
                    let matched = _.find( classObj.schedule.specific, { d: date } )
                    if( ! _.isUndefined( matched ) ){
                        dayIntervals = []
                        dayIntervals = _.concat( dayIntervals, matched )
                    }
                }
                if( dayIntervals.length > 0 ){
                    _.each( dayIntervals, function(di){
                        _.each(di.i, function(i){
                            instances.push(i)
                        })
                    })
                }
                instances = _.orderBy( instances, ['s'] )
                instances = _.map(instances, function(i){
                    return {
                        ...classObj,
                        duration: i.e - i.s,
                        starting_time: moment.tz(date, tz).hours( Math.floor( i.s / 60 ) ).set('minutes', i.s % 60 ).set('seconds', 0).set('milliseconds', 0).format(), //`${date}T${starting_time}Z`,
                        ending_time: moment.tz(date, tz).hours( Math.floor( i.e / 60 ) ).set('minutes', i.e % 60 ).set('seconds', 0).set('milliseconds', 0).format() //`${date}T${ending_time}Z`,
                    }
                })
                instances = _.filter(instances, function(i){
                    if( ! _.isUndefined( classObj.fully_booked ) ){
                        let ts = moment.tz(i.starting_time, tz).format('X').toString()
                        let fully_booked = _.find( classObj.fully_booked, function(v){
                            return v === ts
                        })
                        return _.isUndefined( fully_booked )
                    }
                    return true
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
                if(  ! _.isUndefined(c.schedule) && ! _.isUndefined( c.schedule.empty ) && c.schedule.empty.indexOf(d) >= 0 ){
                    return true
                }
                let validDays = ! _.isUndefined( c.schedule ) ? _.find( c.schedule.days, {d: parseInt(moment.tz(d, this.getTimezone(c.locationId)).format('e')) } ) : undefined
                let specificDays =  _.isUndefined( c.schedule ) || _.isUndefined( c.schedule.specific ) ? undefined : _.find( c.schedule.specific, { d: d } )
                let out = _.isUndefined( validDays ) && _.isUndefined( specificDays )
                return out
            },
            isDayBlockedByLocation: function(c, d){
                let vm = this
                let locationSchedule = _.find(this.$store.state.locations.list, {id: c.locationId })
                try{

                    if( ! _.isUndefined( locationSchedule ) && ! _.isUndefined( locationSchedule.schedule ) && ! _.isUndefined( locationSchedule.schedule.empty ) && locationSchedule.schedule.empty.indexOf(d) >= 0 ){
                        return true
                    }
                    let validSpecific = ! _.isUndefined( locationSchedule.specific ) ? _.find( locationSchedule.specific,  {d: parseInt(moment.tz(d, vm.getTimezone(c.locationId)).format('e')) }) : undefined
                        validSpecific = !_.isUndefined( validSpecific ) ? vm.fitsIntervals( d, validSpecific.i, c.schedule.specific ) : validSpecific
                    let validDays = _.find( locationSchedule.schedule.days, {d: parseInt(moment.tz(d, vm.getTimezone(c.locationId)).format('e')) } )
                        validDays = !_.isUndefined( validDays ) ? vm.fitsIntervals( d, validSpecific.i, c.schedule.days ) : validDays
                    return !_.isUndefined(validDays) || _.isUndefined( validDays ) && !_.isUndefined( validSpecific )
                } catch (e) {
                    return false
                }
            },
            isDayBlockedBySeason: function(c, d){
                let vm = this
                if( vm.$store.state.seasons.list.length === 0 ){
                    return false
                }
                let blocked  = 0
                if( ! _.isUndefined( c.seasonsIds ) && ! _.isEmpty( c.seasonsIds ) ){
                    let seasons = JSON.parse( JSON.stringify( vm.$store.state.seasons.list ) )
                    let ids = JSON.parse( JSON.stringify( c.seasonsIds ) )
                    ids = _.filter( ids, function(i){
                        return _.map(seasons, function(s){
                            return s.id
                        }).indexOf(i) >= 0
                    })
                    _.each( ids, function(season){
                        let validSeason = _.find( vm.$store.state.seasons.list, { id: season } )
                        if( ! _.isUndefined( validSeason ) && ( moment.tz(validSeason.range[0], vm.getTimezone(c.locationId)).isAfter(d) || moment.tz(validSeason.range[1], vm.getTimezone(c.locationId)).isBefore(d) ) ){
                            blocked++
                        }
                    })
                    if( ids.length === 1 ){
                        return blocked > 0
                    }
                }

                return blocked === vm.$store.state.seasons.list.length
            },
            getTimezone: function(id){
                let l = _.find( this.$store.getters.locations, { id: id } )
                return l.timezone || 'Europe/London'
            }
        }
    }
</script>

<style scoped>

</style>