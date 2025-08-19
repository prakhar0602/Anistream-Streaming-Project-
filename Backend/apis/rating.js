/**
 * @swagger
 * components:
 *   schemas:
 *     RatingRequest:
 *       type: object
 *       properties:
 *         uid:
 *           type: string
 *         id:
 *           type: string
 *         rating:
 *           type: number
 *         type:
 *           type: string
 */

const express=require('express');
const Series = require('../models/Series');
const Movies = require('../models/Movies');
const Rating = require('../models/Rating');
const { default: mongoose } = require('mongoose');
const jwt = require('jsonwebtoken');
const { refreshToken } = require('../middleware');
const router=express.Router()

/**
 * @swagger
 * /add_series_rating:
 *   post:
 *     summary: Add rating to series/movie
 *     tags: [Rating]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RatingRequest'
 *     responses:
 *       200:
 *         description: Rating added successfully
 */
router.post('/add_series_rating', refreshToken, async(req,res)=>{
    try {
        let{id,rating,type}=req.body;
        const {refreshToken: token} = req.cookies;
        const {id: uid} = jwt.verify(token, 'Prakhar_Gupta');
        
        let x;
        if(type=='s'){
            x=await Series.findById(id)
        }
        else{
            x=await Movies.findById(id)
        }

        const userObjectId = new mongoose.Types.ObjectId(uid);
        
        let rate=await Rating.create({rating,'user':userObjectId})
        x.rating.push(rate._id);
        x.trating+=Number(rating)
        x.avg_rating=x.trating/x.rating.length
        await x.save();
        res.status(200).json({'msg':'Rating added'})
    } catch (error) {
        res.status(500).json({'msg':'Error adding rating', error: error.message})
    }
})

/**
 * @swagger
 * /get_updated_series/{type}/{id}:
 *   get:
 *     summary: Get updated series/movie with ratings
 *     tags: [Rating]
 *     parameters:
 *       - in: path
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Updated series/movie retrieved
 */
router.get('/get_updated_series/:type/:id',async(req,res)=>{
    let {id,type}=req.params;
    let e;
    if(type=='s')
    e=await Series.findById(id).populate('rating').exec()
    else
    e=await Movies.findById(id).populate('rating').exec()
    res.status(200).json({e});
})

/**
 * @swagger
 * /del_rating/{rid}/{id}/{type}:
 *   get:
 *     summary: Delete rating
 *     tags: [Rating]
 *     parameters:
 *       - in: path
 *         name: rid
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Rating deleted successfully
 */
router.get('/del_rating/:rid/:id/:type', refreshToken, async(req,res)=>{
    try {
        let {rid,id,type}=req.params;
        let e;
        if(type=='s')
        e=await Series.findById(id)
        else
        e=await Movies.findById(id)
      
        let x=e.rating.filter(e1=>e1._id.toString() != rid)
        let rating=await Rating.findById(rid);
        e.trating-=(Number)(rating.rating)
        e.rating=x
        
        if(e.rating.length!=0)
        e.avg_rating=e.trating/e.rating.length
        else
        e.avg_rating=0

        await e.save();
        await Rating.findByIdAndDelete(rid)
        res.json({msg:'Deleted'})
    } catch (error) {
        res.status(500).json({'msg':'Error deleting rating', error: error.message})
    }
})

/**
 * @swagger
 * /get_rating:
 *   post:
 *     summary: Get average rating for series/movie
 *     tags: [Rating]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *               type:
 *                 type: string
 *     responses:
 *       200:
 *         description: Average rating retrieved
 */
router.post('/get_rating',async(req,res)=>{
    let{id,type}=req.body;
    let x;
    if(type=='s')
    {
        x=await Series.findById(id)
    }
    else{
        x=await Movies.findById(id)
    }
    res.status(200).json({rating:x.avg_rating});
})
router.delete('/clear_rating/:id/:type', refreshToken, async(req,res)=>{
    try {
        let {id,type}=req.params;
        const {refreshToken: token} = req.cookies;
        const {id: uid} = jwt.verify(token, 'Prakhar_Gupta');
        
        let anime;
        if(type=='s')
            anime=await Series.findById(id).populate('rating')
        else
            anime=await Movies.findById(id).populate('rating')
      
        const userRating = anime.rating.find(r => r.user.toString() === uid);
        if (!userRating) {
            return res.status(404).json({msg: 'No rating found for user'});
        }
        
        anime.rating = anime.rating.filter(r => r.user.toString() !== uid);
        anime.trating -= Number(userRating.rating);
        
        if(anime.rating.length > 0)
            anime.avg_rating = anime.trating / anime.rating.length;
        else
            anime.avg_rating = 0;

        await anime.save();
        await Rating.findByIdAndDelete(userRating._id);
        res.json({msg:'Rating cleared'});
    } catch (error) {
        res.status(500).json({'msg':'Error clearing rating', error: error.message})
    }
})

module.exports=router;