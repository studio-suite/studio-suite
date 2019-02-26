<template>
    <modal name="class-modal" height="auto" :scrollable="true" :reset="true" :width="1150" :adaptive="true" classes="class-modal" @before-close="allowCloseModal">
        <div class="text-align--right"><i class="fal fa-times" v-on:click.prevent="closeModal"></i></div>
        <SingleEvent v-if="classObject" :classObject="classObject" :ts="ts" :isModal="true"></SingleEvent>
    </modal>
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
            allowCloseModal: function(e){
                if( this.visible ){
                    e.stop()
                }
                this.$emit('closeModal')
            },
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
                this.$modal.show('class-modal');
                //this.toggleBodyClass('addClass', 'class-modal-open');
            },
            hideModal: function () {
                this.$modal.hide('class-modal');
                //this.toggleBodyClass('removeClass', 'class-modal-open');
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