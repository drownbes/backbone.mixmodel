var sampleData = {
    firstName: 'Vasia',
    lastName: 'Popkin',
    email: 'safgaf',
    userData: [
        {key: 'country', value: 'Rssia'},
        {key: 'Age', value: 15}
    ]
};

_.extend(Backbone.MixModel.prototype, Backbone.Validation.mixin);

var Model = Backbone.MixModel.extend({
    validation: {
        firstName: {
            pattern: /Vassdadia/
        },
        email: {
            pattern: 'email'
        },
        country: {
            oneOf: ['Norway', 'Sweeden', 'Russia']
        }
    }
});

var model = new Model(sampleData);
model.bind('validated', function(isValid, model, errors) {
    console.log(arguments);
});
model.validate();
model.set('country', 'Norway');
console.log(model.toJSON());

