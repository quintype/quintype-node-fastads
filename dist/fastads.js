// @quintype/fastads@1.0.0
!function(e){function t(e){e.length&&googletag.cmd.push((function(){for(var t=[],a=0;a<e.length;a++){var g=e[a];if(!g.id){var o="dfp-ad-".concat(Math.random().toString(36).replace(/[^a-zA-Z0-9]/g,"").substr(0,7));g.id=o;var r=googletag.defineSlot(g.getAttribute("data-dfp"),JSON.parse(g.getAttribute("data-dfp-size")),o);r.addService(googletag.pubads()),t.push(r)}}googletag.pubads().enableLazyLoad({fetchMarginPercent:500,renderMarginPercent:200,mobileScaling:2}),googletag.enableServices();for(var d=0;d<t.length;d++){var n=t[d];googletag.display(n)}}))}e.googletag=e.googletag||{cmd:[]},new MutationObserver((function(e){for(var a=[],g=0;g<e.length;g++){var o=e[g],r=o.type,d=o.addedNodes;if("childList"===r)for(var n=0;n<d.length;n++){var i=d[n];"DIV"===i.tagName&&i.getAttribute("data-dfp")&&a.push(i)}}t(a)})).observe(e.document.body,{subtree:!0,childList:!0}),t(e.document.querySelectorAll("div[data-dfp]"))}(window);