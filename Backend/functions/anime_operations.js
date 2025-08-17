const Episodes = require("../models/Episode");
const Series = require("../models/Series");
const Movies = require("../models/Movies");
const Reviews = require("../models/Reviews");
const Rating = require("../models/Rating");
const Viewed = require("../models/Viewed");
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



async function addAnime(name,cover_image,cover_image2,big_image,desc,fld_id,type,nseasons,nepisodes,userID,genres=[]){
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
    let newAnime;
    if(type==='series'){
        newAnime = await Series.create({name,cover_image,cover_image2,big_image,desc,fld_id,episodes,nepisodes,nseasons,trating,avg_rating,type:'s',expiryTime:minTime,uploadedBy:userID,genres});
        await Viewed.create({userId: [], animeId: newAnime._id, animeModel: 'Series'});
    }else{
        newAnime = await Movies.create({name,cover_image,cover_image2,big_image,desc,fld_id,episodes,trating,avg_rating,type:'m',nepisodes,nseasons,expiryTime:minTime,uploadedBy:userID,genres});
        await Viewed.create({userId: [], animeId: newAnime._id, animeModel: 'Movies'});
    }
}

async function editAnime(name,cover_image,cover_image2,big_image,desc,fld_id,type,nseasons,nepisodes,id,userId,genres){ 
    console.log('editAnime function - received genres:', genres);
    if(type==='series'){
        const result = await Series.findByIdAndUpdate(id,{name,cover_image,cover_image2,big_image,desc,fld_id,nepisodes,nseasons,uploadedBy:userId,genres}, {new: true});
        console.log('Updated series genres:', result.genres);
    }else{
        const result = await Movies.findByIdAndUpdate(id,{name,cover_image,cover_image2,big_image,desc,fld_id,nepisodes,nseasons,uploadedBy:userId,genres}, {new: true});
        console.log('Updated movies genres:', result.genres);
    }
}

async function deleteAnime(id,type){
    try {
        let anime;
        if(type=='s'){
            anime = await Series.findById(id).populate('episodes rating');
            if(!anime) throw new Error('Series not found');
        } else {
            anime = await Movies.findById(id).populate('episodes rating');
            if(!anime) throw new Error('Movie not found');
        }
        
        // Delete all episodes and their reviews
        for(let episode of anime.episodes){
            // Delete reviews for this episode
            await Reviews.deleteMany({episode: episode._id});
            // Delete the episode
            await Episodes.findByIdAndDelete(episode._id);
        }
        
        // Delete all ratings for this anime
        await Rating.deleteMany({anime: id});
        
        // Delete from wishlist collections
        const WishList = require('../models/WishList');
        await WishList.updateMany(
            {}, 
            { $pull: { [type === 's' ? 'series' : 'movies']: id } }
        );
        
        // Finally delete the main anime document
        if(type=='s'){
            await Series.findByIdAndDelete(id);
        } else {
            await Movies.findByIdAndDelete(id);
        }
        
        console.log(`Successfully deleted ${type === 's' ? 'series' : 'movie'} with ID: ${id}`);
    } catch (error) {
        console.error('Error deleting anime:', error);
        throw error;
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
    if(!query || query.trim().length === 0)
        return results;
    
    const searchTerm = query.trim().toLowerCase();
    
    try {
        const allSeries = await Series.find().populate('rating episodes').exec();
        const allMovies = await Movies.find().populate('rating episodes').exec();
        
        const series = allSeries.filter(item => 
            item.name.toLowerCase().includes(searchTerm)
        );
        
        const movies = allMovies.filter(item => 
            item.name.toLowerCase().includes(searchTerm)
        );
        
        results = { series, movies };
    } catch (error) {
        console.error('Search error:', error);
        results = { series: [], movies: [] };
    }
    
    return results;
}

async function getGenres(){
    const series = await Series.find({}, 'genres').exec();
    const movies = await Movies.find({}, 'genres').exec();
    
    const allGenres = new Set();
    [...series, ...movies].forEach(item => {
        if(item.genres && Array.isArray(item.genres)){
            item.genres.forEach(genre => allGenres.add(genre));
        }
    });
    
    return Array.from(allGenres).slice(0, 10);
}

async function getAnimeByGenre(genre){
    const series = await Series.find({ genres: genre }).populate('rating episodes').exec();
    const movies = await Movies.find({ genres: genre }).populate('rating episodes').exec();
    
    return { series, movies };
}

module.exports={findAnime,addAnime,editAnime,deleteAnime,getSeries,getMovies,searchQuery,fetchFileCode,getGenres,getAnimeByGenre}