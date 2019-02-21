import SchemaObject from "schema-object";

export default new SchemaObject({
    id: String,
    title: {
        type: String,
        default: ''
    },
    slug: {
        type: String,
        default: ''
    },
    style: {
        type: Number,
        default: 0
    },
    status: {
        type: Boolean,
        default: true
    },
    start: {
        type: Number,
        default: 0
    },
    startSpecific: {
        type: String,
        default: ''
    },
    startDays: {
        type: Number,
        default: 0
    },
    stop: {
        type: Number,
        default: 0
    },
    stopDays: {
        type: Number,
        default: 14
    },
    stopSpecific: {
        type: String,
        default: ''
    },
    limit: {
        type: Number,
        default: 1
    },
    limitType: {
        type: Number,
        default: 0
    },
    classTypes: {
        type: [String],
        default:['*']
    },
    instructors: {
        type: [String],
        default:['*']
    },
    locations: {
        type: [String],
        default:['*']
    },
    age: {
        type: [Number],
        default: [0,19]
    },
    filterClassTypes: {
        type: [String],
        default:['*']
    },
    filterInstructors: {
        type: [String],
        default:['*']
    },
    filterLocations: {
        type: [String],
        default:['0']
    },
    filterAge: {
        type: Number,
        default: 0
    },
    filterDays: {
        type: [Number],
        default: [0,1,2,3,4,5,6]
    },
    filterTimes: {
        type: [Number],
        default: [0,1,2]
    },
    modal: {
        type: Number,
        default: 0
    },
    modalOptions: {
        type: {
            classTypes: Boolean,
            instructors: Boolean,
            ages: Boolean,
            days: Boolean,
            locations: Boolean,
            times: Boolean
        },
        default: {
            classTypes: true,
            instructors: true,
            ages: true,
            days: true,
            locations: true,
            times: true
        }
    },
    appearance: {
        type: {
            show_title: Boolean,
            show_ending: Boolean,
            show_duration: Boolean,
            show_excerpt: Boolean,
            show_instructors: Boolean,
            show_classTypes: Boolean,
            labelNothingToShow: String,
            colorText: String,
            colorBg: String,
            colorPrimary: String,
            colorDays0: String,
            colorDays1: String,
            colorDays2: String,
            colorDays3: String,
            colorDays4: String,
            colorDays5: String,
            colorDays6: String
        },
        default: {
            show_title: true,
            show_ending: true,
            show_duration: true,
            show_excerpt: true,
            show_instructors: true,
            show_classTypes: true,
            labelNothingToShow: '',
            colorText: '',
            colorBg: '',
            colorPrimary: '',
            colorDays0: '',
            colorDays1: '',
            colorDays2: '',
            colorDays3: '',
            colorDays4: '',
            colorDays5: '',
            colorDays6: ''
        }
    },
    created: String,
    updated: String
})