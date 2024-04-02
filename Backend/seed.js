const movies=require('./models/Movies')
const user = require('./models/Users')
const wishlist = require('./models/WishList')
const Series = require('./models/Series')
const Episodes = require('./models/Episode')
const { default: axios } = require('axios')
const Movies = require('./models/Movies')
async function ab(){
    let s=await Movies.find()
    for(i of s){
    let response=await axios.get(`https://api.streamwish.com/api/file/list?key=11124m28yb5z5qbkuh1ru&fld_id=${i.fld_id}`);
    let episodes=[]
    response=response.data.result.files;
    response.sort((x,y)=>{
        if(x.title<y.title)
        return -1
        else
        return 1
      })
    for(let i of response){
        let r=await axios.get(`https://api.streamwish.com/api/file/info?key=11124m28yb5z5qbkuh1ru&file_code=${i.file_code}`)
        let x=r.data.result[0]
        let y=await Episodes.create({file_code:i.file_code,snap_link:x.player_img});
        episodes.push(y._id);
    }
    i.episodes=episodes
    await i.save()
    console.log('Done')
    }
}
module.exports=ab