import SchemaObject from "schema-object";
import Availability from "@/models/Availability"
import Address from "@/models/Address"


export default new SchemaObject({
    id: String,
    name: {
        type: String,
        default: ''
    },
    description: {
        type: String,
        default: ''
    },
    schedule: {
        type: Availability
    },
    image: {
        type: String,
        default: ''
    },
    timezone: {
      type: String,
      default: 'Europe/Bucharest'
    },
    address: {
        type: Address
    },
    email: {
        type: String,
        default: ''
    },
    phone: {
        type: String,
        default: ''
    },
    url: {
        type: String,
        default: ''
    },
    coords: {
        type: String,
        default: ''
    }
})
