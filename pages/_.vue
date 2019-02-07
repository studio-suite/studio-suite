<template>
    <section class="container page--single-class">
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
                <div class="booking-box">
                    <span class="booking-box__pre-title">Next Class</span>
                    <span class="booking-box__date">August 23, 2018</span>
                    <span class="booking-box__time">
                        <span>4:00am</span>
                        <span class="spacer">-</span>
                        <span>4:40am</span>
                    </span>
                    <span class="booking-box__price">$10</span>
                    <span class="booking-box__availability">2 spots available</span>
                    <a class="booking-box__booking-button" href="#">Book Trial Class</a>
                    <span class="booking-box__or">or</span>
                    <span class="booking-box__choose">Choose a different date</span>
                </div>
                <h3>Share</h3>
                <a href="#" class="social-link"><i class="fab fa-facebook-f"></i></a>
                <a href="#" class="social-link"><i class="fab fa-twitter"></i></a>
                <a href="#" class="social-link"><i class="fab fa-instagram"></i></a>
                <a href="#" class="social-link"><i class="fab fa-facebook-f"></i></a>
            </div>
        </aside>
        <!--<pre>{{classObject}}</pre>-->
    </section>
</template>

<script>
    import axios from "axios"
    import _ from "lodash"
    import marked from "marked"

    export default {
        name: "class-slug",
        head () {
            return {
                script: [
                    { src: `https://maps.googleapis.com/maps/api/js?key=AIzaSyDvQBQ_diMzJUxTJDJMRj03rVZYpSu6PW8`, defer: true }
                ]
            }
        },
        async asyncData({params, error, payload}) {
            console.log('intra', params, payload)
            if (payload) return {classObject: payload}
            else return {
                classObject: await axios.get(`${process.env.VUE_APP_API_BASE}/get-class?id=${process.env.VUE_APP_TENANT_ID}&slug=${params.pathMatch}`).then(function (r) {
                    return r.data
                }).catch(function (r) {
                    return {}
                })
            }
        },
        mounted: function(){
            if( this.classLocationCoords ){
                let uluru = {lat: this.classLocationCoords[0], lng: this.classLocationCoords[1]};
                let map = new google.maps.Map(this.$refs.map, {zoom: 16, center: uluru});
                let marker = new google.maps.Marker({position: uluru, map: map});
            }

        },
        methods: {
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