<?php
/* @var $this LandlordController */
/* @var $dataProvider CActiveDataProvider */

$this->breadcrumbs=array(
	'Landlords',
);

$this->menu=array(
	array('label'=>'Create Landlord', 'url'=>array('create'),'linkOptions'=>array('class'=>'item')),
	array('label'=>'Manage Landlord', 'url'=>array('admin'),'linkOptions'=>array('class'=>'item')),
);
?>

<h1>Landlords</h1>

<?php $this->widget('zii.widgets.CListView', array(
	'dataProvider'=>$dataProvider,
	'itemView'=>'_view',
)); ?>
