(this["webpackJsonpserve-browserbench"]=this["webpackJsonpserve-browserbench"]||[]).push([[0],{10:function(e,t,n){e.exports=n(16)},15:function(e,t,n){},16:function(e,t,n){"use strict";n.r(t);var a=n(0),r=n.n(a),o=n(2),i=n.n(o),c=(n(15),n(3)),l=n(4),s=n(9),p=n(8),u=n(5),m=n.n(u),d=n(6),h=n.n(d),g=((new(n(7).UAParser)).getResult(),window.browserbench),b=function(e){Object(s.a)(n,e);var t=Object(p.a)(n);function n(){var e;Object(c.a)(this,n);for(var a=arguments.length,r=new Array(a),o=0;o<a;o++)r[o]=arguments[o];return(e=t.call.apply(t,[this].concat(r))).state={output:g.getBenchmarkText()},e.componentDidMount=function(){var t=new h.a;t.showPanel(0),document.body.appendChild(t.dom);requestAnimationFrame((function e(){t.begin(),t.end(),requestAnimationFrame(e)})),setInterval((function(){return e.setState({output:g.getBenchmarkText(),benchmarking:g.isBenchmarking()})}),100)},e}return Object(l.a)(n,[{key:"render",value:function(){var e=this;return r.a.createElement("div",{style:{textAlign:"center"}},r.a.createElement("div",{style:{backgroundColor:"#282c34",minHeight:"100vh",color:"white",display:"flex",flexDirection:"column",alignItems:"center",fontSize:"16px"}},e.state.benchmarking?r.a.createElement(m.a,{type:"cylon",color:"white",height:70,width:70}):r.a.createElement("button",{style:{margin:"20px",paddingTop:"5px",paddingBottom:"5px",paddingLeft:"15px",paddingRight:"15px",height:"30px"},onClick:function(){g.startBenchmarking()}},"Start Benchmark"),r.a.createElement("div",{style:{fontFamily:"monospace",maxWidth:"80vw",background:"hsl(224, 8%, 22%)",borderRadius:"15px",padding:"15px"}},r.a.createElement("div",null),r.a.createElement("div",{style:{marginTop:"15px",overflow:"auto",textAlign:"left",whiteSpace:"pre-wrap",fontFamily:"monospace"}},this.state.output))))}}]),n}(r.a.Component);i.a.render(r.a.createElement(b,null),document.getElementById("root"))}},[[10,1,2]]]);
//# sourceMappingURL=main.f0ebf884.chunk.js.map