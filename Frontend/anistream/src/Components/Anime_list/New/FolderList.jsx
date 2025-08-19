import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
const {VITE_BACKEND_LINK} = import.meta.env;
const FolderList = ({ folder, setFolder }) => {
  const [folders, setFolders] = useState([]);
  const [subFolders, setSubFolders] = useState([]);
  const [selectedMainFolder, setSelectedMainFolder] = useState("");
  const [seasonNumber, setSeasonNumber] = useState("");
  const [showSubFolders, setShowSubFolders] = useState(false);
  const user = useSelector((state)=>state.user.user)
  useEffect(() => {
    async function fetchFolders() {
      try {
        console.log(user._id);
        let response = await axios.get(
          `${VITE_BACKEND_LINK}/getSyncedfolders/${user._id}`
      );
        setFolders(response.data.folders);
      } catch (error) {
        console.error("Error fetching folders:", error);
      }
    }
    fetchFolders();
  }, []);

  async function fetchSubFolders(fld_id) {
    try {
      const response = await axios.get(
        `https://api.streamwish.com/api/folder/list?key=11124m28yb5z5qbkuh1ru&fld_id=${fld_id}&files=1`
      );
      setSubFolders(response.data.result.folders || []);
      setShowSubFolders(true);
    } catch (error) {
      console.error("Error fetching subfolders:", error);
    }
  }

  async function createSeasonFolder() {
    if (!seasonNumber || !selectedMainFolder) return;
    
    try {
      await axios.get(
        `https://api.streamwish.com/api/folder/create?key=11124m28yb5z5qbkuh1ru&name=Season ${seasonNumber}&parent_id=${selectedMainFolder}`
      );
      setSeasonNumber("");
      fetchSubFolders(selectedMainFolder);
    } catch (error) {
      console.error("Error creating season folder:", error);
    }
  }

  function handleMainFolderSelect(fld_id) {
    setFolder(fld_id);
  }

  function handleViewSeasons(fld_id) {
    setSelectedMainFolder(fld_id);
    fetchSubFolders(fld_id);
  }

  function handleSubFolderSelect(fld_id) {
    setFolder(fld_id);
  }

  function goBack() {
    setShowSubFolders(false);
    setSelectedMainFolder("");
    setSubFolders([]);
    setFolder("");
  }

  return (
    <div className="p-6 bg-gray-900/90 h-fit max-h-[70vh] backdrop-blur-lg border overflow-scroll no-scrollbar border-gray-700 text-gray-200 rounded-2xl w-full max-w-md mx-auto shadow-xl">
      {/* Title */}
      <h2 className="text-3xl font-bold text-center text-blue-400 mb-4 drop-shadow-lg tracking-widest">📁 Folder List</h2>

      {/* Selected Folder */}
      {folder.length !== 0 ? (
        <div className="p-4 mb-4 bg-gray-800 border gap-5 border-green-500 rounded-lg flex justify-between items-center shadow-md transition-all">
          <p className="text-lg font-mono">✅ Selected: {folder}</p>
          <button
            onClick={() => setFolder("")}
            className="px-4 py-2 bg-red-600 text-white tracking-widest rounded-lg shadow-md hover:bg-red-700 transition-all"
          >
            ❌ Clear
          </button>
        </div>
      ) : showSubFolders ? (
        <div>
          <button
            onClick={goBack}
            className="mb-4 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
          >
            ← Back to Main Folders
          </button>
          
          {/* Create Season Folder */}
          <div className="mb-4 p-3 bg-gray-800 rounded-lg">
            <input
              type="number"
              value={seasonNumber}
              onChange={(e) => setSeasonNumber(e.target.value)}
              placeholder="Season number"
              className="w-full p-2 mb-2 bg-gray-700 text-white rounded border border-gray-600"
              min="1"
            />
            <button
              onClick={createSeasonFolder}
              className="w-full px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
            >
              Create Season Folder
            </button>
          </div>
          
          {/* Subfolders List */}
          <ul className="space-y-3">
            {subFolders.map((f) => (
              <li
                key={f.fld_id}
                className="p-3 bg-gray-800 border border-gray-600 rounded-lg flex justify-between items-center shadow-md hover:bg-gray-700 transition-all"
              >
                <p className="text-xl text-gray-300 drop-shadow-md">📁 {f.name}</p>
                <button
                  onClick={() => handleSubFolderSelect(f.fld_id)}
                  className="px-4 py-2 tracking-widest rounded-lg shadow-md transition-all bg-blue-600 text-white hover:bg-blue-700"
                >
                  Select
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <ul className="space-y-3">
          {folders.map((f) => (
            <li
              key={f.fld_id}
              className="p-3 bg-gray-800 border border-gray-600 rounded-lg flex justify-between items-center shadow-md hover:bg-gray-700 transition-all"
            >
              <p className="text-xl text-gray-300 drop-shadow-md">📂 {f.name}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => handleMainFolderSelect(f.fld_id)}
                  className="px-4 py-2 tracking-widest rounded-lg shadow-md transition-all bg-green-600 text-white hover:bg-green-700"
                >
                  Select Anime
                </button>
                <button
                  onClick={() => handleViewSeasons(f.fld_id)}
                  className="px-4 py-2 tracking-widest rounded-lg shadow-md transition-all bg-blue-600 text-white hover:bg-blue-700"
                >
                  View Seasons
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FolderList;
