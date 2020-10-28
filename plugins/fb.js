export default ({ app, store }) => {
    console.log('incep tracking fb')
    if (typeof store.getters.fb === 'undefined' || store.getters.fb === null || store.getters.fb.length < 3 ) return
    console.log('are tracking de fb')
    !function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', store.getters.fb);
    console.log('init fb trafic')
    app.router.afterEach((to, from) => {
        console.log('call tracking aici')
        fbq('track', 'PageView');
        if( to.name === 'confirmation' || to.name === 'success' ){
            console.log('confirmation')
            fbq('track', 'Lead');
        }
    })
}