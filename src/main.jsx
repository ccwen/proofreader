var React=require("react");
var ReactDOM=require("react-dom");
var CodeMirror=require("ksana-codemirror").Component;
var fs=require("./socketfs");
var E=React.createElement;
var styles={image:{width:"100%"}};

var Maincomponent = React.createClass({
	getInitialState:function() {
		return {data:"",pageid:"6.1"}
	}
	,prevline:-1
	,PBLINE:[]
	,componentWillMount:function(){
		fs.readFile("d1.xml",function(err,data){
			this.setState({data});
		}.bind(this));
	}
	,imageLoaded:function() {
		//var imageheight=ReactDOM.findDOMNode(this.refs.image).offsetHeight;
		//this.refs.cm.getCodeMirror().setSize(null,document.body.offsetHeight-imageheight);
	}
	,componentDidUpdate:function() {
		this.cm=this.refs.cm.getCodeMirror();//codemirror instance
		this.doc=this.cm.getDoc();
		this.markAllTag();
	}
	,buildPBLINE:function() {
		var marks=this.doc.getAllMarks();
		this.PBLINE=[];
		for (var i=0;i<marks.length;i++) {
			var m=marks[i];
			if (m.replacedWith.className=="pbmarker") {
				var pos=m.find();
				this.PBLINE.push([pos.from.line,m.replacedWith.innerHTML]);
			}
		}
		this.PBLINE.sort(function(a,b){
			return a[0]-b[0];
		});
	}
	,getPageIdByLine:function(line) {
		for (var i=1;i<this.PBLINE.length;i++) {
			var pbline=this.PBLINE[i];
			if (pbline[0]>line) {
				return this.PBLINE[i-1][1];
			}
		}
		return 1;//default
	}
	,pageId2filename:function() {
		if (!this.state.pageid)return;
		var m=this.state.pageid.match(/(\d+)\.(\d+)/);
		vol=parseInt(m[1],10);
		pg="00"+(parseInt(m[2],10)+10);

		pg=pg.substr(pg.length-3);
		return "images/"+vol+"/"+pg+".png";
	}
	,onTagClick:function(e) {
		var marker=e.target.marker
		var pos=marker.find();
		this.doc.setCursor(pos.to);
		this.cm.focus();
		marker.clear();
	}
	,createMarker:function(tag) {
		var element=document.createElement("SPAN");
		element.className="pbmarker";
		element.innerHTML=tag;
		element.onclick=this.onTagClick;
		return element;
	}
	,markLineTag:function(i,rebuild) {
		var line=this.doc.getLine(i);
		var dirty=false;
		line.replace(/~(\d+)\.(\d+)/g,function(m,vol,pg,idx){
			var element=this.createMarker(vol+"."+pg);
			var marker=this.doc.markText({line:i,ch:idx},{line:i,ch:idx+m.length},
				{clearOnEnter:true,replacedWith:element});
			element.marker=marker;
		}.bind(this));
		setTimeout(function(){
			if (rebuild && dirty) this.buildPBLINE();
		}.bind(this),100);//<pb id="1.2b"/>
	}
	,markAllTag:function() {
		for (var i=0;i<this.doc.lineCount();i++){
			this.markLineTag(i);
		}
		this.buildPBLINE();
	}
	,onCursorActivity:function(cm) {
		var pos=cm.getCursor();
		if (this.prevline>-1 && pos.line!==this.prevline) {
			this.markLineTag(this.prevline,true);
			var pageid=this.getPageIdByLine(pos.line);
			if (pageid!==this.state.pageid) this.setState({pageid:pageid});
		}
		this.prevline=pos.line;
	}
  ,render: function() {
  	if (!this.state.data) {
  		return E("div",{},"Loading");
  	}
    return E("div",{style:{display:"flex",flexDirection:"row"}},
    	E("div",{style:{flex:8}},
      	E(CodeMirror,{ref:"cm",value:this.state.data,onCursorActivity:this.onCursorActivity})),
      E("div",{style:{flex:4}},
    		E("img",{ref:"image" ,style:styles.image,src:this.pageId2filename(),onLoad:this.imageLoaded})
    		)
    	);
  }
});

module.exports=Maincomponent;
