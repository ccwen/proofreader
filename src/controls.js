var React=require("react");

var E=React.createElement;
var PT=React.PropTypes;
var markupButtons=React.createClass({
	contextTypes:{
    	action:PT.func,
    	getter:PT.func
	}	
	,automark:function(){
		var content=this.context.getter("getcontent");
		var newcontent=this.context.getter("automark",content);
		this.context.getter("setcontent",newcontent);
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
    	getter:PT.func,
    	store:PT.object
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
	contextTypes:{
    	store:PT.object
	}
	,getInitialState:function(){
		return {note:""};
	}
	,componentDidMount:function(){
		this.context.store.listen("footnote",this.footnote,this);		
	}
	,footnote:function(note){
		this.setState({note});
	}
	,render:function(){
		return E("div",{style:{right:20,width:250,zIndex:100,
			height:120,background:"silver",position:"absolute"}},
			E(loadSaveButtons,this.props),E(markupButtons,this.props),
			E("div",{},E("span",{style:styles.note},this.state.note))
		);
	}
})
var styles={
	note:{fontSize:"50%"}
}
/*
  save , and load 
  control code : ~ , # , ^
  


  show footnote when 
  show error/warning message ( repeat or missing footnote)
  jump to next page with error

  automarkup paragraph and footnote

*/
module.exports=Controls;
