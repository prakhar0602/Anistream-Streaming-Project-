const Episodes = require("../models/Episode");
const Series = require("../models/Series");
const Movies = require("../models/Movies");
const Reviews = require("../models/Reviews");
const Rating = require("../models/Rating");
const Viewed = require("../models/Viewed");
const {
  fetchFileList,
  fetchFileInfo,
  fetchFolderList,
} = require("./streamwishApi");
const user = require("../models/Users");
const Seasons = require("../models/Season");

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

const fetchFileCode = async (id) => {
  let x = await Episodes.findById(id);
  return x.file_code;
};

const getFileList = async () => {};

const findAnime = async (id, type) => {
  let item;
  if (type == "s") item = await Series.findById(id);
  else item = await Movies.findById(id);
  return item;
};

async function addAnime(
  name,
  cover_image,
  cover_image2,
  big_image,
  desc,
  fld_id,
  type,
  seasons,
  nseasons,
  userID,
  genres = []
) {
  let trating = 0;
  let avg_rating = 0;
  let response = await fetchFolderList(fld_id);
  let seasonNumber = 0;
  let seasonIds=[]
  for (let i of response) {
      seasonNumber += 1;
      let episodes = [];
      let response2 = await fetchFileList(i.fld_id);
      console.log(response2)
      for (let j of response2) {
      let minTime=Date.now()
      let r = await fetchFileInfo(j.file_code);
      let time=j.uploaded;
    let updatedTime = time.replace(" ", "T");
    time = new Date(updatedTime);
    minTime = Math.min((time.getTime()+90*24*60*60*1000),minTime);
      let y = await Episodes.create({
        title: j.title,
        file_code: j.file_code,
        snap_link: r.player_img,
        expiryTime:minTime
      });
      episodes.push(y._id);
    }
    let curr = await Seasons.create({
      name: seasons[seasonNumber - 1] || `Season ${seasonNumber}`,
      seasonNumber,
      episodes,
      fld_id: i.fld_id,
    });
    seasonIds.push(curr._id);

    
  }
  let newAnime;
  if (type === "series") {
    newAnime = await Series.create({
      name,
      cover_image,
      cover_image2,
      big_image,
      desc,
      fld_id,
      seasons: seasonIds,
      nseasons: seasonNumber.toString(),
      trating,
      avg_rating,
      type: "s",
      expiryTime: Date.now() + 90*24*60*60*1000,
      uploadedBy: userID,
      genres,
    });
    await Viewed.create({
      userId: [],
      animeId: newAnime._id,
      animeModel: "Series",
    });
  } else {
    newAnime = await Movies.create({
      name,
      cover_image,
      cover_image2,
      big_image,
      desc,
      fld_id,
      trating,
      avg_rating,
      type: "m",
      nseasons: seasonNumber.toString(),
      seasons: seasonIds,
      expiryTime: Date.now() + 90*24*60*60*1000,
      uploadedBy: userID,
      genres,
    });
    await Viewed.create({
      userId: [],
      animeId: newAnime._id,
      animeModel: "Movies",
    });
  }
}

async function editAnime(
  name,
  cover_image,
  cover_image2,
  big_image,
  desc,
  fld_id,
  type,
  nseasons,
  nepisodes,
  id,
  userId,
  genres
) {
  try {
    const updateData = {
      name,
      cover_image,
      cover_image2,
      big_image,
      desc,
      fld_id,
      nseasons,
      uploadedBy: userId,
      genres,
    };

    if (type === "series") {
      await Series.findByIdAndUpdate(id, updateData, { new: true });
    } else {
      await Movies.findByIdAndUpdate(id, updateData, { new: true });
    }
  } catch (error) {
    console.error('Error editing anime:', error);
    throw error;
  }
}

async function deleteAnime(id, type) {
  try {
    let anime;
    if (type == "s") {
      anime = await Series.findById(id).populate({path: 'seasons', populate: {path: 'episodes'}}).populate('rating');
      if (!anime) throw new Error("Series not found");
    } else {
      anime = await Movies.findById(id).populate({path: 'seasons', populate: {path: 'episodes'}}).populate('rating');
      if (!anime) throw new Error("Movie not found");
    }

    for (let season of anime.seasons) {
      for (let episode of season.episodes) {
        await Reviews.deleteMany({ episode: episode._id });
        await Episodes.findByIdAndDelete(episode._id);
      }
      await Seasons.findByIdAndDelete(season._id);
    }

    // Delete all ratings for this anime
    const ratingIds = anime.rating || [];
    await Rating.deleteMany({ _id: { $in: ratingIds } });

    const WishList = require("../models/WishList");
    await WishList.updateMany(
      {},
      { $pull: { [type === "s" ? "series" : "movies"]: id } }
    );

    // Delete viewed records
    await Viewed.deleteMany({ animeId: id });

    if (type == "s") {
      await Series.findByIdAndDelete(id);
    } else {
      await Movies.findByIdAndDelete(id);
    }


  } catch (error) {
    console.error("Error deleting anime:", error);
    throw error;
  }
}

async function getSeries() {
  let x = await Series.find();
  return {series: x};
}
async function getMovies() {
  let x = await Movies.find();
  return {movies: x};
}
async function searchQuery(query) {
  let results = { series: [], movies: [] };
  if (!query || query.trim().length === 0) return results;

  const searchTerm = query.trim().toLowerCase();

  try {
    const allSeries = await Series.find().populate('rating').populate({path: 'seasons', populate: {path: 'episodes'}}).exec();
    const allMovies = await Movies.find().populate('rating').populate({path: 'seasons', populate: {path: 'episodes'}}).exec();

    const series = allSeries.filter((item) =>
      item.name.toLowerCase().includes(searchTerm)
    );

    const movies = allMovies.filter((item) =>
      item.name.toLowerCase().includes(searchTerm)
    );

    results = { series, movies };
  } catch (error) {

    results = { series: [], movies: [] };
  }

  return results;
}

async function getGenres() {
  const series = await Series.find({}, "genres").exec();
  const movies = await Movies.find({}, "genres").exec();

  const allGenres = new Set();
  [...series, ...movies].forEach((item) => {
    if (item.genres && Array.isArray(item.genres)) {
      item.genres.forEach((genre) => allGenres.add(genre));
    }
  });

  return Array.from(allGenres).slice(0, 10);
}

async function getAnimeByGenre(genre) {
  const series = await Series.find({ genres: genre })
    .populate('rating')
    .populate({path: 'seasons', populate: {path: 'episodes'}})
    .exec();
  const movies = await Movies.find({ genres: genre })
    .populate('rating')
    .populate({path: 'seasons', populate: {path: 'episodes'}})
    .exec();

  return { series, movies };
}

async function getAnimeById(id) {
  try {
    let anime = await Series.findById(id)
      .populate('rating')
      .populate({path: 'seasons', populate: {path: 'episodes'}})
      .exec();
    
    if (!anime) {
      anime = await Movies.findById(id)
        .populate('rating')
        .populate({path: 'seasons', populate: {path: 'episodes'}})
        .exec();
    }
    
    return anime;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  findAnime,
  addAnime,
  editAnime,
  deleteAnime,
  getSeries,
  getMovies,
  searchQuery,
  fetchFileCode,
  getGenres,
  getAnimeByGenre,
  getAnimeById,
};
