<?php
/* @var $this LandController */
/* @var $model Land */

$this->breadcrumbs=array(
	'Lands'=>array('index'),
	$model->PlatCode,
);

$this->menu=array(
	array('label'=>'List Land', 'url'=>array('index')),
	array('label'=>'Create Land', 'url'=>array('create')),
	array('label'=>'Update Land', 'url'=>array('update', 'id'=>$model->PlatCode)),
	array('label'=>'Delete Land', 'url'=>'#', 'linkOptions'=>array('submit'=>array('delete','id'=>$model->PlatCode),'confirm'=>'Are you sure you want to delete this item?')),
	array('label'=>'Manage Land', 'url'=>array('admin')),
);
?>

<h1>View Land #<?php echo $model->PlatCode; ?></h1>

<?php $this->widget('zii.widgets.CDetailView', array(
	'data'=>$model,
	'attributes'=>array(
		'ID',
		'LinkCode',
		'PlatCode',
		'RegistrationNO',
		'AreaPlat',
		'WithDocument',
		'WithoutDocument',
		'NasaghiAcre',
		'HeaatiAcre',
		'PublicSource',
		'VillageName',
		'VillageCode',
		'WaterType',
		'PlantType',
		'X',
		'Y',
		'SheetNO',
		'Price',
		'CodeEvent',
	),
)); ?>
