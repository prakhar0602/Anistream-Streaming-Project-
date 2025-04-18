import React, { useEffect, useState } from "react";
import FolderList from "../../Components/Anime_list/New/FolderList";
import axios from "axios";

const FileUpload = () => {
  const [selectedFolder, setSelectedFolder] = useState(""); // Store selected folder ID
  const [as, setas] = useState("/notDefined");
  async function createUploadLink() {
    const serverResponse = await axios.get(
      "https://api.streamwish.com/api/upload/server?key=11124m28yb5z5qbkuh1ru"
    );
    setas(serverResponse.data.result);
    console.log(serverResponse.data.result);
    console.log("Server Created");
  }
  useEffect(() => {
    createUploadLink();
  }, []);
  return (
    <div className="flex items-center gap-10">
      <FolderList folder={selectedFolder} setFolder={setSelectedFolder} />
      <form
        className="flex flex-col gap-5 items-center p-5 border border-gray-400 rounded-lg bg-gray-800"
        method="POST"
        encType="multipart/form-data"
        action={as}
      >
        <input type="hidden" name="key" value="11124m28yb5z5qbkuh1ru" />
        <input type="hidden" name="html_redirect" value="1" />
        <input type="hidden" name="fld_id" value={selectedFolder} />

        <div className="flex flex-col items-center gap-3">
          <label htmlFor="file" className="text-white font-mono text-lg">
            Select Files:
          </label>
          <input
            className="text-lg text-white cursor-pointer bg-transparent border border-white p-2 rounded-lg"
            type="file"
            id="file"
            name="file"
            multiple
            disabled={!selectedFolder} // Disable if no folder is selected
          />
        </div>

        {/* Show message if folder is not selected */}
        {!selectedFolder && (
          <p className="text-red-400 text-sm font-semibold">
            Please select a folder before uploading.
          </p>
        )}

        {/* Upload Button */}
        <button
          className={`rounded-lg py-2 px-5 text-lg font-semibold transition-all ${
            selectedFolder
              ? "bg-blue-500 hover:bg-blue-600 text-white"
              : "bg-gray-500 text-gray-300 cursor-not-allowed"
          }`}
          type="submit"
          disabled={!selectedFolder} // Disable button if no folder is selected
        >
          Upload
        </button>
      </form>
    </div>
  );
};

export default FileUpload;
