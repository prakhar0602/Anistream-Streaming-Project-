/**
 * @swagger
 * components:
 *   schemas:
 *     Review:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         comment:
 *           type: string
 *         id:
 *           type: string
 */

const express=require('express');
const Episodes = require('../models/Episode');
const Reviews = require('../models/Reviews');
const router=express.Router();
/**
 * @swagger
 * /add_review:
 *   post:
 *     summary: Add review to episode
 *     tags: [Reviews]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Review'
 *     responses:
 *       200:
 *         description: Review added successfully
 */
router.post('/add_review',async(req,res)=>{
    let {name,comment,id}=req.body;
    let x=new Reviews({name,comment});
    let z=await Episodes.findById(id);
    z.reviews.push(x._id);
    await x.save();
    await z.save();
    res.status(200).json({'msg':'Review added'});
})
/**
 * @swagger
 * /get_reviews:
 *   post:
 *     summary: Get reviews for episode
 *     tags: [Reviews]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               file_code:
 *                 type: string
 *     responses:
 *       200:
 *         description: Reviews retrieved successfully
 */
router.post('/get_reviews',async(req,res)=>{
    let {file_code}=req.body;
    let z=await Episodes.findOne({file_code}).populate('reviews')
    res.status(200).json({'reviews':z})
})

/**
 * @swagger
 * /get_reviews/{episodeId}:
 *   get:
 *     summary: Get reviews for episode by ID
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: episodeId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Reviews retrieved successfully
 */
router.get('/get_reviews/:episodeId',async(req,res)=>{
    let {episodeId}=req.params;
    let episode=await Episodes.findById(episodeId).populate('reviews')
    res.status(200).json({
        reviews: episode.reviews || [],
        likes: episode.likes || [],
        dislikes: episode.dislikes || []
    })
})
/**
 * @swagger
 * /delete_review:
 *   post:
 *     summary: Delete review
 *     tags: [Reviews]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *               did:
 *                 type: string
 *     responses:
 *       200:
 *         description: Review deleted successfully
 */
router.post('/delete_review',async(req,res)=>{
    let{id,did}=req.body;
    let x=await Episodes.findById(id);
    await Reviews.findByIdAndDelete(did);
    x.reviews=x.reviews.filter((e)=>e.toString()!=did)
    await x.save()
    res.status(200).json({'msg':'deleted'}) 
})

module.exports=router;