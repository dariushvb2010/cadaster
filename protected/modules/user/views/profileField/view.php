<?php
$this->breadcrumbs=array(
	UserModule::t('Profile Fields')=>array('admin'),
	UserModule::t($model->title),
);
$this->menu=array(
    array('label'=>UserModule::t('Create Profile Field'), 'url'=>array('create'),'linkOptions'=>array('class'=>'item')),
    array('label'=>UserModule::t('Update Profile Field'), 'url'=>array('update','id'=>$model->id),'linkOptions'=>array('class'=>'item')),
    array('label'=>UserModule::t('Delete Profile Field'), 'url'=>'#','linkOptions'=>array('class'=>'item','submit'=>array('delete','id'=>$model->id),'confirm'=>UserModule::t('Are you sure to delete this item?'))),
    array('label'=>UserModule::t('Manage Profile Field'), 'url'=>array('admin'),'linkOptions'=>array('class'=>'item')),
    array('label'=>UserModule::t('Manage Users'), 'url'=>array('/user/admin'),'linkOptions'=>array('class'=>'item')),
);
?>
<h1><?php echo UserModule::t('View Profile Field #').$model->varname; ?></h1>

<?php $this->widget('zii.widgets.CDetailView', array(
	'data'=>$model,
	'attributes'=>array(
		'id',
		'varname',
		'title',
		'field_type',
		'field_size',
		'field_size_min',
		'required',
		'match',
		'range',
		'error_message',
		'other_validator',
		'widget',
		'widgetparams',
		'default',
		'position',
		'visible',
	),
)); ?>
