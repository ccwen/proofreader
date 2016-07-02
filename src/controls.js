var React=require("react");

var E=React.createElement;
var PT=React.PropTypes;
var markupButtons=React.createClass({
	contextTypes:{
    	action:PT.func,
    	getter:PT.func
	}	
	,automark:function(){
		this.context.getter("automark");
	}
	,render:function(){
		return E("div",{},
			E("button",{onClick:this.automark},"automark")
		)	
	}
});
var loadSaveButtons=React.createClass({
	contextTypes:{
    	action:PT.func,
    	getter:PT.func
	}
	,getInitialState:function(){
		return {fn:"d1.xml"};
	}
	,componentDidMount:function(){
		setTimeout(this.loadfile,1000);
	}
	,loadfile:function(){
		var action=this.context.action;
		this.context.getter("file",this.state.fn,function(data){
			action("loaded",data);
		});
	}
	,savefile:function(){
		var action=this.context.action;
		var content=this.context.getter("getcontent");
		this.context.getter("save",{fn:this.state.fn,content},function(err){
			action("saved");
		});
	}
	,onInput:function(e){
		this.setState({fn:e.target.value});
	}
	,render:function(){
		return E("div",{},
			E("input",{value:this.state.fn,onChange:this.onInput,disabled:this.props.dirty})
				,E("button",{onClick:this.loadfile,disabled:this.props.dirty},"load"),
			E("button",{onClick:this.savefile,disabled:!this.props.dirty},"save")
		)	
	}
	
});

var Controls=React.createClass({
	render:function(){
		return E("div",{style:{right:20,zIndex:100,
			height:30,background:"gray",position:"absolute"}},
			E(loadSaveButtons,this.props),E(markupButtons,this.props));
	}
})
/*
  save , and load 
  control code : ~ , # , ^
  


  show footnote when 
  show error/warning message ( repeat or missing footnote)
  jump to next page with error

  automarkup paragraph and footnote

*/
module.exports=Controls;
