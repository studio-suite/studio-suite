<template>
    <div>
        <div class="header" :class="header_classes">
            <nuxt-link to="/" :title="tenant_name">
                <template v-if="logo">
                    <img :src="getImgSrc({w: 200}, logo.url)" :alt="tenant_name">
                </template>
                <template v-else>{{tenant_name}}</template>
            </nuxt-link>
        </div>
        <nuxt/>
    </div>
</template>

<style>
</style>

<script>
    import moment from 'moment'

    export default {
        head(){
            let head = {
                script: []
            }
            head.script.push({
                hid: 'google-maps',
                src: `https://maps.googleapis.com/maps/api/js?key=${process.env.VUE_APP_GMAPS_PUBLIC_API || VUE_APP_GMAPS_PUBLIC_API}`,
                defer: true,
                async: true,
                callback: () => { this.$store.dispatch('setGoogleMapsReady') }
            })
            return head
        },
        computed: {
            year: function () {
                return moment().format('YYYY')
            },
            tenant_name: function () {
                try {
                    return this.$store.state.tenant.name
                } catch (e) {
                    return ''
                }
            },
            logo: function () {
                try {
                    return this.$store.getters.logo
                } catch (e) {
                    return ''
                }
            },
            header_classes: function () {
                let classes = {}
                if (this.logo) {
                    classes['header--with-logo'] = true
                    classes['logo--aspect-landscape'] = this.logo.aspect === 'landscape'
                    classes['logo--aspect-portrait'] = this.logo.aspect === 'portrait'
                    classes['logo--aspect-square'] = this.logo.aspect === 'square'
                } else {
                    classes['header--without-logo'] = true
                }
                return classes
            }
        }
    }
</script>
