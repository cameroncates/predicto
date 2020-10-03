<template>
  <div class="h-100 p-4">
      <div>
          <div>
            <h1 class="mb-4 font-gt-america w-100">Pre Requirements</h1>
              <div class="d-flex">
                <div class="p-2">
                    <select class="custom-select bg-light" v-model="course"  @change="updateChapters()">
                        <option selected>Specify Course</option>
                        <option value="Computer Science">Computer Science</option>
                        <option value="Pakistan Studies">Pakistan Studies</option>
                    </select>
                </div>
                <div class="p-2">
                    <select name="cars" class="custom-select bg-light" v-model="class_" @change="updateChapters()">
                        <option selected>Specify Class</option>
                        <option value="0">9th Class</option>
                        <option value="1">10th Class</option>
                        <option value="2">1st Year</option>
                        <option value="3">2nd Year</option>
                    </select>                                  
                </div>
              </div>       
                <hr>
                <br>
                <div class="form-group ml-2 d-flex align-items-center" v-for="(q, i) in questions" :key="i">
                    <input type="text" class="form-control bg-light m-2" :placeholder="q.placeholder" v-model="q.title">
                    <select class="custom-select bg-light m-2" style="width:160px" v-model="q.section">
                        <option selected>Section</option>
                        <option value="0">Section B</option>
                        <option value="1">Section C</option>
                    </select>        
                    <div class="p-2">
                        <select name="cars" class="custom-select bg-light" v-model="q.chapter" @change="q.topics = q.chapter.topics">
                            <option selected>Select Chapter</option>
                            <option :value="chap" v-for="(chap, k) in q.chapters" :key="k">
                                Chapter # {{ chap.chapter }} - {{ chap.name }}
                            </option>
                        </select>        
                    </div>
                    <div class="p-2">
                        <select name="cars" class="custom-select bg-light" v-model="q.topic" @change="q.subtopics = q.topic.subtopics">
                            <option selected>Select Topic</option>
                            <option :value="topic" v-for="(topic, k) in q.topics" :key="k">
                                {{ topic.name }}
                            </option>
                        </select>        
                    </div>     
                    <div class="p-2">
                        <select name="cars" class="custom-select bg-light" v-model="q.subtopic">
                            <option selected>Select Subtopic</option>
                            <option :value="subtopic" v-for="(subtopic, k) in q.subtopics" :key="k">
                                {{ subtopic }}
                            </option>
                        </select>        
                    </div>     

                    <input type="text" class="form-control bd-round text-center bg-light m-2" style="width:100px" placeholder="Weight" v-model="q.weight">
                </div>
                <div class="w-100 text-right">
                  <button @click="questions.push({title: '', placeholder: 'Add Question #' + (questions.length + 1), section: 'Section' , weight: '0'}), assignChapters()" class="btn text-orange pl-4 pr-4 bd-round btn-hov p-2">
                        <span>Add New Question</span>
                  </button>

                </div>
            

              <div class="w-100 p-4" v-if="questions.length > 1">
                  <button @click="upload()" class="btn btn-block bg-orange box-shadow text-white pl-4 pr-4 bd-round">
                        <span v-if="loading" class="spinner-border spinner-border-sm mr-2"></span>    
                        <span>Upload Paper</span>
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
            loading: false,
            questions: [    
                { title: "", placeholder: "Add Question #1", section: "Section" , weight: "0", topic: "Select Topic", subtopic: "Select Subtopic", topics: [], subtopics: [], chapter: "Select Chapter", chapters: [] }                
            ],
            classes: [9, 10, 11, 12],
            books: [],
            chapters: [],
            topics: [], subtopics: [],
            course: "Specify Course",
            class_: "Specify Class",
            chapter: "Select Chapter",
            topic: "Select Topic", 
            subtopic: "Select Subtopic",
        }
    },
    methods: {
        upload() {

            this.loading = true
            let obj = {
                course: this.course,
                class: this.classes[parseInt(this.class_)],
                sections: {}
            }
            let sections = [[], []]

            for(let i=0; i<this.questions.length; i++) {
                let s = parseInt(this.questions[i].section)
                sections[s].push({
                    title: this.questions[i].title,
                    topic: this.questions[i].topic,
                    subtopic: this.questions[i].subtopic,
                    topics: this.questions[i].topics,
                    subtopics: this.questions[i].subtopics,
                    chapter: this.questions[i].chapter,
                })
            }
            obj.sections = sections
            this.firebase_push_db({ ref: `pastpapers/${obj.class}/${obj.course}` , obj }, (res) => {
                this.alertmsg("Paper Added Successfully", "success")
                this.loading = false
                setTimeout(() => {
                    // location.reload()                
                }, 1000);
            })    
        },
        updateTopics(chap) {
            let c = parseInt(this.class_),
                course = this.course
            if(!Number.isNaN(c) && course != "Specify Course") {
                chap.topics = this.books[c][course].chapters[chap.chapter.chapter-1].topics
            }

        },
        updateChapters() {
            let c = parseInt(this.class_),
                course = this.course
            if(!Number.isNaN(c) && course != "Specify Course") {
                if(this.books[c]) {
                    if(this.books[c][course]) {
                        this.chapters = this.books[c][course].chapters
                    }
                    else {
                        this.alertmsg("Book Content of course " + course + " may not be available", "danger")
                    }

                }
                else {
                    this.alertmsg("Book Content of class " + this.classes[c] + " may not be available", "danger")
                    setTimeout(() => {
                        this.alertmsg("Please upload the Book Content of all classes first", "info")
                        
                    }, 3000);
                }
                this.assignChapters()
            }
        },
        assignChapters() {
            for(let i=0; i<this.questions.length; i++) {
                this.questions[i].chapters = this.chapters
            }
        }
    },
    mounted() {
         this.firebase_books('books', (res) => {
            this.books = res
            console.log(this.books, 'my books')
        })
    }
}
</script>

<style>

</style>