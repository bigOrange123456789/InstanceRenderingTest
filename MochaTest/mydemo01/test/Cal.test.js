var Cal= require('../src/Cal.js');
var expect = require('chai').expect;

describe('测试套件00',//测试套件
    function() {
        var myCal;
        before(function() {// 在本区块的所有测试用例之前执行
            myCal=new Cal();
            console.log("before");
        });

        after(function() {// 在本区块的所有测试用例之后执行
            console.log("after");
        });

        beforeEach(function() {// 在本区块的每个测试用例之前执行
            myCal.set(1);
            console.log("beforeEach");
        });

        afterEach(function() {// 在本区块的每个测试用例之后执行
            console.log("afterEach");
        });
        it('测试用例01', function() {//测试用例
                var result=myCal.add(1);
                expect(result).to.be.equal(2);
            }
        );
        it('测试用例02', function() {//测试用例
                var result=myCal.add(1);
                expect(result).to.be.equal(2);
            }
        );
    }
);