/**
 * @swagger
 * components:
 *   schemas:
 *     LikesDislikesResponse:
 *       type: object
 *       properties:
 *         likes:
 *           type: array
 *           items:
 *             type: string
 *         dislikes:
 *           type: array
 *           items:
 *             type: string
 */

const { default: mongoose } = require('mongoose');
const Episode=require('../models/Episode')
const express=require('express')
const router=express.Router()

/**
 * @swagger
 * /get_likes_dislikes/{id}:
 *   get:
 *     summary: Get likes and dislikes for episode
 *     tags: [Likes/Dislikes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Likes and dislikes retrieved
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LikesDislikesResponse'
 */
router.get('/get_likes_dislikes/:id',async(req,res)=>{
    let {id}=req.params;
    let e=await Episode.findById(id).populate('likes dislikes').exec()
    res.status(200).json({'likes':e.likes,'dislikes':e.dislikes})
})

/**
 * @swagger
 * /toggle/{prevOp}/{operation}/{id}/{uid}:
 *   get:
 *     summary: Toggle like/dislike for episode
 *     tags: [Likes/Dislikes]
 *     parameters:
 *       - in: path
 *         name: prevOp
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: operation
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: uid
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Like/dislike toggled successfully
 */
router.get('/toggle/:prevOp/:operation/:id/:uid',async(req,res)=>{
    let{operation,id,uid,prevOp}=req.params;
    let episode=await Episode.findById(id)
    if(prevOp=='likes'){
        let likes=episode.likes;
        let a=likes.filter(i=>i.toString()!=uid);
        episode.likes=a;
        await episode.save();
    }
    else{
        let dislikes=episode.dislikes; 
        let a=dislikes.filter(i=>i.toString()!=uid);
        episode.dislikes=a;
        await episode.save();
    }
    uid=new mongoose.Types.ObjectId(uid);
    let x=(episode.likes).some((o)=>o.toString()==uid)
    let y=(episode.dislikes).some((o)=>o.toString()==uid)
    if(operation=='likes'){
        if(!x)
        episode.likes.push(uid)
        else{
            let a=episode.likes.filter(i=>i.toString()!=uid);
            episode.likes=a;
        }
    }
    else{
        if(!y)
        episode.dislikes.push(uid)
        else{
            let a=episode.dislikes.filter(i=>i.toString()!=uid);
            episode.dislikes=a;
        }
    }
    await episode.save();
    res.status(200).json({'msg':'Done'})
})






module.exports=router;