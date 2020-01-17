<template>
    <div>
        <modal name="confirmation-modal" height="auto" :adaptive="true" classes="confirmation-modal" @before-close="allowCloseModal">
            <div class="text-align--right"><i class="fal fa-times" v-on:click.prevent="closeModal"></i></div>
            <div class="confirmation">
                <h2>{{ getText('confirmation/h2') }}</h2>
                <img src="~/assets/ok.svg">
                <p class="text-align--center margin-top--4" v-show="booking">{{ getText('confirmation/message') }}</p>
            </div>
        </modal>
    </div>
</template>

<script>
    import _ from 'lodash'
    export default {
        head () {
            let head = {
                title: `Confirmation | ${this.$store.getters.tenant.name}`,
            }

            return head
        },
        name: "confirmation",
        mounted: function(){
            this.showModal()
        },
        computed: {
          booking: function(){
              return this.$route.params
          }
        },
        methods: {
            closeModal: function(){
                this.$router.go(-1)
            },
            allowCloseModal: function(e){
                e.stop()
                this.$router.go(-1)
            },
            showModal: function () {
                this.$modal.show('confirmation-modal');
                setTimeout(function(){
                    addeventatc.refresh();
                }, 300)
                this.$nextTick(function(){
                    addeventatc.refresh();
                })
            },
            hideModal: function () {
                this.$modal.hide('confirmation-modal');
            },
        }
    }
</script>

<style scoped>

</style>