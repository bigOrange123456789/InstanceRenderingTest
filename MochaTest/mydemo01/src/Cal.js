function Cal(){
    this.x;
}
Cal.prototype={
    set:function (x) {
        this.x=x;
    },
    add:function(y){
        this.x=this.x+y;
        return this.x;
    },
}
module.exports = Cal;