<template>
<div class="w-100 h-100 d-flex flex-wrap">
    <div class="w-100">
        <logo color="text-black" />
    </div>
    <div class="container mt-5">
        <div class="w-100 align-items-center d-flex justify-content-end mb-4">
            <button class="p-2 btn text-sm mr-2">Share Via</button>
            <div class="input-group bg-light bd-round" style="width:450px">
                <div class="input-group-prepend">
                <span class="input-group-text mdi mdi-link bg-none bd-none"></span>
                </div>
                <input type="text" class="form-control bg-none bd-none text-sm" placeholder="Forum Link" v-model="url" @click="$event.target.select();"> 
            </div>
        </div>

        <div class="d-flex">
            <div class="w-50">
                <a href="javascript:void()" class="display-4 text-dark font-gt-america">{{ forum.title }}</a>
                <div class="line"></div>
                <p>{{ forum.description }}</p>
                <p class="text-orange text-capitalize" v-if="forum.owner"><i>By {{ forum.owner.username }}</i></p>
            </div>
            <div class="w-50 text-right p-5"></div>
        </div>
        <br>
        <hr>
        <div>
            <!-- <h1 class="font-gt-america">Comments!</h1> -->
            <p class="text-sm p-5 text-sm text-center" v-if="comments.length == 0 && !loading"> 
                <span class="mdi mdi-chat-remove text-orange" style="font-size:5rem"></span> <br>
                <span>No Comments, Be the first one to write your comment</span>
            </p>
            <p v-else-if="loading" class="p-5 text-sm text-center">
                Please wait...
            </p>
            <div v-else class="bg-light mt-5 bd-radius-5">
                <p class="text-right p-4"> <span class="mdi mdi-chat"></span> {{ comments.length }} comments</p>
                <div v-for="(c, i) in comments" :key="i" class="pl-4 pr-4 pt-3 pb-3 hov bd-bottom">
                    <div class="hov-opacity-1">
                        <div class="w-100 text-right pb-2" v-if="c.user.username == user.username">
                            <button @click="remove(c)" class="btn btn-danger mdi mdi-delete bd-round mdi-24px opacity-0 transition dropdown-btn"></button>
                        </div>
                        <p class="text-sm" v-html="c.comment"></p>
                        <div class="w-100 text-right pt-2">
                            <p class="m-1">Posted {{ c.date }}</p>
                            <h6 class="font-gt-america m-1 text-capitalize text-orange">By {{c.user.username}}</h6>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <br><br>
        <div class="w-50 mt-5 mb-5 d-flex align-items-end">
            <textarea v-model="comment" class="w-100 flex-shrink-0 bg-light box-shadow bd-radius-5 p-4" placeholder="Write a comment..." id="" cols="30" rows="10" required></textarea>
            <button @click="post_comment()" class="btn flex-shrink-0 ml-4 bg-orange text-white pl-4 pr-4 bd-round box-shadow">Post Comment</button>
        </div>
    </div>

</div>
</template>

<script>
import logo from "../../../components/Logo"
export default {
  components: {
    logo,
  },    
  data() {
      return {
          loading: true,
          url: null,
          user: null,
          id: null,
          forum: {},
          comments: [],
          comment: null
      }
  },
  methods: {
      remove(item) {
          let ref = 'forum/' + this.id + '/comments/' + item.key
          this.firebase_remove_one(ref, (res) => {
              location.reload()
          })
      },
      post_comment() {
          if(!this.comment) {
              this.alertmsg("Comment should not be empty", "danger")
              return
          }
          if(this.comment.split("\n").length > 1) {
              this.comment = this.comment.split("\n").join("<br>")
          }
          let ref = '/forum/'+this.id + '/comments',
              obj = {
                  user: this.user,
                  comment: this.comment,
                  date: this.mydate()
              }              
          this.firebase_push_db({ref, obj}, (res) => {
              this.alertmsg("Comment Added Successfully", "success")
              this.comment = null
              location.reload()
          })
      }
  },
  mounted() {
      this.id = this.$route.params.id 
      this.firebase_get_one('forum/' + this.id, (res) => {
          this.forum = res
      })

      this.firebase_get('forum/'+ this.id + '/comments', res => {
          if(res) {
              this.comments = res
          }
          this.loading = false
      })
    this.url = window.location.href
    this.user = this.getCookie('project-predicto-2211')
    if(!this.user) {
        window.location.href = '/signup'
    }
  }

}
</script>

<style>

</style>