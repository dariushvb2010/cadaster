<?php /* @var $this Controller */ ?>
<?php $this->beginContent('//layouts/main'); ?>
<div class="span-19">
	<div id="content">
		<?php echo $content; ?>
	</div><!-- content -->
</div>
<div class="span-5 last">
    <div id="sidebar" class="ui inverted menu active"<!-- semantic-ui class-->>
	<?php
		
		$this->widget('zii.widgets.CMenu', array(
			'items'=>$this->menu,
			'htmlOptions'=>array('class'=>'operations'),
		));
		
	?>
	</div><!-- sidebar -->
</div>
<?php $this->endContent(); ?>