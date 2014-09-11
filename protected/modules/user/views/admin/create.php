<?php
$this->breadcrumbs=array(
	UserModule::t('Users')=>array('admin'),
	UserModule::t('Create'),
);

$this->menu=array(
    array('label'=>UserModule::t('Manage Users'), 'url'=>array('admin'),'linkOptions'=>array('class'=>'item')),
    array('label'=>UserModule::t('Manage Profile Field'), 'url'=>array('profileField/admin'),'linkOptions'=>array('class'=>'item')),
    array('label'=>UserModule::t('List User'), 'url'=>array('/user'),'linkOptions'=>array('class'=>'item')),
);
?>
<h1><?php echo UserModule::t("Create User"); ?></h1>

<?php
	echo $this->renderPartial('_form', array('model'=>$model,'profile'=>$profile));
?>