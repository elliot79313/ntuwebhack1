// JavaScript Document
(function($){
  $(document).ready(function(){
	  var xAngle = 0, yAngle = 0;
	  $("body").bind("keydown", function(e){
		  switch(e.keyCode){
			case 37: // left
					yAngle -= 90;
					break;
			case 39: // right
					yAngle += 90;
					break;
		  };
          $('#cube')[0].style.webkitTransform = "rotateX("+xAngle+"deg) rotateY("+yAngle+"deg)";
	  });
	  new Youtube();
  });
})(jQuery);
var Youtube = function(){
	var init = function(){
		var params = { allowScriptAccess: "always" };
    	var atts = { id: "myytplayer" };
    	swfobject.embedSWF("http://www.youtube.com/v/Q3WxhfO2O4E?enablejsapi=1&playerapiid=ytplayer&version=3",
                       "ytapiplayer1", "448", "252", "8", null, null, params, atts);
		
	};
	init();
	var  queue = function(){
	}
}