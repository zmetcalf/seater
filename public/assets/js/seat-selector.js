/**
* Depends on jQuery 1.11.x or 2.1.x but may work with older versions.
*/
var SeatSelector = (function(){

    this.bindClientEvents = function(){

        var self = this;

        $( document.body )
            .on('submit', '#reserveForm', function(e){
                e.preventDefault();
                var data = $(this).serializeJSON();
                $.ajax({
                    dataType: "json",
                    type: "POST",
                    url: "/seats/reserve",
                    data: data
                }).done(function(response){
                    if ( response.success )
                    {
                        var name = data.first_name + ' ' + data.last_name,
                            privateName = data.first_name + ' ' + data.last_name.substr(0,1) + '.',
                            seatLabel = $('.seatLabel:first').text();

                        $('.seat-' + data.seat_id).html('<a href="javascript:;" class="reserved" title="' + privateName + '" data-toggle="tooltip">' + seatLabel + '</a>');
                        $('.personLabel').text(name);
                        $("#confirmationModal").modal('show');
                        $('#reserveModal').modal('hide');

                        self.bindToolTips();
                    }
                    else if ( response.error )
                    {
                        var errorCode = response.error;
                        if ( errorCode === "invalid_code" )
                        {
                            $('#code-error').text("The reservation code you provided is invalid.").parent().addClass('has-error');
                        }
                        else if ( errorCode === "code_already_claimed" )
                        {
                            $('#code-error').text("The reservation code you provided has already been claimed.").parent().addClass('has-error');
                        }
                        else if ( errorCode === "seat_already_reserved" )
                        {
                            alert("The seat you tried reserving has already been reserved. Press 'OK' to refresh this page and to see the currently available seats.");
                            window.location.reload();
                        }
                    }
                    else
                    {
                        alert("An unknown error has occurred. Please contact us directly.");
                    }
                });
            })
            .on('show.bs.modal', function(e){
                var data = $(e.relatedTarget).data();
                if ( data )
                {
                    $('input[name="seat_id"]').val(data.seatid);
                    $('.seatLabel').text(data.row + data.seat);
                }
            })
            .on('shown.bs.modal', function(){
                $('input[name="first_name"]').focus();
            })
            .on('keydown', 'input', function(e){
                var $input = $(e.currentTarget);
                $input.parent().removeClass('has-error');
            });

        self.bindToolTips();
    };

    this.bindToolTips = function() {
        $(function(){
            $('[data-toggle="tooltip"]').tooltip();
        });
    };

    return this;

})();

/*!
SerializeJSON jQuery plugin.
https://github.com/marioizquierdo/jquery.serializeJSON
version 2.4.1 (Oct, 2014)

Copyright (c) 2014 Mario Izquierdo
Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php)
and GPL (http://www.opensource.org/licenses/gpl-license.php) licenses.
*/
(function(a){a.fn.serializeJSON=function(k){var g,e,j,h,i,c,d,b;d=a.serializeJSON;b=d.optsWithDefaults(k);d.validateOptions(b);e=this.serializeArray();d.readCheckboxUncheckedValues(e,this,b);g={};a.each(e,function(l,f){j=d.splitInputNameIntoKeysArray(f.name);h=j.pop();if(h!=="skip"){i=d.parseValue(f.value,h,b);if(b.parseWithFunction&&h==="_"){i=b.parseWithFunction(i,f.name)}d.deepSet(g,j,i,b)}});return g};a.serializeJSON={defaultOptions:{parseNumbers:false,parseBooleans:false,parseNulls:false,parseAll:false,parseWithFunction:null,checkboxUncheckedValue:undefined,useIntKeysAsArrayIndex:false},optsWithDefaults:function(c){var d,b;if(c==null){c={}}d=a.serializeJSON;b=d.optWithDefaults("parseAll",c);return{parseNumbers:b||d.optWithDefaults("parseNumbers",c),parseBooleans:b||d.optWithDefaults("parseBooleans",c),parseNulls:b||d.optWithDefaults("parseNulls",c),parseWithFunction:d.optWithDefaults("parseWithFunction",c),checkboxUncheckedValue:d.optWithDefaults("checkboxUncheckedValue",c),useIntKeysAsArrayIndex:d.optWithDefaults("useIntKeysAsArrayIndex",c)}},optWithDefaults:function(c,b){return(b[c]!==false)&&(b[c]!=="")&&(b[c]||a.serializeJSON.defaultOptions[c])},validateOptions:function(d){var b,c;c=["parseNumbers","parseBooleans","parseNulls","parseAll","parseWithFunction","checkboxUncheckedValue","useIntKeysAsArrayIndex"];for(b in d){if(c.indexOf(b)===-1){throw new Error("serializeJSON ERROR: invalid option '"+b+"'. Please use one of "+c.join(","))}}},parseValue:function(g,b,c){var e,d;d=a.serializeJSON;if(b=="string"){return g}if(b=="number"||(c.parseNumbers&&d.isNumeric(g))){return Number(g)}if(b=="boolean"||(c.parseBooleans&&(g==="true"||g==="false"))){return(["false","null","undefined","","0"].indexOf(g)===-1)}if(b=="null"||(c.parseNulls&&g=="null")){return["false","null","undefined","","0"].indexOf(g)!==-1?null:g}if(b=="array"||b=="object"){return JSON.parse(g)}if(b=="auto"){return d.parseValue(g,null,{parseNumbers:true,parseBooleans:true,parseNulls:true})}return g},isObject:function(b){return b===Object(b)},isUndefined:function(b){return b===void 0},isValidArrayIndex:function(b){return/^[0-9]+$/.test(String(b))},isNumeric:function(b){return b-parseFloat(b)>=0},splitInputNameIntoKeysArray:function(c){var e,b,d,h,g;g=a.serializeJSON;h=g.extractTypeFromInputName(c),b=h[0],d=h[1];e=b.split("[");e=a.map(e,function(f){return f.replace(/]/g,"")});if(e[0]===""){e.shift()}e.push(d);return e},extractTypeFromInputName:function(c){var b,d;d=a.serializeJSON;if(b=c.match(/(.*):([^:]+)$/)){var e=["string","number","boolean","null","array","object","skip","auto"];if(e.indexOf(b[2])!==-1){return[b[1],b[2]]}else{throw new Error("serializeJSON ERROR: Invalid type "+b[2]+" found in input name '"+c+"', please use one of "+e.join(", "))}}else{return[c,"_"]}},deepSet:function(c,l,j,b){var k,h,g,i,d,e;if(b==null){b={}}e=a.serializeJSON;if(e.isUndefined(c)){throw new Error("ArgumentError: param 'o' expected to be an object or array, found undefined")}if(!l||l.length===0){throw new Error("ArgumentError: param 'keys' expected to be an array with least one element")}k=l[0];if(l.length===1){if(k===""){c.push(j)}else{c[k]=j}}else{h=l[1];if(k===""){i=c.length-1;d=c[i];if(e.isObject(d)&&(e.isUndefined(d[h])||l.length>2)){k=i}else{k=i+1}}if(e.isUndefined(c[k])){if(h===""){c[k]=[]}else{if(b.useIntKeysAsArrayIndex&&e.isValidArrayIndex(h)){c[k]=[]}else{c[k]={}}}}g=l.slice(1);e.deepSet(c[k],g,j,b)}},readCheckboxUncheckedValues:function(e,d,i){var b,h,g,c,j;if(i==null){i={}}j=a.serializeJSON;b="input[type=checkbox][name]:not(:checked)";h=d.find(b).add(d.filter(b));h.each(function(f,k){g=a(k);c=g.attr("data-unchecked-value");if(c){e.push({name:k.name,value:c})}else{if(!j.isUndefined(i.checkboxUncheckedValue)){e.push({name:k.name,value:i.checkboxUncheckedValue})}}})}}}(window.jQuery||window.Zepto||window.$));
