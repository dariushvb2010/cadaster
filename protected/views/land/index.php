<?php
/* @var $this LandController */
/* @var $dataProvider CActiveDataProvider */

$this->breadcrumbs=array(
	'Lands',
);

$this->menu=array(
	array('label'=>'Create Land', 'url'=>array('create')),
	array('label'=>'Manage Land', 'url'=>array('admin')),
);
?>

<h1>Lands</h1>

<?php $this->widget('zii.widgets.CListView', array(
	'dataProvider'=>$dataProvider,
	'itemView'=>'_view',
)); ?>
