<template>
  <div>
    <logo color="text-white" />

    <div class="position-absolute" style="top:0px; left:0px; ">
      <div class="w-100 h-100 overflow-hidden">
        <img src="https://images.pexels.com/photos/357514/pexels-photo-357514.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" width="100%" alt=""
          style="filter: brightness(15%) blur(5px)">
      </div>
      
      <div class="position-absolute d-flex w-100 h-100" style="top:0px;left:0px;">
          <div class="align-self-center w-75 mx-auto">
            <div class="pl-4 pt-4 pb-4" style="border-left: 0.5rem solid rgb(246, 89, 54)">
              <h1 class="font-gt-america display-3 animate__animated  animate__fadeInUp animate__faster text-white">
                  Login to your admin Account
              </h1>
              <p class="text-white text-md animate__animated  animate__fadeInUp w-50">
                  If you have forgot your admin login username or password, contact your administrator to rocover your account information
              </p>
            </div>

            <div class="pt-5" style="width:350px">
                <div class="input-group mb-4 p-2 bd-round bg-light">
                    <input type="text" class="form-control bg-none bd-none text-sm bd-round" placeholder="Admin Username" v-model="username">
                </div>
        
                <div class="input-group mb-4 p-2 bd-round bg-light">
                    <input :type="visible ? 'text' : 'password'" class="form-control bg-none bd-none text-sm bd-round" placeholder="Admin Password" v-model="password">
                    <div class="input-group-append">
                        <span @click="visible=!visible" :class="visible ? 'text-orange' : 'text-dark'" class="input-group-text material-icons btn bg-none bd-none">visibility</span>
                    </div>
                </div>                
                
                <div>
                    <button @click="login()" class="btn bg-orange font-weight-bold text-white bd-round pl-4 pr-4">
                      <span v-if="login_in" class="spinner-border spinner-border-sm"></span>
                      <span>Login</span>
                    </button>
                </div>

            </div>



          </div>
      </div>

    </div>
  </div>
</template>

<script>
import logo from "../../components/Logo"
export default {
  components: {
    logo
  },
  data() {
      return {
          visible: false,
          username_: "maheensaleemofficial@gmail.com",
          password_: "projectfyp123",
          login_in: false,
          username: "maheensaleemofficial@gmail.com", password: "projectfyp123"
      }
  },
  methods: {
    login() {
      if(!this.username) {
        this.alertmsg("Enter your username", "info")
        return
      }
      if(!this.password) {
        this.alertmsg("Enter your password", "info")
        return
      }
      this.login_in = true

      if(this.username == this.username_ && this.password == this.password_) {
        this.alertmsg("Verified Successfully", "success")
        setTimeout(() => {
          window.location.href = "/admin/dashboard"
        }, 500);
      }
      else {
        this.login_in = false
        this.alertmsg("Username or Password is Incorrect", "info")
      }


      
    }
  }
}
</script>

<style>
body {
  background: black;
}
</style>