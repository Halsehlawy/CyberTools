const express = require('express')
const router = express.Router()
const Tool = require('../models/tool')
const mongoose = require('mongoose')
const isSignedIn = require('../middleware/is-signed-in')

// Show new tool form
router.get('/new', isSignedIn, (req, res) => {
    res.render('tools/new.ejs')
})

// Post new tool to database
router.post('/', isSignedIn, async(req, res) => {
    try {
        req.body.publishedBy = req.session.user._id
        await Tool.create(req.body)
        res.redirect('/tools/')
    }
    catch(error){
        console.log(error)
        res.send('Something went wrong')
    }
})

// Show tool details
router.get('/:toolId', async (req, res) => {
    try {
        const foundTool = await Tool.findById(req.params.toolId).populate('publishedBy')
        res.render('tools/show.ejs', {foundTool:foundTool})
    }
    catch(error){
        console.log(error)
        res.send('Something went wrong')
    }
})

// Show all tools
router.get('/', async (req, res) => {
    const foundTools = await Tool.find().populate('publishedBy')
    res.render('tools/index.ejs', { foundTools: foundTools })
})

// Show edit tool form
router.get('/:toolId/edit', async (req, res) => {
    const foundTool = await Tool.findById(req.params.toolId).populate('publishedBy')
    if (foundTool.publishedBy._id.equals(req.session.user._id)) {
        return res.render('tools/edit.ejs', { foundTool: foundTool })
    }
})

// Update tool in database
router.put('/:toolId', async (req, res) => {
    try {
        const foundTool = await Tool.findById(req.params.toolId).populate('publishedBy')
        if (foundTool.publishedBy._id.equals(req.session.user._id)) {
            await Tool.findByIdAndUpdate(req.params.toolId, req.body)
            res.redirect(`/tools/${req.params.toolId}`)
        } else {
            res.send('You are not authorized to edit this tool.')
        }
    } catch (error) {
        console.log(error)
        res.send('Something went wrong')
    }
})

// Delete tool from database
router.delete('/:toolId', async (req, res) => {
    try {
        const foundTool = await Tool.findById(req.params.toolId).populate('publishedBy')
        if (foundTool.publishedBy._id.equals(req.session.user._id)) {
            await foundTool.deleteOne()
            res.redirect('/tools/')
        } else {
            res.send('You are not authorized to delete this tool.')
        }
    } catch (error) {
        console.log(error)
        res.send('Something went wrong')
    }
})

module.exports = router;