<?php
/* @var $this LandController */
/* @var $model Land */
/* @var $form CActiveForm */
?>

<div class="wide form">

<?php $form=$this->beginWidget('CActiveForm', array(
	'action'=>Yii::app()->createUrl($this->route),
	'method'=>'get',
)); ?>

	<div class="row">
		<?php echo $form->label($model,'ID'); ?>
		<?php echo $form->textField($model,'ID'); ?>
	</div>

	<div class="row">
		<?php echo $form->label($model,'LinkCode'); ?>
		<?php echo $form->textField($model,'LinkCode'); ?>
	</div>

	<div class="row">
		<?php echo $form->label($model,'PlatCode'); ?>
		<?php echo $form->textField($model,'PlatCode',array('size'=>50,'maxlength'=>50)); ?>
	</div>

	<div class="row">
		<?php echo $form->label($model,'RegistrationNO'); ?>
		<?php echo $form->textField($model,'RegistrationNO',array('size'=>60,'maxlength'=>255)); ?>
	</div>

	<div class="row">
		<?php echo $form->label($model,'AreaPlat'); ?>
		<?php echo $form->textField($model,'AreaPlat'); ?>
	</div>

	<div class="row">
		<?php echo $form->label($model,'WithDocument'); ?>
		<?php echo $form->textField($model,'WithDocument'); ?>
	</div>

	<div class="row">
		<?php echo $form->label($model,'WithoutDocument'); ?>
		<?php echo $form->textField($model,'WithoutDocument'); ?>
	</div>

	<div class="row">
		<?php echo $form->label($model,'NasaghiAcre'); ?>
		<?php echo $form->textField($model,'NasaghiAcre',array('size'=>60,'maxlength'=>255)); ?>
	</div>

	<div class="row">
		<?php echo $form->label($model,'HeaatiAcre'); ?>
		<?php echo $form->textField($model,'HeaatiAcre',array('size'=>60,'maxlength'=>255)); ?>
	</div>

	<div class="row">
		<?php echo $form->label($model,'PublicSource'); ?>
		<?php echo $form->textField($model,'PublicSource',array('size'=>60,'maxlength'=>255)); ?>
	</div>

	<div class="row">
		<?php echo $form->label($model,'VillageName'); ?>
		<?php echo $form->textField($model,'VillageName',array('size'=>60,'maxlength'=>255)); ?>
	</div>

	<div class="row">
		<?php echo $form->label($model,'VillageCode'); ?>
		<?php echo $form->textField($model,'VillageCode',array('size'=>60,'maxlength'=>255)); ?>
	</div>

	<div class="row">
		<?php echo $form->label($model,'WaterType'); ?>
		<?php echo $form->textField($model,'WaterType',array('size'=>60,'maxlength'=>255)); ?>
	</div>

	<div class="row">
		<?php echo $form->label($model,'PlantType'); ?>
		<?php echo $form->textField($model,'PlantType',array('size'=>60,'maxlength'=>255)); ?>
	</div>

	<div class="row">
		<?php echo $form->label($model,'X'); ?>
		<?php echo $form->textField($model,'X',array('size'=>60,'maxlength'=>255)); ?>
	</div>

	<div class="row">
		<?php echo $form->label($model,'Y'); ?>
		<?php echo $form->textField($model,'Y',array('size'=>60,'maxlength'=>255)); ?>
	</div>

	<div class="row">
		<?php echo $form->label($model,'SheetNO'); ?>
		<?php echo $form->textField($model,'SheetNO',array('size'=>60,'maxlength'=>255)); ?>
	</div>

	<div class="row">
		<?php echo $form->label($model,'Price'); ?>
		<?php echo $form->textField($model,'Price'); ?>
	</div>

	<div class="row">
		<?php echo $form->label($model,'CodeEvent'); ?>
		<?php echo $form->textField($model,'CodeEvent'); ?>
	</div>

	<div class="row buttons">
		<?php echo CHtml::submitButton('Search'); ?>
	</div>

<?php $this->endWidget(); ?>

</div><!-- search-form -->