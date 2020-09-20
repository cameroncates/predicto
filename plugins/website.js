import Vue from 'vue'
const path = require('path')
const moment = require('moment')
const mimetype = ["image/jepg", "image/png", "image/jpg", "image/svg+xml"]
import $ from 'jquery'
import PDFJS from 'pdfjs-dist'
Vue.mixin({
    methods:{
        setCookie(name,value,days) {
            value = JSON.stringify(value)
            var expires = "";
            if (days) {
                var date = new Date();
                date.setTime(date.getTime() + (days*24*60*60*1000));
                expires = "; expires=" + date.toUTCString();
            }
            document.cookie = name + "=" + (value || "")  + expires + "; path=/";
        },
        getCookie(name) {
            var nameEQ = name + "=";
            var ca = document.cookie.split(';');
            for(var i=0;i < ca.length;i++) {
                var c = ca[i];
                while (c.charAt(0)==' ') c = c.substring(1,c.length);
                if (c.indexOf(nameEQ) == 0) return JSON.parse(c.substring(nameEQ.length,c.length));
            }
            return null;
        },
        eraseCookie(name) {   
            document.cookie = name+'=; Max-Age=-99999999;';  
        },
        
        format_url(str) {
            if(str.split(" ").length > 1) {
                return str.split(" ").join("-").toLowerCase()
            } else {
                return str.toLowerCase()
            }
        },
        format_sw(sw) {
            sw.path = JSON.parse(sw.path)
            console.log(sw.path, 'path')
            let file_type = sw.path[0].mimetype,
                thumbnail = mimetype.includes(file_type) ? sw.path[0].filename : sw.path[1].filename,
                file = !mimetype.includes(file_type) ? sw.path[0].filename : sw.path[1].filename,
                now = this.date(),
                created = JSON.parse(sw.date),
                start = moment([created.year, created.month, created.day]),
                end = moment([now.year, now.month, now.day]),
                date = start.from(end),
                title = sw.title,
                description = sw.description,
                download = sw.download,
                id = sw.id
            
            return {
                id, date, title, description, thumbnail, file, download
            }
        },
        date_moment(date) {
            let now = this.date(),
                created = JSON.parse(date),
                start = moment([created.year, created.month, created.day]),
                end = moment([now.year, now.month, now.day])
            return start.from(end)
        },
        date() {
            var dateObj = new Date();
            var month = dateObj.getUTCMonth() + 1; //months from 1-12
            var day = dateObj.getUTCDate();
            var year = dateObj.getUTCFullYear();
            return {
                year, month, day
            }
        },
        alertmsg(msg, color="primary") {
            let button = $("<button>")
        
            button.addClass('btn bg-dark-2 bd-round box-shadow pl-4 pr-4 pt-2 pb-2 text-sm animate__animated  animate__fadeInUp animate__faster d-flex align-items-center')
            button.css({
                position: "fixed",
                bottom: "25px", left: "25px"
            })
            button.html(`<span class='material-icons mr-2 text-${color}'>info</span><span class="text-${color}">${msg}</span>`)
            $("body").append(button)
        
            setTimeout(() => {
                button.removeClass("animate__fadeInUp").addClass("animate__zoomOut")
                setTimeout(() => {
                    button.remove()            
                }, 500);
            }, 2000);
        },
        uploadfile() {
            var input=document.createElement('input');
            input.type="file";
            document.body.append(input)
            $(input).addClass("d-none")
            $(input).attr("accept", "application/pdf")
            setTimeout(function() {
                $(input).click();
            }, 100);
            return $(input)
        },
        async getText(typedarray) {

            //PDFJS should be able to read this typedarray content
            const PDFJS = await import('pdfjs-dist/build/pdf');
            const pdfjsWorker = await import('pdfjs-dist/build/pdf.worker.entry');
          
            PDFJS.GlobalWorkerOptions.workerSrc = pdfjsWorker;
            var pdf = PDFJS.getDocument(typedarray);
            return pdf.promise.then(function (pdf) {
                // get all pages text
                var maxPages = pdf._pdfInfo.numPages;
                var countPromises = [];
                // collecting all page promises
                for (var j = 1; j <= maxPages; j++) {
                    var page = pdf.getPage(j);
                    var txt = "";
                    countPromises.push(page.then(function (page) {
                        // add page promise
                        var textContent = page.getTextContent();

                        return textContent.then(function (text) {
                            // return content promise
                            return text.items.map(function (s) {
                                return s.str;
                            }).join(''); // value page text
                        });
                    }));
                }

                // Wait for all pages and join text
                return Promise.all(countPromises).then(function (texts) {
                    return texts.join('');
                });
            });
        },        
        pdfToTxt(e, callback) {
            var $this = this
            var file = $(e.target).prop("files")[0]                
            var fileReader = new FileReader();
             fileReader.onload = function () {
                console.log(this.result)
                var typedarray = new Uint8Array(this.result);
                //calling function to read from pdf file
                $this.getText(typedarray).then(function (text) {
                    callback(text)
                }, 
                function (reason) //Execute only when there is some error while reading pdf file
                {
                    alert('Seems this file is broken, please upload another file');
                    console.error(reason);
                });                      
            }
            fileReader.readAsArrayBuffer(file);
        },
        getChapters(courseContent) {
            let lowercase = courseContent.toLowerCase(),
                maxChapters = 100, cursor = 0, chapters = []
            

            for(let i=1; i<maxChapters; i++) {
                let chapter_end = lowercase.indexOf("chapter " + (i + 1)),
                    chapter_name = lowercase.split("chapter " + i)[1].split(i + ".1 ")[0].trim()
                    
                chapters.push({
                    chapter: i,
                    // content: courseContent.substr(cursor, chapter_end),
                    name: chapter_name,
                    content: lowercase.split(chapter_name)[1].split("chapter " + (i+1))[0]
                })

                if(chapter_end == -1 || chapter_end == 0) {
                    return chapters
                }
                cursor = chapter_end
            }
            return chapters            
        },
        getTopics(c) {
            let { chapter, content } = c

            let topics = []

            let maxTopics = 100, cursor = 0
            for(let i=1; i<maxTopics; i++) {
                let topic_end = content.indexOf(" " + chapter + "." + (i + 1) + " "),
                    topic = content.substring(cursor, topic_end == -1 ? 10000 : topic_end),
                    topic_name = topic.split(chapter + "." + i + ".1")           
                cursor = topic_end

                topics.push({
                    show: true,
                    name: topic_name[0],
                    subtopics: topic_name[1] ? topic_name[1].split(" " + chapter + "." + i) : []
                })

                if(topic_end == -1) {
                    return topics
                }
            }  
            console.log('-------------------------------------------------')
        },
        getSection(paper) {            
            let lowercase = paper.toLowerCase()

            let sectionB = lowercase.split("section c"),
                sectionC = null
            if(sectionB.length == 2) {
                sectionC = sectionB[1]
                sectionB = sectionB[0].split("section b")
                if(sectionB.length == 2) {
                    sectionB = sectionB[1]
                    return [ sectionB, sectionC ]
                }
                else {
                    this.alertmsg("Error Parsing Section B From Paper", "danger")
                    return -1

                }
            }
            else {
                this.alertmsg("Error Parsing Sections From Paper", "danger")
                return -1 
            }
        },
        getQuestions(section) {
            let maxQ = 100, cursor = 0, questions = []
            for(let j=1; j<=maxQ; j++) {
                let Qend = section.indexOf(" " + (j+1) + ". ")
                let q = section.substring(cursor, Qend == -1 ? 10000 : Qend)
                questions.push({ title: q, chapter: "Select Chapter", topics: [], subtopics: [], topic: "Select Topic", subtopic: "Select Subtopic" })
                cursor = Qend

                if(Qend == -1 ) {
                    return questions
                }
            }
        }
    }
})