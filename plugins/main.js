import Vue from 'vue'
import _ from "lodash"
import moment from "moment"
import * as Sqrl from 'squirrelly'
import SocialSharing from "vue-social-sharing";
let MarkdownIt = require('markdown-it'), md = new MarkdownIt();
Vue.use(SocialSharing);

Vue.mixin({
    computed: {
        lang: function(){
            let lang = language
            let tenantLang = this.$store.getters.tenant.language
            let vm = this
            lang = _.map( lang, function(ts){
                let out = ts
                if( ! _.isUndefined( tenantLang ) ){
                    let s = _.find( tenantLang, { i: ts.i } )
                    if( ! _.isUndefined( s ) ){
                        out = s
                    }
                }
                if( ! _.isUndefined( vm.language ) && vm.language.length > 0 ){
                    let s = _.find( vm.language, { i: ts.i } )
                    if( ! _.isUndefined( s ) ){
                        out = s
                    }
                }
                return out
            })
            return lang
        },
        tenantCurrency: function(){
            let currencies = {
                "USD": {
                    "symbol": "$",
                    "name": "US Dollar",
                    "symbol_native": "$",
                    "decimal_digits": 2,
                    "rounding": 0,
                    "code": "USD",
                    "name_plural": "US dollars"
                },
                "CAD": {
                    "symbol": "CA$",
                    "name": "Canadian Dollar",
                    "symbol_native": "$",
                    "decimal_digits": 2,
                    "rounding": 0,
                    "code": "CAD",
                    "name_plural": "Canadian dollars"
                },
                "EUR": {
                    "symbol": "€",
                    "name": "Euro",
                    "symbol_native": "€",
                    "decimal_digits": 2,
                    "rounding": 0,
                    "code": "EUR",
                    "name_plural": "euros"
                },
                "GBP": {
                    "symbol": "£",
                    "name": "British Pound Sterling",
                    "symbol_native": "£",
                    "decimal_digits": 2,
                    "rounding": 0,
                    "code": "GBP",
                    "name_plural": "British pounds sterling"
                },
                "AUD": {
                    "symbol": "AU$",
                    "name": "Australian Dollar",
                    "symbol_native": "$",
                    "decimal_digits": 2,
                    "rounding": 0,
                    "code": "AUD",
                    "name_plural": "Australian dollars"
                }
            }
            let settings = {
                symbol: '$',
                thousandsSeparator: ',',
                fractionCount: 2,
                fractionSeparator: '.',
                symbolPosition: 'front',
                symbolSpacing: false
            }
            let currency = currencies[this.$store.getters.tenant.currency.code]
            if( !_.isUndefined( currency ) ){
                settings.symbol = currency.symbol_native
            }
            switch( true ){
                case this.$store.getters.tenant.currency.format === 1 : {
                    settings.thousandsSeparator = '.'
                    settings.fractionSeparator = ','
                } break

                case this.$store.getters.tenant.currency.format === 2 : {
                    settings.thousandsSeparator = ' '
                    settings.fractionSeparator = ','
                } break
                case this.$store.getters.tenant.currency.format === 3 : {
                    settings.thousandsSeparator = ','
                    settings.fractionSeparator = ''
                    settings.fractionCount = 0
                } break
                case this.$store.getters.tenant.currency.format === 4 : {
                    settings.thousandsSeparator = ','
                    settings.fractionSeparator = ''
                    settings.fractionCount = 0
                } break
                case this.$store.getters.tenant.currency.format === 5 : {
                    settings.thousandsSeparator = ' '
                    settings.fractionSeparator = ''
                    settings.fractionCount = 0
                } break
            }
            return settings
        }
    },
    filters: {
        moment: function(v,o){
            return moment(v).utcOffset(0).format(o)
        },
        moment_ts: function(v,o){
            return moment.unix(v).utcOffset(0).format(o)
        }
    },
    methods: {
        checkEventLabel: function(l){
            if( this.is_event){
                l = l.replace( 'class/', 'event/' )
            }
            return l
        },
        getText: function(id, vals){
            let txt = _.find( this.lang, { i: id } )
                txt = ! _.isUndefined(txt) ? txt.l : ''
            return md.renderInline( Sqrl.Render( txt || '', vals || {}) )
        },
        getImgSrc: function(params, image){
            const ImgixClient = require('imgix-core-js')
            const client = new ImgixClient({
                domains: process.env.VUE_APP_IMGIX_URL,
            });
            return client.buildURL(image, params);
        },
        getClassTimeFormat: function(){
            try{
                let dateFormat = this.$store.getters.tenant.dateFormat
                if( ! _.isUndefined( dateFormat ) ){
                    switch ( dateFormat ){
                        case 0 : return 'h:mma'
                        case 2 : return 'h:mma'
                        default : return 'HH:mm'
                    }
                }
            } catch (e) {
                return 'h:mma'
            }
        },
        getClassDateFormat: function(){
            try{
                let dateFormat = this.$store.getters.tenant.dateFormat
                if( ! _.isUndefined( dateFormat ) ){
                    switch ( dateFormat ){
                        case 1 : return 'MMMM D, YYYY'
                        case 2 : return 'D MMMM, YYYY'
                        case 3 : return 'D MMMM, YYYY'
                        default : return 'MMMM D, YYYY'
                    }
                }
            } catch (e) {
                return 'MMMM D, YYYY'
            }
        },
        getClassClassTypes: function(classTypes){
            let vm = this
            classTypes = _.map(classTypes, function (i) {
                return _.find(vm.$store.getters.class_types, function (j) {
                    return j.id === i
                })
            })
            classTypes = _.map(classTypes, function (i) {
                let ct = !_.isUndefined(i) && !_.isUndefined(i.name) ? i.name : ''
                ct.trim()
                return ct
            })

            return _.join(classTypes, ", ")
        }
    }
})

let language = [

    // Schedule list
    {
        i: 'schedule-list/h1',
        l: 'Schedules',
        d: 'Schedule list page title'
    },
    {
        i: 'schedule-list/schedule/ageChildren',
        l: 'Ages {{ min }} to {{ max }}',
        d: 'Schedule list age limit for children'
    },
    {
        i: 'schedule-list/schedule/ageAdults',
        l: 'Adults only',
        d: 'Schedule list age limit for adults'
    },
    {
        i: 'schedule-list/schedule/ageAny',
        l: 'Any age',
        d: 'Schedule list age limit for any age'
    },

    // Schedule
    {
        i: 'schedule/details',
        l: 'Details',
        d: 'Schedule details button'
    },
    {
        i: 'schedule/book',
        l: 'Book',
        d: 'Schedule booking button'
    },


    // Class single
    {
        i: 'class/singleEvent/metaAgeAdults',
        l: 'Adults only',
        d: 'Age meta label for adults'
    },
    {
        i: 'class/singleEvent/metaAgeChildrenFixed',
        l: 'For children aged {{ age }}',
        d: 'Age meta label for children of an exact age'
    },
    {
        i: 'class/singleEvent/metaAgeChildren',
        l: 'For children ages {{ min }} to {{ max }}',
        d: 'Age meta label for children of an exact age'
    },
    {
        i: 'class/singleEvent/title/instructors',
        l: 'Instructors',
        d: 'Title of the instructors section'
    },
    {
        i: 'class/singleEvent/title/location',
        l: 'Location',
        d: 'Title of the location section'
    },
    {
        i: 'class/singleEvent/share',
        l: 'Share',
        d: 'Sharing label'
    },
    {
        i: 'class/singleEvent/bookingBox/nextClass',
        l: 'Next Class',
        d: 'Booking box next class label'
    },
    {
        i: 'class/singleEvent/bookingBox/bookNowButton',
        l: 'Book Now',
        d: 'Booking box button label'
    },
    {
        i: 'class/singleEvent/bookingBox/priceFree',
        l: 'Free',
        d: 'Booking box free label'
    },
    {
        i: 'class/singleEvent/bookingBox/spotsAvailableMany',
        l: '{{ spots }} spots available',
        d: 'Booking box spots available label for multiple spots'
    },
    {
        i: 'class/singleEvent/bookingBox/spotsAvailableNone',
        l: 'No Spots available',
        d: 'Booking box no spots available label'
    },
    {
        i: 'class/singleEvent/bookingBox/spotsAvailableOne',
        l: 'One spot available',
        d: 'Booking box one spot available label'
    },
    {
        i: 'class/singleEvent/bookingBox/chooseDifferentDate',
        l: 'Choose a different date',
        d: 'Booking box choose a different date label'
    },


    // Modal Step 1
    {
        i: 'class/singleEvent/bookingBox/bookingModal/step1Title',
        l: 'Trial Class Registration',
        d: 'Booking modal step one title'
    },
    {
        i: 'class/singleEvent/bookingBox/bookingModal/step1Subtitle',
        l: 'Hurry up! Only {{ spots }} spots left!',
        d: 'Booking modal step one subtitle multiple spots available'
    },
    {
        i: 'class/singleEvent/bookingBox/bookingModal/step1SubtitleOne',
        l: 'Hurry up! Only one spot left!',
        d: 'Booking modal step one subtitle one spot available'
    },
    {
        i: 'class/singleEvent/bookingBox/bookingModal/step1ChildName',
        l: 'Child first name & birthdate',
        d: 'Booking modal step one label for child name and birthdate'
    },
    // Modal Step 2
    {
        i: 'class/singleEvent/bookingBox/bookingModal/step2Title',
        l: 'Trial Class Registration',
        d: 'Booking modal step two title'
    },
    {
        i: 'class/singleEvent/bookingBox/bookingModal/step2Subtitle',
        l: 'Please fill out the form below',
        d: 'Booking modal step two subtitle'
    },
    // Modal Step 3
    {
        i: 'class/singleEvent/bookingBox/bookingModal/step3Title',
        l: 'Trial Class Registration',
        d: 'Booking modal step three title'
    },
    {
        i: 'class/singleEvent/bookingBox/bookingModal/step3SubtitlePayment',
        l: 'Please provide payment details below',
        d: 'Booking modal step three subtitle when need payment'
    },
    {
        i: 'class/singleEvent/bookingBox/bookingModal/step3Subtitle',
        l: 'Please review your registration',
        d: 'Booking modal step three subtitle'
    },
    {
        i: 'class/singleEvent/bookingBox/bookingModal/step3PaymentMessageOne',
        l: 'You are about to pay **{{ total }}** for **{{ attendee }}** to attend **{{ class_title }}** on {{ time }}',
        d: 'Booking modal step three payment message one attendee'
    },
    {
        i: 'class/singleEvent/bookingBox/bookingModal/step3PaymentMessageTwo',
        l: 'You are about to pay **{{ total }}** for **{{ attendees }}** to attend **{{ class_title }}** on {{ time }}',
        d: 'Booking modal step three payment message multiple attendees'
    },
    {
        i: 'class/singleEvent/bookingBox/bookingModal/step3MessageOne',
        l: 'You are about to register **{{ attendee }}** to attend **{{ class_title }}** on {{ time }}',
        d: 'Booking modal step three message one attendee'
    },
    {
        i: 'class/singleEvent/bookingBox/bookingModal/step3MessageTwo',
        l: 'You are about to register **{{ attendees }}** to attend **{{ class_title }}** on {{ time }}',
        d: 'Booking modal step three message multiple attendees'
    },


    // Confirmation
    {
        i: 'confirmation/h2',
        l: 'Registration Confirmation',
        d: 'Confirmation page title'
    },
    {
        i: 'confirmation/message',
        l: 'We sent you an email confirmation.',
        d: 'Confirmation page message'
    },
    {
        i: 'confirmation/messagePayment',
        l: 'Your payment of **{{ total }}** processed successfully.',
        d: 'Confirmation page payment message'
    },



    // Event single
    {
        i: 'event/singleEvent/metaAgeAdults',
        l: 'Adults only',
        d: 'Age meta label for adults'
    },
    {
        i: 'event/singleEvent/metaAgeChildrenFixed',
        l: 'For children aged {{ age }}',
        d: 'Age meta label for children of an exact age'
    },
    {
        i: 'event/singleEvent/metaAgeChildren',
        l: 'For children ages {{ min }} to {{ max }}',
        d: 'Age meta label for children of an exact age'
    },
    {
        i: 'event/singleEvent/title/instructors',
        l: 'Instructors',
        d: 'Title of the instructors section'
    },
    {
        i: 'event/singleEvent/title/location',
        l: 'Location',
        d: 'Title of the location section'
    },
    {
        i: 'event/singleEvent/share',
        l: 'Share',
        d: 'Sharing label'
    },
    {
        i: 'event/singleEvent/bookingBox/nextClass',
        l: 'Starts On',
        d: 'Booking box next event label'
    },
    {
        i: 'event/singleEvent/bookingBox/bookNowButton',
        l: 'Register',
        d: 'Booking box button label'
    },
    {
        i: 'event/singleEvent/bookingBox/priceFree',
        l: 'Free',
        d: 'Booking box free label'
    },
    {
        i: 'event/singleEvent/bookingBox/spotsAvailableMany',
        l: '{{ spots }} spots available',
        d: 'Booking box spots available label for multiple spots'
    },
    {
        i: 'event/singleEvent/bookingBox/spotsAvailableNone',
        l: 'No Spots available',
        d: 'Booking box no spots available label'
    },
    {
        i: 'event/singleEvent/bookingBox/spotsAvailableOne',
        l: 'One spot available',
        d: 'Booking box one spot available label'
    },
    {
        i: 'event/singleEvent/bookingBox/chooseDifferentDate',
        l: 'Choose a different date',
        d: 'Booking box choose a different date label'
    },


    // Modal Step 1
    {
        i: 'event/singleEvent/bookingBox/bookingModal/step1Title',
        l: 'Fill Out This Form',
        d: 'Booking modal step one title'
    },
    {
        i: 'event/singleEvent/bookingBox/bookingModal/step1Subtitle',
        l: 'Almost there! Fill out this form to get started',
        d: 'Booking modal step one subtitle multiple spots available'
    },
    {
        i: 'event/singleEvent/bookingBox/bookingModal/step1ChildName',
        l: 'Child first name & birthdate',
        d: 'Booking modal step one label for child name and birthdate'
    },
    // Modal Step 2
    {
        i: 'event/singleEvent/bookingBox/bookingModal/step2Title',
        l: 'Fill Out This Form',
        d: 'Booking modal step two title'
    },
    {
        i: 'event/singleEvent/bookingBox/bookingModal/step2Subtitle',
        l: 'Now, please submit your contact details below',
        d: 'Booking modal step two subtitle'
    }
]