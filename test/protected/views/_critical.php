<?php
	if (empty($_COOKIE['first_visit'])):	//if cookie doesn't exist (i.e. new visitor)
		setcookie('first_visit',true,time()+864000,'/','',0); //set cookie for first visit. Expires in 10 days.
		?>
			<style>
				<?php
					echo file_get_contents('../../public_html/css/critical.desktop.css');
				?>
			</style>
			<script>
				
			</script>
		<?php
	endif
?>