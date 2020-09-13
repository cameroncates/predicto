
export default {
  mode: 'universal',
  /*
  ** Headers of the page
  */
  head: {
    title: "Predicto",
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { href:"https://fonts.googleapis.com/icon?family=Material+Icons", rel: "stylesheet"},
      { href:"https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.0.0/animate.min.css", rel: "stylesheet"},
      { href:"https://maxcdn.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css", rel: "stylesheet"},
      { href: "https://cdn.jsdelivr.net/npm/vuetify@2.3.10/dist/vuetify.min.css", rel: "stylesheet"},
      { href: "http://cdn.materialdesignicons.com/5.4.55/css/materialdesignicons.min.css", rel: "stylesheet"},
      { src: "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.0.87/pdf.js"},
      { src: "https://cdn.jsdelivr.net/npm/pdfjs-dist@2.4.456/build/pdf.min.js"},
      { src: "https://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js"}
    ]
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },
  /*
  ** Global CSS
  */
  css: [
    '~assets/css/bootstrap-ext.css',
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '~/plugins/website.js',
    '~/plugins/firebase.js',
  ],
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
  ],
  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend (config, ctx) {
    }
  }
}
