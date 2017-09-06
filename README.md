# Critical-CSS Tool

A tool that utilises Penthouse, PhantomJS, and other NPM Packages, to easily generate clean Critical CSS.

More information about Critical CSS: 

https://dbushell.com/2015/02/19/critical-css-and-performance/

https://css-tricks.com/authoring-critical-fold-css/

## Getting Started

To use this tool you may need a basic understanding of Node.js and Gulp.

https://css-tricks.com/gulp-for-beginners/

### Prerequisites

*Node.js V8.2.1^ https://nodejs.org/en/download/current/

*Python https://www.python.org/downloads/

### Download

`git clone https://github.com/mintymatt/criticalcssgen.git`

https://github.com/mintymatt/criticalcssgen/archive/master.zip

## Setup

1.	Install Modules
2.	Edit `gulpfile.js`

Make sure you have Node.js installed. Open up a console on your local machine and `cd` to the `/release` directory. Install the Node Modules: `npm install`.

Edit `gulpfile.js`, and configure the options. For basic use, you should only need to specify the target website: 

`const global_uri = 'http://getbootstrap.com'; //example URI`

The target can be a remote location, or a local file (advise the use of an absolute path for the latter). You may also wish to cinfigure the views to your own preference. (you can add or remove views as you wish, note that each view should have the same amount of parameters).

## Usage

The proccess of using this tool is as follows:

1.	Set target in `gulpfile.js`
2.	Define desired views.
3.	Download the target's CSS files. Command: `gulp download`
4.	Generate Critical CSS.	Command: `gulp critical`
5.	(Optional) Minify Critical CSS. Command: `gulp minify`

Note that if your target is remote, you will need a connection throughout the proccess.

## All tasks (commands)

`gulp init`

Intializes Tool setup, creates `/critical-css/download` and `/critical-css/output` (customizable within `gulpfile.js`).
Automatically called by `gulp download` and `gulp generate`.


`gulp download`

Download CSS files from target.


`gulp generate`

Generate Critical CSS based on downloaded CSS files, and target document.


`gulp minify`

Minify generated CSS files.


`gulp clean`

Delete downloaded CSS files, and generated Critical CSS.

------------------------------------------------------------------------------------------------------------------------------

You could make this process easier, by automatically calling each task after the other. 
Under `/test` you can find a shell executable which automatically runs through these tasks in one go (except `gulp clean`).

## Example use of critical CSS, using PHP

Critical CSS should only need to be used once, as after the first complete load of a page the user should have a cached edition of our stylesheets. Therefore we can use a cookie to determine whether a visitor has seen our website yet, and decide if we need to provide them with ciritical CSS. Here is a basic example (taken from `/test`):

```
<?php
	if (empty($_COOKIE['first_visit'])):	//if cookie doesn't exist (i.e. new visitor)
		setcookie('first_visit',true,time()+864000,'/','',0); //set cookie for first visit. Expires in 10 days.
		?>
			<style>
			//critical css style rules here. perhaps use file_get_contents()
			</style>
		<?php
	endif
?>

```
From here you would want to load any remaining stylehseets seperately (perhaps after page load with JavaScript and noscript support).

## Notes

With smaller downloaded CSS files you won't notice big file size differences between seperate critical CSS views.

You can remove all downloaded CSS files and critical CSS files using the command `gulp clean`.

## License

This project is licensed under the MIT License.
