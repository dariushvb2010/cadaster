<?php
/* @var $this LandController */
/* @var $model Land */

$this->breadcrumbs=array(
	'Lands'=>array('index'),
	$model->PlatCode=>array('view','id'=>$model->PlatCode),
	'Update',
);

$this->menu=array(
	array('label'=>'List Land', 'url'=>array('index')),
	array('label'=>'Create Land', 'url'=>array('create')),
	array('label'=>'View Land', 'url'=>array('view', 'id'=>$model->PlatCode)),
	array('label'=>'Manage Land', 'url'=>array('admin')),
);
?>

<h1>Update Land <?php echo $model->PlatCode; ?></h1>

<?php $this->renderPartial('_form', array('model'=>$model)); ?>