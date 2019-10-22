<template>
    <div class="booking-box-wrapper">
        <div class="booking-box__button" v-on:click.prevent="show_booking = !show_booking"  :class="{ 'visible': show_booking }" v-if="dates.length > 0">
            <span class="booking-box__pre-title" v-html="getText('class/singleEvent/bookingBox/nextClass')"></span>
            <span class="booking-box__date">
                {{next_class.ts | moment_ts_location( getClassDateFormat(), tz ) }}
                <span class="booking-box__time">
                    <span>{{ next_class.ts | moment_ts_location( getClassTimeFormat(), tz ) }}</span>
                    <span class="spacer">-</span>
                    <span>{{ ( next_class.ts + ( next_class.dr * 60 ) ) | moment_ts_location( getClassTimeFormat(), tz ) }}</span>
                </span>
            </span>
            <template v-if="!show_booking">
            <a class="booking-box__booking__button" href="#"  :disabled="isSaveDisabled" v-html="getText('class/singleEvent/bookingBox/bookNowButton')"></a>
            </template>
            <template v-else><i class="fal fa-times"></i></template>
        </div>
        <div class="booking-box" :class="{ 'booking-box--visible': show_booking }">
            <div class="loading" v-if="!availabilityRequest">
                <div class="loader"></div>
            </div>
            <template v-if="dates.length > 0">
                <span class="booking-box__pre-title" v-html="getText('class/singleEvent/bookingBox/nextClass')"></span>
                <span class="booking-box__date">{{next_class.ts | moment_ts_location( getClassDateFormat(), tz ) }}</span>
                <span class="booking-box__time">
                    <span>{{ next_class.ts | moment_ts_location( getClassTimeFormat(), tz ) }}</span>
                    <span class="spacer">-</span>
                    <span>{{ ( next_class.ts + ( next_class.dr * 60 ) ) | moment_ts_location( getClassTimeFormat(), tz ) }}</span>
                </span>
                <span class="booking-box__price"><template v-if="price  === 0">{{ getText('class/singleEvent/bookingBox/priceFree') }}</template><template v-else>{{price | currency(tenantCurrency)}}</template></span>
                <span class="booking-box__availability"><template v-if="next_class_capacity > 1">{{ getText('class/singleEvent/bookingBox/spotsAvailableMany', { spots: next_class_capacity }) }}</template><template v-else-if="next_class_capacity > 0">{{ getText('class/singleEvent/bookingBox/spotsAvailableOne') }}</template><template v-else>{{ getText('class/singleEvent/bookingBox/spotsAvailableNone') }}</template></span>
                <a class="booking-box__booking-button" href="#" v-on:click.prevent="openModal(next_class.ts, next_class.dr)" :disabled="isSaveDisabled">{{ getText('class/singleEvent/bookingBox/bookNowButton') }}</a>
                <template v-if="dates.length > 1 && !sold_out">
                    <span class="booking-box__or">or</span>
                    <span class="booking-box__choose" v-on:click.prevent="chooseDate = !chooseDate" v-html="getText('class/singleEvent/bookingBox/chooseDifferentDate')"></span>
                    <div v-if="chooseDate" class="booking-box__dates-list">
                        <div v-for="date in dates" class="booking-box__dates-list-item" v-on:click="openModal( date.ts, date.dr )">
                            {{date.ts | moment_ts_location( getClassDateFormat(), tz )}} at {{ date.ts | moment_ts_location( getClassTimeFormat(), tz )}}
                        </div>
                    </div>
                </template>
                <div class="booking-box__sold-out" v-if="sold_out"><i class="fal fa-user-lock"></i></div>
            </template>
        </div>
        <div class="booking-box__bg" v-on:click.prevent="show_booking = false"></div>
    </div>
</template>

<script>
    import _ from "lodash"
    import moment from "moment-timezone"
    export default {
        name: "BookingBox",
        data: function(){
          return {
              chooseDate: false,
              show_booking: false
          }
        },
        methods: {
          openModal: function(ts, dr){
              if( ! this.sold_out && this.dates_type ){
                  this.$emit('openModal', { ts: ts, dr: dr })
              }
          },
            isSaveDisabled: function(){
              return ! this.availabilityRequest
            }
        },
        filters: {
          moment_ts_location: function(v, f, t){
              t = ! _.isUndefined( t ) ? t : 'Europe/London'
              return moment.unix(v).tz(t).format(f)
          }
        },
        props: [ 'dates_next', 'dates_available', 'capacity', 'classNextDates', 'price', 'availability', 'availabilityRequest', 'tz', 'language' ],
        computed: {
            sold_out: function(){
              return  ! _.isUndefined( this.dates_available ) && _.isEmpty( this.dates_available )
            },
            dates_type: function(){
                return ! _.isUndefined( this.dates_available ) && ! _.isEmpty( this.dates_available )
            },
            dates: function(){
              return this.dates_type ? this.dates_available : this.dates_next
            },
            next_class: function(){
                return ! _.isUndefined( this.dates ) && ! _.isUndefined( this.dates[0] ) ? this.dates[0] : false
            },
            next_class_capacity: function(){
                let vm = this
                let cap = this.capacity || 0
                if( vm.next_class ){
                    let a = _.find(vm.availability, { ts: parseInt( vm.next_class.ts ) })
                    cap -= ! _.isUndefined( a ) ? a.count : 0
                }
                return cap
            }
        }
    }
</script>

<style scoped>

</style>