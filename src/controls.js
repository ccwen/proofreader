var React=require("react");

var E=React.createElement;

var Controls=React.createClass({
	render:function(){
		return E("div",{style:{right:20,zIndex:100,
			height:30,background:"gray",position:"absolute"}},"Controls");
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
