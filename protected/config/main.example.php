<?php

// uncomment the following to define a path alias
// Yii::setPathOfAlias('local','path/to/local-folder');

// This is the main Web application configuration. Any writable
// CWebApplication properties can be configured here.
return array(
	'basePath'=>dirname(__FILE__).DIRECTORY_SEPARATOR.'..',
	'name'=>'سامانه تملک اراضی',
	'language'=>'fa_ir',
	// preloading 'log' component
	'preload'=>array('log'),

	
	// autoloading model and component classes
	'import'=>array(
		'application.models.*',
		'application.components.*',
		'application.modules.rights.*',
		'application.modules.rights.components.*',
		'application.modules.user.models.*',
        'application.modules.user.components.*',
	),

	'modules'=>array(
		// uncomment the following to enable the Gii tool
		
		'gii'=>array(
			'class'=>'system.gii.GiiModule',
			'password'=>'123',
			// If removed, Gii defaults to localhost only. Edit carefully to taste.
			'ipFilters'=>array('127.0.0.1','::1'),
		),
		'rights'=>array(
			   'install'=>true, 
			   'superuserName'=>'Admin', // Name of the role with super user privileges.
               'authenticatedName'=>'Authenticated',  // Name of the authenticated user role. 
               'userIdColumn'=>'id', // Name of the user id column in the database. 
               'userNameColumn'=>'username',  // Name of the user name column in the database. 
               'enableBizRule'=>true,  // Whether to enable authorization item business rules. 
               'enableBizRuleData'=>true,   // Whether to enable data for business rules. 
               'displayDescription'=>true,  // Whether to use item description instead of name. 
               'flashSuccessKey'=>'RightsSuccess', // Key to use for setting success flash messages. 
               'flashErrorKey'=>'RightsError', // Key to use for setting error flash messages. 

               'baseUrl'=>'/rights', // Base URL for Rights. Change if module is nested. 
               'layout'=>'rights.views.layouts.main',  // Layout to use for displaying Rights. 
               'appLayout'=>'application.views.layouts.main', // Application layout. 
               'cssFile'=>'rights.css', // Style sheet file to use for Rights. 
               'install'=>false,  // Whether to enable installer. 
               'debug'=>false,
		),
		'user'=>array(
                'tableUsers' => 'tbl_users',
                'tableProfiles' => 'tbl_profiles',
                'tableProfileFields' => 'tbl_profiles_fields',
				'hash' => 'md5',

				'sendActivationMail' => true,// send activation email
				'loginNotActiv' => false,// allow access for non-activated users
				'activeAfterRegister' => false,// activate user on registration (only sendActivationMail = false)
				'autoLogin' => true,// automatically login from registration
				'registrationUrl' => array('/user/registration'),// registration path
				'recoveryUrl' => array('/user/recovery'),// recovery password path
				'loginUrl' => array('/user/login'),// login form path
				'returnUrl' => array('/site/index'),// page after login
				'returnLogoutUrl' => array('/user/login'),// page after logout
		),
		
	),

	// application components
	'components'=>array(
		'user'=>array(
			// enable cookie-based authentication
			'allowAutoLogin'=>true,
			'class'=>'RWebUser',
                    
		),
		'authManager'=>array(
			'class'=>'RDbAuthManager',
			'connectionID'=>'db',
            'defaultRoles'=>array('Authenticated', 'Guest'),
		),
		'excel'=>array(
			'class'=>'Excel'
		),
		// uncomment the following to enable URLs in path-format
		/*
		'urlManager'=>array(
			'urlFormat'=>'path',
			'rules'=>array(
				'<controller:\w+>/<id:\d+>'=>'<controller>/view',
				'<controller:\w+>/<action:\w+>/<id:\d+>'=>'<controller>/<action>',
				'<controller:\w+>/<action:\w+>'=>'<controller>/<action>',
			),
		),
		*/
		/*'db'=>array(
			'connectionString' => 'sqlite:'.dirname(__FILE__).'/../data/testdrive.db',
		),*/
		// uncomment the following to use a MySQL database
// 		'db'=>array(
// 			'connectionString' => 'mysql:host=localhost;dbname=cadaster2',
// 			'emulatePrepare' => true,
// 			'username' => 'root',
// 			'password' => '',
// 			'charset' => 'utf8',
// 			'enableProfiling'=>true,
//       		'enableParamLogging' => true,
// 		),
		'db'=>array(
		     	'tablePrefix'=>'',
		     	'connectionString' => 'pgsql:host=localhost;port=5432;dbname=test2',
		        'username'=>'postgres',
		        'password'=>'postgres',
		        'charset'=>'UTF8',
		),
		
		'errorHandler'=>array(
			// use 'site/error' action to display errors
			'errorAction'=>'site/error',
		),
		'log'=>array(
			'class'=>'CLogRouter',
			'routes'=>array(
				array(
					'class'=>'CFileLogRoute',
					'levels'=>'error, warning',
				),
				array(
					'class'=>'CWebLogRoute',
					'categories'=>'system.db.CDbCommand',
                	'showInFireBug'=>true,
				),
				
			),
		),
	),

	// application-level parameters that can be accessed
	// using Yii::app()->params['paramName']
	'params'=>array(
		// this is used in contact page
		'adminEmail'=>'malvandi.m@gmail.com',
		'lib.openlayers' => '/Lib/openlayers-2.13.1/openlayers.js',
        'lib.ext'=>'/Lib/ext-4.1.1a/ext.js',
        'lib.ext.loader'=>'/loader_4.1.1a.js'
                
	),
);