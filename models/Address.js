import SchemaObject from "schema-object";

export default new SchemaObject({
    address1: {
        type: String,
        default: ""
    },
    address2: {
        type: String,
        default: ''
    },
    countryCode: {
        type: String,
        default: 'US'
    },
    state: {
        type: String,
        default: ''
    },
    zip: {
        type: String,
        default: ''
    },
    city: {
        type: String,
        default: ''
    }
})