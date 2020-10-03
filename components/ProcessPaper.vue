<template>
  <div class="h-100 p-4">
      <div class="w-100 d-flex justify-content-center align-items-center flex-wrap">
          <button class="btn btn-block" style="font-size:5rem" @click="uploadBook()">
              <span class="mdi mdi-file-document-multiple text-orange"></span>
          </button>
          <div class="text-center">
            <p class="m-0 text-md font-gt-america">Upload Your Paper</p>
            <p class="small"><strong>Formats:</strong> <i>.pdf, .jpg, .png</i></p>
          </div>
      </div>
      <hr>
      <div>
          <div>
              <div class="p-5" v-if="questions.length < 1 && !loading">
                <h4 class="pb-2">Info</h4>
                <ul class="text-sm">
                    <li>Uploading a paper in pdf format will be directly processed and on the basis of that, pastpapers will be generated</li>
                    <li>If paper is been uploaded in .jpg (image) format, text will be first extracted from the paper and will be previewed and after 
                        that, paper will be generated.
                    </li>
                    <li>Text extracted from image will be highly depends upon the quality of the image.</li>
                </ul>
              </div>
              <p v-if="loading" class="text-center p-5">
                    <span class="spinner-border spinner-border-sm mb-2 text-orange"></span>   
                    <br> 
                  {{ parseInt(progress*100) }}% Processed
              </p>
              <div class="d-flex">
                <div v-for="(item, i) in questions" :key="i" class="bd-bottom p-5 w-50">
                    <h2 class="font-gt-america mb-4">Section {{ sections[i]}}</h2>
                    <div class="pl-4">
                        <div v-for="(q, j) in item" :key="j">
                                <div class="form-group w-100 bd-bottom hov m-0">
                                    <input v-if="q.title" type="text" class="bd-none text-sm form-control bg-none" v-model="q.title">
                                </div>
                        </div>
                    </div>
                </div>
              </div>

              <div class="w-100 text-right p-4" v-if="chapters.length > 0">
                  <button @click="addBook()" class="btn bg-orange box-shadow text-white pl-4 pr-4 bd-round">
                        <span v-if="addingPaper" class="spinner-border spinner-border-sm mr-2"></span>    
                        <span>Add Paper</span>
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
import Tesseract from 'tesseract.js';

export default {
    data() {
        return {
            progress: 0,
            sections: ["B", "C"],
            classes: [9, 10, 11, 12],
            section: [],
            questions: [],
            books: [],
            chapters: [],
            topics: [], subtopics: [],
            addingPaper: false,
            loading: false,
            course: "Specify Course",
            class_: "Specify Class"
        }
    },
    methods: {
        addBook() {
            this.addingPaper = true
            let obj = {
                course: this.course,
                class: this.classes[parseInt(this.class_)],
                sections: this.questions,
            }
            this.firebase_push_db({ ref: `pastpapers/${obj.class}/${obj.course}` , obj }, (res) => {
                this.alertmsg("Paper Added Successfully", "success")
                this.addingPaper = false
                setTimeout(() => {
                    location.reload()                
                }, 1000);
            })            
        },
        addNewSubtopic(i, j) {
            this.chapters[i].topics[j].subtopics.push("New Topic")
        },
        processImg(e) {
            this.handleImage(e, (canvas) => {
                this.loading = true
                Tesseract.recognize(
                    canvas,
                    'eng',
                    { logger: m => {
                        this.progress = m.progress
                    } })
                    .then(({ data: { text } }) => {
                        console.log(text.split("\n"))
                        this.section = this.getSectionImg(text)
                        if(this.section.length > 1) {
                            for(let i=0; i<this.section.length; i++) {
                                this.questions.push([])
                                for(let j=0; j<this.section[i].length; j++) {
                                    this.questions[i].push({
                                        title: this.section[i][j]
                                    })
                                }
                            }
                            this.loading = false
                        }
                        else {
                            this.alertmsg("cannot parse sections", "warning")
                        }
                    })
            })
        },
        uploadBook() {
            let upload = this.uploadfile("*")
            let $this = this
            upload.change((e) => {
                let type = this.filetype(e)
                if(type == "image/jpeg" || type == "image/png") {
                    this.alertmsg("You have uploaded Image", "info")
                    this.processImg(e)
                    return
                }
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