<?php
$this->breadcrumbs=array(
	(UserModule::t('Users'))=>array('admin'),
	$model->username=>array('view','id'=>$model->id),
	(UserModule::t('Update')),
);
$this->menu=array(
    array('label'=>UserModule::t('Create User'), 'url'=>array('create'),'linkOptions'=>array('class'=>'item')),
    array('label'=>UserModule::t('View User'), 'url'=>array('view','id'=>$model->id),'linkOptions'=>array('class'=>'item')),
    array('label'=>UserModule::t('Manage Users'), 'url'=>array('admin'),'linkOptions'=>array('class'=>'item')),
    array('label'=>UserModule::t('Manage Profile Field'), 'url'=>array('profileField/admin'),'linkOptions'=>array('class'=>'item')),
    array('label'=>UserModule::t('List User'), 'url'=>array('/user'),'linkOptions'=>array('class'=>'item')),
);
?>

<h1><?php echo  UserModule::t('Update User')." ".$model->id; ?></h1>

<?php
	echo $this->renderPartial('_form', array('model'=>$model,'profile'=>$profile));
?>