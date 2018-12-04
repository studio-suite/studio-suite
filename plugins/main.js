import Vue from 'vue'


Vue.mixin({
    methods: {
        getImgSrc: function(params, image){
            const ImgixClient = require('imgix-core-js');

            const client = new ImgixClient({
                domains: "mystudiosuite.imgix.net",
            });
            return client.buildURL(image, params);
        }
    }
})