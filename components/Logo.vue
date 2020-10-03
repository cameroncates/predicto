<template>
  <div class="w-100 text-center p-4 position-relative" style="z-index:10000">
    <div class="d-flex" :class="user ? ' justify-content-between' : ' justify-content-center'">
      <div v-if="user"></div>
      <h1 @click="goto()" class="cursor-pointer font-dancing-script display-1" :class="color"><span class="text-orange">P</span>redicto</h1>
      <button v-if="user" @click="dropdown_list($event)" class="btn mdi dropdown-btn flex-shrink-0 box-shadow p-0 bg-orange text-white text-lg font-dancing-script" style="width:60px;height:60px;border-radius:50%">
        K
      </button>

    </div>
  </div>
</template>

<script>
export default {
  props: {
    color: {
      required: false,
      default: "text-black"
    }
  },
  data() {
    return {
      links: [
        { title: "Logout", icon: "mdi-logout"},
      ],
      url: null,
      user: null
    }
  },
  methods: {
    dropdown_list(e) {
      let buttons = this.dropdown(this.links, e)
      for(let i=0; i<buttons.length; i++) {
        buttons[i].click((e) => {
          switch(i) {
            case 0:
              this.setCookie('project-predicto-2211', null)
              window.location = '/'
              break
          }
        })
      }
    },
    goto() {
      window.location = this.url
    }
  },
  mounted() {
    this.user = this.getCookie("project-predicto-2211")
    console.log(this.user, 'my user')
    if(this.user) {
      if(this.user.username) {
        this.url = '/u'
      }
      else {
        this.url = '/'
      }
    }
    else {
      this.url = '/'
    }
    console.log(this.url, 'my url')
  }
}
</script>

<style>

</style>