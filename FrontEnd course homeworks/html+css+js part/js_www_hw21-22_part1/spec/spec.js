var app = require('../js/app.js');

describe("app", function() {
  it("it positive number raised to the positive power", function() {
    var powResult;

    powResult = app.pow(5,5);
    console.log('powResult', powResult);

    expect(powResult).toEqual(3125);
  });

  it("it negative number raised to the positive power", function() {
    var powResult;

    powResult = app.pow(-7,17);
    console.log('powResult', powResult);

    expect(powResult).toEqual(-232630513987207);
  });

  it("it 0 raised to the posotive power", function() {
    var powResult;

    powResult = app.pow(0, 56);
    console.log('powResult', powResult);

    expect(powResult).toEqual(0);
  });

  it("it positive number raised to the power 0", function() {
    var powResult;

    powResult = app.pow(5,0);
    console.log('powResult', powResult);

    expect(powResult).toEqual(0);
  });


  it("it positive number raised to the negative power", function() {
    var powResult;

    powResult = app.pow(3,-58);
    console.log('powResult', powResult);

    expect(powResult).toEqual(0);
  });

});
