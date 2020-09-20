<template>
  <div class="h-100 p-4">
      <div class="w-100 d-flex justify-content-center align-items-center flex-wrap">
          <button class="btn btn-block" style="font-size:5rem" @click="uploadBook()">
              <span class="mdi mdi-file-document-multiple text-orange"></span>
          </button>
          <p class="text-md font-gt-america">Upload Past Paper</p>
      </div>
      <hr>
      <div>
          <div>
              <div class="d-flex mb-5 justify-content-end">
                <div class="p-2">
                    <select name="cars" class="custom-select bg-light" v-model="course"  @change="updateChapters()">
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
              <div v-for="(item, i) in questions" :key="i" class="bd-bottom p-5">
                  <h2 class="font-gt-america mb-4">Section {{ sections[i]}}</h2>
                  <div class="pl-4">
                      <div v-for="(q, j) in item" :key="j" class="mt-2 mb-4">
                          <div class="d-flex">
                            <div class="form-group w-100 mr-2">
                                <p class="font-weight-bold mb-1">Question # {{ j + 1 }}</p>
                                <input type="text" class="form-control" v-model="q.title">
                            </div>
                            <div class="form-group ml-2 flex-shrink-0 align-self-end" style="width:100px">
                                <input type="text" class="form-control bd-none bd-radius-0 bd-round bg-light text-center" placeholder="Weight">
                            </div>
                          </div>
                          <div class="d-flex">
                              <div class="p-2" v-if="chapters.length > 0">
                                <select name="cars" class="custom-select" v-model="q.chapter" @change="updateTopics(q)">
                                    <option selected>Select Chapter</option>
                                    <option :value="chap" v-for="(chap, k) in chapters" :key="k">
                                       Chapter # {{ chap.chapter }} - {{ chap.name }}
                                    </option>
                                </select>                              
                              </div>
                              <div class="p-2" v-if="q.topics.length > 0">
                                <select name="cars" class="custom-select" v-model="q.topic" @change=" q.subtopics = q.topic.subtopics">
                                    <option selected>Select Topic</option>
                                    <option :value="{...t, k}" v-for="(t, k) in q.topics" :key="k">
                                       {{ t.name }}      
                                    </option>
                                </select>                              
                              </div>
                              <div class="p-2" v-if="q.subtopics.length > 0">
                                <select name="cars" class="custom-select" v-model="q.subtopic">
                                    <option selected>Select subtopic</option>
                                    <option :value="{...t, k}" v-for="(t, k) in q.subtopics" :key="k">
                                       {{ t }}      
                                    </option>
                                </select>                              
                              </div>
                          </div>
                      </div>
                      <div class="w-100 text-right">
                        <button class="btn bg-orange text-white box-shadow pl-4 pr-4 bd-round" 
                          @click="item.push({ title: 'Create New Question', chapter: 'Select Chapter', topics: [], subtopics: [], topic: 'Select Topic', subtopic: 'Select Subtopic' })">
                              Add new Question
                        </button>
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
            sections: ["B", "C"],
            section: [],
            questions: [],
            books: [],
            chapters: [],
            topics: [], subtopics: [],
            addingBook: false,
            course: "Specify Course",
            class_: "Specify Class"
        }
    },
    methods: {
        updateSubTopic(topic) {

            console.log(topic, 'my topic')
            return
            let c = parseInt(this.class_),
                course = this.course
            if(!Number.isNaN(c) && course != "Specify Course") {
                console.log(this.topics[topic.i], 'subtopics')
                // topic.subtopics = topic[] this.topics[topic.i].subtopics
            }            
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
                this.chapters = this.books[c][course].chapters
                console.log(this.chapters, 'chapters')
            }
        },
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
                this.alertmsg("Condition Added Succsessfully", "success")
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
                this.pdfToTxt(e, (text) => {
                    this.section = this.getSection(text)
                    if(this.section !== -1 && this.section.length == 2) {
                        for(let i=0; i<this.section.length; i++) {
                            this.questions.push(
                                this.getQuestions(this.section[i])
                            )
                        }
                        console.log(this.questions, 'questions')
                    } 
                    else {
                        this.alertmsg("Some Unusual Behaviour Occur", "danger")
                    }
                    // console.log(text, 'text-from paper')


                })
            })
        },        
    },
    mounted() {
        this.firebase_books('books', (res) => {
            this.books = res
            console.log(this.books)
        })
    }
}
</script>

<style>

</style>