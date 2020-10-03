import Vue from 'vue'
const path = require('path')
const moment = require('moment')
const mimetype = ["image/jepg", "image/png", "image/jpg", "image/svg+xml"]
import $ from 'jquery'
import PDFJS from 'pdfjs-dist'
Vue.mixin({
    methods:{
        dropdown(list, e) {
            let container = $("<div>"),
                timeout = null,
                buttons = []
            container.addClass("bg-white box-shadow pt-2 pb-2 animate__animated  animate__fadeIn animate__faster bd-radius-5")
            container.css({
                width: "200px",
                position:"absolute",
                left: "0px",
                top: "0px",
                zIndex: 10000
            })
            for(let i=0; i<list.length; i++) {
                let button = $("<a>"),
                    href = null
        
                button.addClass("btn text-sm bg-white btn-hov d-flex align-items-center text-left pl-3 pr-2 mt-0 btn-block animate__animated  animate__fadeInUp animate__faster")
        
                button.attr("href", 'javascript:void(0)')
                button.html('<span class="mr-2 mdi mdi-24px '+list[i].icon+'"></span>' + list[i].title)
                container.append(button)
                buttons.push(button)
            }
            container.mouseleave(() => {
                timeout = setTimeout(() => {
                    container.remove()
                }, 500);
            })
            container.mouseenter(() => clearTimeout(timeout))
            $(window).click((e) => {
                if(e.target.parentNode != container[0] && !$(e.target).hasClass('dropdown-btn') && e.target !== container[0]) {
                    container.remove()
                }
            })
        
            $(window).resize(() => container.remove())
            let top = $(e.currentTarget).offset().top,
                left = $(e.currentTarget).offset().left,
                w = $(window).width(),
                h = $(window).height(),
                w_ = $(container).width(),
                h_ = $(container).height()
        
            if(top+h_ > h) {
                container.css({
                    top: (h - h_ - 10) + 'px'
                })
            } else {
                container.css({
                    top: (top + 10) + 'px'
                })
            }
            if(left+w_ > w) {
                container.css({
                    left: (w - w_ - 10) + 'px'
                })
            } else {
                container.css({
                    left: (left) + 'px'
                })
            }
        
            $("body").append(container)
        
            return buttons
        },
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
        mydate() {
            var today = new Date();
            var dd = String(today.getDate()).padStart(2, '0');
            var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
            var yyyy = today.getFullYear();
            
            today = mm + '/' + dd + '/' + yyyy;
            return today
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
        filetype(e) {
            return e.target.files[0].type
        },
        handleImage(e, callback){
            var reader = new FileReader();
            reader.onload = function(event){
                var img = new Image();
                img.onload = function(){
                    let canvas = document.createElement("canvas"),
                        ctx = canvas.getContext("2d")
                    canvas.width = img.width;
                    canvas.height = img.height;
                    ctx.drawImage(img,0,0);
                    callback(canvas)
                }
                img.src = event.target.result;
            }
            reader.readAsDataURL(e.target.files[0]);     
        },        
        uploadfile(accept = "application/pdf") {
            var input=document.createElement('input');
            input.type="file";
            document.body.append(input)
            $(input).addClass("d-none")
            $(input).attr("accept", accept)
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
        getSectionImg(paper) {
            let lowercase = paper.toLowerCase()
            let sectionB = lowercase.split(" q. 2 "),
                sectionC = null
            let split = " q.3 "
            if(sectionB.length == 1) {
                sectionB = lowercase.split("q.2")
            }
            return this.mysections(sectionB[1].split("\n"))
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
        mysections(q) {
            for(let i=0; i<q.length; i++) {
                if(i > 0) {
                    if(q[i].includes("attempt any") || 
                        q[i].includes("q.3") || 
                        q[i].includes("q. 3") || 
                        q[i].includes("section - c") ||
                        q[i].includes("section ~ c")) {
                        let sectionA = q.slice(0, i - 1),
                            sectionB = q.slice(i, 10000)
                            return [sectionA, sectionB]
                    }
                }
            }
            return -1
        },
        getQuestions(section) {
            let maxQ = 100, cursor = 0, questions = []
            for(let j=1; j<=maxQ; j++) {
                let Qend = section.indexOf(" " + (j+1) + ". ")
                let q = section.substring(cursor, Qend == -1 ? 10000 : Qend)
                questions.push({ title: q, chapter: "Select Chapter", topics: [], subtopics: [], topic: "Select Topic", subtopic: "Select Subtopic", weight: 10 })
                cursor = Qend

                if(Qend == -1 ) {
                    return questions
                }
            }
        }
    }
})