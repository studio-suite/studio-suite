<template>
    <section>
        <div class="single-class" v-if="classObject" :class="{ 'single-class--in-modal': isModal }">
            <div class="loading" v-if="loaders && isModal">
                <div class="loader"></div>
            </div>
            <div class="left-col">
                <h1 class="title">{{classObject.title}}</h1>

                <div class="meta margin-bottom--4">
                    <span class="margin-right--025"><i class="fal fa-users-class"></i> {{classAgeInterval}}</span> <span v-if="classTypes" class="no-wrap"><i class="middot"></i> {{classTypes}}</span>
                </div>
                <div v-if="classObject.image" class="image margin-bottom--4">
                    <img :src="getImgSrc({w: 1300}, classObject.image)" :alt="classObject.title">
                </div>
                <div class="short-description margin-bottom--4" v-if="classObject.excerpt">{{classObject.excerpt}}</div>
                <div class="content margin-bottom--6" v-if="!isModal && classObject.content" v-html="classObject.content ? marked(classObject.content) : ''"></div>
                <div class="instructors margin-bottom--6" v-if="classObject.instructorsIds && !isModal">
                    <h3>{{ getText('class/singleEvent/title/instructors') }}</h3>
                    <div v-for="instructor in classObject.instructorsIds" :key="instructor" class="instructor" v-if="getInstructor(instructor)">
                        <div class="left">
                            <template v-if="getInstructor(instructor).image">
                                <div class="avatar"><img :src="getImgSrc({w: 280, h: 280, crop: 'faces', fit: 'facearea'}, getInstructor(instructor).image)"></div>
                            </template>
                            <template v-else>
                                <div v-text="getInstructorInitials(instructor)" class="initials"></div>
                            </template>
                            <h4 v-text="getInstructorName(instructor)"></h4>
                            <div v-if="getInstructor(instructor).social" class="instructor__social-links">
                                <a v-if="getInstructor(instructor).social.fb" :href="getInstructor(instructor).social.fb" target="_blank" class="fb" :title="`Check out ${getInstructor(instructor).firstName}'s Facebook page`"><i class="fab fa-fw fa-facebook-f"></i></a>
                                <a v-if="getInstructor(instructor).social.tw" :href="getInstructor(instructor).social.tw" target="_blank" class="tw" :title="`Check out ${getInstructor(instructor).firstName}'s Twitter updates`"><i class="fab fa-fw fa-twitter" ></i></a>
                                <a v-if="getInstructor(instructor).social.in" :href="getInstructor(instructor).social.in" target="_blank" class="in" :title="`Check out ${getInstructor(instructor).firstName}'s Instagram stories`"><i class="fab fa-fw fa-instagram"></i></a>
                            </div>
                        </div>
                        <div v-if="getInstructor(instructor).bio" class="right" v-html="getInstructorBioHtml(instructor)">
                        </div>
                    </div>
                </div>
                <div class="location" v-if="classLocation" v-show="!isModal">
                    <h3>{{ getText('class/singleEvent/title/location') }}</h3>
                    <div id="map" ref="map" class="map margin-bottom--4"></div>
                    <h4>{{classLocation.name}}</h4>
                    <div class="address">
                        {{classLocation.address.address1}}<template v-if="classLocation.address.address2">, {{classLocation.address.address2}}</template><template v-if="classLocation.address.city">, {{classLocation.address.city}}</template>, {{classLocation.address.state}} {{classLocation.address.zip}}
                    </div>
                    <div v-if="classObject.description">
                        {{classObject.description}}
                    </div>
                </div>
            </div>
            <aside class="right-col">
                <div class="sticker">
                    <BookingBox
                            :price="classObject.price"
                            :capacity="classObject.capacity"
                            :availability="availability"
                            :dates_available="classNextAvailableDates"
                            :dates_next="classNextDates"
                            :language="classObject.language || []"
                            :availabilityRequest="availabilityRequest"
                            :tz="tz"
                            @openModal="openModal">
                    </BookingBox>
                    <template v-if="!isModal">
                        <h3 class="margin-top--4">{{ getText('class/singleEvent/share') }}</h3>
                        <a :href="fb_share_link" class="social-link" onclick="javascript:window.open(this.href, '', 'menubar=no,toolbar=no,resizable=yes,scrollbars=no,height=600,width=600');return false;"><i class="fab fa-facebook-f"></i></a>
                        <a :href="tw_share_link" class="social-link" onclick="javascript:window.open(this.href, '', 'menubar=no,toolbar=no,resizable=yes,scrollbars=no,height=600,width=600');return false;"><i class="fab fa-twitter"></i></a>
                    </template>

                </div>
            </aside>
        </div>
        <BookingModal :classObject="classObject" :ts="classNextTs" :classNextDuration="classNextDuration" :language="classObject.language" :availability="availability" :visible="showModal" @closeModal="showModal = false" @blockDate="updateAvailability" :tz="tz"></BookingModal>
    </section>
</template>

<script>
    import axios from "axios"
    import _ from "lodash"
    import marked from "marked"
    import moment from "moment-timezone"
    import BookingModal from '@/components/BookingModal'
    import BookingBox from '@/components/BookingBox'
    import queryString from 'querystring'
    import algoliasearch from 'algoliasearch'

    export default {
        name: "SingleEvent",
        components: {
            BookingModal,
            BookingBox
        },
        props: [ 'classObject', 'isModal', 'ts' ],
        data: function(){
            return {
                classNextTs: '',
                showModal: false,
                availability: [],
                chooseDate: false,
                availabilityRequest: false,
                map: null,
                loaders: false,
                bookings: [],
                startDate: moment.tz(this.tz).format(),
                startSteps: 0,
                classNextDuration:''
            }
        },
        watch: {
            bookings: function(nv){
                let vm = this
                let bookings = _.groupBy(nv, 'ts')
                    bookings = _.map( bookings, function(objs, bb){
                    return {
                        ts: parseInt(bb),
                        count: _.sumBy(objs, 'count')
                    }
                })
                vm.availability = bookings
            },
            classNextDates: function(n){
                let vm = this
                if( _.isEmpty(n) && vm.startSteps < 20 ){
                    vm.startDate = moment.tz(vm.startDate, vm.tz).add(14, 'days').format()
                    vm.startSteps++
                } else if( ! _.isEmpty( n ) ){
                    let tss = _.map( n, function(i){
                        return i.ts
                    })
                    if( ! _.isEmpty( tss ) ){
                        vm.getBookings( this.classObject.id, _.min( tss ), _.max( tss ) )
                    }
                }
            },
            ts: function(n){
                this.startDate = !_.isUndefined( n ) && ! _.isNull(n) ? moment.unix(parseInt(n)).tz(this.tz).format() : this.startDate
            }
        },
        mounted: function(){
            let vm = this
            let coords = this.classLocationCoords()
            if( coords !== false && this.isModal !== true && ! _.isUndefined( google ) && _.isArray( coords ) && coords.length === 2 ){
                let uluru = { lat: coords[0], lng: coords[1] };
                let map = new google.maps.Map( vm.$refs.map, { zoom: 16, center: uluru });
                new google.maps.Marker({position: uluru, map: map});
            }
            vm.startDate = !_.isUndefined( vm.ts ) && ! _.isNull(vm.ts) ? moment.unix(parseInt(vm.ts)).tz(vm.tz).format() : vm.startDate
            if( ! _.isEmpty( vm.classNextDates ) ){
                let tss = _.map( vm.classNextDates, function(i){
                    return i.ts
                })
                vm.getBookings( this.classObject.id, _.min( tss ), _.max( tss ) )
            } else {
                vm.startDate = moment.tz(vm.startDate, vm.tz).add(14, 'days').format()
            }

        },
        methods: {
            getBookings: function(classId, min, max){
                let vm = this
                vm.loaders = true
                let client = algoliasearch( '04QHF1E2Q9', this.$store.getters.tenant.algoliaPublicApiKey );
                let index = client.initIndex(process.env.VUE_APP_ALGOLIA_BOOKINGS_INDEX);
                let filters = ''
                filters += `ts:${min} TO ${max}`
                index.search({
                        hitsPerPage: 1000,
                        page: 0,
                        filters: `${filters} AND status >= 1 AND classId:${classId}`
                    },
                    function searchDone(err, content) {
                        vm.loaders = false;
                        vm.availabilityRequest = true
                        if (err) throw err;
                        vm.bookings = content.hits
                    }
                );
            },
            isDayBlockedByLocation: function(c, d){
                let vm = this
                let locationSchedule = _.find(this.$store.state.locations.list, {id: c.locationId })
                console.log('location schedule', locationSchedule)
                try{
                    if( ! _.isUndefined( locationSchedule.schedule ) && ! _.isUndefined( locationSchedule.schedule.empty ) && locationSchedule.schedule.empty.indexOf(d) >= 0 ){
                        return true
                    }
                    let validSpecific = ! _.isUndefined( locationSchedule.specific ) ? _.find( locationSchedule.specific,  {d: parseInt(moment.tz(d, vm.tz).format('e')) }) : undefined
                    validSpecific = !_.isUndefined( validSpecific ) ? vm.fitsIntervals( d, validSpecific.i, c.schedule.specific ) : validSpecific
                    let validDays = _.find( locationSchedule.schedule.days, {d: parseInt(moment.tz(d, vm.tz).format('e')) } )
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
                        if( ! _.isUndefined( validSeason ) && ( moment.tz(validSeason.range[0], vm.tz).isAfter(d) && moment.tz(validSeason.range[1], vm.tz).isBefore(d) ) ){
                            blocked++
                        }
                    })
                    if( ids.length === 1 ){
                        return blocked > 0
                    }
                }

                return blocked === vm.$store.state.seasons.list.length
            },
            marked: function(v){
              return marked(v)
            },
            updateAvailability: function(v){
                this.availability[v.ts] = _.isUndefined( this.availability[v.ts] ) ? parseInt( v.qty ) : ( this.availability[v.ts] + parseInt( v.qty ) )
            },
            openModal: function(p){
                this.classNextTs = p.ts
                this.classNextDuration = p.dr
                this.showModal = true
            },
            getInstructor: function (id) {
                return _.find(this.$store.getters.instructors, {id: id})
            },
            getInstructorBioHtml: function (id) {
                let out = ''
                let vm = this
                let instructor = vm.getInstructor(id)
                if( ! _.isUndefined(instructor) && ! _.isUndefined(instructor.bio) ){
                    out = marked(instructor.bio)
                }
                return out
            },
            getInstructorName: function(id){
                let vm = this
                let {firstName, lastName } = vm.getInstructor(id)
                return `${firstName} ${lastName}`
            },
            getInstructorInitials: function(id){
                let vm = this
                return _.join( _.map( vm.getInstructorName(id).split(' '), function(i){ return i[0] }), ' ')
            },


            classLocationCoords: function(){
                let vm = this
                if( !_.isUndefined( this.classLocation ) && ! _.isUndefined( this.classLocation.coords ) && this.classLocation.coords.indexOf('|') >= 0 ){
                    let coords = _.map(_.split(vm.classLocation.coords, '|'), Number)
                    return [coords[0], coords[1]]
                }
                return false
            },
            getTimezone: function(id){
                let l = _.find( this.$store.getters.locations, { id: id } )
                return l.timezone || 'Europe/London'
            }
        },
        computed: {
            language: function(){
              return this.classObject.language || []
            },
            tz: function(){
               return ! _.isUndefined( this.classLocation ) && ! _.isUndefined( this.classLocation.timezone ) ? this.classLocation.timezone || 'Europe/London' : 'Europe/London'
            },
            classNextDates: function(){
                let vm = this
                let schedule = vm.classObject.schedule
                let dates = []
                let startDate = moment.tz(this.startDate, vm.tz)
                let endDate = moment.tz(startDate, vm.tz).add(14, 'days')
                if( !_.isUndefined( schedule ) && !_.isUndefined( schedule.days ) && ! _.isEmpty( schedule.days ) ){
                    _.each( schedule.days, function(i){
                        let tempDate = moment.tz(startDate, vm.tz)
                        _.each( i.i, function(int){
                            while( tempDate.isSameOrBefore(endDate) ){
                                let inc_factor = tempDate.day() > i.d ? i.d + 7 : i.d
                                let temp_date = moment.tz(tempDate, vm.tz).set({hour:0,minute:0,second:0,millisecond:0}).day(inc_factor).add(int.s, 'minutes')
                                dates.push({
                                    d: temp_date.format('YYYY-MM-DD'),
                                    dr: parseInt( int.e ) - parseInt( int.s ),
                                    ts: parseInt( temp_date.format('X') )
                                })
                                tempDate = tempDate.add(7, 'days')
                            }
                        })
                    })
                }
                if( !_.isUndefined( schedule ) && !_.isUndefined( schedule.specific ) && ! _.isEmpty( schedule.specific ) ){
                    _.each( schedule.specific, function(i){
                        if( startDate.isSameOrBefore(moment.tz( `${i.d}T23:59:00`, vm.getTimezone(vm.classObject.locationId) )) ){
                            dates = _.filter( dates, function(d){
                                return d.d !== i.d
                            })
                            _.each( i.i, function(int){
                                dates.push({
                                    d: i.d,
                                    dr: parseInt( int.e ) - parseInt( int.s ),
                                    ts: parseInt( moment.tz( `${i.d}T00:00:00`, vm.getTimezone(vm.classObject.locationId) ).add(int.s, 'minutes').format('X') )
                                })
                            })
                        }
                    })
                }
                if( !_.isUndefined( schedule ) && !_.isUndefined( schedule.empty ) && ! _.isEmpty( schedule.empty ) ){
                    dates = _.filter( dates, function(d){
                        return schedule.empty.indexOf( d.d ) === -1
                    })
                }
                if( !_.isUndefined( vm.ts ) && ! _.isEmpty( vm.ts ) ){
                    dates = _.filter( dates, function(d){
                        return parseInt(d.ts) >= parseInt(vm.ts)
                    })
                }
                console.log('dates 4', dates)
                dates = _.filter( dates, function(dCheck){
                    return ! vm.isDayBlockedByLocation( vm.classObject, dCheck.d ) && ! vm.isDayBlockedBySeason( vm.classObject, dCheck.d )
                })
                console.log('dates 5', dates)
                dates = _.orderBy( dates, ['ts'] )
                return dates
            },
            classNextAvailableDates: function(){
                let vm = this
                let availability = vm.availability
                let filtered = _.filter( vm.classNextDates, function(i){
                    let available = _.find(availability, { ts: i.ts })
                    return vm.classObject.capacity - ( ! _.isUndefined( available ) ? available.count : 0 ) > 0
                })
                return filtered
            },
            page_url: function(){
               return `${this.$store.getters.tenantUrl}/${this.classObject.slug}`
            },
            fb_share_link: function(){
                return 'https://www.facebook.com/sharer.php?' + queryString.stringify({ u: `${this.$store.getters.tenantUrl}/${this.classObject.slug}` })
            },
            tw_share_link: function(){
                return 'https://twitter.com/intent/tweet?' + queryString.stringify({ url: `${this.$store.getters.tenantUrl}/${this.classObject.slug}`, text: `${this.classObject.title}` })
            },
            classLocation: function(){
                return _.find( this.$store.getters.locations, { id: this.classObject.locationId })
            },
            classAgeInterval: function () {
                let age = this.classObject.age
                let out = ''
                if( _.isArray( age ) ){
                    if (age[0] === age[1] && age[0] === 18) {
                        out = this.getText('class/singleEvent/metaAgeAdults')
                    } else if (age[0] === age[1]) {
                        out = this.getText('class/singleEvent/metaAgeChildrenFixed', { age: age[1] })
                    } else {
                        out = this.getText('class/singleEvent/metaAgeChildren', { min: age[0], max: age[1] })
                    }
                }
                return out
            },
            classTypes: function () {
                return this.getClassClassTypes(this.classObject.classTypesIds)
            }
        }
    }
</script>

<style scoped>

</style>