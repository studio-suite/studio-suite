<template>
    <section>
        <div v-if="magnet.content" v-html="addButton(marked(magnet.content))" class="magnet-content"></div>
        <MagnetModal :visible="showModal" @closeModal="showModal = false" :magnet="magnet"></MagnetModal>
    </section>
</template>

<script>
    import _ from 'lodash'
    import marked from "marked"
    import contrast from 'contrast'
    import MagnetModal from '@/components/MagnetModal'

    export default {
        layout: 'magnet',
        data: function(){
            return {
                showModal: false
            }
        },
        head () {
            let head = {
                title: `${this.magnet.title} | ${this.$store.getters.tenant.name}`,
                meta: [
                    { hid: 'og:title', name: 'og:title', content: this.magnet.title },
                    { hid: 'og:site_name', name: 'og:site_name', content: this.$store.getters.tenant.name },
                    { hid: 'og:type', name: 'og:type', content: 'website' },
                    { hid: 'og:url', name: 'og:url', content: `https://${this.$store.getters.tenant.domain}.studiosuite.io/m/${this.magnet.slug}` },
                ],
                bodyAttrs: {
                    class: 'magnet-page'
                }
            }

            if( ! _.isUndefined( this.magnet.excerpt ) && ! _.isEmpty( this.magnet.excerpt ) ){
                head.meta.push({ hid: 'og:description', name: 'og:description', content: this.magnet.excerpt })
                head.meta.push({ hid: 'description', name: 'description', content: this.magnet.excerpt })
            }

            if( ! _.isUndefined( this.magnet.image ) && ! _.isEmpty( this.magnet.image ) ){
                head.bodyAttrs.style = `background-image: url(${this.getImgSrc({w: 2560 }, this.magnet.image)})`
                head.meta.push({ hid: 'og-image', name: 'og:image', content: this.getImgSrc({w: 1200, h: 630, fit: 'crop', crop: 'edges' }, this.magnet.image ) })
                head.meta.push({ hid: 'og-image-alt', name: 'og:image:alt', content: this.magnet.title })
            }

            return head
        },
        components: {
            MagnetModal
        },
        asyncData: async function({params, payload, store }){
            try{
                let tenantId = process.env.VUE_APP_TENANT_ID.replace('|','%7c')
                return {
                    magnet: payload || {},
                    slug: params.slug
                }
            } catch (e) {
                return {
                    magnet: payload || {},
                    slug: params.slug
                }
            }
        },
        methods: {
            marked: function(v){
                return marked(v)
            },
            addButton: function(v){
                let replace = `<input type="submit" class="cta-button" style="background-color:${this.magnet.cta.color}; color:${contrast(this.magnet.cta.color) === 'light' ? '#000' : '#FFF'}" value="${this.magnet.cta.label}">`
                v = v.replace( /<p>\[call-to-action]/gi, `<p class="with-cta">${replace}`)
                v = v.replace( /\[call-to-action]/gi, replace )
                return `<form>${v}</form>`
            },
            click: function(e){
                e.preventDefault();
                this.showModal = true
            }
        },
        mounted: function(){
            window.addEventListener('submit', this.click);
        },
        computed: {

        }
    }
</script>

<style scoped>

</style>
