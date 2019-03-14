<template>
    <div>
        <modal name="confirmation-modal" height="auto" :adaptive="true" classes="confirmation-modal" @before-close="allowCloseModal">
            <div class="text-align--right"><i class="fal fa-times" v-on:click.prevent="closeModal"></i></div>
            <div class="confirmation">
                <h2>Registration Confirmation</h2>
                <img src="~/assets/ok.svg">
                <p class="text-align--center margin-top--4" v-if="booking"><template v-if="booking.price > 0">Your payment of <strong>{{ booking.attendees.length * booking.price | currency(tenantCurrency) }}</strong> processed successfully.</template> We sent you an email confirmation.</p>
            </div>
        </modal>
    </div>
</template>

<script>
    import _ from 'lodash'
    export default {
        head () {
            let head = {
                title: `Registration Confirmation | ${this.$store.getters.tenant.name}`,
            }

            return head
        },
        name: "confirmation",
        mounted: function(){
            this.showModal()
            this.$fb.track('Lead')
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
            },
            hideModal: function () {
                this.$modal.hide('confirmation-modal');
            },
        }
    }
</script>

<style scoped>

</style>