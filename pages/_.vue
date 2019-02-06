<template>
    <div>
        <section class="container">
            <h1>Clasa</h1>
            {{user}}
        </section>
        classe
    </div>
</template>

<script>
    export default {
        name: "class-slug",
        async asyncData ({ params, error, payload }) {
            if (payload) return { user: payload }
            else return { user: {} }
        }
    }
</script>

<style scoped>

</style>