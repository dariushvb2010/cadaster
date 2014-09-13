<?php

class BusinessController extends Controller {

    public $layout = '//layouts/column2';

    public function filters() {
        return array(
            'accessControl', // perform access control for CRUD operations
            'postOnly + delete', // we only allow deletion via POST request
        );
    }

    public function accessRules() {
        return array(
            array('allow', // allow all users to perform 'index' and 'view' actions
                'actions' => array('index', 'landbuy', 'salelist','buy'),
                'users' => array('*'),
            ),
            array('allow', // allow authenticated user to perform 'create' and 'update' actions
                'actions' => array('create', 'update'),
                'users' => array('@'),
            ),
            array('allow', // allow admin user to perform 'admin' and 'delete' actions
                'actions' => array('landsell','buy'),
                'roles' => array('lord')
            ),
            array('deny', // deny all users
                'users' => array('*'),
            ),
        );
    }

    public function actionBuy() {

        if (isset($_REQUEST['gid'])) {
            $m['suggestPrice'] = $_REQUEST['suggestPrice']*1;
            $m['finalPrice'] = $_REQUEST['finalPrice']*1;
            $m['landId'] = (int) $_REQUEST['gid'];
            $m['state'] = $_REQUEST['state'];
            $m['suggestDate'] = $_REQUEST['buyDate'];
            $m['description'] = $_REQUEST['description'];
            
            $land = Land::model()->findByPk($m['landId']);
            $m['sellerUserId'] = $land->lord->id;
            $m['buyerUserId'] = 1;
            $landShop = new LandShop;
            $landShop->attributes = $m;
            if ($landShop->save())
                $res = array('success' => 'خرید زمین ثبت شد');
            else
                $res = array('failure' => Msg::fail_add);
        } else
            $res = array('failure' => Msg::fail_params);
        echo json_encode($res);
    }

    public function actionSaleList() {
        ///----- list of all landShops
// 		$landShops = LandShop::loadAsSaleList();
        $landShops = LandShop::model()->list()->findAll();

        $res = array();
        if (count($landShops) > 0)
            foreach ($landShops as $landShop) {
                $res[] = $landShop->toSaleFeature();
            }
        echo Gis::makeGeoJson2($res);
    }

    public function actionLandBuy() {
        $landShop = LandShop::model()->findByPk(1);
        var_dump($myUser->lord);
    }

    public function actionIndex() {
        ;
    }

    protected function performAjaxValidation($model) {
        if (isset($_POST['ajax']) && $_POST['ajax'] === 'land-form') {
            echo CActiveForm::validate($model);
            Yii::app()->end();
        }
    }

}
