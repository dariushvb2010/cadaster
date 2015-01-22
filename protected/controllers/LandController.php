<?php

class LandController extends Controller {

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
                'actions' => array('index', 'view', 'master', 'features', 'intersection', 'test', 'getLand', 'getTotalNumbers'),
                'users' => array('*'),
            ),
            array('allow', // allow authenticated user to perform 'create' and 'update' actions
                'actions' => array('create', 'update', 'search', 'createExcel'),
                'roles' => array('admin'),
            ),
            array('allow', // allow admin user to perform 'admin' and 'delete' actions
                'actions' => array('admin', 'delete'),
                'users' => array('admin'),
            ),
            array('deny', // deny all users
                'users' => array('*'),
            ),
        );
    }

    public function actionFeatures() {
        $simplified = isset($_REQUEST['simplified']);
        if (isset($_REQUEST['userId'])) {
            $userId = $_REQUEST['userId'];
            echo Land::loadAsGeoJsonByUserId($userId, $simplified);
        } else if (isset($_REQUEST['gid'])) {
            $gid = $_REQUEST['gid'];
          $land = Land::model()->findByPK($gid*1);
          if(empty($land)){
              $res = array();
              $res['failure']='زمین یافت نشد! gid='.$gid;
              echo json_encode($res);
          }else{
              $userId = $land->userId;
              echo Land::loadAsGeoJsonByUserId($userId, $simplified);
          }
        } else {
            $lands = ($simplified ? Land::model()->simplified()->findAll() : Land::model()->findAll());
            echo $this->makeGeoJson($lands);
        }
    }

    public function actionSearch() {

        $page = $_REQUEST['page'];
        $start = $_REQUEST['start'];
        $limit = $_REQUEST['limit'];

        $crit = new CDbCriteria();
        $crit->limit = $limit;
        $crit->offset = $start;

        $filters = $this->makeFilters();
        //echo json_encode($filters);die();
        $landScope = Land::model();
        foreach ($filters as $filter) {
            $landScope = $landScope->byFilter($filter);
        }
        if (isset($_REQUEST['hasShop']) && $_REQUEST['hasShop'] != 'false') {
            $landScope = $landScope->hasShop();
        }
        $count = $landScope->count();
        foreach ($filters as $filter) {
            $landScope = $landScope->byFilter($filter);
        }
        if (isset($_REQUEST['hasShop']) && $_REQUEST['hasShop'] != 'false') {

            $landScope = $landScope->hasShop();
        }
        $lands = $landScope->findAll($crit);

        $main = array(
            'totalCount' => $count,
            'landDetail' => Land::buildArray($lands, true)
        );
        echo json_encode($main);
//		echo json_encode(Land::buildGeoArray($lands,true));
        //var_dump($lands);
        //Yii::app()->end();
    }

    public function actionCreateExcel() {
        $filters = $this->makeFilters();

        $landScope = Land::model();
        foreach ($filters as $filter) {
            $landScope = $landScope->byFilter($filter);
        }
        if (isset($_REQUEST['hasShop']) && $_REQUEST['hasShop'] != 'false') {
            $landScope = $landScope->hasShop();
        }
        $lands = $landScope->findAll();
        $landArray = Land::buildArray($lands, true);
        //var_dump($landArray);
        $firstTry = true;
        $writer = new LandExcelWriter();

        foreach ($landArray as $value) {
            if ($firstTry) {
                $writer->writeLine(Land::labels());
                $firstTry = false;
            }
            $temp = array();
            foreach (Land::labels() as $key => $v) {
                $temp[] = $value[$key];
            }
            $writer->writeLine($temp);
        }
        $writer->close();
        header('Content-disposition: attachment; filename=excel.xls');
        readfile(Yii::app()->params['excel.writer.file']);
    }

    private function makeFilters() {
        $filters = array();
        if (isset($_REQUEST['filter']))
            $filters = json_decode($_REQUEST['filter']);

        //-----------has...--------------
        foreach (LandShop::$paramsForHas as $hasParam) {
            $hasValue = Yii::app()->request->getParam($hasParam);
            if (!empty($hasValue) && $hasValue != 'false') {
                $filter = new stdClass();
                $filter->property = $hasParam;
                $filter->operator = 'eq';
                $filter->value = $hasValue;
                $filters[] = $filter;
            }
        }

        return $filters;
    }

    public function actionGetLand() {
        //$this->render('report');
        $gid = $_REQUEST['gid'];
        $land = $this->loadLand($gid);
        $lands = array();
        if (!empty($land)) {
            $lands[] = $land;
        }
        echo json_encode(Land::buildGeoArray($lands, true));
    }

    public function actionIntersection() {
        $geoText = $_REQUEST['geoText'];
        $lands = Land::model()->byIntersectionWith($geoText)->findAll();
        echo $this->makeGeoJson($lands);
    }

    /**
     * 
     * creates a new land
     */
    public function actionCreate() {
        $land = new Land;

        $geoText = $_POST['geoText'];
        $land->attributes = $_POST;
        $land->geom = new CDbExpression("ST_Transform(ST_GeomFromText('" . $geoText . "'," . Land::SRID_4326 . ")," . Land::SRID . ")");
        $res = array();

        if ($land->save())
            $res['success'] = Msg::success_add;
        else
            $res['failure'] = Msg::fail_add;
        echo json_encode($res);
    }

    public function actionTest($id) {
        $a = Land::model()->findByPk($id);
        var_dump($a->attributes);
    }

    public function actionGetTotalNumbers() {
        $crit = new CDbCriteria();
        $filters = array();
        //$filters = $this->makeFilters();
        $landScope = Land::model();
        foreach ($filters as $filter) {
            $landScope = $landScope->byFilter($filter);
        }
        if (isset($_REQUEST['hasShop']) && $_REQUEST['hasShop'] != 'false') {
            $landScope = $landScope->hasShop();
        }

        //$crit->select=array('total'=>new CDbExpression('count(t.gid) as mysum'));
        //$lands = $landScope->byTotal()->findAll();
        $area = $landScope->totalArea();
        $perimeter = $landScope->totalPerimeter();
        $price = $landScope->totalPrice();
        $res = array(
            'area' => round($area, 2),
            'perimeter' => round($perimeter, 2),
            'price' => round($price, 2)
        );
        echo json_encode($res);
    }

    protected function makeGeoJson($lands, $selectShopColumns = false) {
        $features = array();
        if (count($lands))
            foreach ($lands as $land) {
                $features[] = $land->toFeature($selectShopColumns);
            }
        return Gis::makeGeoJson2($features);
    }

    public function loadModel($id) {
        $model = Land::model()->findByPk($id);
        if ($model === null)
            throw new CHttpException(404, 'The requested page does not exist.');
        return $model;
    }

    public function actionUpdate() {
        $gid = $_REQUEST['gid'];
        $land = $this->loadLand($gid);
        $shop = $land->shop;
        $land->set($_REQUEST);
        if ($land->update()) {
            echo 'land updated';
        }
        var_dump($_REQUEST);
        var_dump($land);

        if (!empty($shop->id)) {
            $shop->set($_REQUEST);
            var_dump($shop);
            if ($shop->update()) {
                echo 'hi';
            }
        }

//        if (isset($_POST['Land'])) {
//            $model->attributes = $_POST['Land'];
//            if ($model->save())
//                $this->redirect(array('view', 'id' => $model->PlatCode));
//        }
//
//        $this->render('update', array(
//            'model' => $model,
//        ));
    }

    protected function loadLand($gid) {
        $land = Land::model()->with('shop')->findByPk($gid * 1);
        return $land;
    }

//    public function actionDelete($id) {
//        $this->loadModel($id)->delete();
//
//        // if AJAX request (triggered by deletion via admin grid view), we should not redirect the browser
//        if (!isset($_GET['ajax']))
//            $this->redirect(isset($_POST['returnUrl']) ? $_POST['returnUrl'] : array('admin'));
//    }
//    public function actionIndex() {
//        $dataProvider = new CActiveDataProvider('Land');
//        $this->render('index', array(
//            'dataProvider' => $dataProvider,
//        ));
//    }
//    public function actionAdmin() {
//        $model = new Land('search');
//        $model->unsetAttributes();  // clear any default values
//        if (isset($_GET['Land']))
//            $model->attributes = $_GET['Land'];
//
//        $this->render('admin', array(
//            'model' => $model,
//        ));
//    }
//    public function loadByLinkCode($linkCode) {
//        $lordCodeCol = Yii::app()->db->quoteColumnName("LordCode");
//        $criteria = new CDbCriteria;
//        $criteria->select = '*,ST_AsGeoJson(geom) as geom';
//        $criteria->condition = "$lordCodeCol=:lc";
//        $criteria->params = array(':lc' => $linkCode);
//
//        $data = Land::model()->findAll($criteria);
//        return $data;
//    }
//    public function landClassToArray($row) {
//        return array(
//            'PlatCode' => $row->PlatCode,
//            'AreaPlat' => $row->AreaPlat,
//            'Price' => $row->Price,
//            'WaterType' => $row->WaterType,
//            'PlantType' => $row->PlantType,
//            'VillageName' => $row->VillageName,
//            'X' => $row->X,
//            'Y' => $row->Y,
//            'SheetNo' => $row->SheetNO,
//            'VillageCode' => $row->VillageCode,
//            'WithDocument' => $row->WithDocument,
//            'WithoutDocument' => $row->WithoutDocument,
//            'NasaghiAcre' => $row->NasaghiAcre,
//            'HeaatiAcre' => $row->HeaatiAcre,
//            'PublicSource' => $row->PublicSource,
//            'AcreStatus' => $row->CodeEvent,
//        );
//    }
//    protected function performAjaxValidation($model) {
//        if (isset($_POST['ajax']) && $_POST['ajax'] === 'land-form') {
//            echo CActiveForm::validate($model);
//            Yii::app()->end();
//        }
//    }
}
