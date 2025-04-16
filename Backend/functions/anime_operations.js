const Episodes = require("../models/Episode");
const Series = require("../models/Series");
const Movies = require("../models/Movies");
const Reviews = require("../models/Reviews");
const Rating = require("../models/Rating");
const { fetchFileList, fetchFileInfo } = require("./streamwishApi");
const user = require("../models/Users");


// async function add_AnimeByURL(name,cover_image,big_image,desc,fld_id,type,nseasons,nepisodes){
//     let trating=0
//     let avg_rating=0 
//     let episodes=[]
//     let response = await axios.get(`https://api.streamwish.com/api/file/list?key=${process.env.API_KEY}&fld_id=${fld_id}`);
//     let links = response.data.result.files;
//     for(let i of links){
//         let ep={};
//         ep.file_code=i.filecode;
//         response = await axios.get(`https://api.streamwish.com/api/file/info?key=${process.env.API_KEY}&file_code=${ep.file_code}`)
//         ep.snap_link=response.data.result.player_img;
//         ep.title=response.data.result.file_title;
//         episodes.push(ep);
//     }
//     episodes.sort((x,y)=>{
//         if(x.title<y.title)
//             return -1;
//         else
//             return 1;
//     })
//     let final_episodes=[];
//     for(let i of episodes){
//         let y=await Episodes.create({...i});
//         final_episodes.push(y._id);
//     }
//     if(type==='series'){
//         await Series.create({name,cover_image,big_image,desc,fld_id,episodes:final_episodes,nepisodes,nseasons,trating,avg_rating,type:'s'});
//     }else{
//         await Movies.create({name,cover_image,big_image,desc,fld_id,episodes:final_episodes,trating,avg_rating,type:'m',nepisodes,nseasons});
//     }
// }



const fetchFileCode = async(id)=>{
    let x = await Episodes.findById(id);
    return x.file_code;
}



const getFileList = async()=>{
    
}

const findAnime = async(id,type)=>{
    let item;
    if (type == "s")
        item = await Series.findById(id);
    else 
        item = await Movies.findById(id);
    return item;
}



async function addAnime(name,cover_image,cover_image2,big_image,desc,fld_id,type,nseasons,nepisodes,userID){
    let trating=0
    let avg_rating=0 
    let episodes=[]
    let response = await fetchFileList(fld_id);
    let minTime=Date.now()
    for(let i of response){
        let r=await fetchFileInfo(i.file_code);
        let y=await Episodes.create({title:i.title,file_code:i.file_code,snap_link:r.player_img});
        episodes.push(y._id);
        let time=i.uploaded;
        // console.log(time)
        let updatedTime = time.replace(" ", "T");
        time = new Date(updatedTime);
        // console.log(time)
        minTime = Math.min((time.getTime()+90*24*60*60*1000),minTime);
    }
    if(type==='series'){
        await Series.create({name,cover_image,cover_image2,big_image,desc,fld_id,episodes,nepisodes,nseasons,trating,avg_rating,type:'s',expiryTime:minTime,uploadedBy:userID});
    }else{
        await Movies.create({name,cover_image,cover_image2,big_image,desc,fld_id,episodes,trating,avg_rating,type:'m',nepisodes,nseasons,expiryTime:minTime,uploadedBy:userID});
    }
}

async function editAnime(name,cover_image,cover_image2,big_image,desc,fld_id,type,nseasons,nepisodes,id,userId){
    if(type==='series'){
        await Series.findByIdAndUpdate(id,{name,cover_image,cover_image2,big_image,desc,fld_id,nepisodes,nseasons,type:'s',uploadedBy:userId});
    }else{
        await Movies.findByIdAndUpdate(id,{name,cover_image,cover_image2,big_image,desc,fld_id,nepisodes,nseasons,type:'m',uploadedBy:userId});
    }
}

async function deleteAnime(id,type){
    let x
    if(type=='s'){
        // x=await Series.findById(id);
        x=await Series.findByIdAndDelete(id)
    }
    else{
        // x=await Movies.findById(id);
        x=await Movies.findByIdAndDelete(id) 
    }
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

async function getSeries(){
    let x=await Series.find().populate('rating episodes').exec();
    return x;
}
async function getMovies(){
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

module.exports={findAnime,addAnime,editAnime,deleteAnime,getSeries,getMovies,searchQuery,fetchFileCode}