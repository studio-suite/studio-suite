<template>
    <div class="schedule" :class="schedule_classes">
        <div v-show="ready">
            <component :is="schedule_style" :classes="classes_list" :schedule="schedule" @openClassModal="openClassModal" :start="schedule_start" :stop="schedule_stop"></component>
        </div>
        <div v-show="!ready"></div>
        <ClassModal :visible="showModal" :ts="ts" :classId="classId" @closeModal="showModal = false"></ClassModal>
    </div>
</template>

<script>
    import _ from 'lodash'
    import moment from 'moment-timezone';
    //const AsyncComponent = () => import('~/AsyncComponent.vue');
    import algoliasearch from 'algoliasearch'

    export default {
        name: "Schedule",
        props: ['schedule', 'filters', 'classes'],
        components: {
            SchedulePlainList: () => import('~/components/SchedulePlainList'),
            ScheduleCompactList: () => import('~/components/ScheduleCompactList'),
            ScheduleWeekly: () => import( '~/components/ScheduleWeekly' ),
            ClassModal: () => import('~/components/ClassModal')
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
            schedule_style: function (){
              try{
                if( this.schedule.style === 1 ){
                  return 'ScheduleCompactList'
                }
                if( this.schedule.style === 2 ){
                  return 'ScheduleWeekly'
                }
                return 'SchedulePlainList'
              } catch (e){
                return 'SchedulePlainList'
              }
            },
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
                let vm = this
                for( let day = moment(vm.schedule_start).hour(12).minutes(30); day.isBefore(vm.schedule_stop); day.add(1, 'days') ){
                    let date = day.format('YYYY-MM-DD HH:mm:ss')
                    let count = 100
                    _.each(vm.available_classes, function(i){
                        let blockedByClass = vm.isClassBlocked(i, date)
                        let blockedBySeason = vm.isDayBlockedBySeason(i, date)
                        let blockedByLocation = vm.isDayBlockedByLocation(i, date)
                        if( ! blockedByClass && ! blockedBySeason && ! blockedByLocation && count > 0 ){
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
                classes = classes.splice(0, parseInt( vm.schedule.limitType ) === 1  ? vm.schedule.limit : 300 )
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
                if( this.schedule.start === 1 && ! _.isUndefined( this.schedule.startSpecific ) && this.schedule.startSpecific.length > 5 ) return moment(this.schedule.startSpecific).format('YYYY-MM-DD')
                if( this.schedule.start === 2 ) return moment().add( this.schedule.startDays || 14, 'days').format('YYYY-MM-DD')
                return moment().format('YYYY-MM-DD')
            },
            schedule_stop: function(){
                if( this.schedule.style === 2 ) return moment(this.schedule_start).add(7, 'days').format('YYYY-MM-DD')
                if( this.schedule.stop === 1 && ! _.isUndefined( this.schedule.stopSpecific ) && this.schedule.stopSpecific.length > 5 ) return moment(this.schedule.stopSpecific).add(1, 'day').format('YYYY-MM-DD')
                return moment().add(this.schedule.stopDays || 14, 'days').format('YYYY-MM-DD')
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
                let index = client.initIndex(process.env.VUE_APP_ALGOLIA_BOOKINGS_INDEX);
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
                let location = _.find( this.$store.getters.locations, { id: classObj.locationId } )
                let tz = ! _.isUndefined( location ) ? location.timezone : 'Europe/London'
                let instances = []
                let dayIntervals =  _.find(classObj.schedule.days, {d: parseInt(moment.tz(date, tz).format('e'))})
                    dayIntervals = ! _.isUndefined( dayIntervals ) ? [ dayIntervals ] : []
                if( ! _.isUndefined( classObj.schedule ) && ! _.isUndefined( classObj.schedule.specific ) && classObj.schedule.specific.length > 0 ){
                    let matched = _.find( classObj.schedule.specific, { d: moment.tz(date, tz).format('YYYY-MM-DD') } )
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
                // Filter for past instance
                instances = _.filter( instances, function(i){
                  return moment.tz(i.starting_time, tz).isSameOrAfter( moment().tz(tz) )
                })

                // Filter for fully booked
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
                    return _.isUndefined( _.find( intervals, function (i) {
                       return  vm.startsInInterval(interval, i)
                    }))
                }
                return false
            },
            isClassBlocked: function(c, d){
                if(  ! _.isUndefined(c.schedule) && ! _.isUndefined( c.schedule.empty ) && c.schedule.empty.indexOf(d.split(' ')[0]) >= 0 ){
                    return true
                }
                let validDays = ! _.isUndefined( c.schedule ) ? _.find( c.schedule.days, {d: parseInt(moment.tz(d, this.getTimezone(c.locationId)).format('e')) } ) : undefined
                let specificDays =  _.isUndefined( c.schedule ) || _.isUndefined( c.schedule.specific ) ? undefined : _.find( c.schedule.specific, { d: moment.tz(d, this.getTimezone(c.locationId)).format('YYYY-MM-DD') } )
                let out = _.isUndefined( validDays ) && _.isUndefined( specificDays )
                return out
            },
            isDayBlockedByLocation: function(c, d){
                let vm = this
                let location = _.find(this.$store.state.locations.list, {id: c.locationId })
                try{
                    let block = true
                    let date_for_days = parseInt(moment.tz(d, vm.getTimezone(location.id)).format('e'))
                    let date_for_specific = moment.tz(d, vm.getTimezone(location.id)).format('YYYY-MM-DD')
                    if( ! _.isUndefined( location.schedule.empty ) && location.schedule.empty.indexOf(date_for_specific) >= 0 ){
                        return true
                    }
                    let location_specific = ! _.isUndefined( location.schedule.specific ) ? _.find( location.schedule.specific,  { d: date_for_specific } )  : undefined
                    let location_days = ! _.isUndefined( location.schedule.days ) ? _.find( location.schedule.days, {d: date_for_days } ) : undefined
                    let location_intervals = location_specific || location_days
                    if( !_.isUndefined( location_intervals ) && !_.isUndefined( location_intervals.i ) && location_intervals.i.length > 0 ){
                      let class_specific = ! _.isUndefined( c.schedule.specific ) ? _.find( c.schedule.specific, { d: date_for_specific } ) : undefined
                      let class_days = ! _.isUndefined( c.schedule.days ) ? _.find( c.schedule.days, { d: date_for_days } ) : undefined
                      let class_intervals = class_specific || class_days
                        if( ! _.isUndefined( class_intervals ) && ! _.isUndefined( class_intervals.i ) && class_intervals.i.length > 0 ){
                            _.each( class_intervals.i, function(interval){
                                block = block ? vm.fitsIntervals( d, interval, location_intervals.i ) : !block
                            })
                        }
                    }
                    return block
                } catch (e) {
                    console.error(e)
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
                try{
                  let l = _.find( this.$store.getters.locations, { id: id } )
                  return l.timezone || 'Europe/London'
                } catch (e){
                  return 'Europe/London'
                }
            }
        }
    }
</script>

<style scoped>

</style>
