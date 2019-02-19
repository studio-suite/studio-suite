<template>
    <div class="booking-box">
        <div class="loading" v-if="!availabilityRequest">
            <div class="loader"></div>
        </div>
        <template v-if="dates.length > 0">
            <span class="booking-box__pre-title">Next Class</span>
            <span class="booking-box__date">{{next_class.ts | moment_ts( getClassDateFormat() ) }}</span>
            <span class="booking-box__time">
                <span>{{ next_class.ts | moment_ts( getClassTimeFormat() ) }}</span>
                <span class="spacer">-</span>
                <span>{{ ( next_class.ts + ( next_class.dr * 60 ) ) | moment_ts( getClassTimeFormat() ) }}</span>
            </span>
            <span class="booking-box__price"><template v-if="price  === 0">Free</template><template v-else>{{price | currency(tenantCurrency)}}</template></span>
            <span class="booking-box__availability"><template v-if="next_class_capacity > 1">{{next_class_capacity}} spots available</template><template v-else-if="next_class_capacity > 0">{{next_class_capacity}} spot available</template><template v-else>No Spots available</template></span>
            <a class="booking-box__booking-button" href="#" v-on:click.prevent="openModal(next_class.ts)" :disabled="isSaveDisabled">Book Trial Class</a>
            <template v-if="dates.length > 1 && !sold_out">
                <span class="booking-box__or">or</span>
                <span class="booking-box__choose" v-on:click.prevent="chooseDate = !chooseDate">Choose a different date</span>
                <div v-if="chooseDate" class="booking-box__dates-list">
                    <div v-for="date in dates" class="booking-box__dates-list-item" v-on:click="openModal( date.ts )">
                        {{date.ts | moment_ts( `${getClassDateFormat()}` )}} at {{ date.ts | moment_ts( getClassTimeFormat() )}}
                    </div>
                </div>
            </template>
            <div class="booking-box__sold-out" v-if="sold_out"><i class="fal fa-user-lock"></i></div>
        </template>
    </div>
</template>

<script>
    import _ from "lodash"
    export default {
        name: "BookingBox",
        data: function(){
          return {
              chooseDate: false
          }
        },
        methods: {
          openModal: function(ts){
              if( ! this.sold_out && this.dates_type ){
                  this.$emit('openModal', ts)
              }
          },
            isSaveDisabled: function(){
              return ! this.availabilityRequest
            }
        },
        props: [ 'dates_next', 'dates_available', 'capacity', 'classNextDates', 'price', 'availability', 'availabilityRequest' ],
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
                    cap -= ! _.isUndefined( vm.availability[vm.next_class.ts.toString()] ) ? vm.availability[vm.next_class.ts.toString()] : 0
                }
                return cap
            }
        }
    }
</script>

<style scoped>

</style>