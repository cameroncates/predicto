<template>
    <div class="container m-auto p-5" style="width:750px">
        <div class="w-100 bg-light p-5 bd-radius-5 box-shadow">
            <h2 class=" font-gt-america">Create A New Forum</h2>
            <div class="line"></div>
            <ul>
                <li>Private forums can only be accessible via shared links</li>
                <li>Public forums can be available in the search engine console</li>
                <li>Only the owner of the forum will have the access to delete comments on the forum</li>
            </ul>
            <div class="bd-top w-100 pt-4 pb-0">
                <div class="input-group bg-white p-1 bd-round border">
                    <input type="text" class="form-control bg-none bd-none" placeholder="Title of the forum" v-model="title">
                </div>        
                <div class="p-4">
                    <p><strong>Forum Type</strong></p>
                    <div class="custom-control custom-radio custom-control-inline">
                        <input type="radio" class="custom-control-input" id="customRadio" name="example" v-model="visibility" value="private">
                        <label class="custom-control-label" for="customRadio">Private</label>
                    </div>                
                    <div class="custom-control custom-radio custom-control-inline">
                        <input type="radio" class="custom-control-input" id="customRadio1" name="example" v-model="visibility" value="public">
                        <label class="custom-control-label" for="customRadio1">Public</label>
                    </div>                
                </div>
                <div class="w-100 pt-2 pl-2 pr-2">
                    <textarea class="bg-white w-100 bd-radius-5 p-2 border text-sm" placeholder="A short description of the forum" v-model="description" rows="5"></textarea>
                </div>

                <div class="w-100 text-right pt-4 pl-2 pr-2">
                    <button @click="create()" class="btn text-white bg-orange bd-round pt-2 pb-2 pl-5 pr-5 box-shadow">
                        <span v-if="loading" class="spinner-border spinner-border-sm mr-2"></span>    
                        <span>Create</span>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            loading: false,
            title: null, description: null,
            visibility: null,
            user: null
        }
    },
    methods: {
        create() {
            if(!this.title) {
                this.alertmsg("Enter Forum Title", "danger")
                return
            }
            else if(!this.description) {
                this.alertmsg("Add a short description", "danger")
                return
            }
            else if(!this.visibility) {
                this.alertmsg("Select the forum type", "danger")
                return
            }
            this.loading = true
            let obj = {
                owner: this.user,
                title: this.title,
                description: this.description,
                visibility: this.visibility
            }
            this.firebase_push_db({ ref: `forum` , obj }, (res) => {
                this.alertmsg("Forum Created Succsessfully", "success")
                this.title = this.description = ""
                this.loading = false
            })     


        }
    },
    mounted() {
        let user = this.getCookie("project-predicto-2211")
        if(user) {
            if(user.username) {
                this.user = user
            }
        }
    }
}
</script>

<style>

</style>