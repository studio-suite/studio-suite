import _ from "lodash"

export default ({ app, store }) => {
    app.router.beforeEach((to, from, next) => {
        if( to.name === 'confirmation' && ( _.isUndefined( to.params ) || _.isNull( to.params ) || _.isEmpty( to.params )  ) ){
            next('/')
        }
        if( to.name === 'success' && ( _.isUndefined( to.params ) || _.isNull( to.params ) || _.isEmpty( to.params )  ) ){
            next('/')
        }
        next()
    })
}