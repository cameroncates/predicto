import Vue from 'vue'
import { auth, db, storage } from '@/services/firebase'

Vue.mixin({
    methods:{
        async firebase_insert_storage({ ref, file }, callback) {
            storage.ref(ref).put(file).then(function(snapshot) {
                snapshot.ref.getDownloadURL()
                .then(url => {
                    callback(url)
                })
                .catch(err => console.log(err, 'firebase_insert_storage err.'))
            })
        },
        async firebase_push_db({ref, obj }, callback) {
            db.ref(ref).push(obj)
            .then((snapshot) => {
                console.log(snapshot, 'snapshot')
                callback(snapshot)
            })
            .catch(err => console.log(err))
        },
        async firebase_put_db({ref, child, obj }, callback) {
            db.ref(ref).child(child)
            .set(obj)
            .then((snapshot) => {
                console.log(snapshot, 'snapshot')
                callback(snapshot)
            })
        },
        async signup_with_email_password(email, password, callback) {
            await auth.createUserWithEmailAndPassword(email, password).then((user) => {
                callback({ login: true, uid: user.user.uid})
            })
            .catch(err => {
                callback(err.message)
            })

        },        
        async signin_with_email_password(email, password, callback) {
            await auth.signInWithEmailAndPassword(email, password)
            .then(res => {
                callback(res, true)
            })
            .catch(err => {
                callback(err.message, false)
            })
        },   
        firebase_get_one(ref, callback) {
            db.ref(ref).on('value', (snapshot) => {
                if(snapshot.val()) {
                    let item = snapshot.val()
                    callback(item)    
                } else {
                    callback(null)
                }
            })
        },
        firebase_remove_one(ref, callback) {
            db.ref(ref).remove()
            .then(res => {
                callback(res)
            })
        },
        firebase_get(ref, callback) {
            let array = [],
                $this = this
            db.ref(ref).on('value', (snapshot) => {
                snapshot.forEach(function(item) {
                    let key = item.key
                    item = item.val()
                    array.push({...item, key})
                })
                callback(array)
            })
        },
        userexists(username, callback) {
            let exists = false
            db.ref('/users').on('value', (snapshot) => {
                snapshot.forEach(function(item) {
                    let u = item.val()
                    if(u.username == username) {
                        exists = true
                    }
                })
                callback(exists)
            })
        },
        loggedin({ u, p }, callback) {
            let exists = false
            db.ref('/users').on('value', (snapshot) => {
                snapshot.forEach(function(item) {
                    let user = item.val()
                    if(user.username == u && user.password == p) {
                        exists = true
                    }
                })
                callback(exists)
            })

        },
        firebase_books(ref, callback) {
            let array = [],
                $this = this
            db.ref(ref).on('value', (snapshot) => {
                snapshot.forEach(function(item) {
                    item = item.val()
                    array.push(item)
                })
                callback(array)
            })
        },
    }
})