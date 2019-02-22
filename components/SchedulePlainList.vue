<template>
    <div class="class_list">
        <article v-for="c in classes" class="class">
            <div class="class__image">
                <img v-if="c.image" :src="getImgSrc({w: 250, h: 250, fit: 'crop', crop: 'edges'}, c.image)" class="thumb">
                <img v-if="c.image" :src="getImgSrc({w: 900 }, c.image)" class="thumb-mobile">
                <span v-if="!c.image"></span>
            </div>
            <div class="class__date">
                <div>
                    <span>{{ c.starting_time | moment('D') }}</span>
                    {{ c.starting_time | moment('MMMM') }}
                </div>
            </div>
            <div class="class__content">
                <div>
                    <h2>{{c.title}}</h2>
                    <div class="details">
                        <i class="fal fa-clock"></i> {{ c.starting_time | moment( getClassTimeFormat() ) }} <template v-if="schedule.appearance.show_ending">- {{ c.ending_time | moment( getClassTimeFormat() ) }}</template>
                        <template v-if="schedule.appearance.show_duration"><i class="middot" v-if="schedule.appearance.show_duration"></i> {{c.duration}} minutes</template>
                        <template v-if="schedule.appearance.show_classTypes"><i class="middot" v-if="getClassClassTypes(c.classTypesIds)"></i> {{getClassClassTypes(c.classTypesIds)}}</template>
                    </div>
                </div>
            </div>
            <div v-if="schedule.modal !== 2" class="class__buttons">
                <div>
                    <a href="#" v-if="schedule.appearance.show_excerpt" class="btn-class-details" v-on:click.prevent="openClassPage(c.slug, c.starting_time)">Details</a>
                    <a href="#" class="btn-class-book" v-on:click.prevent="openModal(c, c.starting_time)">Book</a>
                </div>
            </div>
        </article>
    </div>
</template>

<script>
    import _ from 'lodash'
    import moment from 'moment'
    export default {
        name: "SchedulePlainList",
        props: ['classes', 'schedule'],
        methods: {
            openClassPage: function(slug, sdate){
                this.$router.push({
                    path: `/${slug}`,
                    query: {
                        ts:  parseInt( moment(sdate).utcOffset(0).format('X') )
                    }
                } )
            },
            openModal: function(c, sdate){
                if( this.schedule.modal === 1 ){
                    this.openClassPage(c.slug, sdate)
                } else {
                    this.$emit('openClassModal', {
                        classId: c.id,
                        ts: parseInt( moment(sdate).utcOffset(0).format('X') )
                    })
                }
            }
        }
    }
</script>

<style scoped>

</style>