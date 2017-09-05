//################################################################################################
//	Load Plugins
//################################################################################################

const $ = require('gulp-load-plugins')({
    pattern: ['*'],
    scope: ['devDependencies']
});
const pkg = require('./package.json');


//################################################################################################
//	Options. Customize as needed...
//################################################################################################



// @var global_uri = target document. Can be local or remote.
const global_uri = "http://getbootstrap.com";

// @var download_dest = folder to save downloaded target CSS files. Include '/' at end.
const download_dest = './critical-css/download/';

// @var output_dest = folder to output critical files. Include '/' at end.
const output_dest = './critical-css/output/';

// @var blacklist = downloaded CSS files that should be ignored.
var blacklist = [
	''
];

/**
 *
 *	This is used to store each desired view. A view creates a unique critical CSS file. 
 *	This is best used to create critical CSS files for different browser dimensions, 
 *	to cater for different devices.
 *
 * 	@var views = Array of view objects.
 *
 */
var views = [
	{
		name: "desktop",
		uri: global_uri,
		criticalDest: output_dest+"critical.desktop.css",
		browser: {
			width: 1300,
			height: 900,
			strict: false,
			renderWaitTime: 100,
			timeout: 30000,
			blockjs: true
		}
	},
	{
		name: "tablet",
		uri: global_uri,
		criticalDest: output_dest+"critical.tablet.css",
		browser: {
			width: 900,
			height: 750,
			strict: false,
			renderWaitTime: 100,
			timeout: 30000,
			blockjs: true
		}
	},
	{
		name: "mobile",
		uri: global_uri,
		criticalDest: output_dest+"critical.mobile.css",
		browser: {
			width: 500,
			height: 500,
			strict: false,
			renderWaitTime: 100,
			timeout: 30000,
			blockjs: true
		}
	}
];


//################################################################################################
//	Functions
//################################################################################################

/**
 *
 *	@var truncated = stores critical css destination files that have been emptied.
 *
 *	@var css_files = array of files downloaded from the target website.
 *
 *	@var current_view = index of current view in loop. Default 0.
 *
 *	@var time = used to calculate operation time.
 *
 */
var truncated = css_files = [], current_view = time = 0;


/**
 *
 * This is the main looping function, that iterates through each stylesheet * views. Only one Penthouse object at any time.
 *
 * @param i = current stylesheet index. Resets to 0 each view.
 *
 */
function loop(i){
	var view = views[current_view];
	var stylesheet = css_files[i];
	if (view!=null && stylesheet != null){
		if (!contains(truncated,view.criticalDest)){ //truncate destination files once.
			$.fancyLog("Truncating previous version of file ==> "+view.criticalDest+"\n");
			$.fs.truncate(view.criticalDest,'',function(){
				truncated.push(view.criticalDest);
			});
		}
		$.clear();
		$.fancyLog('\n\nView Name: '+view.name+'\nStylesheet: '+stylesheet+"\nURI: "+view.uri+"\n");
		console.log('\n\nBrowser options:\n'+dump(view.browser));
		console.log('Running Penthouse (and PhantomJS).\n');
		console.log(Math.floor((time/(1000*60))%60)+'m '+((time/1000)%60).toFixed(1)+'s Time Elalpsed\n');
		time==0?0:console.log('(Predicted) Time Left: '+Math.floor((time/(current_view*css_files.length+i)*((views.length*css_files.length)-((current_view*css_files.length+i))))/1000)+' seconds.');
		console.log('[Loop '+((current_view*css_files.length+i)+1)+' out of '+views.length*css_files.length+']');
		var animate_b = true,animate = setInterval(function(){
			process.stdout.write("=");
			time+=100;
		},100);
		var p = $.penthouse(
			{
				url: view.uri,
				css: stylesheet,
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
					//...
				},
				customPageHeaders: {
					"Accept-Encoding":"identity"
				}
			})
			.then(criticalCss => {
				clearInterval(animate);
				$.fs.appendFileSync(view.criticalDest,criticalCss);

				if (css_files[i+1]!=null){
					loop(i+1);
					//next stylesheet
				}
				else if (views[current_view+1]!=null) {
					current_view += 1;
					loop(0);
					//next view. reset stylesheet index selector.
				}
				else {
					$.clear();
					//completed all views. Exit.
					$.fancyLog("\n\nCompleted Last View.\n\n");
					$.fancyLog(Math.floor((time/(1000*60))%60)+'m '+((time/1000)%60).toFixed(1)+'s Total Time Elalpsed\n\n');
					$.fancyLog("Application will close automatically. (may take some time...)\nOtherwise enter shortcut CTRL + C");
				}
				p = null;
				return;
			})
			.catch(err => {
				clearInterval(animate);
				$.fancyLog(err);
				console.log('\n\n(if error is related to timeout, try increasing the current view\'s timout in settings.');
			});

	}
}

/**
 *
 * Retrieves all (relative) paths of downloaded CSS files from target.
 *
 *	@return String[]
 *
 */
function getCssFiles(callback){
	files = [];
	$.fs.readdirSync(download_dest).forEach(file => {
		if (!contains(blacklist,file)){
			files.push(download_dest+file);
		}
	});
	return files;
}

//################################################################################################
//	Gulp Tasks.
//################################################################################################

/**
 *
 * Gulp Task: 	Default Task.
 *
 */
$.gulp.task('default',function(){
	console.log("No args. Refer to README.md for help on how to use this tool.\n\nInstalled packages:\n\n");
	console.log($);
	console.log("\n");
});

/**
 *
 * 	Gulp Task: Initlializes Setup: creates directories for downloaded CSS files, 
 *	and output critical CSS files.
 *
 */
$.gulp.task('init',function(){
	$.fs.access(download_dest,(err)=>{
		if (err){
			$.mkdirp(download_dest,function(e){
				return;
			});
		}
	});
	$.fs.access(output_dest,(err)=>{
		if (err){
			$.mkdirp(output_dest,function(e){
				return;
			});
		}
	});
});

/**
 *
 * Gulp Task: 	Minify all critical CSS files.
 *
 */
 $.gulp.task('minify',['init'],function(){
 	$.gulp.src(output_dest+'*.css')
        .pipe($.cssmin())
        .pipe($.rename({suffix: '.min'}))
        .pipe($.gulp.dest(output_dest+"/min/"));
    console.log("\n\nCompleted. Minified files saved as: `min/[filename].min.css`\n\n");
 });

/**
 *
 * Gulp Task: 	Clear all saved CSS files (both downloaded and critical)
 *
 */
 $.gulp.task('clean',function(){
 	setTimeout(function(){
 		$.clear();
 		var prompt = $.inquirer.createPromptModule();
	 	var questions = {
	 		type: "confirm",
	 		name: "clean",
	 		message: "\n\nAre you sure you want to delete all \nCSS downloads, and critical CSS files?",
	 		default: "n",
	 		choices: ['y','n']
	 	};
	 	prompt(questions).then(function(answer){
	 		if (answer.clean){
	 			$.del(download_dest+"**",{force:true});
	 			$.del(output_dest+"**",{force:true});
	 			console.log('\n\nDone.');
	 		}
	 		else {
	 			console.log('\n\nAborted.');
	 		}
	 	});
	},1000);
});

/**
 *
 * Gulp Task: 	Generate Critical CSS.
 *
 */
$.gulp.task('generate',['init'],function(){
	if (global_uri!=null && global_uri!=''){
		setTimeout(function(){
			$.clear();
			$.fancyLog("Preparing downloaded files...");
			css_files = getCssFiles();
			$.fancyLog(css_files);
			$.fancyLog("Done.");
			loop(0);
		},1500);
	}
	else {
		console.log('\n\nNo target set. Edit variable `global_uri` in '+__filename);
	}
});

/**
 *
 * Gulp Task: 	Download target CSS files.
 *
 */
$.gulp.task('download',['init'],function(){
	if (global_uri!=null && global_uri!=''){
		var css_files = [];

		function save(){
			$.clear();
			$.fancyLog("\n\tSaving Files...\n");
			for (var i=0; i < css_files.length; i++){
				$.download(css_files[i]).pipe($.gulp.dest(download_dest));
			}
			console.log('\nDone. run `gulp generate` to create Critical CSS.');
		}

		(async function() {
			const instance = await $.phantom.create();
			const page = await instance.createPage();
			page.setting('javascriptEnabled').then(function(value){
			    expect(value).toEqual(true);
			});
			await page.on('onResourceRequested', function(requestData) {
				var request = requestData.url.split('.');
				if (request.length>1 && request[request.length-1].toLowerCase() == 'css'){
					$.fancyLog('CSS FILE:\t'+requestData.url+"\n");
					css_files.push(requestData.url);
				}
			});
			const status = await page.open(global_uri);

			await instance.exit();
			await save();
		})();
	}
	else {
		console.log('\n\nNo target set. Edit variable `global_uri` in '+__filename);
	}
});

//################################################################################################
//	Utils
//################################################################################################
function contains(n,r){for(var t=n.length;t--;)if(n[t]===r)return!0;return!1}
function dump(e,o){var r="";o||(o=0);for(var f="",t=0;t<o+1;t++)f+="    ";if("object"==typeof e)for(var n in e){var p=e[n];"object"==typeof p?(r+=f+"'"+n+"' ...\n",r+=dump(p,o+1)):r+=f+"'"+n+"' => \""+p+'"\n'}else r="===>"+e+"<===("+typeof e+")";return r}
