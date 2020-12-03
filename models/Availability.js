import SchemaObject from "schema-object"
export default new SchemaObject({
    days: {
        type: [{
            d: Number,
            i: [{
                s: Number,
                e: Number
            }]
        }]
    },
    empty: [String],
    specific: {
        type: [{
            d: String,
            i: [{
                s: Number,
                e: Number
            }]
        }]
    }
})