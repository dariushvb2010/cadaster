<?php

//require_once(Yii::app()->baseUrl.'/extensions/excel.php');
//require_once Yii::getPathOfAlias('application.extensions.excel.excel').'.php';
class WMSController extends Controller {

    public $layout = '//layouts/column2';

    public function filters() {
        return array(
            //'accessControl', // perform access control for CRUD operations
            'postOnly + delete', // we only allow deletion via POST request
        );
    }

    public function accessRules() {
        return array(
            array('allow', // allow all users to perform 'index' and 'view' actions
                'actions' => array('index', 'getMap', 'file', 'view'),
                'roles' => array('admin'),
            ),
            array('deny', // deny all users
                'users' => array('*'),
            ),
        );
    }

    public function actionIndex() {
        $lands = Land::model()->findAll();
        var_dump($lands);
    }

    public function actionGetMap() {
		header("Content-type:image/png");
        $curl = curl_init();
        $url = 'http://localhost:8080/geoserver/cadaster/wms';
        //$query_str = "service=WMS&LAYERS=" . $_GET['LAYERS'] . "&TRANSPARENT=" . $_GET['TRANSPARENT'] . "&VERSION=" . $_GET['VERSION'] . "&REQUEST=" . $_GET['REQUEST'] . "&STYLES=" . $_GET['STYLES'] . "&FORMAT=" . $_GET['FORMAT'] . "&SRS=" . $_GET['SRS'] . "&BBOX=" . $_GET['BBOX'] . "&WIDTH=" . $_GET['WIDTH'] . "&HEIGHT=" . $_GET['HEIGHT'];
		$query_str='';
		foreach($_GET as $key=>$value){
			if($key!='r'){
			$query_str.=$key.'='.$value.'&';
			}
		}
        $query = $url . '?' . $query_str;
        //var_dump($query);
        curl_setopt_array($curl, array(
            CURLOPT_RETURNTRANSFER => 1,
            CURLOPT_URL => $query,
            CURLOPT_USERAGENT => 'Codular Sample cURL Request',
            CURLOPT_BINARYTRANSFER => true,
            CURLOPT_HEADER => false
        ));
        set_time_limit(30);                     // set time in secods for PHP
        curl_setopt($curl, CURLOPT_TIMEOUT, 30);
        curl_setopt($curl, CURLOPT_USERPWD, "admin:geoserver");

        $resp = curl_exec($curl);
        curl_close($curl);
        echo ($resp);
		

        //Yii:app()->end();
    }

}
