function isday(n){
	var d = new Date();
	var c = d.getDay();
	var day = parseInt(n);
	if(c==0 || c ==6){
		c=1;
	}
	for(var i=4;i>=0;i--){
		if(day>=Math.pow(2,i)){
			day-=Math.pow(2,i);
			if( c-1==i){
				return true;
			}
		}
	}
	return false;
}
function itoday(n){
	var r="";
	var s=parseInt(n);
	if(s>=16){
		r+="F";
		s-=16;
	}
	if(s>=8){
		r="R"+r;
		s-=8
	}
	if(s>=4){
		r="W"+r;
		s-=4
	}
	if(s>=2){
		r="T"+r;
		s-=2
	}
	if(s==1){
		r="M"+r;
	}
	return r;
}
