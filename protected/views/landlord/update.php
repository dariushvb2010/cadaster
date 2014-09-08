<?php
/* @var $this LandlordController */
/* @var $model Landlord */

$this->breadcrumbs=array(
	'Landlords'=>array('index'),
	$model->LinkCode=>array('view','id'=>$model->LinkCode),
	'Update',
);

$this->menu=array(
	array('label'=>'List Landlord', 'url'=>array('index')),
	array('label'=>'Create Landlord', 'url'=>array('create')),
	array('label'=>'View Landlord', 'url'=>array('view', 'id'=>$model->LinkCode)),
	array('label'=>'Manage Landlord', 'url'=>array('admin')),
);
?>

<h1>Update Landlord <?php echo $model->LinkCode; ?></h1>

<?php $this->renderPartial('_form', array('model'=>$model)); ?>