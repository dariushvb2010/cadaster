<?php
$this->breadcrumbs=array(
	UserModule::t('Profile Fields')=>array('admin'),
	$model->title=>array('view','id'=>$model->id),
	UserModule::t('Update'),
);
$this->menu=array(
    array('label'=>UserModule::t('Create Profile Field'), 'url'=>array('create'),'linkOptions'=>array('class'=>'item')),
    array('label'=>UserModule::t('View Profile Field'), 'url'=>array('view','id'=>$model->id),'linkOptions'=>array('class'=>'item')),
    array('label'=>UserModule::t('Manage Profile Field'), 'url'=>array('admin'),'linkOptions'=>array('class'=>'item')),
    array('label'=>UserModule::t('Manage Users'), 'url'=>array('/user/admin'),'linkOptions'=>array('class'=>'item')),
);
?>

<h1><?php echo UserModule::t('Update Profile Field ').$model->id; ?></h1>
<?php echo $this->renderPartial('_form', array('model'=>$model)); ?>