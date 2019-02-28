<template>
    <div class="confirmation-wrapper">
        <div class="confirmation">
            <h2>Registration Confirmation</h2>
            <img src="~/assets/ok.svg">
            <p class="text-align--center margin-top--4" v-if="booking"><template v-if="booking.price > 0">Your payment of <strong>{{ booking.attendees.length * booking.price | currency(tenantCurrency) }}</strong> processed successfully.</template> We sent you an email confirmation.</p>
        </div>
        <nuxt-link :to="{ name: 'index' }">Back to schedules</nuxt-link>
    </div>
</template>

<script>
    export default {
        name: "confirmation",
        props: ['booking']
    }
</script>

<style scoped>

</style>