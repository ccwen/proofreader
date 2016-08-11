var React=require("react");
var ReactDOM=require("react-dom");
var PDF = require("./react-pdf");
var E=React.createElement;
var styles={
	container:{
		float:"left",overflow:"hidden", 
	}
}
var PDFViewer = React.createClass({
  render: function() {
  	styles.container.width=(window.innerWidth*(this.props.rwidth||0.5))+"px";

  	if (!this.props.pdffn) return E("div",{style:{width:"100%"}},"");
  	return E("div",{style:styles.container},
    	E(PDF,{file:this.props.pdffn, scale:1.4, left:-140,top:-150,
    	page:parseInt(this.props.page)})
    	);
  },
  _onPdfCompleted: function(page, pages){
    //this.setState({page: page, pages: pages});
  }
});
module.exports=PDFViewer;