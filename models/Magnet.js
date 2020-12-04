import SchemaObject from "schema-object";
import languageClass from "./languageClass";

const CTA = new SchemaObject({
    label: {
        type: String,
        default: 'Download'
    },
    color: {
        type: String,
        default: '#cc0000'
    }
})

const Webhook = new SchemaObject({
    url: {
        type: String,
        default: ''
    },
    status: {
        type: Boolean,
        default: true
    }
})

const MagnetFields = new SchemaObject({
    children: {
        type: Boolean,
        default: true
    },
    phone: {
        type: Boolean,
        default: false
    },
    firstName: {
        type: Boolean,
        default: true
    },
    lastName: {
        type: Boolean,
        default: false
    }
})

export default new SchemaObject({
    tenantId: String,
    id: String,
    title: {
        type: String,
        default: ''
    },
    excerpt: {
        type: String,
        default: ''
    },
    content: {
        type: String,
        default: '# Dummy Header\n' +
        '## Dummy Subtitle\n' +
        '\n' +
        'Placeholder text lorem ipsum\n' +
        '\n' +
        '\n' +
        '[call-to-action]\n' +
        '\n' +
        'Footer paragraph here'
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
    status: {
        type: Boolean,
        default: false
    },
    slug: {
        type: String,
        default: ''
    },
    language: [languageClass],
    redirect: String,
    cta: CTA,
    actions: {
        type: [Number],
        default: [1]
    },
    webhooks: {
        type: [Webhook],
        default: []
    },
    pdf: {
        type: String,
        default: ''
    },
    payload: {
        type: String,
        default: JSON.stringify({
            from: '',
            subject: '',
            body: '',
            timer: 0
        })
    },
    submissions: {
        type: Number,
        default: 0
    },
    fields: MagnetFields
})
