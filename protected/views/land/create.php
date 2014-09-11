<?php
/* @var $this LandController */
/* @var $model Land */

$this->breadcrumbs=array(
	'Lands'=>array('index'),
	'Create',
);

$this->menu=array(
	array('label'=>'List Land', 'url'=>array('index'),'linkOptions'=>array('class'=>'item')),
	array('label'=>'Manage Land', 'url'=>array('admin'),'linkOptions'=>array('class'=>'item')),
);
?>

<h1>Create Land</h1>

<?php $this->renderPartial('_form', array('model'=>$model)); ?>