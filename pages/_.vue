<template>
    <section class="main-wrapper">
        <SingleEvent :classObject="classObject" :ts="ts" class="container" :isModal="false" :language="classObject.language" :rs="rs" :isGoogleLoaded="isGoogleLoaded"></SingleEvent>
    </section>
</template>

<script>
    import SingleEvent from '@/components/SingleEvent'
    import axios from 'axios'
    import _ from 'lodash'

    export default {
        name: "class-slug",
        components: {
            SingleEvent
        },
        computed:{
            isGoogleLoaded: function(){
                return this.$store.getters.isGoogleLoaded
            }
        },
        head () {
            let head = {
                title: `${this.classObject.title} | ${this.$store.getters.tenant.name}`,
                meta: [
                    { hid: 'og:title', name: 'og:title', content: this.classObject.title },
                    { hid: 'og:site_name', name: 'og:site_name', content: this.$store.getters.tenant.name },
                    { hid: 'og:type', name: 'og:type', content: 'website' },
                    { hid: 'og:url', name: 'og:url', content: `https://${this.$store.getters.tenant.domain}.studiosuite.io/${this.classObject.slug}` },
                ]
            }

            if( ! _.isUndefined( this.classObject.excerpt ) && ! _.isEmpty( this.classObject.excerpt ) ){
                head.meta.push({ hid: 'og:description', name: 'og:description', content: this.classObject.excerpt })
                head.meta.push({ hid: 'description', name: 'description', content: this.classObject.excerpt })
            } else {
                head.meta.push({ hid: 'og:description', name: 'og:description', content: this.classObject.title })
                head.meta.push({ hid: 'description', name: 'description', content: this.classObject.title })
            }

            if( ! _.isUndefined( this.classObject.image ) && ! _.isEmpty( this.classObject.image ) ){
                head.meta.push({ hid: 'og-image', name: 'og:image', content: this.getImgSrc({w: 1200, h: 630, fit: 'crop', crop: 'edges' }, this.classObject.image ) })
                head.meta.push({ hid: 'og-image-alt', name: 'og:image:alt', content: this.classObject.title })
            }
            return head
        },
        mounted: function(){
            if( ! _.isUndefined( this.$route.query ) && ! _.isUndefined( this.$route.query.ts ) ){
                if( _.isUndefined( this.ts ) || _.isNull( this.ts ) ){
                    this.ts = parseInt( this.$route.query.ts )
                }
            }
            if( ! _.isUndefined( this.$route.query ) && ! _.isUndefined( this.$route.query.rs ) ){
                if( _.isUndefined( this.rs ) || _.isNull( this.rs ) ){
                    this.rs = this.$route.query.rs
                }
            }
        },
        async asyncData({params, error, payload, query}) {
            if (payload) return { classObject: payload, ts: query.ts, rs: query.rs }
            else return {
                classObject: await axios.get(`${process.env.VUE_APP_API_BASE}/get-class?id=${process.env.VUE_APP_TENANT_ID.replace('|','%7C')}&slug=${params.pathMatch}`).then(function (r) {
                    return r.data
                }).catch(function (r) {
                    return {}
                }),
                ts: query.ts,
                rs: query.rs
            }
        }

    }
</script>

<style scoped>

</style>
