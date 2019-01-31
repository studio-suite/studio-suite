const pkg = require('./package')
import axios from 'axios'
import _ from 'lodash'

module.exports = {
  mode: 'universal',

  /*
  ** Headers of the page
  */
  head: {
    title: pkg.name,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: pkg.description }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Muli:300,400,600,700' }
    ]
  },

  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },

  /*
  ** Global CSS
  */
  css: [
      '@/assets/scss/main.scss',
      '@/assets/fontawesome-pro/css/all.css'
  ],

    env: {
        VUE_APP_TENANT_ID: process.env.VUE_APP_TENANT_ID || 'auth0|5bacbeb4654f067ba253ddbd',
        VUE_APP_API_BASE: process.env.VUE_APP_API_BASE || 'https://z0emvvonp3.execute-api.us-east-1.amazonaws.com/dev',
        VUE_APP_IMGIX_URL: process.env.VUE_APP_IMGIX_URL || 'mystudiosuite.imgix.net'
    },

  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
      { src: '~/plugins/main.js', ssr: true },
      { src: '~/plugins/vue-select.js', ssr: false }
  ],

  /*
  ** Nuxt.js modules
  */
  modules: [
  ],


    generate:{
      routes: function(){
          let VUE_APP_TENANT_ID = process.env.VUE_APP_TENANT_ID || 'auth0|5bacbeb4654f067ba253ddbd'
          let VUE_APP_API_URL_SCHEDULES = process.env.VUE_APP_API_BASE || 'https://irxg3zag65.execute-api.us-east-1.amazonaws.com/dev'
          return axios.get(`${VUE_APP_API_URL_SCHEDULES}/schedules?tenantId=${VUE_APP_TENANT_ID}`).then(function(r){
              return _.map(r.data, function(i){
                  return `/s/${i.id}`
              })
          }).catch(function(e){
              console.log(e)
              return []
          })
      }
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
