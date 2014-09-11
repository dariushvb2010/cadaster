<?php
/* @var $this LandController */
/* @var $dataProvider CActiveDataProvider */

$this->breadcrumbs=array(
	'Lands',
);

$this->menu=array(
	array('label'=>'Create Land', 'url'=>array('create'),'linkOptions'=>array('class'=>'item')),
	array('label'=>'Manage Land', 'url'=>array('admin'),'linkOptions'=>array('class'=>'item')),
);
?>

<h1>Lands</h1>

<?php $this->widget('zii.widgets.CListView', array(
	'dataProvider'=>$dataProvider,
	'itemView'=>'_view',
)); ?>
