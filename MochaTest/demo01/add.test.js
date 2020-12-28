var add = require('./add.js');
var expect = require('chai').expect;

describe('加法函数的测试',
    function() {
      it('1 加 1 应该等于 2', function() {
                                  expect(add(1, 1)).to.be.equal(2);
                                }
                                );
});
//测试脚本里面应该包括一个或多个describe块，每个describe块应该包括一个或多个it块。
//describe块称为"测试套件"（test suite），表示一组相关的测试。它是一个函数，第一个参数是测试套件的名称（"加法函数的测试"），第二个参数是一个实际执行的函数
//it块称为"测试用例"（test case），表示一个单独的测试，是测试的最小单位。它也是一个函数，第一个参数是测试用例的名称（"1 加 1 应该等于 2"），第二个参数是一个实际执行的函数。


/*
Mocha
灵活(不包括断言和仿真，自己选对应工具)
流行的选择：chai，sinon
社区成熟用的人多，测试各种东西社区都有示例
需要较多配置
可以使用快照测试，但依然需要额外配置
*/