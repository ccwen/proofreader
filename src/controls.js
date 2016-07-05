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
	,nextwarning:function(){
		this.context.action("nextwarning");
	}
	,render:function(){
		return E("div",{},
			E("button",{onClick:this.automark},"automark"),
			E("button",{onClick:this.nextwarning,style:styles.msg},this.props.msg)
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
		return {fn:"m1.txt"};
	}
	,componentDidMount:function(){
		setTimeout(this.loadfile,1000);
		this.context.store.listen("savefile",this.savefile,this);		
	}
	,loadfile:function(){
		var action=this.context.action;
		this.context.getter("file",this.state.fn,function(data){
			action("loaded",data);
		});
	}
	,loadnextfile:function(){
		var fn=this.state.fn.replace(/\d+/,function(m){
			return parseInt(m)+1;
		});
		this.setState({fn},function(){
			this.loadfile();
		}.bind(this));
	}
	,savefile:function(){
		if (!this.props.dirty)return;
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
			E("button",{onClick:this.loadfile,disabled:this.props.dirty},"load"),
			E("button",{onClick:this.loadnextfile,disabled:this.props.dirty},"next"),
			E("input",{size:5,value:this.state.fn,onChange:this.onInput,disabled:this.props.dirty}),
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
	note:{fontSize:"50%"},
	msg:{fontSize:"50%"}
}
/*
  HOT KEY for next error

*/
module.exports=Controls;
