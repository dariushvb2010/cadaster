<?php
/* @var $this LandController */
/* @var $model Land */

$this->breadcrumbs=array(
	'Lands'=>array('index'),
	'Manage',
);

$this->menu=array(
	array('label'=>'List Land', 'url'=>array('index'),'linkOptions'=>array('class'=>'item')),
	array('label'=>'Create Land', 'url'=>array('create'),'linkOptions'=>array('class'=>'item')),
);

Yii::app()->clientScript->registerScript('search', "
$('.search-button').click(function(){
	$('.search-form').toggle();
	return false;
});
$('.search-form form').submit(function(){
	$('#land-grid').yiiGridView('update', {
		data: $(this).serialize()
	});
	return false;
});
");
?>

<h1>Manage Lands</h1>

<p>
You may optionally enter a comparison operator (<b>&lt;</b>, <b>&lt;=</b>, <b>&gt;</b>, <b>&gt;=</b>, <b>&lt;&gt;</b>
or <b>=</b>) at the beginning of each of your search values to specify how the comparison should be done.
</p>

<?php echo CHtml::link('Advanced Search','#',array('class'=>'search-button')); ?>
<div class="search-form" style="display:none">
<?php $this->renderPartial('_search',array(
	'model'=>$model,
)); ?>
</div><!-- search-form -->

<?php $this->widget('zii.widgets.grid.CGridView', array(
	'id'=>'land-grid',
	'dataProvider'=>$model->search(),
	'filter'=>$model,
	'columns'=>array(
		'ID',
		'LinkCode',
		'PlatCode',
		'RegistrationNO',
		'AreaPlat',
		'WithDocument',
		/*
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
		*/
		array(
			'class'=>'CButtonColumn',
		),
	),
)); ?>
