/*
from https://github.com/nnarhinen/react-pdf/blob/master/index.js
adding big canvas scroll inside div 
http://stackoverflow.com/questions/16128604/scrollable-canvas-inside-div

*/
var React = require('react');
var ReactDOM = require('react-dom');

var Pdf = React.createClass({
  displayName: 'React-PDF',
  propTypes: {
    file: React.PropTypes.string,
    content: React.PropTypes.string,
    page: React.PropTypes.number,
    scale: React.PropTypes.number,
    onDocumentComplete: React.PropTypes.func,
    onPageComplete: React.PropTypes.func
  },
  getInitialState: function() {
    this.marginLeft=this.props.marginLeft||0;
    this.marginTop=this.props.marginTop||0;
    return { scale:this.props.scale};
  },
  getDefaultProps: function() {
    return {page: 1, scale: 1.0};
  },
  componentDidMount: function() {
    this._loadPDFDocument(this.props);
  },
  _loadByteArray: function(byteArray) {
    PDFJS.getDocument(byteArray).then(this._onDocumentComplete);
  },
  _loadPDFDocument: function(props) {
    if(!!props.file){
      if (typeof props.file === 'string') return PDFJS.getDocument(props.file).then(this._onDocumentComplete);
      // Is a File object
      var reader = new FileReader(), self = this;
      reader.onloadend = function() {
        self._loadByteArray(new Uint8Array(reader.result));
      };
      reader.readAsArrayBuffer(props.file);
    }
    else if(!!props.content){
      var bytes = window.atob(props.content);
      var byteLength = bytes.length;
      var byteArray = new Uint8Array(new ArrayBuffer(byteLength));
      for(index = 0; index < byteLength; index++) {
        byteArray[index] = bytes.charCodeAt(index);
      }
      this._loadByteArray(byteArray);
    }
    else {
      console.error('React_Pdf works with a file(URL) or (base64)content. At least one needs to be provided!');
    }
  },
  componentWillReceiveProps: function(newProps) {
    if ((newProps.file && newProps.file !== this.props.file) || (newProps.content && newProps.content !== this.props.content)) {
      this._loadPDFDocument(newProps);
    }
    if (!!this.state.pdf && !!newProps.page && newProps.page !== this.props.page) {
      this.setState({page: null});
      this.state.pdf.getPage(newProps.page).then(this._onPageComplete);
    }
  },
  render: function() {
    var self = this;

    if (!!this.state.page){
      setTimeout(function() {
        if(self.isMounted()){
          var canvas = ReactDOM.findDOMNode(self.refs.pdfCanvas),
            context = canvas.getContext('2d'),
            scale = self.state.scale,
            viewport = self.state.page.getViewport(scale);
          canvas.height = viewport.height;
          canvas.width = viewport.width;

          canvas.style.marginLeft = self.marginLeft+ "px";
          canvas.style.marginTop = self.marginTop + "px";

          var renderContext = {
            canvasContext: context,
            viewport: viewport
          };
          self.state.page.render(renderContext);
        }
      });
      return (React.createElement("canvas", {
        onMouseDown:this.onMouseDown,
        onMouseMove:this.onMouseMove,
        onMouseUp:this.onMouseUp,
        onWheel:this.onWheel,
        ref: "pdfCanvas"}));
    }
    return (this.props.loading || React.createElement("div", null, "Loading pdf...."));
  },
  lastX:0,
  lastY:0,
  toscale:0,
  marginLeft:0,
  marginTop:0,
  rescale:function(){
    //todo , ajdust margin left right when rescale
    var s=this.toscale/10;
    var scale=this.state.scale+s;
    if (scale<0.5 )scale=0.5;
    if (scale>3) scale=3;

    this.marginLeft+=(s*this.marginLeft);
    this.marginTop+=(s*this.marginTop);
    this.toscale=0;
    this.setState({scale});
  }
  ,onWheel:function(e){
    var m=-(e.deltaY/100);
    this.toscale+=m;
    clearTimeout(this.scaletimer);
    this.scaletimer=setTimeout(function(){
      this.rescale();
    }.bind(this),300);
  },
  onMouseMove:function(e){
    if (this.dragging) {
        var canvas = ReactDOM.findDOMNode(this.refs.pdfCanvas);
        var xdelta = e.clientX - this.lastX;
        var ydelta = e.clientY - this.lastY;
        this.lastX = e.clientX;
        this.lastY = e.clientY;
        this.marginLeft += xdelta;
        this.marginTop += ydelta;
        canvas.style.marginLeft = this.marginLeft + "px";
        canvas.style.marginTop = this.marginTop + "px";
    }
    e.preventDefault();
  },
  onMouseDown:function(e){
    this.dragging = true;
    this.lastX = e.clientX;
    this.lastY = e.clientY;
    e.preventDefault();
  }, 
  onMouseUp:function(){
     this.dragging = false;
  },
  _onDocumentComplete: function(pdf){
    if (!this.isMounted()) return;
    this.setState({ pdf: pdf });
    if(!!this.props.onDocumentComplete && typeof this.props.onDocumentComplete === 'function'){
      this.props.onDocumentComplete(pdf.numPages);
    }
    pdf.getPage(this.props.page).then(this._onPageComplete);
  },
  _onPageComplete: function(page){
    if (!this.isMounted()) return;
    this.setState({ page: page });
    if(!!this.props.onPageComplete && typeof this.props.onPageComplete === 'function'){
      this.props.onPageComplete(page.pageIndex + 1);
    }
  }
});

module.exports = Pdf;
