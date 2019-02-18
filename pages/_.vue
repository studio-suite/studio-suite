<template>
    <section>
        <div class="container page--single-class" v-if="classObject">
            <div class="left-col">
                <h1 class="title">{{classObject.title}}</h1>
                <div class="meta">
                    <i class="fal fa-users-class"></i> {{classAgeInterval}} <!--<i class="fas fa-circle"></i>--><i
                        class="middot"></i> {{classTypes}}
                </div>
                <div v-if="classObject.image" class="image">
                    <img :src="getImgSrc({w: 1300}, classObject.image)">
                </div>
                <div class="short-description">{{classObject.excerpt}}</div>
                <div class="content">{{classObject.content}}</div>
                <div class="instructors" v-if="classObject.instructorsIds">
                    <h3>Instructors</h3>
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
                <div class="location" v-if="classLocation">
                    <h3>Location</h3>
                    <div id="map" ref="map" class="map"></div>
                    <h4>{{classLocation.name}}</h4>
                    <div class="address">
                        {{classLocation.address.address1}}<template v-if="classLocation.address.address2">, {{classLocation.address.address2}}</template><template v-if="classLocation.address.city">, {{classLocation.address.city}}</template><template>, {{classLocation.address.zip}} {{classLocation.address.state}}</template>
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
                            @openModal="openModal">
                    </BookingBox>
                    <h3>Share</h3>
                    <a href="#" class="social-link"><i class="fab fa-facebook-f"></i></a>
                    <a href="#" class="social-link"><i class="fab fa-twitter"></i></a>
                    <a href="#" class="social-link"><i class="fab fa-instagram"></i></a>
                    <a href="#" class="social-link"><i class="fab fa-facebook-f"></i></a>
                </div>
            </aside>
        </div>
        <BookingModal :classObject="classObject" :ts="classNextTs" :availability="availability" :visible="showModal" @closeModal="showModal = false" @blockDate="blockDate"></BookingModal>
    </section>
</template>

<script>
    import axios from "axios"
    import _ from "lodash"
    import marked from "marked"
    import moment from "moment"
    import BookingModal from '@/components/BookingModal'
    import BookingBox from '@/components/BookingBox'

    export default {
        name: "class-slug",
        components: {
            BookingModal,
            BookingBox
        },
        head () {
            return {
                script: [
                    { src: `https://maps.googleapis.com/maps/api/js?key=AIzaSyDvQBQ_diMzJUxTJDJMRj03rVZYpSu6PW8`, defer: true }
                ]
            }
        },
        async asyncData({params, error, payload}) {
            if (payload) return { classObject: payload }
            else return {
                classObject: await axios.get(`${process.env.VUE_APP_API_BASE}/get-class?id=${process.env.VUE_APP_TENANT_ID}&slug=${params.pathMatch}`).then(function (r) {
                    return r.data
                }).catch(function (r) {
                    return {}
                })
            }
        },
        data: function(){
          return {
              classNextTs: '',
              showModal: false,
              availability: [],
              chooseDate: false,
              classObject: {}
          }
        },
        mounted: function(){
            let vm = this
            if( this.classLocationCoords ){
                let uluru = {lat: this.classLocationCoords[0], lng: this.classLocationCoords[1]};
                let map = new google.maps.Map(this.$refs.map, {zoom: 16, center: uluru});
                new google.maps.Marker({position: uluru, map: map});
            }
            let tss = _.map( this.classNextDates, function(i){
                return i.ts
            })
            let min = 1//_.min( tss )
            let max = _.max( tss )
            let id = this.classObject.id
            axios.get(`https://3h737nakvh.execute-api.us-east-2.amazonaws.com/prod/availability?id=${id}&min=${min}&max=${max}`).then(function(r){
                if( ! _.isNull( r.data ) ){
                    vm.availability = r.data
                }
            }).catch(function(r){
            })
        },
        methods: {
            blockDate: function(v){
                this.availability[v.toString()] = 99999
            },
            openModal: function(p){
                this.classNextTs = p
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
            }
        },
        computed: {
            classNextAvailableDates: function(){
                let vm = this
                return _.filter( this.classNextDates, function(i){
                    return vm.classObject.capacity - ( 1 + ( ! _.isUndefined( vm.availability[i.ts] ) ? vm.availability[i.ts] : 0) ) >= 0
                })
            },
            classNextDates: function(){
                let vm = this
                let schedule = vm.classObject.schedule
                let dates = []
                let startDate = moment().utcOffset(0)
                let endDate = moment(startDate).add(14, 'days')
                if( !_.isUndefined( schedule ) && !_.isUndefined( schedule.days ) && ! _.isEmpty( schedule.days ) ){
                    _.each( schedule.days, function(i){
                        let tempDate = moment(startDate)
                        _.each( i.i, function(int){
                            let counter = 0
                            while( tempDate.isSameOrBefore(endDate) ){
                                let inc_factor = moment().utcOffset(0).day() > i.d ? i.d + 7 : i.d
                                dates.push({
                                    d: moment().utcOffset(0).add( counter * 7, 'days' ).set({hour:0,minute:0,second:0,millisecond:0}).day(inc_factor).format('YYYY-MM-DD'),
                                    dr: parseInt( int.e ) - parseInt( int.s ),
                                    ts: parseInt( moment().utcOffset(0).add( counter * 7, 'days' ).set({hour:0,minute:0,second:0,millisecond:0}).day(inc_factor).add(int.s, 'minutes').format('X') )
                                })
                                tempDate = tempDate.add(7, 'days')
                                counter++
                            }
                        })
                    })
                }
                if( !_.isUndefined( schedule ) && !_.isUndefined( schedule.specific ) && ! _.isEmpty( schedule.specific ) ){
                    _.each( schedule.specific, function(i){
                        dates = _.filter( dates, function(d){
                            return d.d !== i.d
                        })
                        _.each( i.i, function(int){
                            dates.push({
                                d: i.d,
                                dr: parseInt( int.e ) - parseInt( int.s ),
                                ts: parseInt( moment(i.d).utcOffset(0).add(int.s, 'minutes').format('X') )
                            })
                        })
                    })
                }

                if( !_.isUndefined( schedule.empty ) && ! _.isEmpty( schedule.empty ) ){
                    dates = _.filter( dates, function(d){
                        return schedule.empty.indexOf( d.d ) === -1
                    })
                }

                dates = _.orderBy( dates, function(i){ return i.d } )

                return dates
            },
            classLocationCoords: function(){
                if( !_.isUndefined( this.classLocation ) && ! _.isUndefined( this.classLocation.coords ) ){
                    let coords = _.map(_.split(this.classLocation.coords, '|'), Number)
                    return [coords[0], coords[1]]
                }
              return false
            },
            classLocation: function(){
              return _.find( this.$store.getters.locations, { id: this.classObject.locationId })
            },
            classAgeInterval: function () {
                let age = this.classObject.age
                let out = ''
                if( _.isArray( age ) ){
                    if (age[0] === age[1] && age[0] === 18) {
                        out = 'Adults only'
                    } else if (age[0] === age[1]) {
                        out = `For childrens aged ${age[1]}`
                    } else {
                        out = `For children ages ${age[0]} to ${age[1]}`
                    }
                }
                return out
            },
            classTypes: function () {
                let vm = this
                let classTypes = this.classObject.classTypesIds
                classTypes = _.map(classTypes, function (i) {
                    return _.find(vm.$store.getters.class_types, function (j) {
                        return j.id === i
                    })
                })
                classTypes = _.map(classTypes, function (i) {
                    return !_.isUndefined(i) && !_.isUndefined(i.name) ? i.name : ''
                })

                return _.join(classTypes, ", ")
            }
        }
    }
</script>

<style scoped>

</style>