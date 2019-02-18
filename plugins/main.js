import Vue from 'vue'
import _ from "lodash"
import moment from "moment"

Vue.mixin({
    computed: {
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
        }
    }
})