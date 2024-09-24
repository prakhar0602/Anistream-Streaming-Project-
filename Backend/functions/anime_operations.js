const { default: axios } = require("axios");
const Episodes = require("../models/Episode");
const Series = require("../models/Series");
const Movies = require("../models/Movies");
const Reviews = require("../models/Reviews");
const Rating = require("../models/Rating");
async function add_Anime(name,cover_image,big_image,desc,fld_id,type,nseasons,nepisodes){
    let response=await axios.get(`https://api.streamwish.com/api/file/list?key=${process.env.API_KEY}&fld_id=${fld_id}`);
    let trating=0
    let avg_rating=0 
    let episodes=[]
    response=response.data.result.files;
    response.sort((x,y)=>{
        if(x.title<y.title)
        return -1
        else
        return 1
      })
    for(let i of response){
        let r=await axios.get(`https://api.streamwish.com/api/file/info?key=${process.env.API_KEY}&file_code=${i.file_code}`)
        let x=r.data.result[0]
        let y=await Episodes.create({file_code:i.file_code,snap_link:x.player_img});
        episodes.push(y._id);
    }
    if(type==='series'){
        await Series.create({name,cover_image,big_image,desc,fld_id,episodes,nepisodes,nseasons,trating,avg_rating,type:'s'});
    }else{
        await Movies.create({name,cover_image,big_image,desc,fld_id,episodes,trating,avg_rating,type:'m',nepisodes,nseasons});
    }
}
async function edit_Anime(name,cover_image,big_image,desc,fld_id,type,nseasons,nepisodes,id){
    if(type==='series'){
        await Series.findByIdAndUpdate(id,{name,cover_image,big_image,desc,fld_id,nepisodes,nseasons,type:'s'});
    }else{
        await Movies.findByIdAndUpdate(id,{name,cover_image,big_image,desc,fld_id,nepisodes,nseasons,type:'m'});
    }
}
async function delete_Anime(id,type){
    let x;
    if(type=='s')
        x=await Series.findByIdAndDelete(id)
    else
        x=await Movies.findByIdAndDelete(id) 
    for(i of x.episodes){
        let y=await Episodes.findByIdAndDelete(i)
        for(j of y.reviews){
            await Reviews.findByIdAndDelete(j)
        }
    }
    for(i of x.rating){
        await Rating.findByIdAndDelete(i);
    } 
}

async function get_Series(){
    let x=await Series.find().populate('rating episodes').exec();
    return x;
}
async function get_Movies(){
    let x=await Movies.find().populate('rating episodes').exec();
    return x
}
async function searchQuery(query){
    let results={series:[],movies:[]};
    if(query.length==0)
        return results;
    let all_series=await Series.find().populate('rating episodes').exec();
    let all_movies=await Movies.find().populate('rating episodes').exec();
    let series = all_series.filter((x)=>x.name.toLowerCase().includes(query.toLowerCase()))
    let movies = all_movies.filter((x)=>x.name.toLowerCase().includes(query.toLowerCase()))
    results = {series,movies}
    return results;
}

module.exports={add_Anime,edit_Anime,delete_Anime,get_Series,get_Movies,searchQuery} 