const pkg = require('./package')
import axios from 'axios'
import _ from 'lodash'

let VUE_APP_TENANT_ID = process.env.VUE_APP_TENANT_ID || 'auth0|5bdae2a63fd53b44339f6ab4'
let VUE_APP_API_URL_SCHEDULES = process.env.VUE_APP_API_BASE || 'https://8homamhaq0.execute-api.us-east-2.amazonaws.com/prod'

async function getClassesRoutes(LastEvaluatedKey){
    return new Promise(function (resolve, reject) {
        let url = `${VUE_APP_API_URL_SCHEDULES}/get-routes?id=${VUE_APP_TENANT_ID}`
        if( !_.isUndefined(LastEvaluatedKey) && !_.isNull(LastEvaluatedKey) ){
            url += '&ExclusiveStartKey=' + LastEvaluatedKey
        }

    })

}

function resolveClasses(r, resolve){
    resolve(r.data)
}


async function getRoutes(){
        let classesAll = []
        let lastId = false
        let baseUrl = `${VUE_APP_API_URL_SCHEDULES}/get-routes?id=${VUE_APP_TENANT_ID}`
        while( ! _.isNull( lastId ) || lastId === false ){
            let url = ! _.isNull(lastId) && lastId !== false ? baseUrl + '&ExclusiveStartKey=' + lastId : baseUrl
            let classes = await axios.get(url).then(function(r){
                if( ! _.isUndefined( r.data.LastEvaluatedKey ) ){
                    lastId = r.data.LastEvaluatedKey.id
                } else {
                    lastId = null
                }
                return _.map(r.data.Items, function(i){
                    return {
                        route: `/${i.slug}`,
                        payload: i
                    }
                })
            })
            classesAll = _.concat( classesAll, classes )
        }
        return classesAll
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
            {hid: 'description', name: 'description', content: pkg.description}
        ],
        link: [
            {rel: 'icon', type: 'image/x-icon', href: '/favicon.ico'},
            {rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Muli:300,400,600,700,800,900'}
        ],
        script: [{
            src: 'https://js.stripe.com/v3/'
        }]
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
        VUE_APP_BOOKINGS_API_BASE: process.env.VUE_APP_BOOKINGS_API_BASE || 'https://3h737nakvh.execute-api.us-east-2.amazonaws.com/prod'
    },

    /*
    ** Plugins to load before mounting the App
    */
    plugins: [
        {src: '~/plugins/main.js', ssr: true},
        {src: '~/plugins/vue-select.js', ssr: false},
        {src: '~/plugins/currency', ssr: true }
    ],

    /*
    ** Nuxt.js modules
    */
    modules: [],

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
        vendor: ['vue-select']
    }
}
