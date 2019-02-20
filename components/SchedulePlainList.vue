<template>
    <div class="class_list">
        <article v-for="c in classes" class="class">
            <div class="class__image">
                <img v-if="c.image" :src="getImgSrc({w: 250, h: 250, fit: 'crop', crop: 'edges'}, c.image)">
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
                    <h2>{{c.title}} <span class="margin-left--05 margin-right--05">|</span> {{getClassAge(c.age)}}</h2>
                    <div class="details">
                        <i class="fal fa-clock"></i> {{ c.starting_time | moment( getClassTimeFormat() ) }} - {{ c.ending_time | moment( getClassTimeFormat() ) }}
                        <i class="middot" v-if="schedule.appearance.show_duration"></i> {{c.duration}} minutes
                        <i class="middot" v-if="getClassClassTypes(c.classTypesIds) && schedule.appearance.show_classTypes"></i> {{getClassClassTypes(c.classTypesIds)}}
                    </div>
                </div>
            </div>
            <div class="class__buttons">
                <div>
                    <a href="#" class="btn-class-details" v-on:click.prevent="openModal(c.id, c.starting_time)">Details</a>
                    <a href="#" class="btn-class-book">Book</a>
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
            openModal: function(id, sdate){
              this.$emit('openClassModal', {
                  classId: id,
                  ts: parseInt( moment(sdate).utcOffset(0).format('X') )
              })
            },
            getClassAge: function(age){
                let out = ''
                if(  _.isArray( age ) ){
                    if (age[0] === age[1] && age[0] === 18) {
                        out = 'Adults only'
                    } else if (age[0] === age[1]) {
                        out = `${age[1]} years`
                    } else {
                        out = `${age[0]} to ${age[1]} years`
                    }
                }
                return out
            }
        }
    }
</script>

<style scoped>

</style>