# Critical Css Gen

A tool that utilises Penthouse and other NPM Packages, to generate clean critical CSS.

More information about Critical CSS: 

https://dbushell.com/2015/02/19/critical-css-and-performance/

https://css-tricks.com/authoring-critical-fold-css/

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

*Node.js

### Download

`git clone https://github.com/mintymatt/criticalcssgen.git`

https://github.com/mintymatt/criticalcssgen/archive/master.zip

## Setup

Install node_modules: `npm install`

Open up gulpfile.js, and configure the options. For basic use, you should only need to specify the target website:

`const global_uri = 'http://getbootstrap.com';`

The target can be a remote location, or a local file (advise the use of an absolute path for the latter).

## Usage

The proccess of this tool is as follows:

*Set target in `gulpfile.js`

*Define desired views.

*Download the target's CSS files. Command: `gulp download`

*Generate Critical CSS.	Command: `gulp critical`


Note that if your target is remote, you will need a connection throughout the proccess.

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

With smaller downloaded CSS files you won't motice big file size differences between seperate critical CSS views.

## License

This project is licensed under the MIT License.
