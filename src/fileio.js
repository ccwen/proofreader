var {store,action,getter,hasGetter,registerGetter,unregisterGetter}=require("./model");
var fs=require("./socketfs");

var fileio={
	init:function(){
		//store.listen("load",this.load,this);
		registerGetter("file",this.getfile);
		registerGetter("save",this.savefile);
	}
	,savefile:function({fn,content},cb){
		console.log("saving",fn);
		fs.writeFile(fn,content,function(err){
			cb(err);
		});
	}
	,getfile:function(fn,cb){
		console.log("loading",fn);
		fs.readFile(fn,function(err,data){
			if (!err) cb(data);
		});
	}
}
module.exports=fileio;