window.wp=window.wp||{},wp.svgPainter=function(a,b,c,d){"use strict";var e,f,g,h={},i=[];return a(c).ready(function(){c.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#Image","1.1")&&(a(c.body).removeClass("no-svg").addClass("svg"),wp.svgPainter.init())}),f=function(){function a(){for(;j<256;)e=String.fromCharCode(j),g+=e,i[j]=j,h[j]=f.indexOf(e),++j}function b(a,b,c,d,f,g){var h,i,j=0,k=0,l="",m=0;for(a=String(a),i=a.length;k<i;){for(e=a.charCodeAt(k),e=e<256?c[e]:-1,j=(j<<f)+e,m+=f;m>=g;)m-=g,h=j>>m,l+=d.charAt(h),j^=h<<m;++k}return!b&&m>0&&(l+=d.charAt(j<<g-m)),l}function c(c){return e||a(),c=b(c,!1,i,f,8,6),c+"====".slice(c.length%4||4)}function d(c){var d;e||a(),c=c.replace(/[^A-Za-z0-9\+\/\=]/g,""),c=String(c).split("="),d=c.length;do--d,c[d]=b(c[d],!0,h,g,6,8);while(d>0);return c=c.join("")}var e,f="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",g="",h=[256],i=[256],j=0;return{atob:d,btoa:c}}(),{init:function(){g=this,e=a("#adminmenu .wp-menu-image, #wpadminbar .ab-item"),this.setColors(),this.findElements(),this.paint()},setColors:function(a){"undefined"==typeof a&&"undefined"!=typeof b._wpColorScheme&&(a=b._wpColorScheme),a&&a.icons&&a.icons.base&&a.icons.current&&a.icons.focus&&(h=a.icons)},findElements:function(){e.each(function(){var b=a(this),c=b.css("background-image");c&&c.indexOf("data:image/svg+xml;base64")!=-1&&i.push(b)})},paint:function(){a.each(i,function(a,c){var d=c.parent().parent();d.hasClass("current")||d.hasClass("wp-has-current-submenu")?g.paintElement(c,"current"):(g.paintElement(c,"base"),d.hover(function(){g.paintElement(c,"focus")},function(){b.setTimeout(function(){g.paintElement(c,"base")},100)}))})},paintElement:function(a,c){var d,e,g;if(c&&h.hasOwnProperty(c)&&(g=h[c],g.match(/^(#[0-9a-f]{3}|#[0-9a-f]{6})$/i)&&(d=a.data("wp-ui-svg-"+g),"none"!==d))){if(!d){if(e=a.css("background-image").match(/.+data:image\/svg\+xml;base64,([A-Za-z0-9\+\/\=]+)/),!e||!e[1])return void a.data("wp-ui-svg-"+g,"none");try{d="atob"in b?b.atob(e[1]):f.atob(e[1])}catch(i){}if(!d)return void a.data("wp-ui-svg-"+g,"none");d=d.replace(/fill="(.+?)"/g,'fill="'+g+'"'),d=d.replace(/style="(.+?)"/g,'style="fill:'+g+'"'),d=d.replace(/fill:.*?;/g,"fill: "+g+";"),d="btoa"in b?b.btoa(d):f.btoa(d),a.data("wp-ui-svg-"+g,d)}a.attr("style",'background-image: url("data:image/svg+xml;base64,'+d+'") !important;')}}}}(jQuery,window,document);