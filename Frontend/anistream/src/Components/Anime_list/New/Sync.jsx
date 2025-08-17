import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import loadingGif from '../../../Assets/loading.gif';

let {VITE_BACKEND_LINK} = import.meta.env;

const Sync = () => {
    const [folders, setFolders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [syncing, setSyncing] = useState({});
    const user = useSelector((state) => state.user.user);
    
    const genreOptions = [
        "Action", "Adventure", "Comedy", "Drama", "Fantasy", "Horror", "Mystery", 
        "Romance", "Sci-Fi", "Thriller", "Slice of Life", "Sports", "Supernatural", 
        "Mecha", "Historical", "School", "Military", "Music", "Psychological"
    ];

    async function sync() {
        if (user.type != 'admin') {
            toast.warning('Request Rejected', { position: 'top-center' });
            return;
        }
        
        setIsLoading(true);
        try {
            let response = await axios.get(`${VITE_BACKEND_LINK}/getSyncedfolders/${user._id}`);
            const folderData = response.data.folders;
            setFolders(folderData);
        } catch (error) {
            toast.error('Failed to sync folders');
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    }
    
    async function handleSubmit(e, folder) {
        e.preventDefault();
        if (user.type != 'admin') {
            toast.warning('Request Rejected', { position: 'top-center' });
            return;
        }

        setSyncing(prev => ({ ...prev, [folder.fld_id]: true }));
        
        const formData = new FormData(e.target);
        const genres = Array.from(e.target.querySelectorAll('input[name="genres"]:checked')).map(cb => cb.value);
        
        try {
            const payload = {
                name: formData.get('name'),
                cover_image: formData.get('cover_image'),
                cover_image2: formData.get('cover_image2') || formData.get('cover_image'),
                big_image: formData.get('big_image'),
                desc: formData.get('desc'),
                fld_id: folder.fld_id,
                nseasons: formData.get('nseasons'),
                nepisodes: formData.get('nepisodes'),
                type: formData.get('type'),
                userID: user._id,
                genres: JSON.stringify(genres)
            };

            await axios.post(`${VITE_BACKEND_LINK}/add_anime`, payload);
            
            setFolders(prev => prev.filter(f => f.fld_id !== folder.fld_id));
            toast.success(`${formData.get('name')} added successfully!`);
        } catch (error) {
            toast.error('Failed to add anime');
            console.log(error);
        } finally {
            setSyncing(prev => ({ ...prev, [folder.fld_id]: false }));
        }
    }

    function removeFolder(folderId) {
        if (user.type != 'admin') {
            toast.warning('Request Rejected', { position: 'top-center' });
            return;
        }
        setFolders(prev => prev.filter(f => f.fld_id !== folderId));
        toast.info('Folder removed from sync list');
    }

    useEffect(() => {
        sync();
    }, []);

    if (isLoading) {
        return (
            <div className="h-screen w-full flex justify-center items-center text-white bg-[#121212]">
                <img src={loadingGif} className="w-32" alt="Loading" />
                <p className="text-xl ml-4">Loading sync data...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#121212] text-white p-6">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-orange-400 mb-2">Sync Folders</h1>
                    <p className="text-gray-400">Add synced folders to your anime collection</p>
                    <div className="mt-4 flex justify-center gap-4">
                        <span className="bg-blue-600 px-3 py-1 rounded text-sm">{folders.length} folders found</span>
                        <button 
                            onClick={sync}
                            className="bg-orange-600 hover:bg-orange-700 px-4 py-1 rounded text-sm transition"
                        >
                            Refresh
                        </button>
                    </div>
                </div>

                {folders.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="text-6xl mb-4">📁</div>
                        <h2 className="text-2xl font-semibold mb-2">No folders to sync</h2>
                        <p className="text-gray-400">All folders have been processed or no new folders found.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {folders.map((folder) => (
                            <div key={folder.fld_id} className="bg-gray-800 rounded-lg p-6 hover:bg-gray-700 transition">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-xl font-semibold text-orange-400">{folder.name}</h3>
                                    <button
                                        onClick={() => removeFolder(folder.fld_id)}
                                        className="text-red-400 hover:text-red-300 text-sm"
                                        title="Remove from sync"
                                    >
                                        ✕ Remove
                                    </button>
                                </div>
                                
                                <form onSubmit={(e) => handleSubmit(e, folder)} className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <input
                                            type="text"
                                            name="name"
                                            placeholder="Anime Name"
                                            defaultValue={folder.name}
                                            className="p-3 rounded bg-gray-700 text-white border border-gray-600"
                                            required
                                        />
                                        <input
                                            type="text"
                                            name="cover_image"
                                            placeholder="Cover Image URL"
                                            className="p-3 rounded bg-gray-700 text-white border border-gray-600"
                                            required
                                        />
                                        <input
                                            type="text"
                                            name="cover_image2"
                                            placeholder="Cover Image 2 URL (optional)"
                                            className="p-3 rounded bg-gray-700 text-white border border-gray-600"
                                        />
                                        <input
                                            type="text"
                                            name="big_image"
                                            placeholder="Big Image URL"
                                            className="p-3 rounded bg-gray-700 text-white border border-gray-600"
                                            required
                                        />
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                name="nepisodes"
                                                placeholder="Episodes"
                                                className="p-3 rounded bg-gray-700 text-white border border-gray-600 flex-1"
                                            />
                                            <input
                                                type="text"
                                                name="nseasons"
                                                placeholder="Seasons"
                                                className="p-3 rounded bg-gray-700 text-white border border-gray-600 flex-1"
                                            />
                                        </div>
                                        <input
                                            type="text"
                                            value={folder.fld_id}
                                            disabled
                                            className="p-3 rounded bg-gray-600 text-gray-300 border border-gray-600"
                                        />
                                    </div>
                                    
                                    <textarea
                                        name="desc"
                                        placeholder="Description"
                                        className="w-full p-3 rounded bg-gray-700 text-white border border-gray-600 h-24"
                                        required
                                    />
                                    
                                    <div>
                                        <label className="text-white block mb-2">Genres:</label>
                                        <div className="grid grid-cols-3 gap-2 max-h-32 overflow-y-auto bg-gray-700 p-3 rounded border border-gray-600">
                                            {genreOptions.map(genre => (
                                                <label key={genre} className="flex items-center gap-2 text-white cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        name="genres"
                                                        value={genre}
                                                    />
                                                    <span className="text-sm">{genre}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <label className="text-white block mb-2">Type:</label>
                                        <div className="flex gap-6">
                                            <label className="flex items-center gap-2 text-white cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name="type"
                                                    value="series"
                                                    required
                                                />
                                                <span>Series</span>
                                            </label>
                                            <label className="flex items-center gap-2 text-white cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name="type"
                                                    value="movies"
                                                    required
                                                />
                                                <span>Movies</span>
                                            </label>
                                        </div>
                                    </div>
                                    
                                    <div className="flex gap-3 justify-end pt-4">
                                        <button
                                            type="button"
                                            onClick={() => removeFolder(folder.fld_id)}
                                            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                                        >
                                            Skip
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={syncing[folder.fld_id]}
                                            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:opacity-50 flex items-center gap-2"
                                        >
                                            {syncing[folder.fld_id] ? (
                                                <>
                                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                    Adding...
                                                </>
                                            ) : (
                                                'Add to Collection'
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Sync;