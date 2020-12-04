import SchemaObject from "schema-object";
import Availability from "./Availability"
import languageClass from "./languageClass"

export default new SchemaObject({
  id: String,
  title: {
    type: String,
    default: ''
  },
  redirect: {
    type: String,
    default: null
  },
  excerpt: {
    type: String,
    default: ''
  },
  content: {
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
  created: {
    type: String,
    default: ''
  },
  updated: {
    type: String,
    default: ''
  },
  locationId: {
    type: String,
    default: ''
  },
  roomId: {
    type: String,
    default: ''
  },
  capacity: {
    type: Number,
    default: 1
  },
  age: {
    type: [Number],
    default: [13, 15]
  },
  status: {
    type: Boolean,
    default: false
  },
  event: {
    type: Boolean,
    default: false
  },
  instructorsIds: [String],
  classTypesIds: [String],
  price: {
    type: Number,
    default: 0
  },
  color: {
    type: String,
    default: ''
  },
  slug: {
    type: String,
    default: ''
  },
  seasonsIds: [String],
  dripTags: {
    type: [{
      trigger: String,
      action: String,
      tags: String
    }],
    default: []
  },
  language: [languageClass],
  zoomId: String
})
