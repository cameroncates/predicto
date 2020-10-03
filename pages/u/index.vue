<template>
<div class="w-100 h-100 d-flex flex-wrap">
    <div class="w-100">
        <logo color="text-black" />
    </div>
    <div class="d-flex w-100">
        <div style="width:350px" class="bd-right h-100 flex-shrink-0 pl-4 pt-5 pb-5">
            <button class="btn btn-block text-left btn-hov" v-for="(item, i) in navbar" :key="i" @click="tab=item.value" :class="item.value == tab ? 'bg-light' : ''">
                <span :class="[item.icon, item.value == tab ? 'text-orange' : '']" class="text-md mr-4"></span>
                <span :class="item.value == tab ? 'font-weight-bold text-black' : ''">{{item.title}}</span>
            </button>
        </div>
        <div class="w-100">
            <forum v-if="tab=='forum'" />
            <create-forum v-else-if="tab=='create_forum'" />
            <process-paper v-else-if="tab=='process_paper'" />
        </div>
    </div>
</div>
</template>

<script>
import logo from "../../components/Logo"
import forum from "../../components/forum"
import createForum from "../../components/CreateForum"
import processPaper from "../../components/processPaper"
export default {
  components: {
    logo,
    "forum": forum,
    "create-forum": createForum,
    "process-paper": processPaper
  },    
  data() {
      return {
          tab: "process_paper",
          navbar: [
              { title: "My Forums", value: "forum", icon: "mdi mdi-book-open" },
              { title: "Create a Forum", value: "create_forum", icon: "mdi mdi-book-open" },
              { title: "Generate Paper", value: "process_paper", icon: "mdi mdi-file-document-multiple" },
          ]
      }
  },
  mounted() {
    console.log(this.getCookie('project-predicto-2211'), 'cookie')      
  }

}
</script>

<style>

</style>