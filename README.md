# Critical Css Gen

A neat tunnel into Penthouse, used to generate critical css.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

	*	Node.js

### Installing

A small step-by-step guide to setting up this project:

Install mode_modules: `npm install`

Open up gulpfile.js, and configure a view. Below is an example, taken from `/tests`:

```
{
	name: "desktop",										//just a display name for the view
	uri: global_uri,										//URI. This is the target URL or local file.
	sourceCSS: "public_html/css/bootstrap.css",				//css file. MUST be local.
	criticalDest: "public_html/css/critical.mobile.css",	//destination file for critical css.
	browser: {
		width: 500,											// headless browser width
		height: 500,										// ^ height
		strict: false,										// strict mode for styling?
		renderWaitTime: 100,								// amount of time allowed to render, before capping.
		timeout: 30000,										// total timeout.
		blockjs: true 										// block javascript requests.
	}
},
```

You will also need to set a default URI. This points all views to a default document (usually `.html`). This can be a URL, or a local file. You can override each view's URI, simple by removing the reference to `global_uri` and replacing it with an appropriate URI string value.


## Using

For Windows:
Open/Execute `gen.bat`

Other Playforms:
Enter a command prompt, and navigate to the root directory of this installation. Assuming you have configured the target inside `gulpfile.js`, you can proceed with the command `gulp criticalCss`

You will see information regarding each view as they are processed, and critical CSS is generated.

## Example use of critical CSS, using PHP

Critical CSS should only need to be used once, as after the first complete load of a page the user should have a cached edition of our stylesheets. Therefore we can use a cookie to determine whether a visitor has seen our website yet, and decide if we need to provide them with ciritical CSS. Here is a basic example (taken from `/test`):

```
<?php
	if (empty($_COOKIE['first_visit'])):	//if cookie doesn't exist (i.e. new visitor)
		setcookie('first_visit',true,time()+864000,'/','',0); //set cookie for first visit. Expires in 10 days.
		?>
			<style>
			//critical css style rules here...
			</style>
		<?php
	endif
?>

```
From here you would want to load any remaining stylehseets seperately (perhaps after page load with JavaScript and noscript support).

## License

This project is licensed under the MIT License.
