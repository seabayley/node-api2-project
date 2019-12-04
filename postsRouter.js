const express = require("express")
const db = require("./data/db")

const router = express.Router()

router.post("/", (req, res) => {
    if ('title' in req.body && 'contents' in req.body) {
        db.insert(req.body)
        .then(data => {
            db.findById(data.id)
            .then(post => res.status(201).json(post))
        })
        .catch(error => {
            console.log(error)
            res.status(500).json({error: "There was an error while saving the post to the database."})
        })
    }
    else {
        res.status(400).json({ errorMessage: "Please provide title and contents for the post." })
    }
})

router.post("/:id/comments", (req, res) => {
    if ('text' in req.body) {
        db.findById(req.params.id)
        .then(post => {
            if (post) {
                db.insertComment({text: req.body.text, post_id: req.params.id})
                .then(id => {
                    db.findCommentById(id)
                    .then(comment => {
                        res.status(201).json({...req.body, post_id: req.params.id})
                    })
                })
                .catch(error => res.status(500).json({error: "There was an error while saving the comment to the database"}))
            }
            else {
                res.status(404).json({message: "The post with the specified ID does not exist."})
            }
        })
    }
    else {
        res.status(400).json({errorMessage: "Please provide text for the comment"})
    }
})

router.get("/", (req, res) => {
    db.find()
    .then(data => {
        res.status(200).json(data)
    })
    .catch(error => res.status(500).json({error: "The posts information could not be retreived"}))
})

router.get('/:id', (req, res) => {
    db.findById(req.params.id)
    .then(post => res.status(200).json(post))
    .catch(err => res.status(404).json({ message: "The post with the specified ID does not exist." }))
})

router.get('/:id/comments', (req, res) => {
    db.findPostComments(req.params.id)
    .then(post => res.status(200).json(post))
    .catch(err => res.status(404).json({ message: "The post with the specified ID does not exist." }))
})

router.delete('/:id', (req, res) => {
    db.findById(req.params.id)
    .then(post => {
        res.status(200).json(post)
        db.remove(req.params.id)
        .catch(err => res.status(500).json({message: "Error deleting the post with the specified ID."}))
    })
    .catch(err => res.status(404).json({message: "The post with the specifid ID does not exist."}))
})

router.put('/:id', (req, res) => {
    if ('title' in req.body && 'contents' in req.body) {
        db.update(req.params.id, req.body)
        .then(post => {
            db.findById(req.params.id)
            .then(post => {
                res.status(200).json(post)
            })
        })
        .catch(err => res.status(404).json({ message: "The post with the specified ID does not exist." }))
    }
    else {
        res.status(400).json({ errorMessage: "Please provide title and conents for the post." })
    }
})

module.exports = router