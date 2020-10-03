<template>
  <div class="h-100 p-4">
      <div>
          <p v-if="papers.length == 0 && loading" class="p-5 text-sm text-center">
            <span class="spinner-border spinner-border-sm mr-2 text-orange"></span> <br>
            <span>Loading</span>
          </p>
          <p class="small text-center p-5" v-if="!loading && papers.length == 0">
              No Papers found
          </p>
          <div v-else>
              <div v-for="(cls, i) in papers" :key="i" class="bd-bottom p-5">
                  <h2 class="font-gt-america">Class {{ classes[i] }}</h2>
                  <div class="pl-4" v-for="(courses, j) in cls" :key="j">
                      <div v-if="j != 'key'">
                        <p class="font-weight-bold mb-0 text-orange"> &nbsp; {{ j }}</p>
                        <div class="ml-5 mt-2 pt-2 pb-2 bd-bottom" v-for="(paper, k, count) in courses" :key="k">
                            <h4 class="font-weight-bold font-gt-america">Paper {{ count + 1 }}</h4>
                            <div class="ml-4" v-for="(section, l) in paper.sections" :key="l">
                                <p class="mb-0 font-weight-bold">Section {{ sections[l] }}</p>
                                <div class="ml-4" v-for="(chapter, b) in section" :key="b">
                                    <p class="mt-2 mb-0" v-if="chapter.chapter.chapter">Chapter # {{ chapter.chapter.chapter }} - {{ chapter.chapter.name.toUpperCase() }}</p>
                                </div>
                                <div class="ml-4 mt-2">
                                    <h6 class="font-weight-bold"><i>Questions</i></h6>
                                    <p class="mb-1 text-sm" v-for="(question, c) in section" :key="c">{{ question.title }}</p>
                                </div>
                                <br>
                            </div>
                        </div>

                      </div>
                  </div>
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
            sections: ['A', 'B'],
            classes: [9, 10, 11, 12],
            papers: [],
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
            this.firebase_put_db({ ref: `papers/${this.class_}`, child: this.course , obj }, (res) => {
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
                this.pdfToTxt(e, (courseContent) => {

                    this.chapters = this.getChapters(courseContent)
                    
                    for(let i=0; i<this.chapters.length; i++) {
                        this.chapters[i]["topics"] = this.getTopics(this.chapters[i])
                    }
              
                    console.log(this.chapters, 'my chapters')

                })
            })
        },        
    },
    mounted() {
        this.firebase_get('pastpapers', (res) => {
            this.papers = res
            console.log(this.papers, 'my papers')
            this.loading = false
        })
    }
}
</script>

<style>

</style>