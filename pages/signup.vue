<template>
  <div>
    <logo color="text-white" />

    <div class="position-absolute" style="top:0px; left:0px; ">
      <div class="w-100 h-100 overflow-hidden">
        <img src="https://images.pexels.com/photos/810775/pexels-photo-810775.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" width="100%" alt=""
          style="filter: brightness(15%) blur(5px)">
      </div>
      
      <div class="position-absolute d-flex w-100 h-100" style="top:0px;left:0px;">
          <div class="align-self-center w-75 mx-auto">
            <div class="pl-4 pt-4 pb-4" style="border-left: 0.5rem solid rgb(246, 89, 54)">
              <h1 class="font-gt-america display-3 animate__animated  animate__fadeInUp animate__faster text-white">
                  Create a free Account to Continue
              </h1>
              <p class="text-white text-md animate__animated  animate__fadeInUp w-50">
                  If you already have created your account in Predicto, then login to that account instead.
              </p>
            </div>

            <div class="pt-5" style="width:350px">
                <div class="input-group mb-4 p-2 bd-round bg-light">
                    <input type="text" class="form-control bg-none bd-none text-sm bd-round" placeholder="Username" v-model="username">
                </div>
        
                <div class="input-group mb-4 p-2 bd-round bg-light">
                    <input :type="visible ? 'text' : 'password'" class="form-control bg-none bd-none text-sm bd-round" placeholder="Password" v-model="password">
                    <div class="input-group-append">
                        <span @click="visible=!visible" :class="visible ? 'text-orange' : 'text-dark'" class="input-group-text material-icons btn bg-none bd-none">visibility</span>
                    </div>
                </div>                
                
                <div>
                    <button @click="signup()" class="btn bg-orange font-weight-bold text-white bd-round pl-4 pr-4">
                      <span v-if="signup_in" class="spinner-border spinner-border-sm"></span>
                      <span>Signup</span>
                    </button>
                    <button @click="signin()" class="btn font-weight-bold text-orange bd-round pl-4 pr-4">
                      <span>Signin Instead</span>
                    </button>
                </div>

            </div>



          </div>
      </div>

    </div>
  </div>
</template>

<script>
import logo from "../components/Logo"
export default {
  components: {
    logo
  },
  data() {
      return {
          visible: false,
          username_: "",
          password_: "",
          signup_in: false,
          username: "", password: ""
      }
  },
  methods: {
    signin() {
        location.href = "/login"
    },
    signup() {
        if(!this.username) {
            this.alertmsg("Enter your username", "info")
            return
        }
        if(!this.password) {
            this.alertmsg("Enter your password", "info")
            return
        }
        this.signup_in = true
        
        this.userexists(this.username, (e) => {
            if(e) {
                this.alertmsg("Username is already taken", "danger")
            }
            else {
                this.alertmsg("Creating user...", "success")
                this.firebase_push_db({ ref: `users` , obj: { username: this.username, password: this.password } }, (res) => {
                    this.alertmsg("User Created Succsessfully", "success")
                    this.setCookie("project-predicto-2211", { username: this.username, password: this.password })
                    setTimeout(() => {
                        location.href = "/u/"                    
                    }, 1000);
                })     
            }
            this.signup_in = false
        })      
    }
  }
}
</script>

<style>
body {
  background: black;
}
</style>