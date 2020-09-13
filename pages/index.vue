<template>
  <div>
    <logo color="text-white" />

    <div class="position-absolute" style="top:0px; left:0px; ">
      <div class="w-100 h-100 overflow-hidden">
        <img src="https://images.pexels.com/photos/2058147/pexels-photo-2058147.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" width="100%" alt=""
          style="filter: brightness(15%) blur(5px)">
      </div>
      
      <div class="position-absolute d-flex w-100 h-100 border" style="top:0px;left:0px;">
          <div class="align-self-center w-75 mx-auto">
            <div class="pl-4 pt-4 pb-4" style="border-left: 0.5rem solid rgb(246, 89, 54)">
              <h1 class="font-gt-america display-3 animate__animated  animate__fadeInUp animate__faster text-white">Ready For the Next Big Thing ?</h1>
              <p class="text-white text-md animate__animated  animate__fadeInUp w-50">The time has changed, for the first time in history, <b class="font-dancing-script text-md hov-orange">Predicto</b> brings you the past papers generator tool. 
                  It's time to ease the learning.
              </p>

            </div>
            <div class="mt-5 ml-4">
              <nuxt-link to="/signup" class="btn animate__animated  animate__zoomIn  text-white box-shadow bd-round pl-4 pr-4 pt-3 pb-3 bg-orange">Create a FREE Account</nuxt-link to="/login">
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
  }
}
</script>

<style>
body {
  background: black;
}
</style>