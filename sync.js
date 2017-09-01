const request = require("request");
const fs= require('fs');
const async = require('async');
const config = require('./config/config');
const credentials = config.credentials;
const rootdir=config.rootdir;

function ensureDirectory(path,callback){
    fs.stat(path,function(err,stats){
        if(err&&err.errno!=-2)
            callback(err);
        else{
            if(!stats&&err&&err.errno==-2){
                fs.mkdir(path,function(err){
                    callback(err,true);
                })
            }
            else if(!stats.isDirectory()){
                callback("Allready exists and is not a directory");
            }
            else{
                callback(null,false);
            }
        }    
    })
}
function createRepoAndConnectRemote(repo){
var simplegit;

    async.waterfall([
            function(callback){
                   ensureDirectory(rootdir + repo.slug,callback); 
            },
            function(create,callback){
                if(create===true){
                    const git = require('simple-git/promise')(rootdir+repo.slug);
                    console.log("Creating:" + repo.slug );
                    git
                    .silent(false)
                    .init()
                    //.clone(remote)//.pull(remote,'master','origin')
                    .then(() => callback(null,false))
                    .catch((err) => callback('failed: ' + err));
                }
                else
                    callback(null,false);
            },
            function(create,callback){
                const USER = credentials.username;
                const PASS = credentials.password;
                const REPO = 'bitbucket.org/' + repo.owner + "/" + repo.slug;
                const remote = `https://${USER}:${PASS}@${REPO}`;
                const git = require('simple-git/promise')(rootdir+repo.slug);
                     console.log("Pulling:" + repo.slug );
                    git
                .silent(false)
                //.init()
                .pull(remote,'master')
                .then((update) =>{ 
                    if(update && update.summary.changes) {
                           console.log(update.summary.changes  + "applied to " + repo.slug);
                        }
                    callback(null,'pulled');
                })
                .catch((err) => callback('failed: ' + err + "@" + repo.slug));
                
            }
        ],function(err,results){
            if(err){
                console.log(err);
            }
            else{
                console.log(results)
            }
        });
};
request.get({
  'url':'https://api.bitbucket.org/1.0/user/repositories/', 
  'auth': {
    'user': credentials.username,
    'pass': credentials.password,
    'sendImmediately': false
  },
  'json':true
},function(err,response,repos){
    for(let i=0;i<5/*repos.length*/;i++){
        createRepoAndConnectRemote(repos[i]);
    }
});
