<?php
/* @var $this LandlordController */
/* @var $model Landlord */

$this->breadcrumbs=array(
	'Landlords'=>array('index'),
	$model->LinkCode,
);

$this->menu=array(
	array('label'=>'List Landlord', 'url'=>array('index'),'linkOptions'=>array('class'=>'item')),
	array('label'=>'Create Landlord', 'url'=>array('create'),'linkOptions'=>array('class'=>'item')),
	array('label'=>'Update Landlord', 'url'=>array('update', 'id'=>$model->LinkCode),'linkOptions'=>array('class'=>'item')),
	array('label'=>'Delete Landlord', 'url'=>'#', 'linkOptions'=>array('class'=>'item','submit'=>array('delete','id'=>$model->LinkCode),'confirm'=>'Are you sure you want to delete this item?')),
	array('label'=>'Manage Landlord', 'url'=>array('admin'),'linkOptions'=>array('class'=>'item')),
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
