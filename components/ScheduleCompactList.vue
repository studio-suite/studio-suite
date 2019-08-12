<template>
    <div class="classes_by_day">
        <div v-for="(day_classes, index) in classes_by_day" class="classes_by_day__day">
            <div class="classes_by_day__date">
                <div>
                    <span>{{ index | moment('D') }}</span>
                    {{ index | moment('ddd') }}
                </div>
            </div>
            <div class="class_list">
                <article v-for="c in day_classes" class="class">
                    <div class="class__content">
                        <div>
                            <small>{{c.starting_time | moment('dddd, MMMM D, YYYY')}}</small>
                            <h2>{{c.title}}</h2>
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
            </div>
        </div>
        <div v-if="classes.length === 0" class="empty">
            {{schedule.appearance.labelNothingToShow}}
        </div>
    </div>
</template>

<script>
    import _ from 'lodash'
    import moment from 'moment'
    export default {
        name: "ScheduleCompactList",
        props: ['classes', 'schedule'],
        computed: {
          classes_by_day: function(){
              return _.groupBy( this.classes, function(i){
                  return moment(i.starting_time).utcOffset(0).format('YYYY-MM-DDT00:00:00Z')
              })
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
            }
        }
    }
</script>

<style scoped>

</style>