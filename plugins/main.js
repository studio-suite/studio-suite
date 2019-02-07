import Vue from 'vue'

Vue.mixin({
    methods: {
        getImgSrc: function(params, image){
            const ImgixClient = require('imgix-core-js');

            const client = new ImgixClient({
                domains: process.env.VUE_APP_IMGIX_URL,
            });
            return client.buildURL(image, params);
        }
    }
})

//AIzaSyDvQBQ_diMzJUxTJDJMRj03rVZYpSu6PW8