import axios from "axios";
import React, { useEffect, useState } from "react";

const FolderList = ({ folder, setFolder }) => {
  const [folders, setFolders] = useState([]);

  useEffect(() => {
    async function fetchFolders() {
      try {
        let response = await axios.get(
          "https://api.streamwish.com/api/folder/list?key=11124m28yb5z5qbkuh1ru"
        );
        setFolders(response.data.result.folders);
      } catch (error) {
        console.error("Error fetching folders:", error);
      }
    }
    fetchFolders();
  }, []);

  return (
    <div className="p-6 bg-gray-900/90 backdrop-blur-lg border border-gray-700 text-gray-200 rounded-2xl w-full max-w-md mx-auto shadow-xl">
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
      ) : (
        <ul className="space-y-3">
          {folders.map((f) => (
            <li
              key={f.fld_id}
              className="p-3 bg-gray-800 border border-gray-600 rounded-lg flex justify-between items-center shadow-md hover:bg-gray-700 transition-all"
            >
              <p className="text-xl  text-gray-300 drop-shadow-md">📂 {f.name}</p>
              <button
                onClick={() => setFolder(f.fld_id)}
                className={`px-4 py-2 tracking-widest rounded-lg shadow-md transition-all ${
                  folder === f.fld_id
                    ? "bg-green-600 text-white hover:bg-green-700"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                {folder === f.fld_id ? "✔ Selected" : "Select"}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FolderList;
