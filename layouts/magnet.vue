<template>
    <nuxt/>
</template>

<style>
</style>

<script>

    export default {
        computed: {
            tenant_name: function () {
                try {
                    return this.$store.state.tenant.name
                } catch (e) {
                    return ''
                }
            }
        }
    }
</script>
