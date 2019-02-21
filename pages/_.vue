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

                ]
            }
        },
        async asyncData({params, error, payload}) {
            console.log('params clasa', params)
            if (payload) return { classObject: payload }
            else return {
                classObject: await axios.get(`${process.env.VUE_APP_API_BASE}/get-class?id=${process.env.VUE_APP_TENANT_ID.replace('|','%7C')}&slug=${params.pathMatch}`).then(function (r) {
                    console.log('clasa', r.data)
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