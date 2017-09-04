# Critical Css Gen

A neat tunnel into Penthouse, used to generate critical css.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

	*	Node.js

### Installing

A small step-by-step guide to setting up this project:

Install mode_modules: `npm install`

Open up gulpfile.js, and enter the correct details of your target. An example of this can be found under the `/test` directory.


## Using

For Windows:
Open/Execute `gen.bat`

Other Playforms:
Enter a command prompt, and navigate to the root directory of this installation. Assuming you have configured the target inside `gulpfile.js`, you can proceed with the command `gulp`

You will be presented with a prompt to enter the URL of the target, and then asked where to output the final result. You shouldn't need to change these details, and can simply confirm the default values (set inside `gulpfile.js`) by hitting enter.

When completed (with no errors) a file containing critical css will be generated (by default in the same directory with the name `outfile.css`). This will contain the related critical css.  You should follow other examples elsewhere, but on a basic level this critical CSS should be included in `<style></style>` tags within the target document.

## Example use of critical CSS, using PHP

Critical CSS should only need to be used once, as after the first complete load of a page the user should have a cached edition of our stylesheets. Therefore we can use a cookie to determine whether a visitor has seen our website yet, and decide if we need to provide them with ciritical CSS. Here is a basic example:

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
