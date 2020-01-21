<template>
    <modal name="magnet-modal" height="auto" :scrollable="true" :reset="true" :width="580" :adaptive="true" classes="booking-modal" @before-close="allowCloseModal">
        <div class="text-align--right"><i class="fal fa-times" v-on:click.prevent="closeModal"></i></div>

        <div class="booking-modal__content">
            <div class="loading" v-if="loaders">
                <div class="loader"></div>
            </div>

            <div v-if="step === 0">
                <h2 v-html="getText('class/singleEvent/bookingBox/bookingModal/step2Title')"></h2>
                <h3 class="margin-bottom--5" v-html="getText('class/singleEvent/bookingBox/bookingModal/step2Subtitle')"></h3>
                <div class="attendee" v-for="(att, ind) in attendees">
                    <label><em v-html="getText('class/singleEvent/bookingBox/bookingModal/step1ChildName')"></em> <span class="remove-attendee" v-if="ind > 0" v-on:click.prevent="attendees.splice(ind, 1)"><i class="far fa-user-minus margin-right--05"></i> Remove</span></label>
                    <input type="text" v-model="att.name" placeholder="Your child’s first name here" class="name" :class="checkForErrors(`attendees.${ind}.name`)"/>
                    <div class="year" :class="checkForErrors(`attendees.${ind}.dob.y`)">
                        <select v-model="att.dob.y" :class="checkForErrors(`attendees.${ind}.dob.y`)"  title="Choose child year of birth">
                            <option value="" disabled>Year</option>
                            <option v-for="y in availableYears" :value="y">{{y}}</option>
                        </select>
                    </div>
                    <div class="month" :class="checkForErrors(`attendees.${ind}.dob.m`)">
                        <select v-model="att.dob.m" :class="checkForErrors(`attendees.${ind}.dob.m`)" title="Choose child month of birth">
                            <option value="" disabled>Month</option>
                            <option :value="1" v-if="isMonthAvailable(1, att.dob.y)">January</option>
                            <option :value="2" v-if="isMonthAvailable(2, att.dob.y)">February</option>
                            <option :value="3" v-if="isMonthAvailable(3, att.dob.y)">March</option>
                            <option :value="4" v-if="isMonthAvailable(4, att.dob.y)">April</option>
                            <option :value="5" v-if="isMonthAvailable(5, att.dob.y)">May</option>
                            <option :value="6" v-if="isMonthAvailable(6, att.dob.y)">June</option>
                            <option :value="7" v-if="isMonthAvailable(7, att.dob.y)">July</option>
                            <option :value="8" v-if="isMonthAvailable(8, att.dob.y)">August</option>
                            <option :value="9" v-if="isMonthAvailable(9, att.dob.y)">September</option>
                            <option :value="10" v-if="isMonthAvailable(10, att.dob.y)">October</option>
                            <option :value="11" v-if="isMonthAvailable(11, att.dob.y)">November</option>
                            <option :value="12" v-if="isMonthAvailable(12, att.dob.y)">December</option>
                        </select>
                    </div>
                    <div class="day" :class="checkForErrors(`attendees.${ind}.dob.d`)">
                        <select v-model="att.dob.d" :class="checkForErrors(`attendees.${ind}.dob.d`)"  title="Choose child day of birth">
                            <option value="" disabled>Day</option>
                            <option v-for="day in availableDays(att.dob)" :value="day">{{day}}</option>
                        </select>
                    </div>
                </div>
                <div class="text-align--center">
                    <a href="#" v-on:click.prevent="addChild" class="add-child" v-if="attendees.length < 3"><i class="far fa-user-plus margin-right--05"></i> Add Another Child</a>
                </div>

                <div class="next margin-top--5">
                    <a href="#" class="next-button" v-on:click.prevent="saveChild">Next</a>
                </div>
            </div>

            <div v-else-if="step === 1">
                <h2 v-html="getText('class/singleEvent/bookingBox/bookingModal/step2Title')"></h2>
                <h3 class="margin-bottom--5" v-html="getText('class/singleEvent/bookingBox/bookingModal/step2Subtitle')"></h3>
                <template v-if="magnet.fields.firstName">
                    <label>First name</label>
                    <input type="text" v-model="form.firstName" placeholder="Your first name here" :class="checkForErrors(`form.firstName`)"/>
                </template>
                <template v-if="magnet.fields.lastName">
                    <label class="margin-top--2">Last name</label>
                    <input type="text" v-model="form.lastName" placeholder="Your last name here" :class="checkForErrors(`form.lastName`)"/>
                </template>
                <template v-if="magnet.fields.phone">
                    <label class="margin-top--2">Phone number</label>
                    <input type="tel" v-model="form.phone" placeholder="Your phone number here" :class="checkForErrors(`form.phone`)"/>
                </template>
                <label class="margin-top--2">Email</label>
                <input type="email" v-model="form.email" placeholder="Your email here" :class="checkForErrors(`form.email`)"/>

                <div class="next margin-top--5">
                    <a href="#" class="next-button" v-on:click.prevent="saveForm">{{magnet.cta.label}}</a>
                </div>
            </div>
            <div v-else class="text-align--center">
                    <h2>Something went wrong</h2>
                    <i class="fal fa-exclamation-circle fa-5x margin-top--2" style="color: #ca454b"></i>
                    <p class="text-align--center margin-top--2">Please try again.</p>
            </div>

        </div>
    </modal>
</template>

<script>
    import _ from 'lodash'
    import moment from 'moment'
    import schema from "async-validator"
    import axios from  'axios'
    export default {
        name: "BookingModal",
        props: ['visible', 'magnet'],
        data: function () {
            return {
                step: 0,
                errors: {},
                form: {
                    firstName: '',
                    lastName: '',
                    phone: '',
                    email: ''
                },
                attendees: [{
                    name: '',
                    dob: {
                        y: '',
                        m: '',
                        d: ''
                    }
                }],
                confirmation: null,
                loaders: false,
                errorsPayment:[],
                ts: moment().unix()
            }
        },
        mounted: function () {
            this.step = this.magnet.fields.children ? 0 : 1
            //this.showModal()
        },
        computed: {
            form_submit: function(){
                let out = {}
                out.attendees = this.magnet.fields.children ? this.attendees : []
                if( this.magnet.fields.firstName ){
                    out.firstName = this.form.firstName
                }
                if( this.magnet.fields.lastName ) {
                    out.lastName = this.form.lastName
                }
                if( this.magnet.fields.phone ) {
                    out.phone = this.form.phone
                }
                out.email = this.form.email
                return out
            },
            availableYears: function () {
                return _.range( this.limits[1], this.limits[0] + 1 )
            },
            limits: function(){
                let min = moment().subtract(this.age_min, 'years').year()
                let max = moment().subtract(this.age_max + 1, 'years').year()
                return [ min, max ]
            },
            age_min: function(){
                return this.magnet.fields.children ? 1 : 0
            },
            age_max: function(){
                return this.magnet.fields.children ? 18 : 99
            }
        },
        methods: {
            saveChild: function () {
                let vm = this
                vm.validateChildren()
                if (_.isEmpty(vm.errors)) {
                    vm.next()
                }
            },
            checkForErrors: function (field) {
                let errs = ''
                let vm = this
                if (!_.isUndefined(vm.errors[field])) {
                    errs = 'field-error'
                }
                return errs
            },
            isMonthAvailable: function(m, y){
                if( ! _.isUndefined(y)  && ! _.isNull(y) && parseInt(y) > 0 ){
                    if( this.limits[0] === y ){
                        let ev = moment.unix(this.ts).tz(this.tz)
                        if( moment().month(m-1).isAfter(ev, 'day') ){
                            return false
                        }
                    }
                    if( this.limits[1] === y ){
                        let ev = moment()
                        if( moment().month(m-1).isBefore(ev, 'day') ){
                            return false
                        }
                    }
                } else {
                    return false
                }
                return true
            },
            addChild: function () {
                this.attendees.push({
                    name: '',
                    dob: {
                        y: '',
                        m: '',
                        d: ''
                    }
                })
            },
            availableDays: function(dob){
                let days = []
                let vm = this
                if( ! _.isUndefined( dob.y )  && ! _.isUndefined( dob.m ) && parseInt( dob.y ) > 0 && parseInt( dob.m ) > 0 ){
                    let date = moment().year(dob.y).month(dob.m -1).day(1).endOf('month').format('D')
                    for( let d = 1; d <= parseInt( date ); d++ ){
                        days.push(d)
                    }
                }
                return days
            },
            requestSubmission: function(){
                let vm = this
                axios.post(`${process.env.VUE_APP_API_BASE}/submission?id=${vm.magnet.id}&tenantId=${vm.$store.getters.tenantId.replace('|','%7c')}`, vm.form_submit, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then(function (r) {
                    console.log('rrr', r)
                    if(r.status === 200 && !_.isNull(r.data)){
                        vm.confirmation = 1
                    } else if( r.status === 200 && _.isNull(r.data) ){
                        vm.loaders = false
                        vm.next()
                    }
                }).catch(function (e) {
                    vm.confirmation = null
                    vm.loaders = false
                    vm.next()
                })
            },
            saveForm: function(){
                let vm = this
                if( vm.step === 1 ){
                    vm.validateParent()
                    if (_.isEmpty(vm.errors)) {
                        vm.requestSubmission()
                        vm.loaders = true
                    }
                }
            },
            checkForErrors: function (field) {
                let errs = ''
                let vm = this
                if (!_.isUndefined(vm.errors[field])) {
                    errs = 'field-error'
                }
                return errs
            },
            next: function(){
                this.step++
            },
            validateChildren: function () {
                let vm = this
                let descriptor = {
                    attendees: {
                        type: "array",
                        required: true,
                        defaultField: [{
                            type: 'object',
                            fields: {
                                name: {
                                    type: 'string',
                                    required: true,
                                    min: 3
                                },
                                dob: {
                                    type: 'object',
                                    fields: {
                                        y: {
                                            type: 'number',
                                            required: true
                                        },
                                        m: {
                                            type: 'number',
                                            required: true
                                        },
                                        d: {
                                            type: 'number',
                                            required: true
                                        }
                                    }
                                }
                            }
                        }]
                    }
                }
                let validator = new schema(descriptor);
                validator.validate(JSON.parse(JSON.stringify({attendees: vm.attendees})), (errors, fields) => {
                    if (errors) {
                        vm.errors = fields
                    } else {
                        vm.errors = {}
                    }
                });
            },
            validateParent: function () {
                let vm = this
                let descriptor = {
                    form: {
                        type: "object",
                        required: true,
                        fields: {
                            email: {
                                type: 'email',
                                required: true,
                                min: 3
                            }
                        }
                    }
                }
                if( vm.magnet.fields.firstName ){
                    descriptor.form.fields.firstName = {
                        type: 'string',
                        required: true,
                        min: 3
                    }
                }
                if( vm.magnet.fields.lastName ){
                    descriptor.form.fields.lastName = {
                        type: 'string',
                        required: true,
                        min: 3
                    }
                }
                if( vm.magnet.fields.phone ){
                    descriptor.form.fields.phone = {
                        type: 'string',
                        required: true,
                        min: 3
                    }
                }
                let validator = new schema(descriptor);
                validator.validate(JSON.parse(JSON.stringify({form: vm.form})), (errors, fields) => {
                    if (errors) {
                        vm.errors = fields
                    } else {
                        vm.errors = {}
                    }
                });
            },
            allowCloseModal: function(e){
                if( this.visible ){
                    e.stop()
                }
                this.$emit('closeModal')
            },
            closeModal: function(){
                this.$emit('closeModal')
            },

            toggleBodyClass(addRemoveClass, className) {
                const el = document.body;
                if (addRemoveClass === 'addClass') {
                    el.classList.add(className);
                } else {
                    el.classList.remove(className);
                }
            },
            showModal: function () {
                this.$modal.show('magnet-modal');
                this.toggleBodyClass('addClass', 'modal--visible')
            },
            hideModal: function () {
                this.$modal.hide('magnet-modal');
                this.toggleBodyClass('removeClass', 'modal--visible')
            },
            toggleModal: function () {
                this.$emit('closeModal')
            },

        },
        watch: {
            visible: function (n) {
                if (n) {
                    this.showModal()
                } else {
                    this.hideModal()
                }
            },
            confirmation: function(n){
                if( n === 1 ){
                    let vm = this
                    if( ! _.isUndefined( vm.magnet.redirect ) && ! _.isEmpty( vm.magnet.redirect ) ){
                        window.location = vm.magnet.redirect
                    } else {
                        this.$router.push({ name: 'success', params: vm.formSubmit })
                    }
                }
                //this.loaders = false
            },
            attendees: {
                handler: function () {
                    if ( ! _.isEmpty(this.errors) ) {
                        this.validateChildren()
                    }
                },
                deep: true
            },
        }
    }
</script>

<style scoped>

</style>