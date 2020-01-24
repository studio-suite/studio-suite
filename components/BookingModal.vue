<template>
    <modal name="booking-modal" height="auto" :scrollable="true" :reset="true" :width="580" :adaptive="true" classes="booking-modal" @before-close="allowCloseModal">
        <div class="text-align--right"><i class="fal fa-times" v-on:click.prevent="closeModal"></i></div>

        <div class="booking-modal__content">
            <div class="loading" v-if="loaders">
                <div class="loader"></div>
            </div>

            <!-- C H I L D R E N -->
            <div v-if="step === 0">
                <h2 v-html="getText(checkEventLabel('class/singleEvent/bookingBox/bookingModal/step1Title'))"></h2>
                <h3 class="margin-bottom--5" v-html="capacity > 1 ? getText(checkEventLabel('class/singleEvent/bookingBox/bookingModal/step1Subtitle'), { spots: capacity }) : getText(checkEventLabel('class/singleEvent/bookingBox/bookingModal/step1SubtitleOne') )"></h3>
                <div class="attendees">
                    <div class="attendee" v-for="(att, ind) in attendees">
                        <label><em v-html="getText(checkEventLabel('class/singleEvent/bookingBox/bookingModal/step1ChildName'))"></em> <span class="remove-attendee" v-if="ind > 0" v-on:click.prevent="attendees.splice(ind, 1)"><i class="far fa-user-minus margin-right--05"></i> Remove</span></label>
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
                    <a href="#" v-on:click.prevent="addChild" class="add-child" v-if="attendees.length < 3 && capacity >= attendees.length + 1"><i class="far fa-user-plus margin-right--05"></i> Add Another Child</a>
                    <div class="next margin-top--5">
                        <a href="#" class="next-button" v-on:click.prevent="saveChildren">Next</a>
                    </div>
                </div>
            </div>

            <!-- P A R E N T -->
            <div v-if="step === 1">
                <h2 v-html="getText(checkEventLabel('class/singleEvent/bookingBox/bookingModal/step2Title'))"></h2>
                <h3 class="margin-bottom--5" v-html="getText(checkEventLabel('class/singleEvent/bookingBox/bookingModal/step2Subtitle'))"></h3>
                <label>First name</label>
                <input type="text" v-model="form.firstName" placeholder="Your first name here" :class="checkForErrors(`form.firstName`)"/>
                <label class="margin-top--2">Last name</label>
                <input type="text" v-model="form.lastName" placeholder="Your last name here" :class="checkForErrors(`form.lastName`)"/>
                <label class="margin-top--2">Phone number</label>
                <input type="tel" v-model="form.phone" placeholder="Your phone number here" :class="checkForErrors(`form.phone`)"/>
                <label class="margin-top--2">Email</label>
                <input type="email" v-model="form.email" placeholder="Your email here" :class="checkForErrors(`form.email`)"/>
                <div class="next margin-top--5">
                    <a href="#" class="next-button" v-on:click.prevent="saveParent">Next</a>
                </div>
            </div>

            <!-- P A Y M E N T -->
            <div v-if="step === 2">
                <h2 v-html="getText(checkEventLabel('class/singleEvent/bookingBox/bookingModal/step3Title'))"></h2>
                <h3 class="margin-bottom--5" v-html="classObject.price > 0 ? getText(checkEventLabel('class/singleEvent/bookingBox/bookingModal/step3SubtitlePayment')) : getText(checkEventLabel('class/singleEvent/bookingBox/bookingModal/step3Subtitle'))"></h3>
                <p class="summary-p" v-if="classObject.price > 0" v-html=" formSubmit.attendees.length === 1 ? getText(checkEventLabel('class/singleEvent/bookingBox/bookingModal/step3PaymentMessageOne'), { total: $options.filters.currency(formSubmit.attendees.length * formSubmit.price), attendee: formSubmit.attendees[0].name, class_title: classObject.title, time: $options.filters.moment_ts_location(ts, summaryDateFormat, tz) }) : getText(checkEventLabel('class/singleEvent/bookingBox/bookingModal/step3PaymentMessageTwo'), { total: $options.filters.currency(formSubmit.attendees.length * formSubmit.price), attendees: $options.filters.attendees(formSubmit.attendees), class_title: classObject.title, time: $options.filters.moment_ts_location(ts, summaryDateFormat, tz) }) "></p>
                <p class="summary-p" v-else v-html=" formSubmit.attendees.length === 1 ? getText(checkEventLabel('class/singleEvent/bookingBox/bookingModal/step3MessageOne'), { attendee: formSubmit.attendees[0].name, class_title: classObject.title, time: $options.filters.moment_ts_location(ts, summaryDateFormat, tz) }) : getText(checkEventLabel('class/singleEvent/bookingBox/bookingModal/step3MessageTwo'), { attendees: $options.filters.attendees(formSubmit.attendees), class_title: classObject.title, time: $options.filters.moment_ts_location(ts, summaryDateFormat, tz) })"></p>
                <form method="post" id="payment-form" ref="paymentForm" class="margin-top--3" v-if="classObject.price > 0">
                    <div class="form-row">
                        <label for="card-element">Credit or debit card</label>
                        <div id="card-element" ref="cardElement"></div>
                        <div id="card-errors" role="alert"></div>
                    </div>
                </form>
                <div class="payment-error" v-if="errorsPayment.length > 0">{{errorsPayment[errorsPayment.length - 1]}}</div>
                <div class="next margin-top--2">
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
    import moment from "moment-timezone"
    import _ from "lodash"
    import schema from "async-validator"
    import axios from "axios"

    export default {
        name: "BookingModal",
        props: ['classObject', 'visible', 'ts', 'availability', 'tz', 'classNextDuration', 'language', 'is_event', 'prefill'],
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
            moment_ts_location: function(v, f, t){
                t = ! _.isUndefined( t ) ? t : 'Europe/London'
                return moment.unix(v).tz(t).format(f)
            },
            attendees: function(v){
                let out = ''
                _.each( v, function(a, k){
                    out += out.length === 0 ? a.name : ( k === v.length - 1 ? ` & ${a.name}` : `, ${a.name}` )
                })
                return out
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
            ending: function(){
              return  parseInt( moment.unix(this.ts + this.classNextDuration * 60).tz(this.tz).format('X') )
            },
            format_RFC: function(){
              return 'ddd, DD MMM YYYY HH:mm:ss ZZ'
            },
            format_ADD_EVENT: function(){
              return 'YYYY-MM-DD[T]HH:mm:ss'
            },
            location_address: function(){
                return `${this.location.address.address1}, ${this.location.address.city}, ${this.location.address.state} ${this.location.address.zip}`
            },
            starting_time: function(){
                return moment.unix(this.ts).tz(this.tz).format(this.format_ADD_EVENT)
            },
            ending_time: function(){
                return moment.unix(this.ts + this.classNextDuration * 60).tz(this.tz).format(this.format_ADD_EVENT)
            },
            moment_ts_location: function(){
                return moment.unix(this.ts).tz(this.tz).format()
            },
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
                    let a = _.find(vm.availability, { ts: parseInt( vm.ts ) })
                    cap -= ! _.isUndefined( a ) ? a.count : 0
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
            age_min: function(){
                return ! _.isUndefined( this.classObject.age ) ? parseInt(this.classObject.age[0]) : 0
            },
            age_max: function(){
                return ! _.isUndefined( this.classObject.age ) ? parseInt(this.classObject.age[1]) : 99
            },
            availableYears: function () {
                let avYears = []
                if ( ! this.isClassForAdults ) {
                    avYears = _.range( this.limits[1], this.limits[0] + 1 )
                }
                return avYears
            },
            limits: function(){
                let min = moment().tz(this.tz).subtract(this.age_min, 'years').year()
                let max = moment().tz(this.tz).subtract(this.age_max + 1, 'years').year()
                return [ min, max ]
            },
            isClassForAdults: function () {
                return ! _.isUndefined( this.classObject.age ) && this.classObject.age[0] === this.classObject.age[1] && this.classObject.age[1] === 18
            },
            locations: function(){
                return this.$store.getters.locations
            },
            location: function(){
                return _.find( this.locations, { id: this.classObject.locationId } )
            },
            class_title: function(){
                let vm = this
                let title = `${vm.classObject.title} for `
                if(vm.formSubmit.attendees.length === 1){
                    title += vm.formSubmit.attendees[0].name
                } else if( vm.formSubmit.attendees.length === 2 ){
                    title += `${vm.formSubmit.attendees[0].name} and ${vm.formSubmit.attendees[1].name}`
                } else if( vm.formSubmit.attendees.length > 2 ){
                    _.each( vm.formSubmit.attendees, function(att, att_index){
                        title += att.name
                        if( att_index === vm.formSubmit.attendees.length - 2 ){
                            title += ' and '
                        } else {
                            title += ', '
                        }
                    })

                }
                return title
            }
        },
        methods: {
            isMonthAvailable: function(m, y){
                if( ! _.isUndefined(y)  && ! _.isNull(y) && parseInt(y) > 0 ){
                    if( this.limits[0] === y ){
                        let ev = moment.unix(this.ts).tz(this.tz)
                        if( moment().tz(this.tz).month(m-1).isAfter(ev, 'day') ){
                            return false
                        }
                    }
                    if( this.limits[1] === y ){
                        let ev = moment().tz(this.tz)
                        if( moment().tz(this.tz).month(m-1).isBefore(ev, 'day') ){
                            return false
                        }
                    }
                } else {
                    return false
                }
                return true
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
            availableDays: function(dob){
                let days = []
                let vm = this
                if( ! _.isUndefined( dob.y )  && ! _.isUndefined( dob.m ) && parseInt( dob.y ) > 0 && parseInt( dob.m ) > 0 ){
                    let date = moment().tz(vm.tz).year(dob.y).month(dob.m -1).day(1).endOf('month').format('D')
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
            toggleBodyClass(addRemoveClass, className) {
                const el = document.body;

                if (addRemoveClass === 'addClass') {
                    el.classList.add(className);
                } else {
                    el.classList.remove(className);
                }
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
                                min: 6
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
                this.toggleBodyClass('addClass', 'modal--visible')
            },
            hideModal: function () {
                this.$modal.hide('booking-modal');
                this.toggleBodyClass('removeClass', 'modal--visible')
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
                            vm.errorsPayment.push('Unable to process payment. Try a different card.')
                        } else {
                            setTimeout(vm.checkForPayment, 500)
                        }
                    }).catch(function(e){
                        vm.booking = null
                        vm.stok = null
                    })
                }
            },
            requestBooking: function(stok){
                let vm = this
                axios.post(`${process.env.VUE_APP_BOOKINGS_API_BASE}/booking?id=${vm.classObject.id}&ts=${vm.ts}&stok=${stok}`, {
                    ...vm.formSubmit,
                    duration: vm.classNextDuration,
                    ending: vm.ending
                }, {
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
                        vm.errorsPayment.push( 'Unfortunately no more spots are available for this date.' )
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
                    let vm = this
                    this.$emit('blockDate', { ts: this.ts, qty: this.attendees.length })
                    if( ! _.isUndefined( vm.classObject.redirect ) && ! _.isEmpty( vm.classObject.redirect ) ){
                        window.location = vm.classObject.redirect
                    } else {
                        this.$router.push({ name: 'confirmation', params: {
                                ...vm.formSubmit,
                                starting_time: vm.starting_time,
                                ending_time: vm.ending_time,
                                class_title: vm.class_title,
                                address: vm.location_address,
                                excerpt: vm.classObject.excerpt,
                                tz: vm.tz
                            } })
                    }
                    //this.loaders = false
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
                    vm.loaders = false
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
            'form.phone': _.debounce(function(r, o){
                if( r !== o ){
                    let phone = r
                    phone = phone.replace( / /g, '')
                    phone = phone.replace( /\(/g, '')
                    phone = phone.replace( /\)/g, '')
                    phone = phone.replace( /-/g, '')
                    phone = phone.replace( /\+/g, '')
                    phone = phone.replace( /\./g, '')
                    phone = phone.replace( /[\D]/g, '' )
                    phone = `+${phone}`
                    this.form.phone = phone
                }
            }, 200),
            visible: function (n) {
                if (n) {
                    this.step = this.isClassForAdults ? 1 : 0
                    this.form = JSON.parse( JSON.stringify( this.default_form ) ),
                    this.attendees = JSON.parse( JSON.stringify( this.default_attendees ) ),
                    this.stok = null,
                    this.booking = null
                    this.bookingConfirmation = null
                    this.loaders = false
                    if( ! _.isUndefined(this.prefill) && ! _.isNull(this.prefill) ){
                        if( ! _.isUndefined( this.prefill.customer.firstName ) ){
                            this.form.firstName = this.prefill.customer.firstName
                        }
                        if( ! _.isUndefined( this.prefill.customer.lastName ) ){
                            this.form.lastName = this.prefill.customer.lastName
                        }
                        if( ! _.isUndefined( this.prefill.customer.phone ) ){
                            this.form.phone = this.prefill.customer.phone
                        }
                        if( ! _.isUndefined( this.prefill.customer.email ) ){
                            this.form.email = this.prefill.customer.email
                        }
                        if( ! _.isUndefined( this.prefill.attendees) ){
                            this.attendees = this.prefill.attendees
                        }
                    }
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

                } else if( n=== 2 && vm.isClassForAdults ){
                    vm.attendees = [{
                        name: vm.formSubmit.firstName,
                        dob: {
                            y: 1900,
                            m:1,
                            d:1
                        }
                    }]
                }
            }
        }
    }
</script>

<style scoped>

</style>