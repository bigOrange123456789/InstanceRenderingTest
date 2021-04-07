class Test {

	#id;
	vary;
	vary2;
	constructor(x){
		this.vary=0;
		//console.log(x)
		this.#id=x;
		console.log(this.f2());
		console.log(Test.add(x,x))
	}
	static add=function(x,y){
		return x+y;
	}
	f2=function(){
		return this.f1();
	}
	getVary=function () {
		return this.vary;
	}
}
Test.prototype.f1=function () {
	console.log(111);
	return this.vary;
}
export { Test };
