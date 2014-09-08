<?php
/* @var $this LandlordController */
/* @var $model Landlord */

$this->breadcrumbs=array(
	'Landlords'=>array('index'),
	$model->LinkCode,
);

$this->menu=array(
	array('label'=>'List Landlord', 'url'=>array('index')),
	array('label'=>'Create Landlord', 'url'=>array('create')),
	array('label'=>'Update Landlord', 'url'=>array('update', 'id'=>$model->LinkCode)),
	array('label'=>'Delete Landlord', 'url'=>'#', 'linkOptions'=>array('submit'=>array('delete','id'=>$model->LinkCode),'confirm'=>'Are you sure you want to delete this item?')),
	array('label'=>'Manage Landlord', 'url'=>array('admin')),
);
?>

<h1>View Landlord #<?php echo $model->LinkCode; ?></h1>

<?php $this->widget('zii.widgets.CDetailView', array(
	'data'=>$model,
	'attributes'=>array(
		'ID',
		'LinkCode',
		'FirstName',
		'LastName',
		'DadName',
		'Address',
		'Description',
		'Sharers',
	),
)); ?>
