<?php
/* @var $this LandlordController */
/* @var $dataProvider CActiveDataProvider */

$this->breadcrumbs=array(
	'Landlords',
);

$this->menu=array(
	array('label'=>'Create Landlord', 'url'=>array('create')),
	array('label'=>'Manage Landlord', 'url'=>array('admin')),
);
?>

<h1>Landlords</h1>

<?php $this->widget('zii.widgets.CListView', array(
	'dataProvider'=>$dataProvider,
	'itemView'=>'_view',
)); ?>
