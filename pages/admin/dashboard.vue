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
            <add-book v-if="tab=='book'" />
            <add-paper v-else-if="tab=='paper'" />
            <questionare v-else-if="tab=='questionare'" />
            <papers v-else-if="tab=='papers'" />
        </div>
    </div>
</div>
</template>

<script>
import logo from "../../components/Logo"
import addBook from "../../components/AddBook"
import addPaper from "../../components/AddPaper"
import questionare from "../../components/questionare"
import papers from "../../components/papers"
export default {
  components: {
    logo,
    "add-book": addBook,
    "add-paper": addPaper,
    "papers": papers,
    questionare
  },    
  data() {
      return {
          tab: "questionare",
          navbar: [
              { title: "Books", value: "book", icon: "mdi mdi-book-open" },
              { title: "Add Paper", value: "paper", icon: "mdi mdi-file-plus" },
              { title: "Write a Questionare", value: "questionare", icon: "mdi mdi-progress-question" },
              { title: "My Papers", value: "papers", icon: "mdi mdi-file-document-multiple" },
          ]
      }
  },
  mounted() {
  }

}
</script>

<style>

</style>