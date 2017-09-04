const $ = require('gulp-load-plugins')({
    pattern: ['*'],
    scope: ['devDependencies']
});
const pkg = require('./package.json');

//################################################################################################
//	Optional Variables
//################################################################################################

//Default URL/FILE location:
//if needed, you can safely overide this value in each view.
const global_uri = "http://getbootstrap.com";


// Enter as many views as needed. The bigger the browser dimensions, the longer the view will take to render.
// You can specify the same same criticalDestination in different views. Following views simply append.

var views = [
	{
		name: "mobile",
		uri: global_uri,
		sourceCSS: "public_html/css/bootstrap.css",
		criticalDest: "public_html/css/critical.mobile.css",
		browser: {
			width: 500,
			height: 500,
			strict: false,
			renderWaitTime: 100,
			timeout: 30000,
			blockjs: true
		}
	},
	{
		name: "tablet",
		uri: global_uri,
		sourceCSS: "public_html/css/bootstrap.css",
		criticalDest: "public_html/css/critical.tablet.css",
		browser: {
			width: 1000,
			height: 1000,
			strict: false,
			renderWaitTime: 100,
			timeout: 30000,
			blockjs: true
		}
	},
	{
		name: "desktop",
		uri: global_uri,
		sourceCSS: "public_html/css/bootstrap.css",
		criticalDest: "public_html/css/critical.desktop.css",
		browser: {
			width: 1300,
			height: 1300,
			strict: false,
			renderWaitTime: 100,
			timeout: 30000,
			blockjs: true
		}
	},
	{
		name: "mobile",
		uri: global_uri,
		sourceCSS: "public_html/css/docs.min.css",
		criticalDest: "public_html/css/critical.mobile.css",
		browser: {
			width: 500,
			height: 500,
			strict: false,
			renderWaitTime: 100,
			timeout: 30000,
			blockjs: true
		}
	},
	{
		name: "tablet",
		uri: global_uri,
		sourceCSS: "public_html/css/docs.min.css",
		criticalDest: "public_html/css/critical.tablet.css",
		browser: {
			width: 1000,
			height: 1000,
			strict: false,
			renderWaitTime: 100,
			timeout: 30000,
			blockjs: true
		}
	},
	{
		name: "desktop",
		uri: global_uri,
		sourceCSS: "public_html/css/docs.min.css",
		criticalDest: "public_html/css/critical.desktop.css",
		browser: {
			width: 1300,
			height: 1300,
			strict: false,
			renderWaitTime: 100,
			timeout: 30000,
			blockjs: true
		}
	}
];
//################################################################################################
//	End of options
//################################################################################################
var truncated = [], time = 0;
function criticalGen(i){
	var view = views[i];
	$.clear();
	$.fs.access(view.sourceCSS,(err)=>{
		if (err){
			$.fancyLog('Source CSS file cannot be found ==> '+view.sourceCSS);
		}
		else {
			$.fancyLog('\n\nView Name: '+view.name+'\nID: '+i+'\nsourceCSS: '+view.sourceCSS+" URI: "+view.uri+"\n");
			$.fancyLog('\n\nBrowser options:\n'+dump(view.browser));
			$.fancyLog('Running Penthouse (and PhantomJS).\n\n');
			var animate_b = true,animate = setInterval(function(){
				process.stdout.write("=");
				time+=100;
			},100);
			$.penthouse(
				{
					url: view.uri,
					css: view.sourceCSS,
					width: view.browser.width,
					height: view.browser.height,
					forceInclude: [],
					timeout: view.browser.timeout,
					strict: view.browser.strict,
					maxEmbeddedBase64Length: 1000,
					userAgent: "Penthouse Critical Path CSS Generator",
					renderWaitTime: view.browser.renderWaitTime,
					blockJsRequests: view.browser.blockjs,
					phantomJsOptions: {
						//
					},
					customPageHeaders: {
						"Accept-Encoding":"identity"
					}
				})
				.then(criticalCss => {
					clearInterval(animate);
					process.stdout.write("\n");
					$.fancyLog("Appending to "+view.criticalDest);
					$.fs.appendFileSync(view.criticalDest,criticalCss);
					$.fancyLog("Done.");
					if (i+1==views.length){
						$.clear();
						$.fancyLog("\n\nCompleted last view.\n\nAll Views took Aprox. "+time/1000+" Seconds.\n\nApplication will close automatically. Otherwise enter shortcut CTRL+C");
					}
					else {
						criticalLoop(i+1);
					}
				})
				.catch(err => {
					$.fancyLog("");
					$.fancyLog("Error: "+err);
				});
		}
	});
	return true;
}
function criticalLoop(i){
	var view = views[i];
	if (view!=null){
		if (!contains(truncated,view.criticalDest)){
			$.fancyLog("Truncating previous version of file ==> "+view.criticalDest+"\n");
			$.fs.truncate(view.criticalDest,'',function(){
				truncated.push(view.criticalDest);
				view = null;
				criticalGen(i);
			});
		}
		else {
			view = null;
			criticalGen(i);
		}
	}
	else {
		$.fancyLog('\n\n\tNo views set?\n\tCheck syntax in file: '+__filename);
	}
	
}
//array contains element. contains(array,object);
function contains(n,r){for(var t=n.length;t--;)if(n[t]===r)return!0;return!1}
//dump variable.
//credit: http://www.openjs.com/scripts/others/dump_function_php_print_r.php
function dump(e,o){var r="";o||(o=0);for(var f="",t=0;t<o+1;t++)f+="    ";if("object"==typeof e)for(var n in e){var p=e[n];"object"==typeof p?(r+=f+"'"+n+"' ...\n",r+=dump(p,o+1)):r+=f+"'"+n+"' => \""+p+'"\n'}else r="===>"+e+"<===("+typeof e+")";return r}

//################################################################################################
// Gulp Tasks
//################################################################################################
$.gulp.task('criticalCss',function(){
	setTimeout(function(){
		$.clear();
		criticalLoop(0);
	},1500);
})
$.gulp.task('default',function(){
	console.log("woops! There is no set default task. Try `gulp criticalCss` to generate Critical CSS");
});