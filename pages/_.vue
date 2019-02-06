<template>
        <section class="container page--single-class">
            <div class="left">
                <h1 class="title">{{classObject.title}}</h1>
                <div class="meta">
                    <i class="fal fa-users-class"></i> {{classAgeInterval}} <!--<i class="fas fa-circle"></i>--><i class="middot"></i> {{classTypes}}
                </div>
                <div v-if="classObject.image"><img :src="classImageSrc"></div>
                <div class="short-description">{{classObject.excerpt}}</div>
                <div class="content">{{classObject.content}}</div>
            </div>

            <!--<pre>{{classObject}}</pre>-->
        </section>
</template>

<script>
    import axios from "axios"
    import _ from "lodash"

    export default {
        name: "class-slug",
        async asyncData ({ params, error, payload }) {
            if (payload) return { classObject: payload }
            else return { classObject: await axios.get(`${process.env.VUE_APP_API_BASE}/get-class?id=${process.env.VUE_APP_TENANT_ID}&slug=${params.pathMatch}`).then(function(r){
                return r.data
                }).catch(function(r){
                return {}
                }) }
        },
        computed: {
            classAgeInterval: function(){
                let age = this.classObject.age
                let out = ''
                if( age[0] === age[1] && age[0] === 18 ){
                    out = 'Adults only'
                } else if( age[0] === age[1] ){
                    out = `For childrens aged ${age[1]}`
                } else {
                    out = `For children ages ${age[0]} to ${age[1]}`
                }
                return out
            },
            classTypes: function(){
                let vm = this
                let classTypes = this.classObject.classTypesIds
                    classTypes = _.map(classTypes, function(i){
                        return _.find(vm.$store.getters.class_types, function(j){
                            return j.id === i
                        })
                    })
                    classTypes = _.map(classTypes, function(i){
                        return i.name
                    })

                return _.join(classTypes, ", ")
            },
            classImageSrc: function(){
                return process.env.VUE_APP_IMGIX_URL
            }
        }
    }
</script>

<style scoped>

</style>