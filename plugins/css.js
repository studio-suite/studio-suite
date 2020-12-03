import axios from 'axios'
import Color from 'color'

function populateCss(css, colors){
    let bg = Color( colors.bg )
    let bgBox = Color( colors.bgContent)
    let text = Color( colors.text )
    let accent = Color( colors.accent )
    css += `
        :root{
            --color-bg: ${bg.hex()};
            --color-bgContent: ${bgBox.hex()};
            --color-text-alpha-95: ${text.alpha(0.95).rgb().string()};
            --color-text: ${text.hex()};
            --color-text-alpha-10: ${text.alpha(0.1).rgb().string()};
            --color-text-alpha-20: ${text.alpha(0.2).rgb().string()};
            --color-text-alpha-40: ${text.alpha(0.4).rgb().string()};
            --color-text-alpha-60: ${text.alpha(0.6).rgb().string()};
            --color-text-alpha-75: ${text.alpha(0.75).rgb().string()};
            --color-text-alpha-95: ${text.alpha(0.95).rgb().string()};
            --color-accent: ${accent.hex()};
            --color-accent-alpha-60: ${accent.alpha(0.60).rgb().string()};
            --color-accent-shadow-60: ${accent.alpha(0.6).rgb().string()};
            --color-accent-darken-10: ${accent.darken(0.10).rgb().string()};
            --color-accent-darken-15: ${accent.darken(0.15).rgb().string()};
            --color-accent-darken-20: ${accent.darken(0.2).rgb().string()};
            --color-accent-reverse: ${accent.isDark() ? '#FFFFFF' : '#000000'};
          }
    `
    return css
}

export default async (ctx) => {
    let { app, store } = ctx
    let baseUrl = process.env.VUE_APP_API_BASE || 'https://8homamhaq0.execute-api.us-east-2.amazonaws.com/prod';
    let tenantId = process.env.VUE_APP_TENANT_ID || 'auth0|5bdae2a63fd53b44339f6ab4'
        tenantId = tenantId.replace('|','%7C')
    let colors = {
        text: '#000000',
        bg: '#EFEDEB',
        bgContent: '#FFFFFF',
        accent: '#5258FF'
    }
    let css = ''

    try{
      colors = store.getters.tenant.colors
      console.log('colors', store.getters.tenant)
      css = populateCss(css, colors)
      app.head.style.push({ cssText: css.replace(' ',''), type: 'text/css' })
    } catch (e){
      axios.get( `${baseUrl}/get-colors?id=${tenantId}` ).then(function(r){
        if( r.status === 200 ){
          colors = r.data
        }
        css = populateCss(css, colors)
        app.head.style.push({ cssText: css.replace(' ',''), type: 'text/css' })
      }).catch(function(e){
        css = populateCss(css, colors)
        app.head.style.push({ cssText: css.replace(' ',''), type: 'text/css' })
      })
    }
}
