export default ({ app, store }) => {
    /*
    ** Only run on client-side and only in production mode
    */
    if (typeof store.getters.fb === 'undefined' || store.getters.fb === null || store.getters.fb.length < 3 ) return
    /*
    ** Include Google Analytics Script
    */
    !function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
    /*
    ** Set the current page
    */
    fbq('init', store.getters.fb);
    /*
    ** Every time the route changes (fired on initialization too)
    */
    app.router.afterEach((to, from) => {
        /*
        ** We tell Google Analytics to add a `pageview`
        */
        fbq('track', 'PageView');
    })
}