//################################################################################################
//	Optional Variables
//################################################################################################

const default_uri = "./public_html/index.html";	//can be remote...

var css_files = [	//must be local. More than one css file is allowed.
	"./public_html/css/creative.min.css"
];

const browser = {
	dimensions: {
		width: 1300,
		height: 900
	},
	strict: false,
	renderWaitTime: 100,
	blockjs: true,
};

//################################################################################################
//	End of options
//################################################################################################




const $ = require('gulp-load-plugins')({
    pattern: ['*'],
    scope: ['devDependencies']
});
const pkg = require('./package.json');
$.util.log = function(){return this;};

$.gulp.task("default",function(){
	setTimeout(function(){
		$.clear();
		$.inquirer.prompt([
			{
				type: "input",
				name: "uri",
				message: "hostname or relative html file:\n",
				default: default_uri
			}
			]).then(function(a){
				if (a.url!=""){
					var uri = a.uri;
					$.clear();
					$.inquirer.prompt([
					{
						type: "input",
						name: "output",
						message: "Output file: location/file.css",
						default: "./outfile.css"	
					}
					]).then(function(a){
						$.clear();
						if (a.output!=""){
							var outputFile = a.output.replace(/['"]+/g, '').trim();
							$.fancyLog("Clearing any previous outfile file...");
							$.fs.truncate(outputFile,"",function(){
								$.fancyLog("Cleared file.");
								for (var i = 0; i < css_files.length; i++){
									$.fs.access(css_files[i],(err) => {
										if (err){
											$.fancyLog("File "+css_files[i]+" cannot be found!");
											css_files = css_files.splice(i,1);
										}
									});
									$.fancyLog("Added CSS File: "+css_files[i]);
									var file = css_files[i];
									var l = css_files.length;
									$.penthouse({
										url: uri,
										css: file,
										width: browser.dimensions.width,
										height: browser.dimensions.height,
										forceInclude: [],
										timeout: 30000,
										strict: browser.strict,
										maxEmbeddedBase64Length: 1000,
										userAgent: "Penthouse Critical Path CSS Generator",
										renderWaitTime: browser.renderWaitTime,
										blockJsRequests: browser.blockjs,
										phantomJsOptions: {
											//
										},
										customPageHeaders: {
											"Accept-Encoding":"identity"
										}
									})
										.then(criticalCss => {
											$.fancyLog("Appending to "+outputFile);
											$.fs.appendFileSync(outputFile,criticalCss);
											if (i==l){
												$.fancyLog("Completed.");
											}
										})
										.catch(err => {
											$.fancyLog("Error: "+err);
										});
								}
							});
						}
					});
				}
				else {
					$.fancyLog("No URL entered!");
					return;
				}
			})
	},1000);
});