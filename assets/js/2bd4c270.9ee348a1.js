"use strict";(self.webpackChunklondogard=self.webpackChunklondogard||[]).push([[6509],{3905:function(e,t,n){n.d(t,{Zo:function(){return m},kt:function(){return c}});var a=n(7294);function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function l(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?l(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):l(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function o(e,t){if(null==e)return{};var n,a,r=function(e,t){if(null==e)return{};var n,a,r={},l=Object.keys(e);for(a=0;a<l.length;a++)n=l[a],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(e);for(a=0;a<l.length;a++)n=l[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var s=a.createContext({}),p=function(e){var t=a.useContext(s),n=t;return e&&(n="function"==typeof e?e(t):i(i({},t),e)),n},m=function(e){var t=p(e.components);return a.createElement(s.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},d=a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,l=e.originalType,s=e.parentName,m=o(e,["components","mdxType","originalType","parentName"]),d=p(n),c=r,h=d["".concat(s,".").concat(c)]||d[c]||u[c]||l;return n?a.createElement(h,i(i({ref:t},m),{},{components:n})):a.createElement(h,i({ref:t},m))}));function c(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var l=n.length,i=new Array(l);i[0]=d;var o={};for(var s in t)hasOwnProperty.call(t,s)&&(o[s]=t[s]);o.originalType=e,o.mdxType="string"==typeof e?e:r,i[1]=o;for(var p=2;p<l;p++)i[p]=n[p];return a.createElement.apply(null,i)}return a.createElement.apply(null,n)}d.displayName="MDXCreateElement"},8215:function(e,t,n){var a=n(7294);t.Z=function(e){var t=e.children,n=e.hidden,r=e.className;return a.createElement("div",{role:"tabpanel",hidden:n,className:r},t)}},9877:function(e,t,n){n.d(t,{Z:function(){return m}});var a=n(7462),r=n(7294),l=n(2389),i=n(9548),o=n(6010),s="tabItem_LplD";function p(e){var t,n,l,p=e.lazy,m=e.block,u=e.defaultValue,d=e.values,c=e.groupId,h=e.className,k=r.Children.map(e.children,(function(e){if((0,r.isValidElement)(e)&&void 0!==e.props.value)return e;throw new Error("Docusaurus error: Bad <Tabs> child <"+("string"==typeof e.type?e.type:e.type.name)+'>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.')})),f=null!=d?d:k.map((function(e){var t=e.props;return{value:t.value,label:t.label,attributes:t.attributes}})),g=(0,i.lx)(f,(function(e,t){return e.value===t.value}));if(g.length>0)throw new Error('Docusaurus error: Duplicate values "'+g.map((function(e){return e.value})).join(", ")+'" found in <Tabs>. Every value needs to be unique.');var b=null===u?u:null!=(t=null!=u?u:null==(n=k.find((function(e){return e.props.default})))?void 0:n.props.value)?t:null==(l=k[0])?void 0:l.props.value;if(null!==b&&!f.some((function(e){return e.value===b})))throw new Error('Docusaurus error: The <Tabs> has a defaultValue "'+b+'" but none of its children has the corresponding value. Available values are: '+f.map((function(e){return e.value})).join(", ")+". If you intend to show no default tab, use defaultValue={null} instead.");var v=(0,i.UB)(),y=v.tabGroupChoices,w=v.setTabGroupChoices,N=(0,r.useState)(b),T=N[0],P=N[1],I=[],C=(0,i.o5)().blockElementScrollPositionUntilNextRender;if(null!=c){var x=y[c];null!=x&&x!==T&&f.some((function(e){return e.value===x}))&&P(x)}var E=function(e){var t=e.currentTarget,n=I.indexOf(t),a=f[n].value;a!==T&&(C(t),P(a),null!=c&&w(c,a))},S=function(e){var t,n=null;switch(e.key){case"ArrowRight":var a=I.indexOf(e.currentTarget)+1;n=I[a]||I[0];break;case"ArrowLeft":var r=I.indexOf(e.currentTarget)-1;n=I[r]||I[I.length-1]}null==(t=n)||t.focus()};return r.createElement("div",{className:"tabs-container"},r.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,o.Z)("tabs",{"tabs--block":m},h)},f.map((function(e){var t=e.value,n=e.label,l=e.attributes;return r.createElement("li",(0,a.Z)({role:"tab",tabIndex:T===t?0:-1,"aria-selected":T===t,key:t,ref:function(e){return I.push(e)},onKeyDown:S,onFocus:E,onClick:E},l,{className:(0,o.Z)("tabs__item",s,null==l?void 0:l.className,{"tabs__item--active":T===t})}),null!=n?n:t)}))),p?(0,r.cloneElement)(k.filter((function(e){return e.props.value===T}))[0],{className:"margin-vert--md"}):r.createElement("div",{className:"margin-vert--md"},k.map((function(e,t){return(0,r.cloneElement)(e,{key:t,hidden:e.props.value!==T})}))))}function m(e){var t=(0,l.Z)();return r.createElement(p,(0,a.Z)({key:String(t)},e))}},2845:function(e,t,n){n.r(t),n.d(t,{frontMatter:function(){return p},contentTitle:function(){return m},metadata:function(){return u},assets:function(){return d},toc:function(){return c},default:function(){return k}});var a=n(7462),r=n(3366),l=(n(7294),n(3905)),i=n(9877),o=n(8215),s=["components"],p={description:"I'm building a babymonitor!",tags:["python","raspberrypi"],title:"Babymonitor #1",authors:"hlondogard"},m=void 0,u={permalink:"/blog/2022/11/06/babymonitor-pt-1",editUrl:"https://github.com/londogard/londogard/blog/2022-11-06-babymonitor-pt-1.mdx",source:"@site/blog/2022-11-06-babymonitor-pt-1.mdx",title:"Babymonitor #1",description:"I'm building a babymonitor!",date:"2022-11-06T00:00:00.000Z",formattedDate:"November 6, 2022",tags:[{label:"python",permalink:"/blog/tags/python"},{label:"raspberrypi",permalink:"/blog/tags/raspberrypi"}],readingTime:6.925,truncated:!0,authors:[{name:"Hampus Lond\xf6g\xe5rd",title:"Main Contributor of Londogard",url:"https://github.com/lundez",imageURL:"https://github.com/lundez.png",key:"hlondogard"}],frontMatter:{description:"I'm building a babymonitor!",tags:["python","raspberrypi"],title:"Babymonitor #1",authors:"hlondogard"},prevItem:{title:"Timeseries Learnings at AFRY",permalink:"/blog/timeseries-learnings"},nextItem:{title:"Docker (Presentation)",permalink:"/blog/2022/09/07/docker-simplified-presentation"}},d={authorsImageUrls:[void 0]},c=[{value:"Background",id:"background",children:[],level:2},{value:"Goals",id:"goals",children:[],level:2},{value:"Live Streaming: Initial Experimentation",id:"live-streaming-initial-experimentation",children:[{value:"Protocols / Variants",id:"protocols--variants",children:[],level:3},{value:"Implementations",id:"implementations",children:[],level:3},{value:"Performance",id:"performance",children:[],level:3}],level:2},{value:"Ending Notes",id:"ending-notes",children:[],level:2}],h={toc:c};function k(e){var t=e.components,n=(0,r.Z)(e,s);return(0,l.kt)("wrapper",(0,a.Z)({},h,n,{components:t,mdxType:"MDXLayout"}),(0,l.kt)("p",null,"Hi \ud83d\udc4b"),(0,l.kt)("p",null,"I\u2019m building a babymonitor. It\u2019s not gonna be anything novel, neither the first or last in history. But it\u2019s a relevant project to me, and it makes me happy! \ud83e\udd13"),(0,l.kt)("p",null,"In this blog I'll walk through different ways to stream video from the raspberry pi to the network, capturing it in a client browser."),(0,l.kt)("h2",{id:"background"},"Background"),(0,l.kt)("p",null,'It all started when I talked to an old friend and he said that his in-laws gifted them the "Rolls-Royce" of babymonitors. The monitor has:'),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},"Bidirectional audio."),(0,l.kt)("li",{parentName:"ul"},"Unidirectional video.",(0,l.kt)("ol",{parentName:"li"},(0,l.kt)("li",{parentName:"ol"},"Night Vision."),(0,l.kt)("li",{parentName:"ol"},"Rotation Horizontally."),(0,l.kt)("li",{parentName:"ol"},"Zoom."))),(0,l.kt)("li",{parentName:"ul"},"Temperature"),(0,l.kt)("li",{parentName:"ul"},"Play soothing bedtime songs.")),(0,l.kt)("p",null,"Incredibly cool!\xa0\xa0"),(0,l.kt)("p",null,"This led to a simple equation:",(0,l.kt)("br",{parentName:"p"}),"\n",(0,l.kt)("inlineCode",{parentName:"p"},"awesome + expensive + programmer = Do It Yourself (DIY)")),(0,l.kt)("p",null,'Obviously I need to have the same specifications and a little better, while "cheaper" (my hours are "free" \ud83e\udd13).  '),(0,l.kt)("p",null,"The greatest part? I have a natural deadline which enforce me to finish the project!"),(0,l.kt)("h2",{id:"goals"},"Goals"),(0,l.kt)("p",null,(0,l.kt)("strong",{parentName:"p"},"KISS"),"\xa0","-"," Keep It Simple Stupid"),(0,l.kt)("p",null,"I've collected the following equipment:"),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},"Raspberry Pi 3B (had one already)"),(0,l.kt)("li",{parentName:"ul"},"5 MP camera with mechanical IR filter"),(0,l.kt)("li",{parentName:"ul"},"2 servos (rotating camera)"),(0,l.kt)("li",{parentName:"ul"},"Temperature / Humidity Sensor"),(0,l.kt)("li",{parentName:"ul"},"Microphone Array"),(0,l.kt)("li",{parentName:"ul"},"Speaker")),(0,l.kt)("p",null,"My bottleneck is the Raspberry Pi's performance really. And with performance comes optimisations, which I love! It makes following the KISS principle a tad harder! \ud83d\ude05"),(0,l.kt)("p",null,"I have settled on one of three languages to write the video streaming in, either ",(0,l.kt)("inlineCode",{parentName:"p"},"golang"),", ",(0,l.kt)("inlineCode",{parentName:"p"},"rust")," or ",(0,l.kt)("inlineCode",{parentName:"p"},"python"),".",(0,l.kt)("br",{parentName:"p"}),"\n","My initial idea is that the simpler parts will be a FastAPI (Python) server, like temperature and moving servos. Python really is\xa0",(0,l.kt)("em",{parentName:"p"},"lingua franca"),"\xa0on the Raspberry Pi and the support is amazing.\xa0\xa0"),(0,l.kt)("p",null,"From my initial experimentation I found Python to require a\xa0",(0,l.kt)("em",{parentName:"p"},"shit ton"),"\xa0of CPU power to livestream video, as such I believe ",(0,l.kt)("inlineCode",{parentName:"p"},"rust")," or ",(0,l.kt)("inlineCode",{parentName:"p"},"golang")," will be the way to go. \ud83d\ude80"),(0,l.kt)("h2",{id:"live-streaming-initial-experimentation"},"Live Streaming: Initial Experimentation"),(0,l.kt)("p",null,"I've tried multiple things, HTTP, HLS, Websocket & WebRTC. Each step proves a more complex, albeit more optimal, solution. Each with it's trade-offs."),(0,l.kt)("p",null,"Some worthy mentions of other solutions is\xa0",(0,l.kt)("em",{parentName:"p"},"Real Time Streaming Protocol (RTSP)"),"."),(0,l.kt)("h3",{id:"protocols--variants"},"Protocols / Variants"),(0,l.kt)("p",null,"Describing the protocol and how it's implemented, in a very general way."),(0,l.kt)(i.Z,{groupId:"stream",mdxType:"Tabs"},(0,l.kt)(o.Z,{value:"http",label:"HTTP",default:!0,mdxType:"TabItem"},(0,l.kt)("p",null,(0,l.kt)("b",null,"H"),"yper",(0,l.kt)("strong",null,"t"),"ext ",(0,l.kt)("strong",null,"T"),"ransfer ",(0,l.kt)("strong",null,"P"),"rotocol, ",(0,l.kt)("em",null,"lingua franca")," protocol of the internet, is a way to stream both video and audio. It's easy but not efficient."),(0,l.kt)("p",null,(0,l.kt)("b",null,"How: ")," Stream chunks using HTTP messages and let your\xa0",(0,l.kt)("code",null,"<video>"),"\xa0 element handle the consumption of the stream.")),(0,l.kt)(o.Z,{value:"hls",label:"HLS",mdxType:"TabItem"},(0,l.kt)("p",null,(0,l.kt)("strong",null,"H"),"TTP ",(0,l.kt)("strong",null,"L"),"ive ",(0,l.kt)("strong",null,"S"),"treaming is a simple and pretty efficient way to stream both video and audio over the internet."),(0,l.kt)("p",null,(0,l.kt)("b",null,"How: ")," Stream chunks of video-/audio-files, ",(0,l.kt)("code",null,".m3u8"),', which are then picked up by client. The chunks are built from a "live" stream, e.g. webcam, or a file.')),(0,l.kt)(o.Z,{value:"websocket",label:"Websocket",mdxType:"TabItem"},(0,l.kt)("p",null,"Websockets is a communication protocol which allows much lower overhead than raw HTTP while providing bi-directional (duplex) communication. It's really optimal to stream things that move in real-time through HTTP, such as a video or audio stream."),(0,l.kt)("p",null,(0,l.kt)("b",null,"How: ")," Stream your byte-array realtime through a websocket, like you'd a HTTP. There's less headers involved, but it's much harder to consume on the client. You need a special JS media player which can decode the websocket stream into video/audio. ")),(0,l.kt)(o.Z,{value:"webrtc",label:"WebRTC",mdxType:"TabItem"},(0,l.kt)("p",null,"WebRTC is a open framework that enables ",(0,l.kt)("em",null,"Real-Time Communications (RTC)")," inside the browser. From the get-go it supports bidirectional video/audio and also encrypted if required.",(0,l.kt)("br",null),"    It's ",(0,l.kt)("em",null,"the protocol to stream realtime")," really. It's used in a lot of the tools you know today."),(0,l.kt)("p",null,(0,l.kt)("b",null,"How: ")," set up a WebRTC server and then stream your bytearrays directly after connecting with a client."))),(0,l.kt)("p",null,"Each protocol comes with positives and negatives."),(0,l.kt)("table",null,(0,l.kt)("thead",{parentName:"table"},(0,l.kt)("tr",{parentName:"thead"},(0,l.kt)("th",{parentName:"tr",align:null}),(0,l.kt)("th",{parentName:"tr",align:null},"HTTP"),(0,l.kt)("th",{parentName:"tr",align:null},"HLS"),(0,l.kt)("th",{parentName:"tr",align:null},"Websocket"),(0,l.kt)("th",{parentName:"tr",align:null},"WebRTC"))),(0,l.kt)("tbody",{parentName:"table"},(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},(0,l.kt)("strong",{parentName:"td"},"Pros")),(0,l.kt)("td",{parentName:"tr",align:null},"+ Easy to implement.",(0,l.kt)("br",null),"+ Simple protocol."),(0,l.kt)("td",{parentName:"tr",align:null},"+ Easy to implement",(0,l.kt)("br",null),"+ CPU efficient.",(0,l.kt)("br",null),'+ Easy to do "live" streams.'),(0,l.kt)("td",{parentName:"tr",align:null},"+ Low latency.",(0,l.kt)("br",null),"+ CPU efficient."),(0,l.kt)("td",{parentName:"tr",align:null},"+ Supports all my use-cases",(0,l.kt)("br",null),"+ Low Latency.",(0,l.kt)("br",null),"+ CPU efficient.")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},(0,l.kt)("strong",{parentName:"td"},"Cons")),(0,l.kt)("td",{parentName:"tr",align:null},"- CPU inefficient (HTTP header overhead)."),(0,l.kt)("td",{parentName:"tr",align:null},"- High latency (5-10s+).\xa0"),(0,l.kt)("td",{parentName:"tr",align:null},"- Hard to consume on client.",(0,l.kt)("br",null),"- Bi-directional streaming is also hard."),(0,l.kt)("td",{parentName:"tr",align:null},"- Not straightforward implementation",(0,l.kt)("br",null),"- Less documentation than HLS/HTTP.")))),(0,l.kt)("h3",{id:"implementations"},"Implementations"),(0,l.kt)(i.Z,{groupId:"stream",mdxType:"Tabs"},(0,l.kt)(o.Z,{value:"http",label:"HTTP - MJPEG",mdxType:"TabItem"},(0,l.kt)("p",null,"The provided\xa0",(0,l.kt)("a",{parentName:"p",href:"https://raw.githubusercontent.com/raspberrypi/picamera2/main/examples/mjpeg_server.py"},"MJPEG server"),"\xa0from\xa0",(0,l.kt)("a",{parentName:"p",href:"https://github.com/raspberrypi/picamera2"},(0,l.kt)("inlineCode",{parentName:"a"},"picamera2")),"\xa0is excelent show-case on how to stream the video. It sets up a simple HTML with a\xa0",(0,l.kt)("inlineCode",{parentName:"p"},"<img>"),"\xa0element which streams new frames using\xa0",(0,l.kt)("inlineCode",{parentName:"p"},"MJPEG"),"\xa0 which is Motion-JPEG."),(0,l.kt)("p",null,"The performance is pretty OK, considering it's Python & MJPEG. Compared to H264 which works much more effectively.\xa0",(0,l.kt)("br",{parentName:"p"}),"\n","We see the CPU hovering around 130-150%, but the largest drawback is the network\xa0bandwidth, at ~50Mb/s compared to H.264 at ~3.5Mb/s.",(0,l.kt)("br",{parentName:"p"}),"\n","This is because MJPEG sends the full frame each time, H.264 sends a frame and then some delta frame until it sends a full frame again. This has drawbacks and positives, the bandwidth is low but quality can suffer."),(0,l.kt)("details",null,(0,l.kt)("summary",null,"Code"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-python"},"#!/usr/bin/python3\n\n# Mostly copied from https://picamera.readthedocs.io/en/release-1.13/recipes2.html\n# Run this script, then point a web browser at http:<this-ip-address>:8000\n# Note: needs simplejpeg to be installed (pip3 install simplejpeg).\n\nimport io\nimport logging\nimport socketserver\nfrom http import server\nfrom threading import Condition, Thread\n\nfrom picamera2 import Picamera2\nfrom picamera2.encoders import JpegEncoder\nfrom picamera2.outputs import FileOutput\n\nPAGE = \"\"\"\\\n<html>\n<head>\n<title>picamera2 MJPEG streaming demo</title>\n</head>\n<body>\n<h1>Picamera2 MJPEG Streaming Demo</h1>\n<img src=\"stream.mjpg\" width=\"640\" height=\"480\" />\n</body>\n</html>\n\"\"\"\n\n\nclass StreamingOutput(io.BufferedIOBase):\n    def __init__(self):\n        self.frame = None\n        self.condition = Condition()\n\n    def write(self, buf):\n        with self.condition:\n            self.frame = buf\n            self.condition.notify_all()\n\n\nclass StreamingHandler(server.BaseHTTPRequestHandler):\n    def do_GET(self):\n        if self.path == '/':\n            self.send_response(301)\n            self.send_header('Location', '/index.html')\n            self.end_headers()\n        elif self.path == '/index.html':\n            content = PAGE.encode('utf-8')\n            self.send_response(200)\n            self.send_header('Content-Type', 'text/html')\n            self.send_header('Content-Length', len(content))\n            self.end_headers()\n            self.wfile.write(content)\n        elif self.path == '/stream.mjpg':\n            self.send_response(200)\n            self.send_header('Age', 0)\n            self.send_header('Cache-Control', 'no-cache, private')\n            self.send_header('Pragma', 'no-cache')\n            self.send_header('Content-Type', 'multipart/x-mixed-replace; boundary=FRAME')\n            self.end_headers()\n            try:\n                while True:\n                    with output.condition:\n                        output.condition.wait()\n                        frame = output.frame\n                    self.wfile.write(b'--FRAME\\r\\n')\n                    self.send_header('Content-Type', 'image/jpeg')\n                    self.send_header('Content-Length', len(frame))\n                    self.end_headers()\n                    self.wfile.write(frame)\n                    self.wfile.write(b'\\r\\n')\n            except Exception as e:\n                logging.warning(\n                    'Removed streaming client %s: %s',\n                    self.client_address, str(e))\n        else:\n            self.send_error(404)\n            self.end_headers()\n\n\nclass StreamingServer(socketserver.ThreadingMixIn, server.HTTPServer):\n    allow_reuse_address = True\n    daemon_threads = True\n\n\npicam2 = Picamera2()\npicam2.configure(picam2.create_video_configuration(main={\"size\": (640, 480)}))\noutput = StreamingOutput()\npicam2.start_recording(JpegEncoder(), FileOutput(output))\n\ntry:\n    address = ('', 8000)\n    server = StreamingServer(address, StreamingHandler)\n    server.serve_forever()\nfinally:\n    picam2.stop_recording()\n")))),(0,l.kt)(o.Z,{value:"hls",label:"HLS",mdxType:"TabItem"},(0,l.kt)("p",null,"Very simple using\xa0",(0,l.kt)("inlineCode",{parentName:"p"},"ffmpeg"),"\xa0and\xa0",(0,l.kt)("inlineCode",{parentName:"p"},"picamera2"),"\xa0 in conjunction.\xa0"),(0,l.kt)("p",null,"The performance of HLS is great at ~40% CPU, but the latency is awful at 5-10s easily!"),(0,l.kt)("details",null,(0,l.kt)("summary",null,"Code"),(0,l.kt)(i.Z,{mdxType:"Tabs"},(0,l.kt)(o.Z,{value:"python",label:"Python",mdxType:"TabItem"},(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-python"},'import time\nfrom picamera2.outputs import FfmpegOutput\nfrom picamera2.encoders import H264Encoder, Quality\nfrom picamera2 import Picamera2\n\n\npicam2 = Picamera2()\npicam2.configure(picam2.create_video_configuration(main={"size": (640, 480)}))\nencoder = H264Encoder(bitrate=1000000, repeat=True, iperiod=15)\noutput = FfmpegOutput("-f hls -hls_time 4 -hls_list_size 5 -hls_flags delete_segments -hls_allow_cache 0 stream.m3u8")\npicam2.start_recording(encoder, output)\ntime.sleep(9999999)\n'))),(0,l.kt)(o.Z,{value:"html",label:"HTML",mdxType:"TabItem"},(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-html"},'<video width="320" height="240" controls autoplay>\n    <source src="stream.m3u8" type="application/x-mpegURL" />\n    Your browser does not support the video tag.\n</video>\n')))))),(0,l.kt)(o.Z,{value:"websocket",label:"Websocket",mdxType:"TabItem"},(0,l.kt)("p",null,"I've basically re-used\xa0",(0,l.kt)("a",{parentName:"p",href:"https://github.com/bezineb5/go-h264-streamer"},(0,l.kt)("inlineCode",{parentName:"a"},"go-h264-streamer")),"\xa0which is a very simple yet efficient golang-implementation of a websocket driven H264 streamer that streams through websocket to a client. The client has a JS script which is WebASM/emscripten compiled to use WebGL-accelerated graphics to decode the H264 into frames.\xa0"),(0,l.kt)("p",null,"What's really cool about this implementation is that it only starts the video stream when people connect and shut it down when there's no connected websockets.")),(0,l.kt)(o.Z,{value:"webrtc",label:"WebRTC",mdxType:"TabItem"},(0,l.kt)("p",null,"I kept myself to KISS, unlike all this testing of approaches, and went with golangs\xa0",(0,l.kt)("inlineCode",{parentName:"p"},"pion"),"\xa0(",(0,l.kt)("a",{parentName:"p",href:"https://github.com/pion/webrtc"},"https://github.com/pion/webrtc"),")\xa0 and their excellent\xa0",(0,l.kt)("inlineCode",{parentName:"p"},"mediadevices"),"\xa0(",(0,l.kt)("a",{parentName:"p",href:"https://github.com/pion/mediadevices"},"https://github.com/pion/mediadevices"),") which wraps the legacy pi camera stack (non-open source drivers, unlike the modern pi camera stack which builds on\xa0",(0,l.kt)("inlineCode",{parentName:"p"},"libcamera"),")."))),(0,l.kt)("h3",{id:"performance"},"Performance"),(0,l.kt)("p",null,"Stats taken from ",(0,l.kt)("inlineCode",{parentName:"p"},"top"),"."),(0,l.kt)("table",null,(0,l.kt)("thead",{parentName:"table"},(0,l.kt)("tr",{parentName:"thead"},(0,l.kt)("th",{parentName:"tr",align:null},"Hardware"),(0,l.kt)("th",{parentName:"tr",align:null},"HTTP - MJPEG"),(0,l.kt)("th",{parentName:"tr",align:null},"HLS"),(0,l.kt)("th",{parentName:"tr",align:null},"Websocket no connection"),(0,l.kt)("th",{parentName:"tr",align:null},"Websocket"),(0,l.kt)("th",{parentName:"tr",align:null},"WebRTC"),(0,l.kt)("th",{parentName:"tr",align:null},"WebRTC (",(0,l.kt)("inlineCode",{parentName:"th"},"aiortc"),")"))),(0,l.kt)("tbody",{parentName:"table"},(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},(0,l.kt)("strong",{parentName:"td"},"CPU")),(0,l.kt)("td",{parentName:"tr",align:null},"150%"),(0,l.kt)("td",{parentName:"tr",align:null},(0,l.kt)("strong",{parentName:"td"},"40%")),(0,l.kt)("td",{parentName:"tr",align:null},"<=0.2%"),(0,l.kt)("td",{parentName:"tr",align:null},(0,l.kt)("strong",{parentName:"td"},"40%")),(0,l.kt)("td",{parentName:"tr",align:null},"170%"),(0,l.kt)("td",{parentName:"tr",align:null},"250-350%")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},(0,l.kt)("strong",{parentName:"td"},"RAM")),(0,l.kt)("td",{parentName:"tr",align:null},"6%"),(0,l.kt)("td",{parentName:"tr",align:null},(0,l.kt)("strong",{parentName:"td"},"4%")),(0,l.kt)("td",{parentName:"tr",align:null},"<=0.4%"),(0,l.kt)("td",{parentName:"tr",align:null},"6%"),(0,l.kt)("td",{parentName:"tr",align:null},"5%"),(0,l.kt)("td",{parentName:"tr",align:null})))),(0,l.kt)("h2",{id:"ending-notes"},"Ending Notes"),(0,l.kt)("p",null,"This is what I have currently.\xa0",(0,l.kt)("strong",{parentName:"p"},"In the next blog I'll go through how we'll set up a backend which will allow us to use the sensors, move the servos and stream audio/video.")),(0,l.kt)("p",null,"I think the bidirectional communication will require a third blog, and then manufacturing a 3D-printed case as a fourth!"),(0,l.kt)("p",null,"Until next time,",(0,l.kt)("br",{parentName:"p"}),"\n","Hampus Lond\xf6g\xe5rd"))}k.isMDXComponent=!0}}]);