<?php

class BusinessController extends Controller {

    public $layout = '//layouts/column2';

    const UPLOAD_FOLDER = 'upload';
    const MAX_FILE_SIZE = 200000; // in Bytes

    private static $allowedExts = array("gif", "jpeg", "jpg", "png");

    public function filters() {
        return array(
            'accessControl', // perform access control for CRUD operations
            'postOnly + delete', // we only allow deletion via POST request
        );
    }

    public function accessRules() {
        return array(
            array('allow', // allow all users to perform 'index' and 'view' actions
                'actions' => array('index', 'landbuy', 'salelist', 'buy', 'upload'),
                'users' => array('*'),
            ),
            array('allow', // allow authenticated user to perform 'create' and 'update' actions
                'actions' => array('create', 'update'),
                'users' => array('@'),
            ),
            array('allow', // allow admin user to perform 'admin' and 'delete' actions
                'actions' => array('landsell', 'buy'),
                'roles' => array('lord')
            ),
            array('deny', // deny all users
                'users' => array('*'),
            ),
        );
    }

    public function actionBuy() {

        if (isset($_REQUEST['gid'])) {
            $landId = (int) $_REQUEST['gid'];

            $m['finalPrice'] = $_REQUEST['finalPrice'];
            $m['pricePerMeter'] = $_REQUEST['pricePerMeter'];
            $m['area'] = $_REQUEST['area'];
            $m['mobayeNo'] = $_REQUEST['mobayeNo'];
            $m['mobayeDate'] = $_REQUEST['mobayeDate'];
            $m['committeeNo'] = $_REQUEST['committeeNo'];
            $m['committeeDate'] = $_REQUEST['committeeDate'];
            $m['description'] = $_REQUEST['description'];
            $m['createDate'] = new CDbExpression('NOW()');
            $m['createrUserId'] = Yii::app()->user->id;

            $land = Land::model()->findByPk($landId);
            //$m['sellerUserId'] = $land->lord->id;

            $landShop = new LandShop;
            $landShop->attributes = $m;
            if ($landShop->save()) {

                $land->shopId = $landShop->id;
                if ($land->save()) {
                    $res = array('success' => 'خرید زمین ثبت شد');
                } else {
                    $res = array('failure' => CHtml::errorSummary($landShop));
                }
            } else
                $res = array('failure' => CHtml::errorSummary($landShop));
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

    public function actionUpload() {

        ob_start();
        $gid = $_REQUEST['gid'];
        $land = Land::model()->with('shop')->findByPk($gid * 1);

        $folder = Yii::app()->params['upload.folder'] . DIRECTORY_SEPARATOR . $land->lord->id . DIRECTORY_SEPARATOR . $land->shop->id ;
        $msg = '';
        $allSuccess = true;
        foreach ($_FILES as $fKey => $file) {
            //--$fKey = name of the input, like 'qabz','committee','sanad'
            if($file['error']==4){ // empty file
                continue;
            }
            $res = $this->saveFile($file, $folder,$fKey);
            if ($res === true) {
                var_dump($fKey);
                $property = 'has'.ucfirst($fKey);////uppercase the first letter of $fKey
                $land->shop->$property = true;  
                $land->shop->save();
                $msg.=Yii::t('global', 'file {file} has been uploaded.', array('{file}' => $file['name'])) . '<br/>';
            } else {
                $allSuccess = false;
                $msg.=$res . '<br/>';
            }
        }
        if ($allSuccess) {
            $ret = array('success' => $msg);
        } else {
            $ret = array('failure' => $msg);
        }
        ob_end_clean();
        echo json_encode($ret);
        
    }

    /**
     * 
     * @param array $file ==$_FILES[$fKey]
     * @param string $folder
     */
    private function saveFile($file, $folder,$fileName) {
        $temp = explode(".", $file["name"]);
        $extension = end($temp);
        if ((($file["type"] == "image/gif") || ($file["type"] == "image/jpeg") || ($file["type"] == "image/jpg") || ($file["type"] == "image/pjpeg") || ($file["type"] == "image/x-png") || ($file["type"] == "image/png")) && ($file["size"] < 200000) && in_array($extension, self::$allowedExts)) {
            if ($file["error"] > 0) {
                return "خطا: " . $file["error"];
            } else {
//                    echo "Upload: " . $_FILES["file"]["name"] . "<br>";
//                    echo "Type: " . $_FILES["file"]["type"] . "<br>";
//                    echo "Size: " . ($_FILES["file"]["size"] / 1024) . " kB<br>";
//                    echo "Temp file: " . $_FILES["file"]["tmp_name"] . "<br>";
                $filePath = $folder . DIRECTORY_SEPARATOR . $fileName.'.'.$extension;
                var_dump($filePath);
                if(!file_exists($folder)){
                    mkdir($folder, 0700, true);
                }
                if (file_exists($filePath)) {
                    return Yii::t('global', '{file} already exists.', array('{file}' => $file['name']));
                } else{
                    move_uploaded_file($file["tmp_name"], $filePath);
                    return true;
                }
            }
        } else {
            return Yii::t('global', 'file format not supported.');
        }
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
