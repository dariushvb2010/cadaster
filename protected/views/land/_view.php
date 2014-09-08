<?php
/* @var $this LandController */
/* @var $data Land */
?>

<div class="view">

	<b><?php echo CHtml::encode($data->getAttributeLabel('PlatCode')); ?>:</b>
	<?php echo CHtml::link(CHtml::encode($data->PlatCode), array('view', 'id'=>$data->PlatCode)); ?>
	<br />

	<b><?php echo CHtml::encode($data->getAttributeLabel('ID')); ?>:</b>
	<?php echo CHtml::encode($data->ID); ?>
	<br />

	<b><?php echo CHtml::encode($data->getAttributeLabel('LinkCode')); ?>:</b>
	<?php echo CHtml::encode($data->LinkCode); ?>
	<br />

	<b><?php echo CHtml::encode($data->getAttributeLabel('RegistrationNO')); ?>:</b>
	<?php echo CHtml::encode($data->RegistrationNO); ?>
	<br />

	<b><?php echo CHtml::encode($data->getAttributeLabel('AreaPlat')); ?>:</b>
	<?php echo CHtml::encode($data->AreaPlat); ?>
	<br />

	<b><?php echo CHtml::encode($data->getAttributeLabel('WithDocument')); ?>:</b>
	<?php echo CHtml::encode($data->WithDocument); ?>
	<br />

	<b><?php echo CHtml::encode($data->getAttributeLabel('WithoutDocument')); ?>:</b>
	<?php echo CHtml::encode($data->WithoutDocument); ?>
	<br />

	<?php /*
	<b><?php echo CHtml::encode($data->getAttributeLabel('NasaghiAcre')); ?>:</b>
	<?php echo CHtml::encode($data->NasaghiAcre); ?>
	<br />

	<b><?php echo CHtml::encode($data->getAttributeLabel('HeaatiAcre')); ?>:</b>
	<?php echo CHtml::encode($data->HeaatiAcre); ?>
	<br />

	<b><?php echo CHtml::encode($data->getAttributeLabel('PublicSource')); ?>:</b>
	<?php echo CHtml::encode($data->PublicSource); ?>
	<br />

	<b><?php echo CHtml::encode($data->getAttributeLabel('VillageName')); ?>:</b>
	<?php echo CHtml::encode($data->VillageName); ?>
	<br />

	<b><?php echo CHtml::encode($data->getAttributeLabel('VillageCode')); ?>:</b>
	<?php echo CHtml::encode($data->VillageCode); ?>
	<br />

	<b><?php echo CHtml::encode($data->getAttributeLabel('WaterType')); ?>:</b>
	<?php echo CHtml::encode($data->WaterType); ?>
	<br />

	<b><?php echo CHtml::encode($data->getAttributeLabel('PlantType')); ?>:</b>
	<?php echo CHtml::encode($data->PlantType); ?>
	<br />

	<b><?php echo CHtml::encode($data->getAttributeLabel('X')); ?>:</b>
	<?php echo CHtml::encode($data->X); ?>
	<br />

	<b><?php echo CHtml::encode($data->getAttributeLabel('Y')); ?>:</b>
	<?php echo CHtml::encode($data->Y); ?>
	<br />

	<b><?php echo CHtml::encode($data->getAttributeLabel('SheetNO')); ?>:</b>
	<?php echo CHtml::encode($data->SheetNO); ?>
	<br />

	<b><?php echo CHtml::encode($data->getAttributeLabel('Price')); ?>:</b>
	<?php echo CHtml::encode($data->Price); ?>
	<br />

	<b><?php echo CHtml::encode($data->getAttributeLabel('CodeEvent')); ?>:</b>
	<?php echo CHtml::encode($data->CodeEvent); ?>
	<br />

	*/ ?>

</div>