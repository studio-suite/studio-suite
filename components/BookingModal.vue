<template>
    <modal name="booking-modal" height="auto" :scrollable="true" :reset="true" :width="580" :adaptive="true" classes="booking-modal" @before-close="allowCloseModal">
        <div class="text-align--right"><i class="fal fa-times" v-on:click.prevent="closeModal"></i></div>

        <div class="booking-modal__content">
            <div class="loading" v-if="loaders">
                <div class="loader"></div>
            </div>

            <!-- C H I L D R E N -->
            <div v-if="step === 0">
                <h2>Trial Class Registration</h2>
                <h3 class="margin-bottom--6">Hurry up! Only <template v-if="capacity > 1">{{capacity}} spots</template><template v-else>one spot</template> left!</h3>
                <div class="attendees">
                    <div class="attendee" v-for="(att, ind) in attendees">
                        <label>Child first name & birthdate <span class="remove-attendee" v-if="ind > 0" v-on:click.prevent="attendees.splice(ind, 1)"><i class="far fa-user-minus margin-right--05"></i> Remove</span></label>
                        <input type="text" v-model="att.name" placeholder="Your child’s first name here" class="name" :class="checkForErrors(`attendees.${ind}.name`)"/>
                        <div class="year" :class="checkForErrors(`attendees.${ind}.dob.y`)">
                            <select v-model="att.dob.y" :class="checkForErrors(`attendees.${ind}.dob.y`)"  title="Choose childyear of birth">
                                <option value="" disabled>Year</option>
                                <option v-for="y in availableYears" :value="y">{{y}}</option>
                            </select>
                        </div>
                        <div class="month" :class="checkForErrors(`attendees.${ind}.dob.m`)">
                            <select v-model="att.dob.m" :class="checkForErrors(`attendees.${ind}.dob.m`)" title="Choose child month of birth">
                                <option value="" disabled>Month</option>
                                <option :value="1">January</option>
                                <option :value="2">February</option>
                                <option :value="3">March</option>
                                <option :value="4">April</option>
                                <option :value="5">May</option>
                                <option :value="6">June</option>
                                <option :value="7">July</option>
                                <option :value="8">August</option>
                                <option :value="9">September</option>
                                <option :value="10">October</option>
                                <option :value="11">November</option>
                                <option :value="12">December</option>
                            </select>
                        </div>
                        <div class="day" :class="checkForErrors(`attendees.${ind}.dob.d`)">
                            <select v-model="att.dob.d" :class="checkForErrors(`attendees.${ind}.dob.d`)"  title="Choose child day of birth">
                                <option value="" disabled>Day</option>
                                <option v-for="day in availableDays(att.dob)" :value="day">{{day}}</option>
                            </select>
                        </div>
                    </div>
                    <a href="#" v-on:click.prevent="addChild" class="add-child" v-if="attendees.length < 3 && capacity >= attendees.length + 1"><i class="far fa-user-plus margin-right--05"></i> Add Another Child</a>
                    <div class="next margin-top--6">
                        <a href="#" class="next-button" v-on:click.prevent="saveChildren">Next</a>
                    </div>
                </div>
            </div>

            <!-- P A R E N T -->
            <div v-if="step === 1">
                <h2>Trial Class Registration</h2>
                <h3 class="margin-bottom--6">Please fill out the form below</h3>
                <label>First name</label>
                <input type="text" v-model="form.firstName" placeholder="Your first name here" :class="checkForErrors(`form.firstName`)"/>
                <label class="margin-top--2">Last name</label>
                <input type="text" v-model="form.lastName" placeholder="Your last name here" :class="checkForErrors(`form.lastName`)"/>
                <label class="margin-top--2">Phone number</label>
                <input type="tel" v-model="form.phone" placeholder="Your phone number here" :class="checkForErrors(`form.phone`)"/>
                <label class="margin-top--2">Email</label>
                <input type="email" v-model="form.email" placeholder="Your email here" :class="checkForErrors(`form.email`)"/>
                <div class="next margin-top--6">
                    <a href="#" class="next-button" v-on:click.prevent="saveParent">Next</a>
                </div>
            </div>

            <!-- P A Y M E N T -->
            <div v-if="step === 2">
                <h2>Trial Class Registration</h2>
                <h3 class="margin-bottom--6"><template v-if="classObject.price > 0">Please provide payment details below</template><template v-else>Please review your registration</template></h3>
                <form method="post" id="payment-form" ref="paymentForm" class="margin-top--3" v-if="classObject.price > 0">
                    <div class="form-row">
                        <label for="card-element">Credit or debit card</label>
                        <div id="card-element" ref="cardElement"></div>
                        <div id="card-errors" role="alert"></div>
                    </div>
                </form>
                <div class="summary">
                    <label class="label-summary">Registration summary</label>
                    <strong>{{classObject.title}}</strong>
                    <span>{{ts | moment_ts( summaryDateFormat ) }}</span>
                    <div class="item" v-for="att in formSubmit.attendees">
                        <h5>{{att.name}} <span>{{formSubmit.price | currency }}</span></h5>
                    </div>
                    <div class="total">Total <span>{{ formSubmit.attendees.length * formSubmit.price | currency }}</span></div>
                </div>
                <div class="next margin-top--6">
                    <a href="#" class="next-button" v-on:click.prevent="completeBooking">Complete Booking</a>
                </div>
            </div>

            <!-- C O N F I R M A T I O N -->
            <div v-if="step === 3" class="confirmation">
                <h2>Registration Confirmation</h2>
                <img src="~/assets/ok.svg">
                <p class="text-align--center margin-top--4"><template v-if="classObject.price > 0">Your payment of <strong>{{ formSubmit.attendees.length * formSubmit.price | currency(tenantCurrency) }}</strong> processed successfully.</template> We sent you an email confirmation.</p>
            </div>


            <!-- N O   M O R E   S P O T S -->
            <div v-if="step === 4">
                <h2>Registration Failed</h2>
                <p class="margin-top--4 text-align--center"><strong>Unfortunately there are no more spots avaialble</strong>. Please close this window and choose a different date.</p>
                <a href="#" class="close-button" v-on:click.prevent="closeModal">Choose different date</a>
            </div>

        </div>
    </modal>
</template>

<script>
    import moment from "moment"
    import _ from "lodash"
    import schema from "async-validator"
    import axios from "axios"

    export default {
        name: "BookingModal",
        props: ['classObject', 'visible', 'ts', 'availability'],
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
                stok: null,
                booking: null,
                bookingConfirmation: null,
                loaders: false,
                errorsPayment:[]
            }
        },
        filters: {
            convertTimestamp: function (e, format) {
                return moment.unix(e).utcOffset(0).format(format)
            }
        },
        mounted: function () {
            if (this.isClassForAdults) {
                this.step = 1
            } else {
                this.step = 0
            }
        },
        computed: {
            default_form: function(){
              return {
                  firstName: '',
                  lastName: '',
                  phone: '',
                  email: ''
              }
            },
            default_attendees: function(){
              return  [{
                  name: '',
                  dob: {
                      y: '',
                      m: '',
                      d: ''
                  }
              }]
            },
            capacity: function(){
                let vm = this
                let cap = this.classObject.capacity || 0
                if( vm.ts ){
                    cap -= ! _.isUndefined( vm.availability[vm.ts.toString()] ) ? vm.availability[vm.ts.toString()] : 0
                }
                return cap
            },
            summaryDateFormat: function () {
                return this.getClassDateFormat() + ' [at] ' + this.getClassTimeFormat()
            },
            formSubmit: function () {
                let out = {}
                out.attendees = this.attendees
                out.price = this.classObject.price
                out.firstName = this.form.firstName
                out.lastName = this.form.lastName
                out.phone = this.form.phone
                out.email = this.form.email
                return out
            },
            availableYears: function () {
                let vm = this
                let avYears = []
                if (!this.isClassForAdults) {
                    let yearToday = parseInt(moment().utcOffset(0).format('YYYY'))
                    for (let i = parseInt(vm.classObject.age[0]); i <= parseInt(vm.classObject.age[1]); i++) {
                        avYears.push(yearToday - i)
                    }
                }
                return avYears
            },
            isClassForAdults: function () {
                return this.classObject.age[0] === this.classObject.age[1] && this.classObject.age[1] === 18
            }
        },
        methods: {
            allowCloseModal: function(e){
                if( this.visible ){
                    e.stop()
                }
                this.$emit('closeModal')
            },
            closeModal: function(){
                this.$emit('closeModal')
            },
            availableDays: function(dob){
                let days = []
                if( ! _.isUndefined( dob.y )  && ! _.isUndefined( dob.m ) && parseInt( dob.y ) > 0 && parseInt( dob.m ) > 0 ){
                    let date = moment().utcOffset(0).year(dob.y).month(dob.m -1).day(1).endOf('month').format('D')
                    for( let d = 1; d <= parseInt( date ); d++ ){
                        days.push(d)
                    }
                }
                return days
            },
            saveParent: function () {
                let vm = this
                vm.validateParent()
                if (_.isEmpty(vm.errors)) {
                    vm.step++
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
            validateParent: function () {
                let vm = this
                let descriptor = {
                    form: {
                        type: "object",
                        required: true,
                        fields: {
                            firstName: {
                                type: 'string',
                                required: true,
                                min: 3
                            },
                            lastName: {
                                type: 'string',
                                required: true,
                                min: 3
                            },
                            phone: {
                                type: 'string',
                                required: true,
                                min: 3
                            },
                            email: {
                                type: 'email',
                                required: true,
                                min: 3
                            }
                        }
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
            saveChildren: function () {
                let vm = this
                vm.validateChildren()
                if (_.isEmpty(vm.errors)) {
                    vm.step++
                }
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
            toggleBodyClass(addRemoveClass, className) {
                const el = document.body;

                if (addRemoveClass === 'addClass') {
                    el.classList.add(className);
                } else {
                    el.classList.remove(className);
                }
            },
            showModal: function () {
                this.$modal.show('booking-modal');
            },
            hideModal: function () {
                this.$modal.hide('booking-modal');
            },
            toggleModal: function () {
                this.$emit('closeModal')
            },
            completeBooking: function () {
                let vm = this
                if( vm.classObject.price > 0 ){
                    let form = vm.$refs.paymentForm;
                    form.dispatchEvent(new Event('submit'))
                } else {
                    vm.requestBooking()
                }
                vm.loaders = true
            },
            checkForPayment: function(){
                let vm = this
                if( ! _.isNull( vm.booking ) && _.isNull( vm.bookingConfirmation ) ){
                    axios.get( `${process.env.VUE_APP_BOOKINGS_API_BASE}/booking?id=${vm.booking}` ).then(function(r){
                        if( ! _.isUndefined( r.data ) && parseInt(r.data) === 1 ){
                            vm.bookingConfirmation = 1
                        } else if( ! _.isUndefined( r.data ) && parseInt(r.data) === -1 ){
                            vm.booking = null
                            vm.stok = null
                            vm.errorsPayment.push('Could not process payment. Please try again')
                        } else {
                            setTimeout(vm.checkForPayment, 5000)
                        }
                    }).catch(function(e){
                        vm.booking = null
                        vm.stok = null
                    })
                }
            },
            requestBooking: function(stok){
                let vm = this
                axios.post(`${process.env.VUE_APP_BOOKINGS_API_BASE}/booking?id=${vm.classObject.id}&ts=${vm.ts}&stok=${stok}`, vm.formSubmit, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then(function (r) {
                    if ( ! _.isNull(r.data) && ! _.isEmpty(r.data) ) {
                        vm.booking = r.data
                    } else if( ! _.isNull(r.data) && parseInt( r.data ) === -1 ) {
                        vm.errorsPayment.push( 'Could not communicate with server. Please try again.' )
                        vm.stok = null
                    } else {
                        vm.errorsPayment.push( 'Unfortunately there are no more spots available for this date.' )
                        vm.stok = null
                        vm.step = 4
                    }
                }).catch(function (e) {
                    vm.stok = null
                    vm.errorsPayment.push( 'Could not communicate with server. Please try again.' )
                })
            }
        },
        watch: {
            bookingConfirmation: function(n){
                if( n === 1 ){
                    this.$emit('blockDate', { ts: this.ts, qty: this.attendees.length })
                    this.loaders = false
                    this.$router.push({ name: 'confirmation' })
                }
            },
            booking: function(n){
                if( ! _.isNull( n ) ){
                    this.checkForPayment()
                }
            },
            stok: function (n) {
                let vm = this
                if (  !_.isNull(n) ) {
                    vm.requestBooking(n)
                } else {
                    vm.loaders = true
                }
            },
            form: {
                handler: function () {
                    if ( ! _.isEmpty(this.errors) ) {
                        this.validateParent()
                    }
                },
                deep: true
            },
            attendees: {
                handler: function () {
                    if ( ! _.isEmpty(this.errors) ) {
                        this.validateChildren()
                    }
                },
                deep: true
            },
            visible: function (n) {
                if (n) {
                    this.step = 0
                    this.form = JSON.parse( JSON.stringify( this.default_form ) ),
                    this.attendees = JSON.parse( JSON.stringify( this.default_attendees ) ),
                    this.stok = null,
                    this.booking = null
                    this.bookingConfirmation = null
                    this.loaders = false
                    this.showModal()
                } else {
                    this.hideModal()
                }
            },
            step: function (n) {
                let vm = this
                if (n === 2 && ! _.isNull( vm.$store.getters.stripePublicApiKey ) && ! _.isEmpty( vm.$store.getters.stripePublicApiKey ) && vm.classObject.price > 0 ) {
                    this.$nextTick(function () {
                        let stripe = Stripe( vm.$store.getters.stripePublicApiKey )
                        let elements = stripe.elements({ fonts: [{ cssSrc: "https://fonts.googleapis.com/css?family=Muli:300,400,600,700,800,900" }]})
                        let style = {
                            base: {
                                color: '#32325d',
                                lineHeight: '56px',
                                height: '56px',
                                fontFamily: '"Muli", "Helvetica Neue", Helvetica, sans-serif',
                                fontSmoothing: 'antialiased',
                                borderBottomStyle: 'solid',
                                borderBottomWidth: '1px',
                                fontSize: '18px',
                                '::placeholder': {
                                    color: '#949494'
                                }
                            },
                            invalid: {
                                color: '#262626',
                                iconColor: '#F53F46'
                            }
                        };
                        let card = elements.create('card', {
                            style: style,
                            hidePostalCode: false
                        });
                        card.mount(vm.$refs.cardElement);
                        card.addEventListener('change', function (event) {
                            let displayError = document.getElementById('card-errors');
                            if (event.error) {
                                displayError.textContent = event.error.message;
                            } else {
                                displayError.textContent = '';
                            }
                        });
                        let form = vm.$refs.paymentForm;
                        form.addEventListener('submit', function (event) {
                            event.preventDefault();
                            stripe.createToken(card).then(function (result) {
                                if (result.error) {
                                    let errorElement = document.getElementById('card-errors');
                                    errorElement.textContent = result.error.message;
                                    vm.loaders = false
                                } else {
                                    if (!_.isUndefined(result.token.id)) {
                                        vm.stok = result.token.id
                                    }
                                }
                            });
                        });

                    })
                } else if( n >= 3 ){
                    vm.loaders = false
                    if( n === 3 ){
                        vm.$emit('blockDate', { ts: vm.ts, qty: vm.attendees.length })
                    } else {
                        vm.$emit('blockDate', { ts: vm.ts, qty: 999999 })
                    }

                }
            }
        }
    }
</script>

<style scoped>

</style>