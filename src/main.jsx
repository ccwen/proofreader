var React=require("react");
var ReactDOM=require("react-dom");
var CodeMirror=require("ksana-codemirror").Component;
var E=React.createElement;
var PT=React.PropTypes;
var styles={image:{height:"100%"}};
var Magnifier=require("./magnifier");
var rule=require("./rule_dhammakaya_pts");
var Controls=require("./controls");
var {store,action,getter,registerGetter,unregisterGetter}=require("./model");
var fileio=require("./fileio");

var Maincomponent = React.createClass({
	getInitialState:function() {
		var m=new Magnifier();
		return {data:"",pageid:rule.initpage,m};
	}
	,prevline:-1
  ,childContextTypes: {
    store: PT.object
    ,action: PT.func
    ,getter: PT.func
    ,registerGetter:PT.func
    ,unregisterGetter:PT.func
  }
  ,getChildContext:function(){
    return {action,store,getter,registerGetter,unregisterGetter};
  }
	,componentWillMount:function(){
		fileio.init();
		store.listen("loaded",this.loaded,this)
	}
	,loaded:function(data){
		this.setState({data});
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
  		return E("div",{},E(Controls,{}));
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
