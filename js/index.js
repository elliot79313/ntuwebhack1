// JavaScript Document
var g_youtube;
(function($){
  $(document).ready(function(){
	  var xAngle = 0, yAngle = 0;
	  $("body").bind("playerleft", function(e){
		  yAngle -= 90;
          $('#cube')[0].style.webkitTransform = "rotateX("+xAngle+"deg) rotateY("+yAngle+"deg)";
	  }).bind("playerright", function(e){
		   yAngle += 90;
		   $('#cube')[0].style.webkitTransform = "rotateX("+xAngle+"deg) rotateY("+yAngle+"deg)";
	  });
	  g_youtube = new Youtube();
	  
  });
})(jQuery);


var Youtube = function(){
	var queue = [];
	var playlistID = "";
	var playlistPtr = 0;
	var playPtr = 0;
	var playerView = new Array(4);
	this.regisPlayer = function(idx){
		playerView[idx] = $(".face_containter:eq("+idx+")").data("prev",(idx+1)%4).data("next",(idx-1) % 4 < 0? 4 + ((idx-1) % 4):((idx-1) % 4));
		$(".face_containter:eq("+idx+")").bind("curVideo",function(event, param){
			var currentPlayer = $(this).find("object")[0];
			setTimeout(function(){
				$(this).find("object").width(448).height(252);
				currentPlayer.loadVideoById(param);
			},1000);
		});
		$(".face_containter:eq("+idx+")").bind("nextVideo",function(){
			$(this).find("object")[0].stopVideo();
			playPtr = $(this).data("next");
			
			playlistPtr = (playlistPtr+1) % queue.length;
			setTimeout(function(){
				$(".face_containter:eq("+playPtr+")").trigger("curVideo",  $("#queue ul li:eq("+ playlistPtr +")").data("ytID"));
			},500);
		});
		$(".face_containter:eq("+idx+")").bind("prevVideo",function(){
			$(this).find("object")[0].stopVideo();
			playPtr = $(this).data("prev");
			playlistPtr = ((playlistPtr-1) % queue.length  < 0) ? queue.length+((playlistPtr-1) % queue.length): ((playlistPtr-1) % queue.length);
			console.log(playPtr, playlistPtr);
			setTimeout(function(){
				$(".face_containter:eq("+playPtr+")").trigger("curVideo",  $("#queue ul li:eq("+ playlistPtr +")").data("ytID"));
			},500);
		});
		
		
	}
	
	var elemtemplate = '<li><div><img src="{{$0}}"/><div class="title">{{$1}}</div></div></li>';
	
	var init = function(){
		$("#playlisttext").bind("keyup",function(){
			var payload = getParameterByName($(this).val(), "list");
			if(playlistID ==payload ) return;
			   playlistID = payload;
			if(payload  === "") return;
			
			$.get("https://gdata.youtube.com/feeds/api/playlists/"+ payload, {"alt":"json", "key": "AIzaSyBn-ntA9itbIoKLPXtOvU_F71l6SHvJIEA"},null,"jsonp")
			 .success(function(resp){
				 playPtr = 0;
				 playlistPtr = 0;
				 queue = resp["feed"]["entry"];
				 $("#queue ul").html("");
				 $.map(queue,addElement);
				 var first = $("#queue ul li:first").data("ytID");
				 $(".face_containter:eq("+0+")").trigger("curVideo",first);
				
			});
			
		});
		$("#playlisttext").val("http://www.youtube.com/watch?v=heF9OSHZ4tY&list=PL7ACC58155086E693").trigger("keyup");
		$("#prev").bind("click",function(){
			$("body").trigger("playerleft");
			$("#myytplayer" + playPtr).trigger("prevVideo");
		});
		$("#next").bind("click",function(){
			$("body").trigger("playerright");
			$("#myytplayer" + playPtr).trigger("nextVideo");
		});
		
	};
	init();
	var addElement = function(elem, idx){
		var template = elemtemplate;
		template = template.replace(/{{\$0}}/, elem["media$group"]["media$thumbnail"][0]["url"]);
		template = template.replace(/{{\$1}}/, elem["title"]["$t"]);
		template = $(template);
		$("#queue ul").append(template);
		var ytpath = elem["link"][0]["href"].match(/https:\/\/(?:www\.)?youtube.*watch\?v=([a-zA-Z0-9\-_]+)/);
		if(ytpath == null)
			ytpath = elem["link"][0]["href"].match(/https:\/\/gdata.youtube.com\/feeds\/api\/videos\/([a-zA-Z0-9\-_]+)/);
		if(ytpath != null){
			template.data("ytID", ytpath[1]).data("ptr", idx).bind("click",function(){
				var current = $(this).index();
				playlistPtr = current;
				setTimeout(function(){
					$(".face_containter:eq("+playPtr+")").trigger("curVideo",  ytpath[1]);
				},500);
			});
		}else{
			console.log(elem["link"]);
		}
	}
	var params = { allowScriptAccess: "always" };
    var atts = { id: "myytplayer" };
		
	for(var x = 0;x <4 ;x++){
		atts = { id : "myytplayer"+ x };
		swfobject.embedSWF("http://www.youtube.com/v/Q3WxhfO2O4E?enablejsapi=1&playerapiid=ytplayer"+ x +"&version=3",
				   "ytapiplayer"+x, "448", "252", "8", null, null, params, atts);
	}
	
}
function onYouTubePlayerReady(playerId) {
	var id = parseInt( playerId.replace("ytplayer",""));
	g_youtube.regisPlayer(id);
	var ytplayer =  document.getElementById("myytplayer"+id);
	/*ytplayer.addEventListener("onStateChange", function(state){
		console.log(state);
		if(state==1){
			console.log(this);
		}else if(state==3){
			console.log(this);
		}
		
	});*/
  	ytplayer.addEventListener("onStateChange", "onytplayerStateChange");
}
function onytplayerStateChange(newState){
console.log(newState);
	setTimeout(function(){
		$("object").css("width",448).css("height",252);
	},1000);
}
function getParameterByName(path,name){
  name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
  var regexS = "[\\?&]" + name + "=([^&#]*)";
  var regex = new RegExp(regexS);
  var results = regex.exec(path);
  if(results == null)
    return "";
  else
    return decodeURIComponent(results[1].replace(/\+/g, " "));
};