<?php
/* @var $this LandlordController */
/* @var $model Landlord */

$this->breadcrumbs=array(
	'Landlords'=>array('index'),
	$model->LinkCode=>array('view','id'=>$model->LinkCode),
	'Update',
);

$this->menu=array(
	array('label'=>'List Landlord', 'url'=>array('index'),'linkOptions'=>array('class'=>'item')),
	array('label'=>'Create Landlord', 'url'=>array('create'),'linkOptions'=>array('class'=>'item')),
	array('label'=>'View Landlord', 'url'=>array('view', 'id'=>$model->LinkCode),'linkOptions'=>array('class'=>'item')),
	array('label'=>'Manage Landlord', 'url'=>array('admin'),'linkOptions'=>array('class'=>'item')),
);
?>

<h1>Update Landlord <?php echo $model->LinkCode; ?></h1>

<?php $this->renderPartial('_form', array('model'=>$model)); ?>