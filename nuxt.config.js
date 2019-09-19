const pkg = require('./package')
import axios from 'axios'
import _ from 'lodash'

let VUE_APP_TENANT_ID = process.env.VUE_APP_TENANT_ID || 'auth0|5c50a6871a76dc70235185e7' //'auth0|5c8fdce594ed5d2e1df165d2' //'auth0|5c8fdce594ed5d2e1df165d2' // //radu 'auth0|5bdae2a63fd53b44339f6ab4' //austin'auth0|5c50a6871a76dc70235185e7'
let VUE_APP_API_URL_SCHEDULES = process.env.VUE_APP_API_BASE || 'https://8homamhaq0.execute-api.us-east-2.amazonaws.com/prod'
let VUE_APP_ALGOLIA_BOOKINGS_INDEX = process.env.VUE_APP_ALGOLIA_BOOKINGS_INDEX || 'ss_prod_bookings'

async function getClassesRoutes() {
    let classesAll = []
    let lastId = false
    let baseUrl = `${VUE_APP_API_URL_SCHEDULES}/get-routes?id=${VUE_APP_TENANT_ID}`
    while (!_.isNull(lastId) || lastId === false) {
        let url = !_.isNull(lastId) && lastId !== false ? baseUrl + '&ExclusiveStartKey=' + lastId : baseUrl
        let classes = await axios.get(url).then(function (r) {
            if (!_.isUndefined(r.data.LastEvaluatedKey)) {
                lastId = r.data.LastEvaluatedKey.id
            } else {
                lastId = null
            }
            return _.map(r.data.Items, function (i) {
                return {
                    route: `/${i.slug}`,
                    payload: i
                }
            })
        })
        classesAll = _.concat(classesAll, classes)
    }
    return classesAll
}

async function getSchedulesRoutes() {
    let schedulesAll = []
    let lastId = false
    let baseUrl = `${VUE_APP_API_URL_SCHEDULES}/get-routes?type=schedule&id=${VUE_APP_TENANT_ID}`
    while (!_.isNull(lastId) || lastId === false) {
        let url = !_.isNull(lastId) && lastId !== false ? baseUrl + '&ExclusiveStartKey=' + lastId : baseUrl
        let schedules = await axios.get(url).then(function (r) {
            if (!_.isUndefined(r.data.LastEvaluatedKey)) {
                lastId = r.data.LastEvaluatedKey.id
            } else {
                lastId = null
            }
            return _.map(r.data.Items, function (i) {
                return {
                    route: `/s/${i.slug}`,
                    payload: i
                }
            })
        })
        schedulesAll = _.concat(schedulesAll, schedules)
    }
    return schedulesAll
}

async function getRoutes() {
    let classes = await getClassesRoutes()
    let schedules = await getSchedulesRoutes()
    /*let locations = await axios.get(`${VUE_APP_API_URL_SCHEDULES}/locations?tenantId=${VUE_APP_TENANT_ID}`)
        locations = _.map(locations.data, function(l){
            return l.id
        })*/
    /*classes = _.filter(classes, function(c){
        return locations.indexOf( c.locationId ) >= 0
    })*/
    return _.concat(schedules, classes)
}

module.exports = {
    mode: 'universal',

    /*
    ** Headers of the page
    */
    head: {
        title: pkg.name,
        htmlAttrs: {
            lang: 'en',
        },
        meta: [
            {charset: 'utf-8'},
            {name: 'viewport', content: 'width=device-width, initial-scale=1'},
            {hid: 'description', name: 'description', content: pkg.description},
            {hid: 'robots', name: 'robots', content: 'index, follow'},
            {hid: 'revised', content: new Date()}
        ],
        link: [
            {rel: 'icon', type: 'image/x-icon', href: '/favicon.ico'}
        ],
        script: [
            {
                src: 'https://js.stripe.com/v3/'
            },
            {
                src: `https://maps.googleapis.com/maps/api/js?key=${process.env.VUE_APP_GMAPS_PUBLIC_API || 'AIzaSyDvQBQ_diMzJUxTJDJMRj03rVZYpSu6PW8'}`,
                defer: true,
                async: true
            },
            {
                src: 'https://addevent.com/libs/atc/1.6.1/atc.min.js',
                defer: true,
                async: true
            }
        ],
        bodyAttrs: {
            class: 'body'
        },
    },

    /*
    ** Customize the progress-bar color
    */
    loading: {color: '#fff'},

    /*
    ** Global CSS
    */
    css: [
        '@/assets/scss/main.scss',
        '@/assets/fontawesome-pro/css/all.css',
        'vue-js-modal/dist/styles.css'
    ],

    env: {
        VUE_APP_TENANT_ID: process.env.VUE_APP_TENANT_ID || VUE_APP_TENANT_ID,
        VUE_APP_API_BASE: process.env.VUE_APP_API_BASE || 'https://8homamhaq0.execute-api.us-east-2.amazonaws.com/prod',
        VUE_APP_IMGIX_URL: process.env.VUE_APP_IMGIX_URL || 'my-getstudiosuite.imgix.net',
        VUE_APP_BOOKINGS_API_BASE: process.env.VUE_APP_BOOKINGS_API_BASE || 'https://3h737nakvh.execute-api.us-east-2.amazonaws.com/prod',
        VUE_APP_GMAPS_PUBLIC_API: process.env.VUE_APP_GMAPS_PUBLIC_API || 'AIzaSyDvQBQ_diMzJUxTJDJMRj03rVZYpSu6PW8',
        VUE_APP_ALGOLIA_BOOKINGS_INDEX: process.env.VUE_APP_ALGOLIA_BOOKINGS_INDEX || VUE_APP_ALGOLIA_BOOKINGS_INDEX
    },

    /*
    ** Plugins to load before mounting the App
    */
    plugins: [
        {src: '~/plugins/main.js', ssr: true},
        {src: '~/plugins/vue-select.js', ssr: false},
        {src: '~/plugins/currency', ssr: true},
        {src: '~plugins/vue-js-modal', ssr: true},
        { src: '~plugins/ga.js', ssr: false },
        { src: '~plugins/fb.js', ssr: false },
        { src: '~plugins/css.js', ssr: true },
        { src: '~plugins/confirmation.js', ssr: true }
    ],

    /*
    ** Nuxt.js modules
    */
    modules: [
        'nuxt-webfontloader',
        /*['nuxt-facebook-pixel-module', {
            /!* module options *!/
            track: 'PageView',
            pixelId: '1028096897222871',
            disabled: false
        }],*/
    ],

    webfontloader: {
        google: {
            families: ['Muli:300,400,600,700,800,900'] //Loads Lato font with weights 400 and 700
        }
    },

    generate: {
        subFolders: false,
        routes: getRoutes
    },

    /*
    ** Build configuration
    */
    build: {
        extractCSS: true,
        /*filenames: {
            app: ({ isDev }) => isDev ? '[name].js' : '[name].js',
            chunk: ({ isDev }) => isDev ? '[name].js' : '[name].js',
            css: ({ isDev }) => isDev ? '[name].css' : '[name].css'
        }*/
    }
}
