var React=require("react");

var E=React.createElement;
var PT=React.PropTypes;
var loadSaveButton=React.createClass({
	contextTypes:{
    	action:PT.func,
    	getter:PT.func
	}
	,getInitialState:function(){
		return {fn:"d1.xml"};
	}
	,loadfile:function(){
		var action=this.context.action;
		this.context.getter("file",this.state.fn,function(data){
			action("loaded",data);
		});
	}
	,onInput:function(e){
		this.setState({fn:e.target.value});
	}
	,render:function(){
		return E("div",{},
			E("input",{value:this.state.fn,onChange:this.onInput})
				,E("button",{onClick:this.loadfile},"load"),
			E("button",{},"save")
		)	
	}
	
});

var Controls=React.createClass({
	render:function(){
		return E("div",{style:{right:20,zIndex:100,
			height:30,background:"gray",position:"absolute"}},
			E(loadSaveButton));
	}
})
/*
  save , and load 
  control code : ~ , # , ^
  {} //fix up
  jump to a paragraph/page
  show footnote when 
  show error/warning message ( repeat or missing footnote)

  automarkup paragraph and footnote

  jump to next error

*/
module.exports=Controls;
