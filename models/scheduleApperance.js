import SchemaObject from "schema-object";

export default new SchemaObject({
    show_title: {
        type: Boolean,
        default: true
    },
    show_ending: {
        type: Boolean,
        default: true
    },
    show_duration: {
        type: Boolean,
        default: true
    },
    show_excerpt: {
        type: Boolean,
        default: true
    },
    show_instructors: {
        type: Boolean,
        default: true
    },
    show_classTypes: {
        type: Boolean,
        default: true
    },
    labelNothingToShow: {
        type: String,
        default: ''
    },
    labelFilterInstructors: {
        type: String,
        default: 'Which instructor?'
    },
    labelFilterAge: {
        type: String,
        default: 'How old?'
    },
    labelFilterClassTypes: {
        type: String,
        default: 'Which class?'
    },
    labelFilterLocations: {
        type: String,
        default: 'Which location?'
    },
    labelFilterDays: {
        type: String,
        default: 'Which day?'
    },
    labelFilterTimes: {
        type: String,
        default: 'When?'
    },
    colorText: {
        type: String,
        default: ''
    },
    colorBg: {
        type: String,
        default: ''
    },
    colorPrimary: {
        type: String,
        default: ''
    },
    colorDays0: {
        type: String,
        default: ''
    },
    colorDays1: {
        type: String,
        default: ''
    },
    colorDays2: {
        type: String,
        default: ''
    },
    colorDays3: {
        type: String,
        default: ''
    },
    colorDays4: {
        type: String,
        default: ''
    },
    colorDays5: {
        type: String,
        default: ''
    },
    colorDays6: {
        type: String,
        default: ''
    }
})