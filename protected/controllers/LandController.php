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
                'actions' => array('index', 'view', 'master', 'features', 'intersection', 'test'),
                'users' => array('*'),
            ),
            array('allow', // allow authenticated user to perform 'create' and 'update' actions
                'actions' => array('create', 'update'),
                'users' => array('@'),
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
        } else {
            $lands = ($simplified ? Land::model()->simplified()->findAll() : Land::model()->findAll());
            echo $this->makeGeoJson($lands);
        }
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

    public function getCount($id) {
        $crit = new CDbCriteria();
    }

    public function actionUpdate($id) {
        $model = $this->loadModel($id);

        // Uncomment the following line if AJAX validation is needed
        // $this->performAjaxValidation($model);

        if (isset($_POST['Land'])) {
            $model->attributes = $_POST['Land'];
            if ($model->save())
                $this->redirect(array('view', 'id' => $model->PlatCode));
        }

        $this->render('update', array(
            'model' => $model,
        ));
    }

    public function actionDelete($id) {
        $this->loadModel($id)->delete();

        // if AJAX request (triggered by deletion via admin grid view), we should not redirect the browser
        if (!isset($_GET['ajax']))
            $this->redirect(isset($_POST['returnUrl']) ? $_POST['returnUrl'] : array('admin'));
    }

    public function actionIndex() {
        $dataProvider = new CActiveDataProvider('Land');
        $this->render('index', array(
            'dataProvider' => $dataProvider,
        ));
    }

    public function actionAdmin() {
        $model = new Land('search');
        $model->unsetAttributes();  // clear any default values
        if (isset($_GET['Land']))
            $model->attributes = $_GET['Land'];

        $this->render('admin', array(
            'model' => $model,
        ));
    }

    public function loadModel($id) {
        $model = Land::model()->findByPk($id);
        if ($model === null)
            throw new CHttpException(404, 'The requested page does not exist.');
        return $model;
    }

    public function loadByLinkCode($linkCode) {
        $lordCodeCol = Yii::app()->db->quoteColumnName("LordCode");
        $criteria = new CDbCriteria;
        $criteria->select = '*,ST_AsGeoJson(geom) as geom';
        $criteria->condition = "$lordCodeCol=:lc";
        $criteria->params = array(':lc' => $linkCode);

        $data = Land::model()->findAll($criteria);
        return $data;
    }

    public function landClassToArray($row) {
        return array(
            'PlatCode' => $row->PlatCode,
            'AreaPlat' => $row->AreaPlat,
            'Price' => $row->Price,
            'WaterType' => $row->WaterType,
            'PlantType' => $row->PlantType,
            'VillageName' => $row->VillageName,
            'X' => $row->X,
            'Y' => $row->Y,
            'SheetNo' => $row->SheetNO,
            'VillageCode' => $row->VillageCode,
            'WithDocument' => $row->WithDocument,
            'WithoutDocument' => $row->WithoutDocument,
            'NasaghiAcre' => $row->NasaghiAcre,
            'HeaatiAcre' => $row->HeaatiAcre,
            'PublicSource' => $row->PublicSource,
            'AcreStatus' => $row->CodeEvent,
        );
    }

    protected function performAjaxValidation($model) {
        if (isset($_POST['ajax']) && $_POST['ajax'] === 'land-form') {
            echo CActiveForm::validate($model);
            Yii::app()->end();
        }
    }

    protected function makeGeoJson($lands) {
        $features = array();
        if (count($lands))
            foreach ($lands as $land) {
                $features[] = $land->toFeature();
            }
        return Gis::makeGeoJson2($features);
    }

}
