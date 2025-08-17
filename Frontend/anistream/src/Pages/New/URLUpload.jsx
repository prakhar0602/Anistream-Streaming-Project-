import axios from "axios";
import React, { useEffect, useState } from "react";
import FolderList from "../../Components/Anime_list/New/FolderList";
import { toast } from "react-toastify";

const URLUpload = () => {
  const [fld_id, setFld_id] = useState("");
  const [files, setFiles] = useState([]);
  const [newUrl, setNewUrl] = useState("");
  const [isUploaded, setUploaded] = useState(false);
  const [uploadStatus, setStatus] = useState([]);
  const [uploadError, setError] = useState([]);

  useEffect(() => {
    if (isUploaded) {
      const interval = setInterval(() => chk_status(interval), 10 * 1000);
      return () => clearInterval(interval);
    }
  }, [isUploaded]);

  async function chk_status(inte) {
    try {
      let response = await axios.get(
        "https://api.streamwish.com/api/file/url_uploads?key=11124m28yb5z5qbkuh1ru"
      );
      let result = response.data.result;
      let errorFiles = result.filter((x) => x.status === "ERROR");
      let workingFiles = result.filter((x) => x.status === "WORKNG");
      toast.success(`${workingFiles.length} files Uploading`)
      toast.error(`${errorFiles.length} files not uploaded`)
      setError([...JSON.parse(sessionStorage.getItem("error") || "[]"), ...errorFiles]);
      sessionStorage.setItem("error", JSON.stringify([...uploadError, ...errorFiles]));

      if (workingFiles.length === 0) {
        sessionStorage.removeItem("error");
        setStatus([]);
        clearInterval(inte);
      } else {
        setStatus(workingFiles);
      }
    } catch (error) {
      console.error("Error checking upload status:", error);
    }
  }

  async function upload() {
    try {
      for (let url of files) {
        await axios.get(
          `https://api.streamwish.com/api/upload/url?fld_id=${fld_id}&key=11124m28yb5z5qbkuh1ru&url=${encodeURIComponent(url)}`,{
            withCredentials:false
          }
        );
      }
      toast.success("Uploaded ")
      sessionStorage.setItem("error", "[]");
      setUploaded(true);
    } catch (error) {
      console.error("Upload error:", error);
    }
  }

  function addUrl() {
    let urls = newUrl.split(",").map((url) => url.trim());
    let newFiles = [...files, ...urls].slice(0, 50);
    setFiles(newFiles);
    setNewUrl("");
  }

  function removeURL(index) {
    setFiles(files.filter((_, i) => i !== index));
  }

  return (
    <div className="flex  w-full items-center gap-6 p-6 bg-gray-900/90 backdrop-blur-lg rounded-xl border border-gray-700 shadow-2xl overflow-auto h-fit">
      <FolderList setFolder={setFld_id} folder={fld_id} />

      <div className="w-full max-w-3xl flex flex-col items-center gap-5 p-6 bg-gray-800/80 border border-gray-600 rounded-lg shadow-lg overflow-auto max-h-[70vh]">
        <h2 className="text-2xl font-bold text-blue-400">🔗 Enter File URLs</h2>

        <span className="text-gray-300 font-mono text-lg">Total Files: {files.length}</span>

        {files.length < 50 && (
          <div className="w-full flex flex-col gap-4">
            <input
              type="text"
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              className="w-full p-3 text-lg text-gray-200 bg-gray-900 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Paste URLs (comma-separated)"
            />
            <div className="flex gap-4 justify-center">
              <button
                onClick={addUrl}
                className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition"
              >
                ➕ Add URL
              </button>
              <button
                onClick={upload}
                className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition"
              >
                🚀 Upload
              </button>
            </div>
          </div>
        )}

        {files.length >= 50 && (
          <p className="text-red-400 font-semibold">⚠️ Maximum 50 URLs allowed!</p>
        )}

        <ul className="w-full mt-4 space-y-2 overflow-auto max-h-40">
          {files.map((url, index) => (
            <li key={index} className="flex justify-between items-center p-2 bg-gray-700 rounded-md">
              <span className="text-gray-300 truncate max-w-[80%]">{url}</span>
              <button
                onClick={() => removeURL(index)}
                className="text-red-500 hover:text-red-400 transition"
              >
                ❌
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default URLUpload;