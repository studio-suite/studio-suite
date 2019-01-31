<template>
    <div class="class_list">
        <div v-for="c in classes" class="class">
            <div class="class__image">
                {{c.title}}
            </div>
            <div class="class_date">
                {{c.starting_time}}
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "SchedulePlainList",
        props: ['classes']
    }
</script>

<style scoped>

</style>