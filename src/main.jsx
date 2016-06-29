var React=require("react");
var ReactDOM=require("react-dom");
var CodeMirror=require("ksana-codemirror").Component;
var E=React.createElement;
var styles={image:{height:"100%"}};
var Magnifier=require("./magnifier");
var rule=require("./rule_dhammakaya_pts");
var Controls=require("./controls");
var Maincomponent = React.createClass({
	getInitialState:function() {
		var m=new Magnifier();
		return {data:"",pageid:rule.initpage,m};
	}
	,prevline:-1
	
	,componentWillMount:function(){
		rule.loadfile.call(this,"d1.xml");
	}
	,componentDidUpdate:function() {
		this.cm=this.refs.cm.getCodeMirror();//codemirror instance
		this.doc=this.cm.getDoc();

		rule.setDoc(this.doc);
		rule.markAllLine();
		var imgfn=rule.getimagefilename(this.state.pageid);
		this.state.m.attach({
		    thumb: '#thumb',
		    large: imgfn,
		    mode: 'inside',
		    zoom: 2.5,
		    zoomable: true
		});		
	}	

	,onCursorActivity:function(cm) {
		var pos=cm.getCursor();
		if (this.prevline>-1 && pos.line!==this.prevline) {
			rule.markLine(this.prevline,true);
			var pageid=rule.getPageByLine(pos.line);
			if (this.state.pageid!==pageid) {
				this.setState({pageid});
			}
		}
		this.prevline=pos.line;
	}
  ,render: function() {
  	if (!this.state.data) {
  		return E("div",{},"Loading");
  	}
  	return E("div",{},E(Controls,{}),
    	E("div",{style:{display:"flex",flexDirection:"row"}},
      	E("div",{style:{flex:4}},
    			E("img",{ref:"image" ,id:"thumb",style:styles.image,
		    			src:rule.getimagefilename(this.state.pageid)})
    			)
    		,E("div",{style:{flex:8}},
	      	E(CodeMirror,{ref:"cm",value:this.state.data,
  	    		onCursorActivity:this.onCursorActivity}))
    		)
    	)
  }
});

module.exports=Maincomponent;
