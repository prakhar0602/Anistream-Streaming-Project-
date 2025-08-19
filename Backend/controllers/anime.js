const { fetchFileInfo } = require("../functions/streamwishApi");
const { sendEmail } = require("../functions/nodemailerApi");
const {
  addAnime,
  editAnime,
  deleteAnime,
  getSeries,
  getMovies,
  searchQuery,
  fetchFileCode,
  findAnime,
  getGenres,
  getAnimeByGenre,
  getAnimeById,
} = require("../functions/anime_operations");
const { default: axios } = require("axios");
const jwt = require('jsonwebtoken');

const handleFetchSeries = async (req, res) => {
  let x = await getSeries();
  res.status(200).json(x);
};

const handleFetchMovies = async (req, res) => {
  let x = await getMovies();
  res.status(200).json(x);
};

const handleDeleteAnime = async (req, res) => {
  let { id, type } = req.body;
  await deleteAnime(id, type);
  res.status(200).json({ msg: "Deleted" });
};

const handleEditAnime = async (req, res) => {
  let {
    name,
    cover_image,
    cover_image2,
    big_image,
    desc,
    fld_id,
    type,
    nseasons,
    nepisodes,
    id,genres
  } = req.body;
  try {
  const parsedGenres = typeof genres === 'string' ? JSON.parse(genres || '[]') : (genres || []);
  const {refreshToken} = req.cookies;
  const {id: userId} = jwt.verify(refreshToken, 'Prakhar_Gupta');
  
  await editAnime(
    name,
    cover_image,cover_image2,
    big_image,
    desc,
    fld_id,
    type,
    nseasons,
    nepisodes,
    id,userId,parsedGenres
  );
    res.status(200).json({ data: "Data updated" });
  } catch (error) {

    res.status(500).json({ error: error.message });
  }
};

const handleAddAnime = async (req, res) => {
  let {
    name,
    cover_image,
    cover_image2,
    big_image,
    desc,
    fld_id,
    type,
    seasons,
    nseasons,
    nepisodes,userID,genres
  } = req.body;
  
  // Parse genres and seasons if they're JSON strings
  const parsedGenres = typeof genres === 'string' ? JSON.parse(genres || '[]') : (genres || []);
  const parsedSeasons = typeof seasons === 'string' ? JSON.parse(seasons || '[]') : (seasons || []);
  await addAnime(
    name,
    cover_image,
    cover_image2,
    big_image,
    desc,
    fld_id,
    type,
    parsedSeasons,
    nseasons,
    userID,
    parsedGenres
  );
  res.status(201).json({ bool:true,data: "Data added" });
};

const handleFetchFileCode = async (req, res) => {
  try {
    let { id } = req.params;
    let x = await fetchFileCode(id);
    res.status(200).json(x);
  } catch (e) {

  }
};

const handleFetchFoldersById = async(req,res)=>{
  let {id} = req.params;
  try{
    let response = await axios.get("https://api.streamwish.com/api/folder/list?key=11124m28yb5z5qbkuh1ru&files=1", {
      httpsAgent: new (require('https').Agent)({
        rejectUnauthorized: false
      })
    });
    
    // Check if response contains expected data structure
    if (!response.data || !response.data.result || !response.data.result.folders) {

      return res.status(500).json({error:"Invalid API response - possibly blocked by firewall"});
    }
    
    let folders = response.data.result.folders;
    let selectedFolders = folders.filter(x=>(x.name.split("_"))[1]==id);
    selectedFolders.forEach(x=>{
      x.name = (x.name.split("_"))[0];
    })
    res.status(200).json({folders:selectedFolders,msg:"Folders found"});
  } catch(e){

    res.status(500).json({error:"Failed to fetch folders - network or firewall issue"});
  }
}

const handleFetchFileInfo = async (req, res) => {
  const { eps } = req.body;
  let info = [];
  for (i of eps) {
    let x = fetchFileInfo(i.file_code);
    info.push(x);
  }
  res.status(200).json({ info });
};

const handleSearchQuery = async (req, res) => {
  try {
    const { query } = req.params;
    
    if (!query || query.trim().length === 0) {
      return res.status(400).json({ 
        bool: false, 
        message: 'Search query is required',
        results: { series: [], movies: [] }
      });
    }
    
    const results = await searchQuery(query);
    res.status(200).json({ 
      bool: true, 
      results,
      message: `Found ${results.series.length} series and ${results.movies.length} movies`
    });
  } catch (error) {

    res.status(500).json({ 
      bool: false, 
      message: 'Search failed. Please try again.',
      results: { series: [], movies: [] }
    });
  }
};

const handleExpiryNotification = async (req, res) => {
  let { id, type } = req.params;
  let item = await findAnime(id, type);
  time = item.expiryTime - Date.now();
  try {
    setTimeout(sendEmail, time);
  } catch (e) {
    setTimeout(sendEmail, 0);
  }
  res.send("Done");
};

const handleFetchGenres = async (req, res) => {
  try {
    const genres = await getGenres();
    res.status(200).json({ genres });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch genres' });
  }
};

const handleFetchAnimeByGenre = async (req, res) => {
  try {
    const { genre } = req.params;
    const anime = await getAnimeByGenre(genre);
    res.status(200).json(anime);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch anime by genre' });
  }
};

const handleFetchAnimeById = async (req, res) => {
  try {
    const { id } = req.params;
    const anime = await getAnimeById(id);
    if (!anime) {
      return res.status(404).json({ error: 'Anime not found' });
    }
    res.status(200).json(anime);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch anime' });
  }
};

module.exports = {
  handleFetchSeries,
  handleFetchMovies,
  handleDeleteAnime,
  handleEditAnime,
  handleAddAnime,
  handleFetchFileCode,
  handleFetchFileInfo,
  handleSearchQuery,
  handleExpiryNotification,
  handleFetchFoldersById,
  handleFetchGenres,
  handleFetchAnimeByGenre,
  handleFetchAnimeById
};
