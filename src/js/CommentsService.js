var $ = require('jquery');

module.exports = {

    list: function(){
        var deferred = $.Deferred();

        $.getJSON('/comments/').done(function(data){
            deferred.resolve(data);
        }).fail(function(error){
            deferred.reject(error);
        });

        return deferred;
    },

    create: function(comment){
        var deferred = $.Deferred();
        var data = comment;

        $.post('/comments/', data).done(function(data){
            deferred.resolve(data);
        }).fail(function(error){
            deferred.reject(error);
        });

        return deferred;
    }

};