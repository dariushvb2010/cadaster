<?php /* @var $this Controller */ ?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="language" content="en" />

    <link rel="stylesheet" type="text/css" href="<?php echo Yii::app()->request->baseUrl; ?>/css/resources/css/ext-all.css" />
    <link rel="stylesheet" type="text/css" href="<?php echo Yii::app()->request->baseUrl; ?>/css/desktop.css" />
    <link rel="stylesheet" type="text/css" href="<?php echo Yii::app()->request->baseUrl; ?>/css/css.css" />
    <link rel="stylesheet" type="text/css" href="<?php echo Yii::app()->request->baseUrl; ?>/css/data-view.css" />
    <link rel="stylesheet" type="text/css" href="<?php echo Yii::app()->request->baseUrl; ?>/css/upload.css" />
    
    <!------------------------------- filter Styling --------------------------->
    <link rel="stylesheet" type="text/css" href="<?php echo Yii::app()->request->baseUrl; ?>/css/resources/css/app.css" />
    <link rel="stylesheet" type="text/css" href="<?php echo Yii::app()->request->baseUrl; ?>/css/resources/css/overrides.css" />
    <link rel="stylesheet" type="text/css" href="<?php echo Yii::app()->request->baseUrl; ?>/css/resources/css/uxs.css" />

    <script type="text/javascript" src="<?php echo Yii::app()->params['lib.ext'] ?>"></script>
    <script type="text/javascript" src="<?php echo Yii::app()->params['lib.openlayers'] ?>"></script>
    <script type="text/javascript" src="<?php echo Yii::app()->params['lib.ext.loader'] ?>"></script>
    
    
    <script src="http://maps.google.com/maps/api/js?v=3&amp;sensor=false&amp;language=fa"></script>
    
    <!------------------- Mirroring Extjs ---------------------->
    <!--
    <script type="text/javascript" src="<?php echo Yii::app()->request->baseUrl; ?>/extjs-mirror-master/ext-mirror.js"></script>
    <link rel="stylesheet" type="text/css" href="<?php echo Yii::app()->request->baseUrl; ?>/extjs-mirror-master/resources/css/ext-mirror.css" />
    -->
    
    <script type="text/javascript">
        Ext.Loader.setPath({
            'Ext.ux.desktop': '<?php echo Yii::app()->request->baseUrl; ?>/desktop/js',
            MyDesktop: '<?php echo Yii::app()->request->baseUrl; ?>/desktop/windows'
        });

        Ext.require('MyDesktop.App');

        var myDesktopApp;
        Ext.onReady(function () {
            myDesktopApp = new MyDesktop.App();
        });
    </script>
    <title><?php echo CHtml::encode($this->pageTitle); ?></title>
</head>

<body>
    
</body>
</html>
