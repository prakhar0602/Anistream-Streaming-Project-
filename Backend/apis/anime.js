const express = require("express");
const router = express.Router();
const { refreshToken, validateAnime, validateEditUser } = require("../middleware");
const {
  handleFetchSeries,
  handleFetchMovies,
  handleDeleteAnime,
  handleEditAnime,
  handleAddAnime,
  handleFetchFileCode,
  handleFetchFileInfo,
  handleSearchQuery,
  handleExpiryNotification,
} = require("../controllers/anime");

router.get("/get_series", handleFetchSeries);

router.get("/get_movies", handleFetchMovies);

router.post("/delete_anime", refreshToken, handleDeleteAnime);

router.post("/edit_anime", refreshToken,validateAnime,validateEditUser,handleEditAnime);

router.post("/add_anime", refreshToken,validateAnime, handleAddAnime);

router.get("/get_file_code/:id", handleFetchFileCode);

router.post("/get_info", handleFetchFileInfo);

router.get("/search/:query", handleSearchQuery);

router.get(
  "/setExpiryNotification/:id/:type",
  refreshToken,
  handleExpiryNotification
);

module.exports = router;
