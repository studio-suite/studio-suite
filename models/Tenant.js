import SchemaObject from "schema-object";
import Address from "./Address"
import languageClass from "./languageClass"


const Currency = new SchemaObject({
  code: {
    type: String,
    default: 'USD'
  },
  format: {
    type: Number,
    default: 0
  }
})

const Colors = new SchemaObject({
  bg: {
    type: String,
    default: '#EFEDEB'
  },
  bgContent: {
    type: String,
    default: '#FFFFFF'
  },
  text: {
    type: String,
    default: '#000000'
  },
  accent: {
    type: String,
    default: '#5258FF'
  }
})

export default new SchemaObject({
  id: String,
  name: {
    type: String,
    default: ''
  },
  domain: {
    type: String,
    default: ''
  },
  siteId: String,
  logo: {
    type: String,
    default: ''
  },
  dateFormat: {
    type: Number,
    default: 0
  },
  currency: {
    type: Currency
  },
  stripeId: String,
  subscriptionId: String,
  colors: Colors,
  language: [languageClass],
  version: Number
});
