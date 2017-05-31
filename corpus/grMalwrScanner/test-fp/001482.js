!function(a,b,c,d){a(function(){var e=a(".wc-shipping-zones"),f=a(".wc-shipping-zone-rows"),g=a(".wc-shipping-zone-save"),h=c.template("wc-shipping-zone-row"),i=c.template("wc-shipping-zone-row-blank"),j=Backbone.Model.extend({changes:{},logChanges:function(a){var b=this.changes||{};_.each(a,function(a,c){b[c]=_.extend(b[c]||{zone_id:c},a)}),this.changes=b,this.trigger("change:zones")},discardChanges:function(a){var b=this.changes||{},c=null,d=_.indexBy(this.get("zones"),"zone_id");b[a]&&void 0!==b[a].zone_order&&(c=b[a].zone_order),delete b[a],null!==c&&d[a]&&d[a].zone_order!==c&&(b[a]=_.extend(b[a]||{},{zone_id:a,zone_order:c})),this.changes=b,0===_.size(this.changes)&&m.clearUnloadConfirmation()},save:function(){_.size(this.changes)?a.post(d+(d.indexOf("?")>0?"&":"?")+"action=woocommerce_shipping_zones_save_changes",{wc_shipping_zones_nonce:b.wc_shipping_zones_nonce,changes:this.changes},this.onSaveResponse,"json"):l.trigger("saved:zones")},onSaveResponse:function(a,c){"success"===c&&(a.success?(l.set("zones",a.data.zones),l.trigger("change:zones"),l.changes={},l.trigger("saved:zones")):window.alert(b.strings.save_failed))}}),k=Backbone.View.extend({rowTemplate:h,initialize:function(){this.listenTo(this.model,"change:zones",this.setUnloadConfirmation),this.listenTo(this.model,"saved:zones",this.clearUnloadConfirmation),this.listenTo(this.model,"saved:zones",this.render),f.on("change",{view:this},this.updateModelOnChange),f.on("sortupdate",{view:this},this.updateModelOnSort),a(window).on("beforeunload",{view:this},this.unloadConfirmation),a(document.body).on("click",".wc-shipping-zone-add",{view:this},this.onAddNewRow)},block:function(){a(this.el).block({message:null,overlayCSS:{background:"#fff",opacity:.6}})},unblock:function(){a(this.el).unblock()},render:function(){var b=_.indexBy(this.model.get("zones"),"zone_id"),c=this;c.$el.empty(),c.unblock(),_.size(b)?(b=_.sortBy(b,function(a){return parseInt(a.zone_order,10)}),a.each(b,function(a,b){c.renderRow(b)})):c.$el.append(i),c.initRows()},renderRow:function(a){var b=this;b.$el.append(b.rowTemplate(a)),b.initRow(a)},initRow:function(a){var b=this,c=b.$el.find('tr[data-id="'+a.zone_id+'"]');b.renderShippingMethods(a.zone_id,a.shipping_methods),c.find(".wc-shipping-zone-delete").on("click",{view:this},this.onDeleteRow)},initRows:function(){0===a("tbody.wc-shipping-zone-rows tr").length%2?e.find("tbody.wc-shipping-zone-rows").next("tbody").find("tr").addClass("odd"):e.find("tbody.wc-shipping-zone-rows").next("tbody").find("tr").removeClass("odd"),a("#tiptip_holder").removeAttr("style"),a("#tiptip_arrow").removeAttr("style"),a(".tips").tipTip({attribute:"data-tip",fadeIn:50,fadeOut:50,delay:50})},renderShippingMethods:function(c,d){var e=a('.wc-shipping-zones tr[data-id="'+c+'"]'),f=e.find(".wc-shipping-zone-methods ul");f.find(".wc-shipping-zone-method").remove(),_.size(d)?(d=_.sortBy(d,function(a){return parseInt(a.method_order,10)}),_.each(d,function(a){var b="method_disabled";"yes"===a.enabled&&(b="method_enabled"),f.append('<li class="wc-shipping-zone-method '+b+'">'+a.title+"</li>")})):f.append('<li class="wc-shipping-zone-method">'+b.strings.no_shipping_methods_offered+"</li>")},onDeleteRow:function(c){var d=c.data.view,e=d.model,f=_.indexBy(e.get("zones"),"zone_id"),g={},h=a(this).closest("tr"),i=h.data("id");c.preventDefault(),window.confirm(b.strings.delete_confirmation_msg)&&f[i]&&(delete f[i],g[i]=_.extend(g[i]||{},{deleted:"deleted"}),e.set("zones",f),e.logChanges(g),c.data.view.block(),c.data.view.model.save())},setUnloadConfirmation:function(){this.needsUnloadConfirm=!0,g.prop("disabled",!1)},clearUnloadConfirmation:function(){this.needsUnloadConfirm=!1,g.prop("disabled",!0)},unloadConfirmation:function(a){if(a.data.view.needsUnloadConfirm)return a.returnValue=b.strings.unload_confirmation_msg,window.event.returnValue=b.strings.unload_confirmation_msg,b.strings.unload_confirmation_msg},updateModelOnChange:function(b){var c=b.data.view.model,d=a(b.target),e=d.closest("tr").data("id"),f=d.data("attribute"),g=d.val(),h=_.indexBy(c.get("zones"),"zone_id"),i={};h[e]&&h[e][f]===g||(i[e]={},i[e][f]=g),c.logChanges(i)},updateModelOnSort:function(b){var c=b.data.view,d=c.model,e=_.indexBy(d.get("zones"),"zone_id"),f=a("tbody.wc-shipping-zone-rows tr"),g={};_.each(f,function(b){var c=a(b).data("id"),d=null,f=parseInt(a(b).index(),10);e[c]&&(d=parseInt(e[c].zone_order,10)),d!==f&&(g[c]=_.extend(g[c]||{},{zone_order:f}))}),_.size(g)&&(d.logChanges(g),b.data.view.block(),b.data.view.model.save())}}),l=new j({zones:b.zones}),m=new k({model:l,el:f});m.render(),f.sortable({items:"tr",cursor:"move",axis:"y",handle:"td.wc-shipping-zone-sort",scrollSensitivity:40})})}(jQuery,shippingZonesLocalizeScript,wp,ajaxurl);