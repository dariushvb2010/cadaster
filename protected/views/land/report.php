<?php
/* @var $this LandController */
/* @var $model Land */

$this->breadcrumbs=array(
	'Lands'=>array('index'),
	$model->PlatCode=>array('view','id'=>$model->PlatCode),
	'Update',
);

$this->menu=array(
	array('label'=>'List Land', 'url'=>array('index'),'linkOptions'=>array('class'=>'item')),
	array('label'=>'Create Land', 'url'=>array('create'),'linkOptions'=>array('class'=>'item')),
	array('label'=>'View Land', 'url'=>array('view', 'id'=>$model->PlatCode),'linkOptions'=>array('class'=>'item')),
	array('label'=>'Manage Land', 'url'=>array('admin'),'linkOptions'=>array('class'=>'item')),
);
?>

<h1>این قسمت در حال تکمیل میباشد ...</h1>