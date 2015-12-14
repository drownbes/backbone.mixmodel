var fixture = {
    fieldProp0: 'fieldProp0',
    fieldProp1: 'fieldProp1',
    bagProp: [
        {key: 'bagProp0', value:'bagProp0'},
        {key: 'bagProp1', value:'bagProp1'}
    ]
};

var lineModel = Backbone.MixModel.extend({
});

var t = new lineModel(fixture);

console.log(t.toJSON());

describe("Backbone.MixModel", function() {
    var fixtures = [
        [{},{}],
        [{prop:'value'}, {prop:'value'}],
        [{prop0:'value0', prop1:'value1'},{prop0:'value0', prop1:'value1'}],
        [{prop0:[]}, {}],
        [{
            prop0:[
                {key: 'prop1', value: 'value1'}
            ],
            prop2: 'value2'
        }, {
            prop1:'value1',
            prop2:'value2'
        }],
    ];

    it("works with every fixture:" + JSON.stringify(fixtures), function() {
        _.each(fixtures, function(fixture) {
            var m = new Backbone.MixModel(fixture[0]);
            expect(m.attributes).toEqual(fixture[1]);
            expect(m.toJSON()).toEqual(fixture[0]);
        });
    });

    it("works with custom keyName and valueName", function() {
        var o = {
            a: [
                {k: 'k', v: 'v'}
            ]
        };
        var e = {
            k: 'v'
        }
        var m = new Backbone.MixModel(o, {
            keyName: 'k',
            valueName: 'v'
        });
        expect(m.attributes).toEqual(e);
        expect(m.toJSON()).toEqual(o);
    });


    it("throw error on properties intersection", function() {
        var o = {
            k: 'v',
            t: [
                {key:'k',value:'v'}
            ]
        };
        expect(function() {
            var m = new Backbone.MixModel(o);
        }).toThrow();
    });

});
