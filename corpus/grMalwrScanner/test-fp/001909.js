!function(a,b,c){var d=a(document);b=b||{},b.updates={},b.updates.ajaxNonce=c.ajax_nonce,b.updates.l10n=c.l10n,b.updates.searchTerm="",b.updates.shouldRequestFilesystemCredentials=!1,b.updates.filesystemCredentials={ftp:{host:"",username:"",password:"",connectionType:""},ssh:{publicKey:"",privateKey:""},available:!1},b.updates.ajaxLocked=!1,b.updates.adminNotice=b.template("wp-updates-admin-notice"),b.updates.queue=[],b.updates.$elToReturnFocusToFromCredentialsModal=void 0,b.updates.addAdminNotice=function(c){var e,f=a(c.selector);delete c.selector,e=b.updates.adminNotice(c),f.length||(f=a("#"+c.id)),f.length?f.replaceWith(e):a(".wrap").find("> h1").after(e),d.trigger("wp-updates-notice-added")},b.updates.ajax=function(c,d){var e={};return b.updates.ajaxLocked?(b.updates.queue.push({action:c,data:d}),a.Deferred()):(b.updates.ajaxLocked=!0,d.success&&(e.success=d.success,delete d.success),d.error&&(e.error=d.error,delete d.error),e.data=_.extend(d,{action:c,_ajax_nonce:b.updates.ajaxNonce,username:b.updates.filesystemCredentials.ftp.username,password:b.updates.filesystemCredentials.ftp.password,hostname:b.updates.filesystemCredentials.ftp.hostname,connection_type:b.updates.filesystemCredentials.ftp.connectionType,public_key:b.updates.filesystemCredentials.ssh.publicKey,private_key:b.updates.filesystemCredentials.ssh.privateKey}),b.ajax.send(e).always(b.updates.ajaxAlways))},b.updates.ajaxAlways=function(c){c.errorCode&&"unable_to_connect_to_filesystem"===c.errorCode||(b.updates.ajaxLocked=!1,b.updates.queueChecker()),"undefined"!=typeof c.debug&&window.console&&window.console.log&&_.map(c.debug,function(b){window.console.log(a("<p />").html(b).text())})},b.updates.refreshCount=function(){var b,d=a("#wp-admin-bar-updates"),e=a('a[href="update-core.php"] .update-plugins'),f=a('a[href="plugins.php"] .update-plugins'),g=a('a[href="themes.php"] .update-plugins');d.find(".ab-item").removeAttr("title"),d.find(".ab-label").text(c.totals.counts.total),0===c.totals.counts.total&&d.find(".ab-label").parents("li").remove(),e.each(function(a,b){b.className=b.className.replace(/count-\d+/,"count-"+c.totals.counts.total)}),c.totals.counts.total>0?e.find(".update-count").text(c.totals.counts.total):e.remove(),f.each(function(a,b){b.className=b.className.replace(/count-\d+/,"count-"+c.totals.counts.plugins)}),c.totals.counts.total>0?f.find(".plugin-count").text(c.totals.counts.plugins):f.remove(),g.each(function(a,b){b.className=b.className.replace(/count-\d+/,"count-"+c.totals.counts.themes)}),c.totals.counts.total>0?g.find(".theme-count").text(c.totals.counts.themes):g.remove(),"plugins"===pagenow||"plugins-network"===pagenow?b=c.totals.counts.plugins:"themes"!==pagenow&&"themes-network"!==pagenow||(b=c.totals.counts.themes),b>0?a(".subsubsub .upgrade .count").text("("+b+")"):a(".subsubsub .upgrade").remove()},b.updates.decrementCount=function(a){c.totals.counts.total=Math.max(--c.totals.counts.total,0),"plugin"===a?c.totals.counts.plugins=Math.max(--c.totals.counts.plugins,0):"theme"===a&&(c.totals.counts.themes=Math.max(--c.totals.counts.themes,0)),b.updates.refreshCount(a)},b.updates.updatePlugin=function(c){var e,f,g,h;return c=_.extend({success:b.updates.updatePluginSuccess,error:b.updates.updatePluginError},c),"plugins"===pagenow||"plugins-network"===pagenow?(e=a('tr[data-plugin="'+c.plugin+'"]'),g=e.find(".update-message").removeClass("notice-error").addClass("updating-message notice-warning").find("p"),h=b.updates.l10n.updatingLabel.replace("%s",e.find(".plugin-title strong").text())):"plugin-install"!==pagenow&&"plugin-install-network"!==pagenow||(f=a(".plugin-card-"+c.slug),g=f.find(".update-now").addClass("updating-message"),h=b.updates.l10n.updatingLabel.replace("%s",g.data("name")),f.removeClass("plugin-card-update-failed").find(".notice.notice-error").remove()),g.html()!==b.updates.l10n.updating&&g.data("originaltext",g.html()),g.attr("aria-label",h).text(b.updates.l10n.updating),d.trigger("wp-plugin-updating",c),b.updates.ajax("update-plugin",c)},b.updates.updatePluginSuccess=function(c){var e,f,g;"plugins"===pagenow||"plugins-network"===pagenow?(e=a('tr[data-plugin="'+c.plugin+'"]').removeClass("update").addClass("updated"),f=e.find(".update-message").removeClass("updating-message notice-warning").addClass("updated-message notice-success").find("p"),g=e.find(".plugin-version-author-uri").html().replace(c.oldVersion,c.newVersion),e.find(".plugin-version-author-uri").html(g)):"plugin-install"!==pagenow&&"plugin-install-network"!==pagenow||(f=a(".plugin-card-"+c.slug).find(".update-now").removeClass("updating-message").addClass("button-disabled updated-message")),f.attr("aria-label",b.updates.l10n.updatedLabel.replace("%s",c.pluginName)).text(b.updates.l10n.updated),b.a11y.speak(b.updates.l10n.updatedMsg,"polite"),b.updates.decrementCount("plugin"),d.trigger("wp-plugin-update-success",c)},b.updates.updatePluginError=function(c){var e,f,g;b.updates.isValidResponse(c,"update")&&(b.updates.maybeHandleCredentialError(c,"update-plugin")||(g=b.updates.l10n.updateFailed.replace("%s",c.errorMessage),"plugins"===pagenow||"plugins-network"===pagenow?(f=c.plugin?a('tr[data-plugin="'+c.plugin+'"]').find(".update-message"):a('tr[data-slug="'+c.slug+'"]').find(".update-message"),f.removeClass("updating-message notice-warning").addClass("notice-error").find("p").html(g),c.pluginName?f.find("p").attr("aria-label",b.updates.l10n.updateFailedLabel.replace("%s",c.pluginName)):f.find("p").removeAttr("aria-label")):"plugin-install"!==pagenow&&"plugin-install-network"!==pagenow||(e=a(".plugin-card-"+c.slug).addClass("plugin-card-update-failed").append(b.updates.adminNotice({className:"update-message notice-error notice-alt is-dismissible",message:g})),e.find(".update-now").text(b.updates.l10n.updateFailedShort).removeClass("updating-message"),c.pluginName?e.find(".update-now").attr("aria-label",b.updates.l10n.updateFailedLabel.replace("%s",c.pluginName)):e.find(".update-now").removeAttr("aria-label"),e.on("click",".notice.is-dismissible .notice-dismiss",function(){setTimeout(function(){e.removeClass("plugin-card-update-failed").find(".column-name a").focus(),e.find(".update-now").attr("aria-label",!1).text(b.updates.l10n.updateNow)},200)})),b.a11y.speak(g,"assertive"),d.trigger("wp-plugin-update-error",c)))},b.updates.installPlugin=function(c){var e=a(".plugin-card-"+c.slug),f=e.find(".install-now");return c=_.extend({success:b.updates.installPluginSuccess,error:b.updates.installPluginError},c),"import"===pagenow&&(f=a('[data-slug="'+c.slug+'"]')),f.html()!==b.updates.l10n.installing&&f.data("originaltext",f.html()),f.addClass("updating-message").attr("aria-label",b.updates.l10n.pluginInstallingLabel.replace("%s",f.data("name"))).text(b.updates.l10n.installing),b.a11y.speak(b.updates.l10n.installingMsg,"polite"),e.removeClass("plugin-card-install-failed").find(".notice.notice-error").remove(),d.trigger("wp-plugin-installing",c),b.updates.ajax("install-plugin",c)},b.updates.installPluginSuccess=function(c){var e=a(".plugin-card-"+c.slug).find(".install-now");e.removeClass("updating-message").addClass("updated-message installed button-disabled").attr("aria-label",b.updates.l10n.pluginInstalledLabel.replace("%s",c.pluginName)).text(b.updates.l10n.installed),b.a11y.speak(b.updates.l10n.installedMsg,"polite"),d.trigger("wp-plugin-install-success",c),c.activateUrl&&setTimeout(function(){e.removeClass("install-now installed button-disabled updated-message").addClass("activate-now button-primary").attr("href",c.activateUrl).attr("aria-label",b.updates.l10n.activatePluginLabel.replace("%s",c.pluginName)).text(b.updates.l10n.activatePlugin)},1e3)},b.updates.installPluginError=function(c){var e,f=a(".plugin-card-"+c.slug),g=f.find(".install-now");b.updates.isValidResponse(c,"install")&&(b.updates.maybeHandleCredentialError(c,"install-plugin")||(e=b.updates.l10n.installFailed.replace("%s",c.errorMessage),f.addClass("plugin-card-update-failed").append('<div class="notice notice-error notice-alt is-dismissible"><p>'+e+"</p></div>"),f.on("click",".notice.is-dismissible .notice-dismiss",function(){setTimeout(function(){f.removeClass("plugin-card-update-failed").find(".column-name a").focus()},200)}),g.removeClass("updating-message").addClass("button-disabled").attr("aria-label",b.updates.l10n.pluginInstallFailedLabel.replace("%s",g.data("name"))).text(b.updates.l10n.installFailedShort),b.a11y.speak(e,"assertive"),d.trigger("wp-plugin-install-error",c)))},b.updates.installImporterSuccess=function(c){b.updates.addAdminNotice({id:"install-success",className:"notice-success is-dismissible",message:b.updates.l10n.importerInstalledMsg.replace("%s",c.activateUrl+"&from=import")}),a('[data-slug="'+c.slug+'"]').removeClass("install-now updating-message").addClass("activate-now").attr({href:c.activateUrl+"&from=import","aria-label":b.updates.l10n.activateImporterLabel.replace("%s",c.pluginName)}).text(b.updates.l10n.activateImporter),b.a11y.speak(b.updates.l10n.installedMsg,"polite"),d.trigger("wp-importer-install-success",c)},b.updates.installImporterError=function(c){var e=b.updates.l10n.installFailed.replace("%s",c.errorMessage),f=a('[data-slug="'+c.slug+'"]'),g=f.data("name");b.updates.isValidResponse(c,"install")&&(b.updates.maybeHandleCredentialError(c,"install-plugin")||(b.updates.addAdminNotice({id:c.errorCode,className:"notice-error is-dismissible",message:e}),f.removeClass("updating-message").text(b.updates.l10n.installNow).attr("aria-label",b.updates.l10n.installNowLabel.replace("%s",g)),b.a11y.speak(e,"assertive"),d.trigger("wp-importer-install-error",c)))},b.updates.deletePlugin=function(c){var e=a('[data-plugin="'+c.plugin+'"]').find(".row-actions a.delete");return c=_.extend({success:b.updates.deletePluginSuccess,error:b.updates.deletePluginError},c),e.html()!==b.updates.l10n.deleting&&e.data("originaltext",e.html()).text(b.updates.l10n.deleting),b.a11y.speak(b.updates.l10n.deleting,"polite"),d.trigger("wp-plugin-deleting",c),b.updates.ajax("delete-plugin",c)},b.updates.deletePluginSuccess=function(e){a('[data-plugin="'+e.plugin+'"]').css({backgroundColor:"#faafaa"}).fadeOut(350,function(){var d=a("#bulk-action-form"),f=a(".subsubsub"),g=a(this),h=d.find("thead th:not(.hidden), thead td").length,i=b.template("item-deleted-row"),j=c.plugins;g.hasClass("plugin-update-tr")||g.after(i({slug:e.slug,plugin:e.plugin,colspan:h,name:e.pluginName})),g.remove(),-1!==_.indexOf(j.upgrade,e.plugin)&&(j.upgrade=_.without(j.upgrade,e.plugin),b.updates.decrementCount("plugin")),-1!==_.indexOf(j.inactive,e.plugin)&&(j.inactive=_.without(j.inactive,e.plugin),j.inactive.length?f.find(".inactive .count").text("("+j.inactive.length+")"):f.find(".inactive").remove()),-1!==_.indexOf(j.active,e.plugin)&&(j.active=_.without(j.active,e.plugin),j.active.length?f.find(".active .count").text("("+j.active.length+")"):f.find(".active").remove()),-1!==_.indexOf(j.recently_activated,e.plugin)&&(j.recently_activated=_.without(j.recently_activated,e.plugin),j.recently_activated.length?f.find(".recently_activated .count").text("("+j.recently_activated.length+")"):f.find(".recently_activated").remove()),j.all=_.without(j.all,e.plugin),j.all.length?f.find(".all .count").text("("+j.all.length+")"):(d.find(".tablenav").css({visibility:"hidden"}),f.find(".all").remove(),d.find("tr.no-items").length||d.find("#the-list").append('<tr class="no-items"><td class="colspanchange" colspan="'+h+'">'+b.updates.l10n.noPlugins+"</td></tr>"))}),b.a11y.speak(b.updates.l10n.deleted,"polite"),d.trigger("wp-plugin-delete-success",e)},b.updates.deletePluginError=function(c){var e,f,g=b.template("item-update-row"),h=b.updates.adminNotice({className:"update-message notice-error notice-alt",message:c.errorMessage});c.plugin?(e=a('tr.inactive[data-plugin="'+c.plugin+'"]'),f=e.siblings('[data-plugin="'+c.plugin+'"]')):(e=a('tr.inactive[data-slug="'+c.slug+'"]'),f=e.siblings('[data-slug="'+c.slug+'"]')),b.updates.isValidResponse(c,"delete")&&(b.updates.maybeHandleCredentialError(c,"delete-plugin")||(f.length?(f.find(".notice-error").remove(),f.find(".plugin-update").append(h)):e.addClass("update").after(g({slug:c.slug,plugin:c.plugin||c.slug,colspan:a("#bulk-action-form").find("thead th:not(.hidden), thead td").length,content:h})),d.trigger("wp-plugin-delete-error",c)))},b.updates.updateTheme=function(c){var e;return c=_.extend({success:b.updates.updateThemeSuccess,error:b.updates.updateThemeError},c),"themes-network"===pagenow?e=a('[data-slug="'+c.slug+'"]').find(".update-message").removeClass("notice-error").addClass("updating-message notice-warning").find("p"):(e=a("#update-theme").closest(".notice").removeClass("notice-large"),e.find("h3").remove(),e=e.add(a('[data-slug="'+c.slug+'"]').find(".update-message")),e=e.addClass("updating-message").find("p")),e.html()!==b.updates.l10n.updating&&e.data("originaltext",e.html()),b.a11y.speak(b.updates.l10n.updatingMsg,"polite"),e.text(b.updates.l10n.updating),d.trigger("wp-theme-updating",c),b.updates.ajax("update-theme",c)},b.updates.updateThemeSuccess=function(c){var e,f,g=a("body.modal-open").length,h=a('[data-slug="'+c.slug+'"]'),i={className:"updated-message notice-success notice-alt",message:b.updates.l10n.updated};"themes-network"===pagenow?(e=h.find(".update-message"),f=h.find(".theme-version-author-uri").html().replace(c.oldVersion,c.newVersion),h.find(".theme-version-author-uri").html(f)):(e=a(".theme-info .notice").add(h.find(".update-message")),g?a(".load-customize:visible").focus():h.find(".load-customize").focus()),b.updates.addAdminNotice(_.extend({selector:e},i)),b.a11y.speak(b.updates.l10n.updatedMsg,"polite"),b.updates.decrementCount("theme"),d.trigger("wp-theme-update-success",c),g&&a(".theme-info .theme-author").after(b.updates.adminNotice(i))},b.updates.updateThemeError=function(c){var e,f=a('[data-slug="'+c.slug+'"]'),g=b.updates.l10n.updateFailed.replace("%s",c.errorMessage);b.updates.isValidResponse(c,"update")&&(b.updates.maybeHandleCredentialError(c,"update-theme")||("themes-network"===pagenow?e=f.find(".update-message "):(e=a(".theme-info .notice").add(f.find(".notice")),a("body.modal-open").length?a(".load-customize:visible").focus():f.find(".load-customize").focus()),b.updates.addAdminNotice({selector:e,className:"update-message notice-error notice-alt is-dismissible",message:g}),b.a11y.speak(g,"polite"),d.trigger("wp-theme-update-error",c)))},b.updates.installTheme=function(c){var e=a('.theme-install[data-slug="'+c.slug+'"]');return c=_.extend({success:b.updates.installThemeSuccess,error:b.updates.installThemeError},c),e.addClass("updating-message"),e.parents(".theme").addClass("focus"),e.html()!==b.updates.l10n.installing&&e.data("originaltext",e.html()),e.text(b.updates.l10n.installing).attr("aria-label",b.updates.l10n.themeInstallingLabel.replace("%s",e.data("name"))),b.a11y.speak(b.updates.l10n.installingMsg,"polite"),a('.install-theme-info, [data-slug="'+c.slug+'"]').removeClass("theme-install-failed").find(".notice.notice-error").remove(),d.trigger("wp-theme-installing",c),b.updates.ajax("install-theme",c)},b.updates.installThemeSuccess=function(c){var e,f=a(".wp-full-overlay-header, [data-slug="+c.slug+"]");d.trigger("wp-theme-install-success",c),e=f.find(".button-primary").removeClass("updating-message").addClass("updated-message disabled").attr("aria-label",b.updates.l10n.themeInstalledLabel.replace("%s",c.themeName)).text(b.updates.l10n.installed),b.a11y.speak(b.updates.l10n.installedMsg,"polite"),setTimeout(function(){c.activateUrl&&e.attr("href",c.activateUrl).removeClass("theme-install updated-message disabled").addClass("activate").attr("aria-label",b.updates.l10n.activateThemeLabel.replace("%s",c.themeName)).text(b.updates.l10n.activateTheme),c.customizeUrl&&e.siblings(".preview").replaceWith(function(){return a("<a>").attr("href",c.customizeUrl).addClass("button load-customize").text(b.updates.l10n.livePreview)})},1e3)},b.updates.installThemeError=function(c){var e,f,g=b.updates.l10n.installFailed.replace("%s",c.errorMessage),h=b.updates.adminNotice({className:"update-message notice-error notice-alt",message:g});b.updates.isValidResponse(c,"install")&&(b.updates.maybeHandleCredentialError(c,"install-theme")||(d.find("body").hasClass("full-overlay-active")?(f=a('.theme-install[data-slug="'+c.slug+'"]'),e=a(".install-theme-info").prepend(h)):(e=a('[data-slug="'+c.slug+'"]').removeClass("focus").addClass("theme-install-failed").append(h),f=e.find(".theme-install")),f.removeClass("updating-message").attr("aria-label",b.updates.l10n.themeInstallFailedLabel.replace("%s",f.data("name"))).text(b.updates.l10n.installFailedShort),b.a11y.speak(g,"assertive"),d.trigger("wp-theme-install-error",c)))},b.updates.deleteTheme=function(c){var e;return"themes"===pagenow?e=a(".theme-actions .delete-theme"):"themes-network"===pagenow&&(e=a('[data-slug="'+c.slug+'"]').find(".row-actions a.delete")),c=_.extend({success:b.updates.deleteThemeSuccess,error:b.updates.deleteThemeError},c),e&&e.html()!==b.updates.l10n.deleting&&e.data("originaltext",e.html()).text(b.updates.l10n.deleting),b.a11y.speak(b.updates.l10n.deleting,"polite"),a(".theme-info .update-message").remove(),d.trigger("wp-theme-deleting",c),b.updates.ajax("delete-theme",c)},b.updates.deleteThemeSuccess=function(e){var f=a('[data-slug="'+e.slug+'"]');"themes-network"===pagenow&&f.css({backgroundColor:"#faafaa"}).fadeOut(350,function(){var d=a(".subsubsub"),f=a(this),g=c.themes,h=b.template("item-deleted-row");f.hasClass("plugin-update-tr")||f.after(h({slug:e.slug,colspan:a("#bulk-action-form").find("thead th:not(.hidden), thead td").length,name:f.find(".theme-title strong").text()})),f.remove(),f.hasClass("update")&&(g.upgrade--,b.updates.decrementCount("theme")),f.hasClass("inactive")&&(g.disabled--,g.disabled?d.find(".disabled .count").text("("+g.disabled+")"):d.find(".disabled").remove()),d.find(".all .count").text("("+--g.all+")")}),b.a11y.speak(b.updates.l10n.deleted,"polite"),d.trigger("wp-theme-delete-success",e)},b.updates.deleteThemeError=function(c){var e=a('tr.inactive[data-slug="'+c.slug+'"]'),f=a(".theme-actions .delete-theme"),g=b.template("item-update-row"),h=e.siblings("#"+c.slug+"-update"),i=b.updates.l10n.deleteFailed.replace("%s",c.errorMessage),j=b.updates.adminNotice({className:"update-message notice-error notice-alt",message:i});b.updates.maybeHandleCredentialError(c,"delete-theme")||("themes-network"===pagenow?h.length?(h.find(".notice-error").remove(),h.find(".plugin-update").append(j)):e.addClass("update").after(g({slug:c.slug,colspan:a("#bulk-action-form").find("thead th:not(.hidden), thead td").length,content:j})):a(".theme-info .theme-description").before(j),f.html(f.data("originaltext")),b.a11y.speak(i,"assertive"),d.trigger("wp-theme-delete-error",c))},b.updates._addCallbacks=function(a,c){return"import"===pagenow&&"install-plugin"===c&&(a.success=b.updates.installImporterSuccess,a.error=b.updates.installImporterError),a},b.updates.queueChecker=function(){var a;if(!b.updates.ajaxLocked&&b.updates.queue.length)switch(a=b.updates.queue.shift(),a.action){case"install-plugin":b.updates.installPlugin(a.data);break;case"update-plugin":b.updates.updatePlugin(a.data);break;case"delete-plugin":b.updates.deletePlugin(a.data);break;case"install-theme":b.updates.installTheme(a.data);break;case"update-theme":b.updates.updateTheme(a.data);break;case"delete-theme":b.updates.deleteTheme(a.data)}},b.updates.requestFilesystemCredentials=function(c){!1===b.updates.filesystemCredentials.available&&(c&&!b.updates.$elToReturnFocusToFromCredentialsModal&&(b.updates.$elToReturnFocusToFromCredentialsModal=a(c.target)),b.updates.ajaxLocked=!0,b.updates.requestForCredentialsModalOpen())},b.updates.maybeRequestFilesystemCredentials=function(a){b.updates.shouldRequestFilesystemCredentials&&!b.updates.ajaxLocked&&b.updates.requestFilesystemCredentials(a)},b.updates.keydown=function(c){27===c.keyCode?b.updates.requestForCredentialsModalCancel():9===c.keyCode&&("upgrade"!==c.target.id||c.shiftKey?"hostname"===c.target.id&&c.shiftKey&&(a("#upgrade").focus(),c.preventDefault()):(a("#hostname").focus(),c.preventDefault()))},b.updates.requestForCredentialsModalOpen=function(){var c=a("#request-filesystem-credentials-dialog");a("body").addClass("modal-open"),c.show(),c.find("input:enabled:first").focus(),c.on("keydown",b.updates.keydown)},b.updates.requestForCredentialsModalClose=function(){a("#request-filesystem-credentials-dialog").hide(),a("body").removeClass("modal-open"),b.updates.$elToReturnFocusToFromCredentialsModal&&b.updates.$elToReturnFocusToFromCredentialsModal.focus()},b.updates.requestForCredentialsModalCancel=function(){(b.updates.ajaxLocked||b.updates.queue.length)&&(_.each(b.updates.queue,function(a){d.trigger("credential-modal-cancel",a)}),b.updates.ajaxLocked=!1,b.updates.queue=[],b.updates.requestForCredentialsModalClose())},b.updates.showErrorInCredentialsForm=function(b){var c=a("#request-filesystem-credentials-form");c.find(".notice").remove(),c.find("#request-filesystem-credentials-title").after('<div class="notice notice-alt notice-error"><p>'+b+"</p></div>")},b.updates.credentialError=function(a,c){a=b.updates._addCallbacks(a,c),b.updates.queue.unshift({action:c,data:a}),b.updates.filesystemCredentials.available=!1,b.updates.showErrorInCredentialsForm(a.errorMessage),b.updates.requestFilesystemCredentials()},b.updates.maybeHandleCredentialError=function(a,c){return!(!b.updates.shouldRequestFilesystemCredentials||!a.errorCode||"unable_to_connect_to_filesystem"!==a.errorCode)&&(b.updates.credentialError(a,c),!0)},b.updates.isValidResponse=function(c,d){var e,f=b.updates.l10n.unknownError;if(_.isObject(c)&&!_.isFunction(c.always))return!0;switch(_.isString(c)&&"-1"===c?f=b.updates.l10n.nonceError:_.isString(c)?f=c:"undefined"!=typeof c.readyState&&0===c.readyState?f=b.updates.l10n.connectionError:_.isString(c.responseText)&&""!==c.responseText?f=c.responseText:_.isString(c.statusText)&&(f=c.statusText),d){case"update":e=b.updates.l10n.updateFailed;break;case"install":e=b.updates.l10n.installFailed;break;case"delete":e=b.updates.l10n.deleteFailed}return f=f.replace(/<[\/a-z][^<>]*>/gi,""),e=e.replace("%s",f),b.updates.addAdminNotice({id:"unknown_error",className:"notice-error is-dismissible",message:_.escape(e)}),b.updates.ajaxLocked=!1,b.updates.queue=[],a(".button.updating-message").removeClass("updating-message").removeAttr("aria-label").prop("disabled",!0).text(b.updates.l10n.updateFailedShort),a(".updating-message:not(.button):not(.thickbox)").removeClass("updating-message notice-warning").addClass("notice-error").find("p").removeAttr("aria-label").text(e),b.a11y.speak(e,"assertive"),!1},b.updates.beforeunload=function(){if(b.updates.ajaxLocked)return b.updates.l10n.beforeunload},a(function(){var e=a("#plugin-filter"),f=a("#bulk-action-form"),g=a("#request-filesystem-credentials-form"),h=a("#request-filesystem-credentials-dialog"),i=a(".plugins-php .wp-filter-search"),j=a(".plugin-install-php .wp-filter-search");c=_.extend(c,window._wpUpdatesItemCounts||{}),c.totals&&b.updates.refreshCount(),b.updates.shouldRequestFilesystemCredentials=h.length>0,h.on("submit","form",function(c){c.preventDefault(),b.updates.filesystemCredentials.ftp.hostname=a("#hostname").val(),b.updates.filesystemCredentials.ftp.username=a("#username").val(),b.updates.filesystemCredentials.ftp.password=a("#password").val(),b.updates.filesystemCredentials.ftp.connectionType=a('input[name="connection_type"]:checked').val(),b.updates.filesystemCredentials.ssh.publicKey=a("#public_key").val(),b.updates.filesystemCredentials.ssh.privateKey=a("#private_key").val(),b.updates.filesystemCredentials.available=!0,b.updates.ajaxLocked=!1,b.updates.queueChecker(),b.updates.requestForCredentialsModalClose()}),h.on("click",'[data-js-action="close"], .notification-dialog-background',b.updates.requestForCredentialsModalCancel),g.on("change",'input[name="connection_type"]',function(){a("#ssh-keys").toggleClass("hidden","ssh"!==a(this).val())}).change(),d.on("credential-modal-cancel",function(c,d){var e,f,g=a(".updating-message");"import"===pagenow?g.removeClass("updating-message"):"plugins"===pagenow||"plugins-network"===pagenow?"update-plugin"===d.action?e=a('tr[data-plugin="'+d.data.plugin+'"]').find(".update-message"):"delete-plugin"===d.action&&(e=a('[data-plugin="'+d.data.plugin+'"]').find(".row-actions a.delete")):"themes"===pagenow||"themes-network"===pagenow?"update-theme"===d.action?e=a('[data-slug="'+d.data.slug+'"]').find(".update-message"):"delete-theme"===d.action&&"themes-network"===pagenow?e=a('[data-slug="'+d.data.slug+'"]').find(".row-actions a.delete"):"delete-theme"===d.action&&"themes"===pagenow&&(e=a(".theme-actions .delete-theme")):e=g,e&&e.hasClass("updating-message")&&(f=e.data("originaltext"),"undefined"==typeof f&&(f=a("<p>").html(e.find("p").data("originaltext"))),e.removeClass("updating-message").html(f),"plugin-install"!==pagenow&&"plugin-install-network"!==pagenow||("update-plugin"===d.action?e.attr("aria-label",b.updates.l10n.updateNowLabel.replace("%s",e.data("name"))):"install-plugin"===d.action&&e.attr("aria-label",b.updates.l10n.installNowLabel.replace("%s",e.data("name"))))),b.a11y.speak(b.updates.l10n.updateCancel,"polite")}),f.on("click","[data-plugin] .update-link",function(c){var d=a(c.target),e=d.parents("tr");c.preventDefault(),d.hasClass("updating-message")||d.hasClass("button-disabled")||(b.updates.maybeRequestFilesystemCredentials(c),b.updates.$elToReturnFocusToFromCredentialsModal=e.find(".check-column input"),b.updates.updatePlugin({plugin:e.data("plugin"),slug:e.data("slug")}))}),e.on("click",".update-now",function(c){var d=a(c.target);c.preventDefault(),d.hasClass("updating-message")||d.hasClass("button-disabled")||(b.updates.maybeRequestFilesystemCredentials(c),b.updates.updatePlugin({plugin:d.data("plugin"),slug:d.data("slug")}))}),e.on("click",".install-now",function(c){var e=a(c.target);c.preventDefault(),e.hasClass("updating-message")||e.hasClass("button-disabled")||(b.updates.shouldRequestFilesystemCredentials&&!b.updates.ajaxLocked&&(b.updates.requestFilesystemCredentials(c),d.on("credential-modal-cancel",function(){var c=a(".install-now.updating-message");c.removeClass("updating-message").text(b.updates.l10n.installNow),b.a11y.speak(b.updates.l10n.updateCancel,"polite")})),b.updates.installPlugin({slug:e.data("slug")}))}),d.on("click",".importer-item .install-now",function(c){var e=a(c.target),f=a(this).data("name");c.preventDefault(),e.hasClass("updating-message")||(b.updates.shouldRequestFilesystemCredentials&&!b.updates.ajaxLocked&&(b.updates.requestFilesystemCredentials(c),d.on("credential-modal-cancel",function(){e.removeClass("updating-message").text(b.updates.l10n.installNow).attr("aria-label",b.updates.l10n.installNowLabel.replace("%s",f)),b.a11y.speak(b.updates.l10n.updateCancel,"polite")})),b.updates.installPlugin({slug:e.data("slug"),pagenow:pagenow,success:b.updates.installImporterSuccess,error:b.updates.installImporterError}))}),f.on("click","[data-plugin] a.delete",function(c){var d=a(c.target).parents("tr");c.preventDefault(),window.confirm(b.updates.l10n.aysDeleteUninstall.replace("%s",d.find(".plugin-title strong").text()))&&(b.updates.maybeRequestFilesystemCredentials(c),b.updates.deletePlugin({plugin:d.data("plugin"),slug:d.data("slug")}))}),d.on("click",".themes-php.network-admin .update-link",function(c){var d=a(c.target),e=d.parents("tr");c.preventDefault(),d.hasClass("updating-message")||d.hasClass("button-disabled")||(b.updates.maybeRequestFilesystemCredentials(c),b.updates.$elToReturnFocusToFromCredentialsModal=e.find(".check-column input"),b.updates.updateTheme({slug:e.data("slug")}))}),d.on("click",".themes-php.network-admin a.delete",function(c){var d=a(c.target).parents("tr");c.preventDefault(),window.confirm(b.updates.l10n.aysDelete.replace("%s",d.find(".theme-title strong").text()))&&(b.updates.maybeRequestFilesystemCredentials(c),b.updates.deleteTheme({slug:d.data("slug")}))}),f.on("click",'[type="submit"]',function(c){var e,g,h=a(c.target).siblings("select").val(),i=f.find('input[name="checked[]"]:checked'),j=0,k=0,l=[];switch(pagenow){case"plugins":case"plugins-network":e="plugin";break;case"themes-network":e="theme";break;default:return}if(!i.length)return c.preventDefault(),a("html, body").animate({scrollTop:0}),b.updates.addAdminNotice({id:"no-items-selected",className:"notice-error is-dismissible",message:b.updates.l10n.noItemsSelected});switch(h){case"update-selected":g=h.replace("selected",e);break;case"delete-selected":if(!window.confirm("plugin"===e?b.updates.l10n.aysBulkDelete:b.updates.l10n.aysBulkDeleteThemes))return void c.preventDefault();g=h.replace("selected",e);break;default:return}b.updates.maybeRequestFilesystemCredentials(c),c.preventDefault(),f.find('.manage-column [type="checkbox"]').prop("checked",!1),d.trigger("wp-"+e+"-bulk-"+h,i),i.each(function(c,d){var e=a(d),f=e.parents("tr");return"update-selected"!==h||f.hasClass("update")&&!f.find("notice-error").length?void b.updates.queue.push({action:g,data:{plugin:f.data("plugin"),slug:f.data("slug")}}):void e.prop("checked",!1)}),d.on("wp-plugin-update-success wp-plugin-update-error wp-theme-update-success wp-theme-update-error",function(c,d){var e,f,g=a('[data-slug="'+d.slug+'"]');"wp-"+d.update+"-update-success"===c.type?j++:(f=d.pluginName?d.pluginName:g.find(".column-primary strong").text(),k++,l.push(f+": "+d.errorMessage)),g.find('input[name="checked[]"]:checked').prop("checked",!1),b.updates.adminNotice=b.template("wp-bulk-updates-admin-notice"),b.updates.addAdminNotice({id:"bulk-action-notice",className:"bulk-action-notice",successes:j,errors:k,errorMessages:l,type:d.update}),e=a("#bulk-action-notice").on("click","button",function(){a(this).toggleClass("bulk-action-errors-collapsed").attr("aria-expanded",!a(this).hasClass("bulk-action-errors-collapsed")),e.find(".bulk-action-errors").toggleClass("hidden")}),k>0&&!b.updates.queue.length&&a("html, body").animate({scrollTop:0})}),d.on("wp-updates-notice-added",function(){b.updates.adminNotice=b.template("wp-updates-admin-notice")}),b.updates.queueChecker()}),j.length&&j.attr("aria-describedby","live-search-desc"),j.on("keyup input",_.debounce(function(c,d){var f,g,h=a(".plugin-install-search");f={_ajax_nonce:b.updates.ajaxNonce,s:c.target.value,tab:"search",type:a("#typeselector").val(),pagenow:pagenow},g=location.href.split("?")[0]+"?"+a.param(_.omit(f,["_ajax_nonce","pagenow"])),"keyup"===c.type&&27===c.which&&(c.target.value=""),b.updates.searchTerm===f.s&&"typechange"!==d||(e.empty(),b.updates.searchTerm=f.s,window.history&&window.history.replaceState&&window.history.replaceState(null,"",g),h.length||(h=a('<li class="plugin-install-search" />').append(a("<a />",{"class":"current",href:g,text:b.updates.l10n.searchResultsLabel})),a(".wp-filter .filter-links .current").removeClass("current").parents(".filter-links").prepend(h),e.prev("p").remove(),a(".plugins-popular-tags-wrapper").remove()),"undefined"!=typeof b.updates.searchRequest&&b.updates.searchRequest.abort(),a("body").addClass("loading-content"),b.updates.searchRequest=b.ajax.post("search-install-plugins",f).done(function(c){a("body").removeClass("loading-content"),e.append(c.items),delete b.updates.searchRequest,0===c.count?b.a11y.speak(b.updates.l10n.noPluginsFound):b.a11y.speak(b.updates.l10n.pluginsFound.replace("%d",c.count))}))},500)),i.length&&i.attr("aria-describedby","live-search-desc"),i.on("keyup input",_.debounce(function(c){var d,e={_ajax_nonce:b.updates.ajaxNonce,s:c.target.value,pagenow:pagenow,plugin_status:"all"};"keyup"===c.type&&27===c.which&&(c.target.value=""),b.updates.searchTerm!==e.s&&(b.updates.searchTerm=e.s,d=_.object(_.compact(_.map(location.search.slice(1).split("&"),function(a){if(a)return a.split("=")}))),e.plugin_status=d.plugin_status||"all",window.history&&window.history.replaceState&&window.history.replaceState(null,"",location.href.split("?")[0]+"?s="+e.s+"&plugin_status="+e.plugin_status),
"undefined"!=typeof b.updates.searchRequest&&b.updates.searchRequest.abort(),f.empty(),a("body").addClass("loading-content"),a(".subsubsub .current").removeClass("current"),b.updates.searchRequest=b.ajax.post("search-plugins",e).done(function(c){var d=a("<span />").addClass("subtitle").html(b.updates.l10n.searchResults.replace("%s",_.escape(e.s))),g=a(".wrap .subtitle");e.s.length?g.length?g.replaceWith(d):a(".wrap h1").append(d):(g.remove(),a(".subsubsub ."+e.plugin_status+" a").addClass("current")),a("body").removeClass("loading-content"),f.append(c.items),delete b.updates.searchRequest,0===c.count?b.a11y.speak(b.updates.l10n.noPluginsFound):b.a11y.speak(b.updates.l10n.pluginsFound.replace("%d",c.count))}))},500)),d.on("submit",".search-plugins",function(b){b.preventDefault(),a("input.wp-filter-search").trigger("input")}),a("#typeselector").on("change",function(){var b=a('input[name="s"]');b.val().length&&b.trigger("input","typechange")}),a("#plugin_update_from_iframe").on("click",function(b){var c,d=window.parent===window?null:window.parent;a.support.postMessage=!!window.postMessage,!1!==a.support.postMessage&&null!==d&&-1===window.parent.location.pathname.indexOf("update-core.php")&&(b.preventDefault(),c={action:"update-plugin",data:{plugin:a(this).data("plugin"),slug:a(this).data("slug")}},d.postMessage(JSON.stringify(c),window.location.origin))}),a("#plugin_install_from_iframe").on("click",function(b){var c,d=window.parent===window?null:window.parent;a.support.postMessage=!!window.postMessage,!1!==a.support.postMessage&&null!==d&&-1===window.parent.location.pathname.indexOf("index.php")&&(b.preventDefault(),c={action:"install-plugin",data:{slug:a(this).data("slug")}},d.postMessage(JSON.stringify(c),window.location.origin))}),a(window).on("message",function(c){var d,e=c.originalEvent,f=document.location.protocol+"//"+document.location.hostname;if(e.origin===f){try{d=a.parseJSON(e.data)}catch(g){return}if("undefined"!=typeof d.action)switch(d.action){case"decrementUpdateCount":b.updates.decrementCount(d.upgradeType);break;case"install-plugin":case"update-plugin":window.tb_remove(),d.data=b.updates._addCallbacks(d.data,d.action),b.updates.queue.push(d),b.updates.queueChecker()}}}),a(window).on("beforeunload",b.updates.beforeunload)})}(jQuery,window.wp,window._wpUpdatesSettings);