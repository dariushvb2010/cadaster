<?php
/* @var $this LandlordController */
/* @var $model Landlord */

$this->breadcrumbs=array(
	'Landlords'=>array('index'),
	'Create',
);

$this->menu=array(
	array('label'=>'List Landlord', 'url'=>array('index'),'linkOptions'=>array('class'=>'item')),
	array('label'=>'Manage Landlord', 'url'=>array('admin'),'linkOptions'=>array('class'=>'item')),
);
?>

<h1>Create Landlord</h1>

<?php $this->renderPartial('_form', array('model'=>$model)); ?>