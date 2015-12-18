( function(root, factory) {
    if(typeof define === 'function' && define.amd) {
        define([ 'exports', 'backbone', 'underscore' ], factory);
    }
    else if( typeof exports !== 'undefined' ) {
        factory(exports, require( 'backbone' ), require( 'underscore' ));
    }
    else {
        factory(root, root.Backbone, root._);
    }
}(this, function(exports, Backbone, _) {

    "use strict";

    Backbone.MixModel = Backbone.Model.extend({

        constructor: function(attributes, options) {
            options = options || {};
            _.defaults(options, {
                keyName: 'key',
                valueName: 'value',
                prefixes: false
            });
            _.extend(options, {
                parse: true
            });
            this.props = [];
            this.arrayProps = {};
            this.options = options;
            Backbone.Model.call(this, attributes, options);
        },

        parse: function(resp, options) {
            var self = this;
            var res = _(resp).pairs().reduce(function(acc, a) {
                return _.extend(
                    acc,
                    _.isArray(a[1]) ?
                    (function() {
                        var names =_(a[1])
                        .pluck(options.keyName)
                        .map(function(name) {
                            return (self.options.prefixes?a[0] + '.' + name:name);
                        });
                        self.arrayProps[a[0]] = names;
                        return _.object(
                            names,
                            _.pluck(a[1], options.valueName));
                    } ()) :
                    (function(){
                        self.props.push(a[0])
                        return _.object([a[0]],[a[1]]);
                    })()
                )
            }, {});
            var error = _.intersection(this.props, _.flatten(_.values(this.arrayProps)));
            if(error.length) {
                throw new Error("Backbone.MixModel property names intersection: " +  error);
            }
            return res;
        },

        toJSON: function() {
            return _.extend(
                {},
                _.pick(this.attributes, this.props),
                _.mapObject(this.arrayProps, function(val, key) {
                    var t = _(this.attributes).pick(val);
                    return _.map(t, function(v,k) {
                        if(this.options.prefixes) {
                            k = k.replace(new RegExp(key+'\.'),'');
                        }
                        return _.object(
                            [this.options.keyName, this.options.valueName],
                            [k, v]
                        );
                    }.bind(this));
                }.bind(this))
            );
        }
    });

}));
