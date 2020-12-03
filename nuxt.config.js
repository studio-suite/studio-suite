const pkg = require('./package')
import axios from 'axios'
import _ from 'lodash'

// Production
/*let defaults = {
    tId: 'auth0|5dcc3fed24c6030e771ea60b', //'auth0|5db0a4c9e3191b0c63334a80', //'auth0|5c8fdce594ed5d2e1df165d2' //'auth0|5c8fdce594ed5d2e1df165d2' // //radu 'auth0|5bdae2a63fd53b44339f6ab4' //austin'auth0|5c50a6871a76dc70235185e7'
    apiBase: 'https://8homamhaq0.execute-api.us-east-2.amazonaws.com/prod',
    alogliaBIndex: 'ss_prod_bookings',
    gMapsApi: 'AIzaSyDvQBQ_diMzJUxTJDJMRj03rVZYpSu6PW8',
    imgix: 'my-getstudiosuite.imgix.net',
    apiBaseBookings: 'https://3h737nakvh.execute-api.us-east-2.amazonaws.com/prod'
}*/

let defaults = {
    tId: 'auth0|5bacbeb4654f067ba253ddbd', //radu 'auth0|5bacbeb4654f067ba253ddbd',
    apiBase: 'https://dz0uo09p5h.execute-api.us-east-1.amazonaws.com/dev',
    alogliaBIndex: 'ss_dev_bookings',
    gMapsApi: 'AIzaSyDvQBQ_diMzJUxTJDJMRj03rVZYpSu6PW8',
    imgix: 'myssdev.imgix.net',
    apiBaseBookings: 'https://tiw7tn4fh6.execute-api.us-east-1.amazonaws.com/dev',
    appsync: 'https://5ls7y5fabva3belrt3pkkikffy.appsync-api.us-east-1.amazonaws.com/graphql',
    appsync_key: 'da2-crrgk3yxwvcpnld5n2w2rxg5om'
}

let VUE_APP_TENANT_ID = process.env.VUE_APP_TENANT_ID || defaults.tId
let VUE_APP_API_BASE = process.env.VUE_APP_API_BASE || defaults.apiBase
let VUE_APP_ALGOLIA_BOOKINGS_INDEX = process.env.VUE_APP_ALGOLIA_BOOKINGS_INDEX || defaults.alogliaBIndex
let VUE_APP_GMAPS_PUBLIC_API = process.env.VUE_APP_GMAPS_PUBLIC_API || defaults.gMapsApi
let VUE_APP_IMGIX_URL = process.env.VUE_APP_IMGIX_URL || defaults.imgix
let VUE_APP_BOOKINGS_API_BASE = process.env.VUE_APP_BOOKINGS_API_BASE || defaults.apiBaseBookings
let VUE_APP_APPSYNC_URL = VUE_APP_API_BASE.indexOf('prod') >= 0 ? process.env.VUE_APP_APPSYNC_URL || defaults.appsync : defaults.appsync
let VUE_APP_APPSYNC_KEY = VUE_APP_API_BASE.indexOf('prod') >= 0 ? process.env.VUE_APP_APPSYNC_KEY || defaults.appsync_key : defaults.appsync_key

const operations = {
  listClassesByTenant: `
            query listClassesByTenant($limit: Int, $nextToken: String, $tenantID: String){
              listClassesByTenant(
                  limit: $limit,
                  nextToken: $nextToken,
                  tenantID: $tenantID
              ){
                items{
                    id
                    title
                    excerpt
                    content
                    image
                    created
                    updated
                    locationId
                    roomId
                    capacity
                    age
                    status
                    instructorsIds
                    classTypesIds
                    seasonsIds
                    language{
                        i
                        l
                    }
                    schedule{
                        days{
                            d
                            i{
                                s
                                e
                            }
                        }
                        empty
                        specific{
                            d
                            i{
                                s
                                e
                            }
                        }
                    }
                    price
                    color
                    slug
                    dripTags{
                        trigger
                        action
                        tags
                    }
                    redirect
                    event
                    zoomId
                },
                nextToken
              }
            }
        `,
  listSchedulesByTenant: `
            query listSchedulesByTenant($limit: Int, $nextToken: String, $tenantID: String){
                listSchedulesByTenant(
                    limit: $limit,
                    nextToken: $nextToken,
                    tenantID: $tenantID
                ){
                    items{
                        id
                        title
                        slug
                        style
                        status
                        start
                        startSpecific
                        startDays
                        stop
                        stopDays
                        stopSpecific
                        limit
                        limitType
                        classTypes
                        instructors
                        locations
                        age
                        filterClassTypes
                        filterInstructors
                        filterLocations
                        filterAge
                        filterDays
                        filterTimes
                        modal
                        modalOptions{
                            classTypes
                            instructors
                            ages
                            days
                            locations
                            times
                        }
                        appearance{
                            show_title
                            show_ending
                            show_duration
                            show_excerpt
                            show_instructors
                            show_classTypes
                            show_empty
                            show_weekdays
                            labelNothingToShow
                            labelFilterClassTypes
                            labelFilterInstructors
                            labelFilterLocations
                            labelFilterDays
                            labelFilterAge
                            labelFilterTimes
                            colorText
                            colorBg
                            colorPrimary
                            colorDays0
                            colorDays1
                            colorDays2
                            colorDays3
                            colorDays4
                            colorDays5
                            colorDays6
                        }
                        created
                        updated
                        headline
                        description
                        language{
                            i
                            l
                        }
                    },
                    nextToken
                 }
            }
        `,
  listMagnetsByTenant: `
            query listMagnetsByTenant($limit: Int, $nextToken: String, $tenantID: String){
                listMagnetsByTenant(
                    limit: $limit,
                    nextToken: $nextToken,
                    tenantID: $tenantID
                ){
                    items{
                        tenantId
                        id
                        title
                        slug
                        status
                        actions
                        submissions
                        fields{
                          children
                          phone
                          firstName
                          lastName
                        }
                        language{
                          i
                          l
                        }
                    },
                    nextToken
                 }
            }
        `
}
async function getDynamicRoutes(operationName){
  let listAll = []
  let lastId = false
  while (!_.isNull(lastId) || lastId === false) {
    let operation = {
      query: operations[operationName],
      operationName: operationName,
      variables: {
        tenantID: VUE_APP_TENANT_ID
      }
    };
    if( !_.isNull(lastId) && lastId !== false ){
      operation.variables.input.nextToken = lastId
    }
    const headers = {
      'Content-Type': 'application/json',
      'x-api-key': VUE_APP_APPSYNC_KEY,
    }
    let list = await axios({
      method: 'POST',
      url: VUE_APP_APPSYNC_URL,
      data: JSON.stringify(operation),
      headers: headers
    }).then(function (r) {
      if ( !_.isUndefined(r.data.data[operationName] ) && !_.isUndefined(r.data.data[operationName].nextToken)) {
        lastId = r.data.data[operationName].nextToken
      } else {
        lastId = null
      }
      let prefix = '';
      if( operationName === 'listSchedulesByTenant' ){
        prefix = '/s'
      } else if( operationName === 'listMagnetsByTenant' ){
        prefix = '/m'
      }

      return _.map(r.data.data[operationName].items, function (i) {
        return {
          route: `${prefix}/${i.slug}`,
          payload: i
        }
      })
    }).catch(function(e){
      return []
    });
    listAll = _.concat(listAll, list)
  }

  return listAll
}

async function getRoutes() {
    let classes = await getDynamicRoutes('listClassesByTenant')
    let schedules = await getDynamicRoutes('listSchedulesByTenant')
    let magnets = await getDynamicRoutes('listMagnetsByTenant')
    return _.filter( _.concat(schedules, classes, magnets), function(v){
      return v.route.length < 100
    })
}

module.exports = {
    target: 'static',
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
        VUE_APP_API_BASE: process.env.VUE_APP_API_BASE || VUE_APP_API_BASE,
        VUE_APP_IMGIX_URL: process.env.VUE_APP_IMGIX_URL || VUE_APP_IMGIX_URL,
        VUE_APP_BOOKINGS_API_BASE: process.env.VUE_APP_BOOKINGS_API_BASE || VUE_APP_BOOKINGS_API_BASE,
        VUE_APP_GMAPS_PUBLIC_API: process.env.VUE_APP_GMAPS_PUBLIC_API || VUE_APP_GMAPS_PUBLIC_API,
        VUE_APP_ALGOLIA_BOOKINGS_INDEX: process.env.VUE_APP_ALGOLIA_BOOKINGS_INDEX || VUE_APP_ALGOLIA_BOOKINGS_INDEX,
        VUE_APP_APPSYNC_URL: VUE_APP_API_BASE.indexOf('prod') >= 0 ? process.env.VUE_APP_APPSYNC_URL || VUE_APP_APPSYNC_URL : VUE_APP_APPSYNC_URL,
        VUE_APP_APPSYNC_KEY: VUE_APP_API_BASE.indexOf('prod') >= 0 ? process.env.VUE_APP_APPSYNC_KEY || VUE_APP_APPSYNC_KEY : VUE_APP_APPSYNC_KEY
    },

    /*
    ** Plugins to load before mounting the App
    */
    plugins: [
        {src: '~/plugins/main.js'},
        {src: '~/plugins/vue-select.js', mode: 'client'},
        {src: '~/plugins/currency'},
        {src: '~plugins/vue-js-modal'},
        { src: '~plugins/ga.js', mode: 'client' },
        { src: '~plugins/fb.js', mode: 'client' },
        { src: '~plugins/css.js' },
        { src: '~plugins/confirmation.js' }
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
