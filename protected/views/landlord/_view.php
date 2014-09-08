<?php
/* @var $this LandlordController */
/* @var $data Landlord */
?>

<div class="view">

	<b><?php echo CHtml::encode($data->getAttributeLabel('LinkCode')); ?>:</b>
	<?php echo CHtml::link(CHtml::encode($data->LinkCode), array('view', 'id'=>$data->LinkCode)); ?>
	<br />

	<b><?php echo CHtml::encode($data->getAttributeLabel('ID')); ?>:</b>
	<?php echo CHtml::encode($data->ID); ?>
	<br />

	<b><?php echo CHtml::encode($data->getAttributeLabel('FirstName')); ?>:</b>
	<?php echo CHtml::encode($data->FirstName); ?>
	<br />

	<b><?php echo CHtml::encode($data->getAttributeLabel('LastName')); ?>:</b>
	<?php echo CHtml::encode($data->LastName); ?>
	<br />

	<b><?php echo CHtml::encode($data->getAttributeLabel('DadName')); ?>:</b>
	<?php echo CHtml::encode($data->DadName); ?>
	<br />

	<b><?php echo CHtml::encode($data->getAttributeLabel('Address')); ?>:</b>
	<?php echo CHtml::encode($data->Address); ?>
	<br />

	<b><?php echo CHtml::encode($data->getAttributeLabel('Description')); ?>:</b>
	<?php echo CHtml::encode($data->Description); ?>
	<br />

	<?php /*
	<b><?php echo CHtml::encode($data->getAttributeLabel('Sharers')); ?>:</b>
	<?php echo CHtml::encode($data->Sharers); ?>
	<br />

	*/ ?>

</div>