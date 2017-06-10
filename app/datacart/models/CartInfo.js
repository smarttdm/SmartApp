

'use strict';

angular.module('app.datacart').factory('CartInfo', function () {

    var CartModels = {};

    function _createCartModel()
    {
        var cart = new Object();
        cart.count = 0;
        cart.items = [];
        cart.showDataCart = false;
        cart.dataViewName = undefined;

        return cart;
    }

    function _getCart(dbschema, dbclass) {
        var cart = CartModels[dbschema + dbclass];
        if (!cart) {
            // first time, create a model for the cart
            cart = _createCartModel();
            CartModels[dbschema + dbclass] = cart;
        }

        return cart;
    }

    function _addToCart(dbschema, dbclass, item) {
        var cart = CartModels[dbschema + dbclass];
        if (!cart)
        {
            // first time, create a model for the cart
            cart = _createCartModel();
            CartModels[dbschema + dbclass] = cart;
        }

        var arrayLength = cart.items.length;
        var exist = false;
        for (var i = 0; i < arrayLength; i++) {
            if (cart.items[i].obj_id === item.obj_id) {
                exist = true;
                break;
            }
        }

        if (!exist) {
            cart.count++;

            cart.items.push(item);
        }
    }

    function _removeFromCart(dbschema, dbclass, oid) {
        var cart = CartModels[dbschema + dbclass];
        if (cart) {
            var found = false;
            var index;
            if (cart.items.length > 0) {
                for (var i = 0; i < cart.items.length; i++) {
                    if (cart.items[i].obj_id === oid) {
                        found = true;
                        index = i;
                        break;
                    }
                }

                if (found) {
                    cart.count--;
                    cart.items.splice(index, 1);
                }
            }
        }
    }

    function _clearCart(dbschema, dbclass) {
        var cart = CartModels[dbschema + dbclass];
        if (cart) {
            cart.count = 0;
            cart.items = [];
        }
    }

    return {
        getCart : _getCart,
        addToCart: _addToCart,
        removeFromCart: _removeFromCart,
        clearCart: _clearCart
    }
});
