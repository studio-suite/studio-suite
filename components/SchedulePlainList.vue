<template>
    <div class="class_list">
        <article v-for="c in classes" class="class">
            <div class="class__image" :class="{ 'class__image--empty': !c.image }">
                <img v-if="c.image" :src="getImgSrc({w: 250, h: 250, fit: 'crop', crop: 'edges'}, c.image)" class="thumb" :alt="c.title">
                <img v-if="c.image" :src="getImgSrc({w: 600 }, c.image)" class="thumb-mobile" :alt="c.title">
                <span v-if="!c.image"></span>
            </div>
            <div class="class__date">
                <div>
                    <span>{{ c.starting_time | moment('D' ) }}</span>
                    {{ c.starting_time | moment('MMMM') }}
                </div>
            </div>
            <div class="class__content">
                <div>
                    <h2>{{c.title}}</h2>
                    <div class="class__date-mobile">{{ c.starting_time | moment('D') }} {{ c.starting_time | moment('MMMM') }}</div>
                    <div class="details">
                        <span class="margin-right--05"><i class="far fa-clock margin-right--025"></i> {{ c.starting_time | moment( getClassTimeFormat() ) }} <template v-if="schedule.appearance.show_ending">- {{ c.ending_time | moment( getClassTimeFormat() ) }}</template></span>
                        <span class="margin-right--05" v-if="schedule.appearance.show_duration"><i class="middot" v-if="schedule.appearance.show_duration"></i> {{c.duration}} minutes</span>
                        <span class="no-wrap" v-if="schedule.appearance.show_classTypes"><i class="middot" v-if="getClassClassTypes(c.classTypesIds)"></i> {{getClassClassTypes(c.classTypesIds)}}</span>
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
        <div v-if="classes.length === 0" class="empty">
            {{schedule.appearance.labelNothingToShow}}
        </div>
    </div>
</template>

<script>
    import _ from 'lodash'
    import moment from 'moment-timezone'
    export default {
        name: "SchedulePlainList",
        props: ['classes', 'schedule'],
        filters: {
            moment_location: function(v, f, tz){
                return moment(v).tz( tz ).format(f)
            }
        },
        methods: {
            openClassPage: function(slug, sdate){
                /*let ts = parseInt( moment(sdate).utcOffset(0).format('X') )
                window.location = `/${slug}?ts=${ts}`;*/
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
            },
            getTimezone: function(id){
                let l = _.find( this.$store.getters.locations, { id: id } )
                return l.timezone || 'Europe/London'
            }
        }
    }
</script>

<style scoped>

</style>