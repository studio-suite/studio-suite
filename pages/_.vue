<template>
    <SingleEvent :classObject="classObject" class="container" :isModal="false"></SingleEvent>
</template>

<script>
    import SingleEvent from '@/components/SingleEvent'
    import axios from 'axios'

    export default {
        name: "class-slug",
        components: {
            SingleEvent
        },
        head () {
            return {
                title: `${this.classObject.title} | ${this.$store.getters.tenant.name}`,
                script: [
                    { src: `https://maps.googleapis.com/maps/api/js?key=${process.env.VUE_APP_GMAPS_PUBLIC_API}`, defer: true }
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
        }

    }
</script>

<style scoped>

</style>