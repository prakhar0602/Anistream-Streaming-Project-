const { default: axios } = require("axios");

const fetchFileInfo = async(file_code)=>{
    let response = await axios.get(
        `https://api.streamwish.com/api/file/info?key=${process.env.API_KEY}&file_code=${file_code}`
    );
    let x = response.data.result[0];
    return x;
}

const fetchFolderList = async(fld_id)=>{
    let response=await axios.get(`https://api.streamwish.com/api/folder/list?key=${process.env.API_KEY}&fld_id=${fld_id}`);
    console.log(response)
    response=response.data.result.folders;
     response.sort((x,y)=>{
        if(x.name<y.name)
        return -1
        else
        return 1
      })
    return response;
    
}

const fetchFileList = async(fld_id)=>{
    let response=await axios.get(`https://api.streamwish.com/api/file/list?key=${process.env.API_KEY}&fld_id=${fld_id}`);
    response=response.data.result.files;
    response.sort((x,y)=>{
        if(x.title<y.title)
        return -1
        else
        return 1
      })
    
    return response;
}

module.exports = {fetchFileInfo,fetchFileList,fetchFolderList};