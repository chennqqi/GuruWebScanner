jQuery(function(a){var b={states:null,init:function(){"undefined"!=typeof wc_users_params.countries&&(this.states=a.parseJSON(wc_users_params.countries.replace(/&quot;/g,'"'))),a(".js_field-country").select2().change(this.change_country),a(".js_field-country").trigger("change",[!0]),a(document.body).on("change","select.js_field-state",this.change_state)},change_country:function(c,d){if("undefined"==typeof d&&(d=!1),null!==b.states){var e=a(this),f=e.val(),g=e.parents(".form-table").find(":input.js_field-state"),h=g.parent(),i=g.attr("name"),j=g.attr("id"),k=e.data("woocommerce.stickState-"+f)?e.data("woocommerce.stickState-"+f):g.val();if(d&&e.data("woocommerce.stickState-"+f,k),h.show().find(".select2-container").remove(),a.isEmptyObject(b.states[f]))g.replaceWith('<input type="text" class="js_field-state" name="'+i+'" id="'+j+'" value="'+k+'" />');else{var l=a('<select name="'+i+'" id="'+j+'" class="js_field-state" style="width: 25em;"></select>'),m=b.states[f];l.append(a('<option value="">'+wc_users_params.i18n_select_state_text+"</option>")),a.each(m,function(b){l.append(a('<option value="'+b+'">'+m[b]+"</option>"))}),l.val(k),g.replaceWith(l),l.show().select2().hide().change()}a(document.body).trigger("contry-change.woocommerce",[f,a(this).closest("div")]),a(document.body).trigger("country-change.woocommerce",[f,a(this).closest("div")])}},change_state:function(){var b=a(this),c=b.val(),d=b.parents(".form-table").find(":input.js_field-country"),e=d.val();d.data("woocommerce.stickState-"+e,c)}};b.init()});