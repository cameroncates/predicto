<template>
  <div class="h-100 p-4">
      <div class="w-100 d-flex justify-content-center align-items-center flex-wrap">
          <button class="btn btn-block" style="font-size:5rem" @click="uploadBook()">
              <span class="mdi mdi-book-plus text-orange"></span>
          </button>
          <p class="text-md font-gt-america">Upload Book Content</p>
      </div>
      <hr>
      <div>
          <p v-if="chapters.length == 0 && books.length == 0 && loading" class="p-5 text-sm text-center">
            <span class="spinner-border spinner-border-sm mr-2 text-orange"></span> <br>
            <span>Loading</span>
          </p>
          <p v-if="chapters.length == 0 && books.length == 0 && !loading" class="p-5 text-sm text-center">
              Book Preview will be show here
          </p>
          <div v-if="chapters.length == 0">
              <div v-for="(book, j) in books" :key="j" class="mb-5 hov p-4">
                  <h1 class="font-gt-america text-center">Course Content of Class {{ book["Computer Science"] ? book['Computer Science'].class : book['Pakistan Studies'].class }}</h1>

                <div v-if="book['Computer Science']">
                    <h5 class="font-gt-america">Computer Sciene</h5>
                    <div v-for="(item, i) in book['Computer Science'].chapters" :key="i" class="pl-5">
                        <p class="bd-bottom text-sm hov p-2 mb-0">Chapter {{ i + 1}} - <span> {{ item.name.toUpperCase() }}</span> </p>
                    </div>                    
                </div>    

                <div v-if="book['Pakistan Studies']">
                    <h5 class="font-gt-america mt-4">Pakistan Studies</h5>
                    <div v-for="(item, i) in book['Pakistan Studies'].chapters" :key="i+0.5" class="pl-5">
                        <p class="bd-bottom text-sm hov p-2 mb-0">Chapter {{ i + 1}} - <span> {{ item.name.toUpperCase() }}</span> </p>
                    </div>                    
                </div>                                  

                    <hr style="border-top:3px solid black">

              </div>
          </div>
          <div v-else>
              <div class="d-flex mb-5 justify-content-end">
                <div class="p-2">
                    <select name="cars" class="custom-select bg-light" v-model="course">
                        <option selected>Specify Course</option>
                        <option value="Computer Science">Computer Science</option>
                        <option value="Pakistan Studies">Pakistan Studies</option>
                    </select>
                </div>
                <div class="p-2">
                    <select name="cars" class="custom-select bg-light" v-model="class_">
                        <option selected>Specify Class</option>
                        <option value="9">9th Class</option>
                        <option value="10">10th Class</option>
                        <option value="11">1st Year</option>
                        <option value="12">2nd Year</option>
                    </select>                                  
                </div>
              </div>
              <div v-for="(item, i) in chapters" :key="i" class="bd-bottom p-5 hov">
                  <h2 class="font-gt-america">Chapter {{ i + 1}} - <span contenteditable="true"> {{ item.name.toUpperCase() }}</span> </h2>
                  <div class="pl-4">
                      <div v-for="(topic, j) in item.topics" :key="j" class="mt-2">
                          <p class="font-weight-bold pb-2 bd-bottom" contenteditable="true">
                                {{ topic.name.toUpperCase() }}                              
                              <!-- <span @click="addNewSubtopic(i, j)" class="btn mdi mdi-plus ml-2 bd-round text-orange  text-md btn-hov"></span> -->
                          </p>
                          <div class="pl-4">
                              <p contenteditable="true" class="hov p-2 mb-0" v-for="(subtopic, k) in topic.subtopics" :key="k">{{subtopic}}</p>
                          </div>
                      </div>
                  </div>
              </div>

              <div class="w-100 text-right p-4">
                  <button @click="addBook()" class="btn bg-orange box-shadow text-white pl-4 pr-4 bd-round">
                        <span v-if="addingBook" class="spinner-border spinner-border-sm mr-2"></span>    
                        <span>Add Book</span>
                  </button>
              </div>
          </div>
      </div>
  </div>
</template>

<script src="https://mozilla.github.io/pdf.js/build/pdf.js"></script>
<script>
import $ from 'jquery'
import PDFJS from 'pdfjs-dist'
export default {
    data() {
        return {
            books: [],
            chapters: [],
            addingBook: false,
            loading: true,
            course: "Specify Course",
            class_: "Specify Class"
        }
    },
    methods: {
        addBook() {

            if(!this.course || this.course == "Specify Course") {
                this.alertmsg("Please choose Course", "danger")
                return
            }
            if(!this.class_ || this.class_ == "Specify Class") {
                this.alertmsg("Please choose Class", "danger")
                return
            }

            this.addingBook = true
            let obj = {
                course: this.course,
                class: this.class_,
                chapters: this.chapters
            }
            let test = "ABCD"
            this.firebase_put_db({ ref: `books/${this.class_}`, child: this.course , obj }, (res) => {
                this.alertmsg("Book Added Succsessfully", "success")
                location.reload()
            })            
        },
        addNewSubtopic(i, j) {
            this.chapters[i].topics[j].subtopics.push("New Topic")
        },
        uploadBook() {
            let upload = this.uploadfile()
            let $this = this
            upload.change((e) => {
                this.pdfToTxt(e, (courseContent) => {

                    this.chapters = this.getChapters(courseContent)
                    
                    for(let i=0; i<this.chapters.length; i++) {
                        this.chapters[i]["topics"] = this.getTopics(this.chapters[i])
                    }
              

                })
            })
        },        
    },
    mounted() {
        this.firebase_books('books', (res) => {
            this.books = res
            console.log(this.books, 'books')
            this.loading = false
        })
    }
}
</script>

<style>

</style>