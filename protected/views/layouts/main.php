<?php
/* @var $this Controller */
$cs = Yii::app()->clientScript;
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="language" content="en" />

        <!-- blueprint CSS framework -->
        <!--<link rel="stylesheet" type="text/css" href="<?php echo Yii::app()->request->baseUrl; ?>/css/print.css" media="print" />-->
        <!--[if lt IE 8]>
        <link rel="stylesheet" type="text/css" href="<?php echo Yii::app()->request->baseUrl; ?>/css/ie.css" media="screen, projection" />
        <![endif]-->
        <?php
        $cs->registerCssFile('css/screen.css');
        $cs->registerCssFile("css/main.css");
        $cs->registerCssFile("css/form.css");
        $cs->registerCssFile("semantic/packaged/css/semantic.css");

        $cs->registerCoreScript('jquery');
        $cs->registerScriptFile('semantic/packaged/javascript/semantic.js');
        ?>



        <title><?php echo CHtml::encode($this->pageTitle); ?></title>
        <script>

            // this is for semantic menu
            $(document).ready(function() {
                $('.ui.dropdown')
                        .dropdown({
                            on: 'hover'
                        })
                        ;
            });
        </script>
    </head>

    <body>

        <div class="container" id="page">

            <div id="header">
                <div id="logo" style="color:white"><?php echo CHtml::encode(Yii::app()->name); ?></div>

                <div id="mainmenu" class="inverted secondary pointing ui menu right">
                    <?php
                    ?>
                    <div class="menu">
                        <a class="item" href="<?php echo Yii::app()->createUrl('site/index');?>"><?php echo Yii::t('global','home') ?></a>
                        
                        <div class="ui top pointing mobile dropdown link item">
                            سایت
                            <i class="dropdown icon"></i>
                            <div class="menu">
                                <a class="item txtright" href="<?php echo Yii::app()->createUrl('site/page');?>"><?php echo Yii::t('global','about') ?></a>
                                <a class="item txtright" href="<?php echo Yii::app()->createUrl('site/contact');?>"><?php echo Yii::t('global','contact') ?></a>
                                
                            </div>
                        </div>
                        <div class="ui dropdown link item">
                            ناحیه کاربری
                            <i class="dropdown icon"></i>
                            <div class="menu">
                                <a class="item user txtright" href="<?php echo Yii::app()->createUrl('user/login');?>"><?php echo Yii::t('global','login') ?></a>
                                <a class="item txtright" href="<?php echo Yii::app()->createUrl('rights');?>"><?php echo Yii::t('global','user access') ?></a>
                                <a class="item txtright" href="<?php echo Yii::app()->createUrl('user/admin');?>"><?php echo Yii::t('global','user management') ?></a>
                                <?php if(!Yii::app()->user->isGuest): ?>
                                <a class="item txtright" href="<?php echo Yii::app()->createUrl('user/logout');?>"><?php echo Yii::t('global','logout') ?></a>
                                <?php endif; ?>
                            </div>
                        </div>
                        
                    </div>
                </div><!-- mainmenu -->
                <img id="imgheader"style=" height: 100px;position: absolute; left:0px; bottom:0px;" src="<?php echo Yii::app()->getBaseUrl() ?>/images/header-earth.png" usemap="#mymap"/>
                <map name="mymap">
                    <area shape="circle" coords="0,80,80" href="<?php echo Yii::app()->getHomeUrl() ?>" alt="home" style="cursor:pointer" 
                          onmouseover=" document.getElementById('imgheader').src = '<?php echo Yii::app()->getBaseUrl() ?>/images/header-earth-bright.png';
                          "
                          onmouseout="document.getElementById('imgheader').src = '<?php echo Yii::app()->getBaseUrl(); ?>/images/header-earth.png';
                          "/>
                </map>
            </div><!-- header -->


            

            <?php echo $content; ?>

            <div class="clear"></div>

            <div id="footer">
                تمام حقوق مادی و معنوی این سامانه متعلق به گروه نرم افزاری جوان می باشد!
            </div><!-- footer -->

        </div><!-- page -->

    </body>
</html>
