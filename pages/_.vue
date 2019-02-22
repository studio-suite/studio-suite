<template>
    <SingleEvent :classObject="classObject" :ts="ts" class="container" :isModal="false"></SingleEvent>
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
        head () {
            return {
                title: `${this.classObject.title} | ${this.$store.getters.tenant.name}`,
            }
        },
        async asyncData({params, error, payload, query}) {
            if (payload) return { classObject: payload, ts: query.ts }
            else return {
                classObject: await axios.get(`${process.env.VUE_APP_API_BASE}/get-class?id=${process.env.VUE_APP_TENANT_ID.replace('|','%7C')}&slug=${params.pathMatch}`).then(function (r) {
                    return r.data
                }).catch(function (r) {
                    return {}
                }),
                ts: query.ts
            }
        }

    }
</script>

<style scoped>

</style>