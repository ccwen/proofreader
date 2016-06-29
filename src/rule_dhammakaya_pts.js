/* convert simple markup to tag */
/* give warning for */
var fs=require("./socketfs");
var PBLINE=[];
var initpage="6.1";

var doc=null;

var onTagClick=function(e) {
		var marker=e.target.marker;
		var pos=marker.find();
		doc.setCursor(pos.to);
		doc.cm.focus();
		marker.clear();
}

var createMarker=function(classname,tag) {
		var element=document.createElement("SPAN");
		element.className=classname;
		element.innerHTML=tag;
		element.onclick=onTagClick;
		return element;
}

var markLine=function(i,rebuild) {
		var line=doc.getLine(i);
		var dirty=false;
		line.replace(/~(\d+)\.(\d+)/g,function(m,vol,pg,idx){
			var element=createMarker("pbmarker",vol+"."+pg);
			var marker=doc.markText({line:i,ch:idx},{line:i,ch:idx+m.length},
				{clearOnEnter:true,replacedWith:element});
			element.marker=marker;
		});

		line.replace(/\^(\d+)/g,function(m,m1,idx){
			var element=createMarker("paragraph",m1);
			var marker=doc.markText({line:i,ch:idx},{line:i,ch:idx+m.length},
				{clearOnEnter:true,replacedWith:element});
			element.marker=marker;
		});

		line.replace(/#(\d+)/g,function(m,m1,idx){
			var element=createMarker("footnote",m1);
			var marker=doc.markText({line:i,ch:idx},{line:i,ch:idx+m.length},
				{clearOnEnter:true,replacedWith:element});
			element.marker=marker;
		});

		line.replace(/\{(.+?)\}/g,function(m,m1,idx){
			var element=createMarker("correction",m1);
			var marker=doc.markText({line:i,ch:idx},{line:i,ch:idx+m.length},
				{clearOnEnter:true,replacedWith:element});
			element.marker=marker;
		});

		setTimeout(function(){
			if (rebuild && dirty) buildPBLINE();
		},100);//<pb id="1.2b"/>
	}

var getimagefilename=function(pageid) {
		var m=pageid.match(/(\d+)\.(\d+)/);
		vol=parseInt(m[1],10);
		pg="00"+(parseInt(m[2],10)+10);

		pg=pg.substr(pg.length-3);
		return "images/"+vol+"/"+pg+".png";
}
var markAllLine=function() {
	for (var i=0;i<doc.lineCount();i++){
		markLine(i);
	}
	buildPBLINE();
}

var buildPBLINE=function() {
		//var t=new Date();
		var marks=doc.getAllMarks();
		PBLINE=[];
		for (var i=0;i<marks.length;i++) {
			var m=marks[i];
			if (m.replacedWith.className=="pbmarker") {
				var pos=m.find();
				PBLINE.push([pos.from.line,m.replacedWith.innerHTML]);
			}
		}
		PBLINE.sort(function(a,b){
			return a[0]-b[0];
		});

		//console.log("rebuild pbline",new Date()-t);
	}
var loadfile=function(fn){
	fs.readFile("d1.xml",function(err,data){
		this.setState({data});
	}.bind(this));
}
var setDoc=function(_doc){
	doc=_doc;
}
var getPageByLine=function(line) {
		for (var i=1;i<PBLINE.length;i++) {
			var pbline=PBLINE[i];
			if (pbline[0]>line) {
				return PBLINE[i-1][1];
			}
		}
		return 1;//default
}

module.exports={loadfile,markAllLine,markLine,initpage,getimagefilename,setDoc
,getPageByLine};