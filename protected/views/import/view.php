<?php
/* @var $this LandController */
/* @var $model Land */

$this->breadcrumbs=array(
	'Lands'=>array('index'),
	'Create',
);

$this->menu=array(
	array('label'=>'List Land', 'url'=>array('index')),
	array('label'=>'Manage Land', 'url'=>array('admin')),
);
?>

<h1>Import Excel</h1>

<form action="<?php echo Yii::app()->createUrl('import/excel');?>" method="POST" enctype="multipart/form-data">
<input type="file" name="excel_file"> <br>
حذف اطلاعات قبلي همين جدول در صورت استفاده نشدن درجداول ديگر<input type="checkbox" name="delete_all" value="yes"> <br>
<input type="submit" value="ارسال فايل" name="uploaded">

</form>