const pkg = require('./package')

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
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Muli:300,400,600,700' },
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
      //'fortawesome/fontawesome-pro/css/all.css'
  ],

    env: {
        VUE_APP_TENANT_ID: process.env.VUE_APP_TENANT_ID || 'auth0|5bacbeb4654f067ba253ddbd',
        VUE_APP_API_URL_TENANT: process.env.VUE_APP_API_URL_TENANT || 'https://o6rowv78y6.execute-api.us-east-1.amazonaws.com/dev/tenant',
        VUE_APP_API_URL_SCHEDULES: process.env.VUE_APP_API_URL_SCHEDULES || 'https://o6rowv78y6.execute-api.us-east-1.amazonaws.com/dev/schedules',
        VUE_APP_API_URL_CLASS_TYPES: process.env.VUE_APP_API_URL_CLASS_TYPES || 'https://o6rowv78y6.execute-api.us-east-1.amazonaws.com/dev/class-types',
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
      routes: []
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
