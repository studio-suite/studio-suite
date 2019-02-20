<template>
    <div class="classModal">
        <div class="classModal__bg" v-on:click.prevent="toggleModal"></div>
        <div class="classModal__content-wrapper">
            <div class="classModal__content">
                <div class="loading" v-if="loaders">
                    <div class="loader"></div>
                </div>
                <SingleEvent v-if="classObject" :classObject="classObject"  :isModal="true"></SingleEvent>
            </div>
        </div>
    </div>
</template>

<script>
    import moment from "moment"
    import _ from "lodash"
    import SingleEvent from '@/components/SingleEvent'
    import schema from "async-validator"
    import axios from "axios"

    export default {
        name: "ClassModal",
        props: ['classId', 'visible', 'ts', 'availability'],
        data: function () {
            return {
                loaders: false,
            }
        },
        components: {
            SingleEvent
        },
        mounted: function(){
            if ( this.visible ) {
                this.showModal()
            } else {
                this.hideModal()
            }
        },
        computed: {
          classObject: function(){
              return _.find( this.$store.getters.classes, { id: this.classId } )
          }
        },
        methods: {
            getClass: function(){
                if( ! _.isNull( this.classId ) ) {
                    this.$store.dispatch( 'classes/get', this.classId )
                }
            },
            closeModal: function(){
                this.$emit('closeModal')
            },
            toggleBodyClass(addRemoveClass, className) {
                const el = document.body;

                if (addRemoveClass === 'addClass') {
                    el.classList.add(className);
                } else {
                    el.classList.remove(className);
                }
            },
            showModal: function () {
                this.toggleBodyClass('addClass', 'class-modal-open');
            },
            hideModal: function () {
                this.toggleBodyClass('removeClass', 'class-modal-open');
            },
            toggleModal: function () {
                this.$emit('closeModal')
            }
        },
        watch: {
            visible: function (n) {
                if (n) {
                    if( _.isUndefined( this.classObject ) ){
                        this.getClass()
                    }
                    this.showModal()
                } else {
                    this.hideModal()
                }
            }
        }
    }
</script>

<style scoped>

</style>