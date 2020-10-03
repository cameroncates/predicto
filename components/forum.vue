<template>
<div class="container p-5">
    <div class="pb-5">
        <div class="input-group bg-light p-1 bd-round border m-auto" style="width:650px">
            <div class="input-group-prepend">
                <span class="input-group-text mdi mdi-magnify bg-none bd-none"></span>
            </div>            
            <input @keyup="search()" type="text" class="form-control bg-none bd-none" placeholder="Search for public forums" v-model="keywords">
            <div class="input-group-append" v-if="keywords">
                <span @click="keywords= null" class="btn input-group-text mdi mdi-close-circle bg-none bd-none"></span>
            </div>            
        </div>      
        <br>
        <div v-if="keywords" class="m-auto overflow-auto" style="width:650px;max-height:500px">
            <p>(<span class="text-orange">{{ search_forums.length }}</span>) forums found</p>
            <a :href="'/u/forum/' + sf.key" class="btn p-2 hov bd-bottom btn-block text-left" v-for="(sf, i) in search_forums" :key="i">
                <span class="d-flex justify-content-between text-sm">
                    <span v-html="highlight(sf.title)"></span>
                    <span v-if="sf.comments">
                        <span class="mdi mdi-chat text-orange"></span>
                        <span class="small">({{Object.keys(sf.comments).length}})</span>
                    </span>
                </span>
            </a>
        </div>  
    </div>
    <div v-if="forum_.length > 0">
        <h1 class="font-gt-america">My Forums</h1>
        <p>(<span class="text-orange">{{forum_.length}}</span>) forums found</p>
        <br>
        <div v-for="(item, i) in forum_" :key="i">
            <div class="d-block p-4 hov bd-bottom">
                <a :href="'/u/forum/' + item.key" class="text-dark text-lg font-gt-america">{{ item.title }}</a>
                <p>{{ item.description }}</p>
            </div>
        </div>
    </div>
    <p v-else class="p-5 text-center">
        No Forum Found, try create one!
    </p>
</div>
</template>

<script>
export default {
    data() {
        return {
            keywords: null,
            search_forums: [],
            clone: [],
            forum: [],
            loading: true,
            user: null,
            forum_: []
        }
    },
    methods: {
        highlight(str) {
            return str.split(this.keywords).join("<mark>"+this.keywords+"</mark>")
        },        
        search() {
            if(this.keywords) {
                let $this = this
                this.search_forums = this.clone.filter(function(el) {
                    return el.title.includes($this.keywords) && el.visibility == "public"
                })                
            }
        }
    },
    mounted() {
        this.user = this.getCookie('project-predicto-2211')
        this.firebase_get('forum', (res) => {
            this.forum = res
            this.search_forums = res
            this.clone = JSON.parse(JSON.stringify(res))
            for(let i=0; i<this.forum.length; i++) {
                if(this.forum[i].owner.username == this.user.username) {
                    this.forum_.push(this.forum[i])
                }
            }

            console.log(this.forum_, this.user, 'forum')
            this.loading = false
        })        
    }
}
</script>

<style>

</style>