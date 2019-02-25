const pkg = require('./package')
import axios from 'axios'
import _ from 'lodash'

let VUE_APP_TENANT_ID = process.env.VUE_APP_TENANT_ID || 'auth0|5bdae2a63fd53b44339f6ab4'
let VUE_APP_API_URL_SCHEDULES = process.env.VUE_APP_API_BASE || 'https://8homamhaq0.execute-api.us-east-2.amazonaws.com/prod'

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
    let classesAll = []
    let lastId = false
    let baseUrl = `${VUE_APP_API_URL_SCHEDULES}/get-routes?type=schedule&id=${VUE_APP_TENANT_ID}`
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
                    route: `/s/${i.slug}`,
                    payload: i
                }
            })
        })
        classesAll = _.concat(classesAll, classes)
    }
    return classesAll
}

async function getRoutes() {
    let classes = await getClassesRoutes()
    let schedules = await getSchedulesRoutes()
    return _.concat(schedules, classes)
}


module.exports = {
    mode: 'universal',

    /*
    ** Headers of the page
    */
    head: {
        title: pkg.name,
        meta: [
            {charset: 'utf-8'},
            {name: 'viewport', content: 'width=device-width, initial-scale=1'},
            {hid: 'description', name: 'description', content: pkg.description},
            {hid: 'robots', name: 'robots', content: 'index, follow'}
        ],
        link: [
            {rel: 'icon', type: 'image/x-icon', href: '/favicon.ico'}
        ],
        script: [{
            src: 'https://js.stripe.com/v3/'
            },
            {
                src: `https://maps.googleapis.com/maps/api/js?key=${process.env.VUE_APP_GMAPS_PUBLIC_API || 'AIzaSyDvQBQ_diMzJUxTJDJMRj03rVZYpSu6PW8'}`,
                defer: true,
                async: true
            }
        ]
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
        '@/assets/fontawesome-pro/css/all.css'
    ],

    env: {
        VUE_APP_TENANT_ID: process.env.VUE_APP_TENANT_ID || 'auth0|5bdae2a63fd53b44339f6ab4',
        VUE_APP_API_BASE: process.env.VUE_APP_API_BASE || 'https://8homamhaq0.execute-api.us-east-2.amazonaws.com/prod',
        VUE_APP_IMGIX_URL: process.env.VUE_APP_IMGIX_URL || 'my-getstudiosuite.imgix.net',
        VUE_APP_BOOKINGS_API_BASE: process.env.VUE_APP_BOOKINGS_API_BASE || 'https://3h737nakvh.execute-api.us-east-2.amazonaws.com/prod',
        VUE_APP_GMAPS_PUBLIC_API: process.env.VUE_APP_GMAPS_PUBLIC_API || 'AIzaSyDvQBQ_diMzJUxTJDJMRj03rVZYpSu6PW8'
    },

    /*
    ** Plugins to load before mounting the App
    */
    plugins: [
        {src: '~/plugins/main.js', ssr: true},
        {src: '~/plugins/vue-select.js', ssr: false},
        {src: '~/plugins/currency', ssr: true}
    ],

    /*
    ** Nuxt.js modules
    */
    modules: [
        'nuxt-webfontloader'
        // '@nuxtjs/proxy'
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
        /*
        ** You can extend webpack config here
        */
        vendor: ['vue-select'],
        extractCSS: true
    }
}
