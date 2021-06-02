
var country_id=0;
class Country{
	id;//
	name;
	race;//human,ORC, spirit, dwarf
	constructor(name){
		this.name=name;
		this.id=country_id++;
	}
}
class City{
	country;
	population;
	army;
	constructor(){
		this.country=null;
		this.population=Math.round(Math.random()*1000);
		this.army=Math.round(Math.random()*1000);
	}
	develop(){
		this.army=this.army+0.1*this.population;
		this.population=1.9*this.population;
	}
	occupy(country,army){
		this.country=country;
		this.army=typeof (army)==="undefined"?0:army;
	}
	static warfare(city1,city2){
		var d=city1.army-city2.army;
		if(city1.army===0){//两座空城
			return;
		}else if(d>0){
			city1.army-=d;
			city2.army=city2.army-2*d;
			if(city2.army<0){
				city2.occupy(city1.country)
			}
		}else if(d==0){
			city1.army-=d;
			city2.army-=d;
		}else{
			City.warfare(city2,city1)
		}
	}
	static moveTroops(city1,city2){
		var troops=city1.army+city2.army;
		city1.army=troops/2;
		city2.army=troops/2;
	}
	static contact(city1,city2){
		if(city1.country===null){
			city1.occupy(city2.country)
		}else if(city2.country===null){
			city2.occupy(city1.country)
		}else if(city1.country===city2.country){
			City.moveTroops(city1,city2)
		}else{
			City.warfare(city1,city2)
		}
	}

}

class Manager{
	world;
	years;
	world_size;
	constructor(world_size){
		this.world_size=world_size;
		this.world=[]
		for(var i=0;i<world_size;i++){
			this.world.push([]);
			for(var j=0;j<world_size;j++)
				this.world[i].push(new City());
		}
		this.years=0;
	}
	init(){
		this.world[0][0].country=new Country("1");
        this.world[0][0].army=10000;


		this.world[0][7].country=new Country("1");
		this.world[7][0].country=new Country("1");
		this.world[7][7].country=new Country("1");

        this.world[1][0].country=new Country("1");
        this.world[2][0].country=new Country("1");
        this.world[3][0].country=new Country("1");
        this.world[4][0].country=new Country("1");

		this.show()
		this.start();

	}

	finish(){
		var num=0;
		for(var i=0;i<this.world_size;i++)
			for(var j=0;j<this.world_size;j++)
			if(this.world[i][j].country===this.world[0][0].country)
				num++
		return num===Math.pow(this.world_size,2);
	}
	start(){
        this.nextYear()
        if(this.finish()) console.log("\n完成模拟")
        else this.start();
	}
    start0(){
        console.log("开始模拟")
        var self=this;
        var interval=setInterval(function () {
            self.nextYear()
            if(self.finish()){
                clearInterval(interval)
                console.log("完成模拟")
                console.log(self.world)
            }
        },100)
    }
	show(){
		console.log("\n年份"+this.years+":")
		for(var i=0;i<this.world.length;i++){
			var s=""
			for(var j=0;j<this.world.length;j++){
				if(this.world[i][j].country===null)s+="*";
				else s+=this.world[i][j].country.id;
			}
			console.log(s)
		}

	}

	nextYear(){
		for(var i=0;i<this.world.length;i++)
			for(var j=0;j<this.world.length;j++){
				this.world[i][j].develop();
			}
		//console.log("spring")
		//this.show()
		for(var i=0;i<this.world.length;i++)
			for(var j=0;j<this.world.length;j++){
				this._contact2(i,j)//
		}

		this.years++;
		this.show()

	}
	_contact2(i,j){
		var rand=Math.floor(Math.random()*8);
		var s=this.world_size-1;
		if(rand===0){
			if(i===s)return;
			this._contact([i,j],[i+1,j])
		}else if(rand===1){
			if(i===0)return;
			this._contact([i,j],[i-1,j])
		}else if(rand===2){
			if(j===s)return;
			this._contact([i,j],[i,j+1])
		}else if(rand===3){
			if(j===0)return;
			this._contact([i,j],[i,j-1])
		}else if(rand===4){
			if(i===s||j===s)return;
			this._contact([i,j],[i+1,j+1])
		}else if(rand===5){
			if(i===0||j===0)return;
			this._contact([i,j],[i-1,j-1])
		}else if(rand===6){
			if(i===0||j===s)return;
			this._contact([i,j],[i-1,j+1])
		}else{
			if(i===s||j===0)return;
			this._contact([i,j],[i+1,j-1])
		}

	}
	_contact(c1,c2) {
		City.contact(
			this.world[c1[0]][c1[1]],
			this.world[c2[0]][c2[1]]
		)
	}
}


new Manager(8).init();


