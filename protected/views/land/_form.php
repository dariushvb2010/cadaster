<?php
/* @var $this LandController */
/* @var $model Land */
/* @var $form CActiveForm */
?>

<div class="form">

<?php $form=$this->beginWidget('CActiveForm', array(
	'id'=>'land-form',
	// Please note: When you enable ajax validation, make sure the corresponding
	// controller action is handling ajax validation correctly.
	// There is a call to performAjaxValidation() commented in generated controller code.
	// See class documentation of CActiveForm for details on this.
	'enableAjaxValidation'=>false,
)); ?>

	<p class="note">Fields with <span class="required">*</span> are required.</p>

	<?php echo $form->errorSummary($model); ?>

	<div class="row">
		<?php echo $form->labelEx($model,'LinkCode'); ?>
		<?php echo $form->textField($model,'LinkCode'); ?>
		<?php echo $form->error($model,'LinkCode'); ?>
	</div>

	<div class="row">
		<?php echo $form->labelEx($model,'PlatCode'); ?>
		<?php echo $form->textField($model,'PlatCode',array('size'=>50,'maxlength'=>50)); ?>
		<?php echo $form->error($model,'PlatCode'); ?>
	</div>

	<div class="row">
		<?php echo $form->labelEx($model,'RegistrationNO'); ?>
		<?php echo $form->textField($model,'RegistrationNO',array('size'=>60,'maxlength'=>255)); ?>
		<?php echo $form->error($model,'RegistrationNO'); ?>
	</div>

	<div class="row">
		<?php echo $form->labelEx($model,'AreaPlat'); ?>
		<?php echo $form->textField($model,'AreaPlat'); ?>
		<?php echo $form->error($model,'AreaPlat'); ?>
	</div>

	<div class="row">
		<?php echo $form->labelEx($model,'WithDocument'); ?>
		<?php echo $form->textField($model,'WithDocument'); ?>
		<?php echo $form->error($model,'WithDocument'); ?>
	</div>

	<div class="row">
		<?php echo $form->labelEx($model,'WithoutDocument'); ?>
		<?php echo $form->textField($model,'WithoutDocument'); ?>
		<?php echo $form->error($model,'WithoutDocument'); ?>
	</div>

	<div class="row">
		<?php echo $form->labelEx($model,'NasaghiAcre'); ?>
		<?php echo $form->textField($model,'NasaghiAcre',array('size'=>60,'maxlength'=>255)); ?>
		<?php echo $form->error($model,'NasaghiAcre'); ?>
	</div>

	<div class="row">
		<?php echo $form->labelEx($model,'HeaatiAcre'); ?>
		<?php echo $form->textField($model,'HeaatiAcre',array('size'=>60,'maxlength'=>255)); ?>
		<?php echo $form->error($model,'HeaatiAcre'); ?>
	</div>

	<div class="row">
		<?php echo $form->labelEx($model,'PublicSource'); ?>
		<?php echo $form->textField($model,'PublicSource',array('size'=>60,'maxlength'=>255)); ?>
		<?php echo $form->error($model,'PublicSource'); ?>
	</div>

	<div class="row">
		<?php echo $form->labelEx($model,'VillageName'); ?>
		<?php echo $form->textField($model,'VillageName',array('size'=>60,'maxlength'=>255)); ?>
		<?php echo $form->error($model,'VillageName'); ?>
	</div>

	<div class="row">
		<?php echo $form->labelEx($model,'VillageCode'); ?>
		<?php echo $form->textField($model,'VillageCode',array('size'=>60,'maxlength'=>255)); ?>
		<?php echo $form->error($model,'VillageCode'); ?>
	</div>

	<div class="row">
		<?php echo $form->labelEx($model,'WaterType'); ?>
		<?php echo $form->textField($model,'WaterType',array('size'=>60,'maxlength'=>255)); ?>
		<?php echo $form->error($model,'WaterType'); ?>
	</div>

	<div class="row">
		<?php echo $form->labelEx($model,'PlantType'); ?>
		<?php echo $form->textField($model,'PlantType',array('size'=>60,'maxlength'=>255)); ?>
		<?php echo $form->error($model,'PlantType'); ?>
	</div>

	<div class="row">
		<?php echo $form->labelEx($model,'X'); ?>
		<?php echo $form->textField($model,'X',array('size'=>60,'maxlength'=>255)); ?>
		<?php echo $form->error($model,'X'); ?>
	</div>

	<div class="row">
		<?php echo $form->labelEx($model,'Y'); ?>
		<?php echo $form->textField($model,'Y',array('size'=>60,'maxlength'=>255)); ?>
		<?php echo $form->error($model,'Y'); ?>
	</div>

	<div class="row">
		<?php echo $form->labelEx($model,'SheetNO'); ?>
		<?php echo $form->textField($model,'SheetNO',array('size'=>60,'maxlength'=>255)); ?>
		<?php echo $form->error($model,'SheetNO'); ?>
	</div>

	<div class="row">
		<?php echo $form->labelEx($model,'Price'); ?>
		<?php echo $form->textField($model,'Price'); ?>
		<?php echo $form->error($model,'Price'); ?>
	</div>

	<div class="row">
		<?php echo $form->labelEx($model,'CodeEvent'); ?>
		<?php echo $form->textField($model,'CodeEvent'); ?>
		<?php echo $form->error($model,'CodeEvent'); ?>
	</div>

	<div class="row buttons">
		<?php echo CHtml::submitButton($model->isNewRecord ? 'Create' : 'Save'); ?>
	</div>

<?php $this->endWidget(); ?>

</div><!-- form -->