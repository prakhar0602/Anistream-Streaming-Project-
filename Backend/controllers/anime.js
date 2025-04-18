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
} = require("../functions/anime_operations");
const { default: axios } = require("axios");

const handleFetchSeries = async (req, res) => {
  let x = await getSeries();
  console.log(x)
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
    id,userID
  } = req.body;
  await editAnime(
    name,
    cover_image,cover_image2,
    big_image,
    desc,
    fld_id,
    type,
    nseasons,
    nepisodes,
    id,userID
  );
  res.status(200).json({ data: "Data updated" });
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
    nseasons,
    nepisodes,userID
  } = req.body;
  await addAnime(
    name,
    cover_image,
    cover_image2,
    big_image,
    desc,
    fld_id,
    type,
    nseasons,
    nepisodes,userID
  );
  res.status(201).json({ data: "Data added" });
};

const handleFetchFileCode = async (req, res) => {
  try {
    let { id } = req.params;
    let x = await fetchFileCode(id);
    res.status(200).json(x);
  } catch (e) {
    console.log(e.message);
  }
};

const handleFetchFoldersById = async(req,res)=>{
  let {id} = req.params;
  let response = await axios.get("https://api.streamwish.com/api/folder/list?key=11124m28yb5z5qbkuh1ru&files=1");
  response = response.data.result.folders;
  let selectedFolders = response.filter(x=>(x.name.split("_"))[1]==id);
  // console.log(selectedFolders)
  selectedFolders.forEach(x=>{
    x.name = (x.name.split("_"))[0];
  })
  res.status(200).json({folders:selectedFolders,msg:"Folders found"});
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
    let results = await searchQuery(query);
    res.status(200).json({ bool: true, results });
  } catch (e) {
    res.status(200).json({ bool: false });
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
  handleFetchFoldersById
};
