var React=require("react");
var ReactDOM=require("react-dom");
var CodeMirror=require("ksana-codemirror").Component;
var E=React.createElement;
var PT=React.PropTypes;
var styles={image:{height:"100%"}};
var Magnifier=require("./magnifier");
var rule=require("./rule_dhammakaya_pts");
var setRule=require("./rule").setRule;
var Controls=require("./controls");
var {store,action,getter,registerGetter,unregisterGetter}=require("./model");
var fileio=require("./fileio");

var Maincomponent = React.createClass({
	getInitialState:function() {
		var m=new Magnifier();
		setRule(rule);
		return {data:"",pageid:rule.initpage,m,dirty:false};
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
		store.listen("loaded",this.loaded,this);
		store.listen("saved",this.saved,this);
		registerGetter("getcontent",this.getcontent);
		registerGetter("setcontent",this.setcontent);
	}
	,componentWillUnmount:function(){
		unregisterGetter("getcontent");
	}
	,getcontent:function(){
		return this.refs.cm.getCodeMirror().getValue();
	}
	,setcontent:function(content){
		this.refs.cm.getCodeMirror().setValue(content);
		if (!this.state.dirty) this.setState({dirty:true});
	}
	,loaded:function(data){
		this.setState({data,dirty:false});
	}
	,saved:function(){
		this.setState({dirty:false});
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
		var pageid=rule.getPageByLine(pos.line);

		if (this.prevline>-1 && pos.line!==this.prevline) {
			rule.markLine(this.prevline,true);
			if (this.state.pageid!==pageid) {
				this.setState({pageid});
			}
		}
		var index=cm.indexFromPos(pos);
		var str=cm.getValue().substr(index-5,10);
		var footnote=rule.getFootnote(str,pageid);
		action("footnote",footnote);
		this.prevline=pos.line;
	}
	,onChange:function(){
		this.setState({dirty:true});
	}
  ,render: function() {
  	if (!this.state.data) {
  		return E("div",{},E(Controls,{}));
  	}
  	return E("div",{},E(Controls,{dirty:this.state.dirty}),
    	E("div",{style:{display:"flex",flexDirection:"row"}},
      	E("div",{style:{flex:4}},
    			E("img",{ref:"image" ,id:"thumb",style:styles.image,
		    			src:rule.getimagefilename(this.state.pageid)})
    			)
    		,E("div",{style:{flex:8}},
	      	E(CodeMirror,{ref:"cm",value:this.state.data,
	      		onChange:this.onChange,
  	    		onCursorActivity:this.onCursorActivity}))
    		)
    	)
  }
});

module.exports=Maincomponent;
