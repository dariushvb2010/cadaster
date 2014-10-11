<?php

class BusinessController extends Controller {

    public $layout = '//layouts/column2';

    const UPLOAD_FOLDER = 'upload';
    const MAX_FILE_SIZE = 2000000; // in Bytes

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
                'actions' => array('landbuy', 'salelist', 'buy', 'upload','updateshop','delete'),
                'users' => array('*'),
            ),
            array('allow', // allow authenticated user to perform 'create' and 'update' actions
                'actions' => array('create', 'update'),
                'users' => array('@'),
            ),
            array('allow', // allow admin user to perform 'admin' and 'delete' actions
                'actions' => array('landsell', 'buy', 'retrieve', 'imgInfo'),
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
            if ($land == null) {
                $res = array('failure' => Yii::t('global', 'land with id {id} not found!', array('{id}' => $landId)));
                echo json_encode($res);
                return;
            }elseif(!empty($land->shop->id)){
                $res = array('failure' => Yii::t('global', 'land with id {id} has already been sold !', array('{id}' => $landId)));
                echo json_encode($res);
                return;
            }
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

    public function actionUpdateShop(){
        $gid = $_REQUEST['gid'];
        $attr['hasEsteshhad'] = true;
        $attr['hasMap'] = $_REQUEST['hasMap'];
        $attr['hasEstelam'] = $_REQUEST['hasEstelam'];
        
        $land = $this->loadLand($gid);
        $shop = $land->shop;
        $shop->hasEsteshhad = $_REQUEST['hasEsteshhad']=='true' ? true : false;
        $shop->hasMap = $_REQUEST['hasMap']=='true' ? true : false;
        $shop->hasEstelam = $_REQUEST['hasEstelam']=='true' ? true : false;
        $shop->hasMadarek = $_REQUEST['hasMadarek']=='true' ? true : false;
        $shop->hasSanad = $_REQUEST['hasSanad']=='true' ? true : false;
        $shop->hasTayeediyeShura = $_REQUEST['hasTayeediyeShura']=='true' ? true : false;
        $shop->hasQabz = $_REQUEST['hasQabz']=='true' ? true : false;
        
        
        
        if($shop->update()){
            $ret = array('success'=>Yii::t('global','Attributes were successfully updated!')); 
        }else{
            $ret = array('failure'=>Yii::t('global','An error occured when saving data!'));
        }
        echo json_encode($ret);
    }
    public function actionUpload() {

        ob_start();
        $gid = $_REQUEST['gid'];
        $land = $this->loadLand($gid);
        if(empty($land)){
            echo json_encode(array('failure' => Yii::t('global','land with id {id} not found!',array('{id}'=>$gid))));
            return; 
        }
        $folder = $this->getUploadFolder($land);
        $msg = '';
        $allSuccess = true;
        foreach ($_FILES as $fKey => $file) {
            //--$fKey = name of the input, like 'qabz','committee','sanad'
            if ($file['error'] == 4) { // empty file
                continue;
            }
            $res = $this->saveFile($file, $folder, $fKey);
            if ($res === true) {
                
                //$property = 'has' . ucfirst($fKey); ////uppercase the first letter of $fKey
                //$land->shop->$property = true;
                //$land->shop->save();
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
        Yii::app()->end();
    }

    /**
     * 
     * @param array $file ==$_FILES[$fKey]
     * @param string $folder
     */
    private function saveFile($file, $folder, $fileName) {
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
                $filePath = $folder . $fileName . '.' . $extension;
                var_dump($filePath);
                if (!file_exists($folder)) {
                    mkdir($folder, 0700, true);
                }
                if (file_exists($filePath)) {
                    return Yii::t('global', '{file} already exists.', array('{file}' => $file['name']));
                } else {
                    move_uploaded_file($file["tmp_name"], $filePath);
                    return true;
                }
            }
        } else {
            return Yii::t('global', 'file format not supported.');
        }
    }

    /**
     * 
     * @param type $land
     * @return string directory name with '/' at the end
     */
    protected function getUploadFolder($land) {
        $folder = Yii::app()->params['upload.folder'] . DIRECTORY_SEPARATOR . $land->gid . DIRECTORY_SEPARATOR . $land->shop->id . DIRECTORY_SEPARATOR;
        return $folder;
    }

    public function actionImgInfo() {
        $gid = $_REQUEST['gid'];
        $land = $this->loadLand($gid);
        $folder = $this->getUploadFolder($land);
        
        if(!file_exists($folder)){
           
            echo json_encode(array('images'=>array()));
            return;//rrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr
        }
        $d = dir($folder);
        while ($name = $d->read()) {
            if (!preg_match('/\.('.  implode('|', self::$allowedExts).')$/', $name)){
                continue;
            }
            $filePath = $folder . $name;
            $size = filesize($filePath);
            $lastmod = filemtime($filePath) * 1000;
            $images[] = array(
                'name' => $name,
                'size' => $size,
                'lastmod' => $lastmod,
                'url' => Yii::app()->createUrl('business/retrieve', array('gid' => $gid, 'fileName' => $name))
            );
        }
        $d->close();
        $o = array('images' => $images);
        echo json_encode($o);
    }

    public function actionRetrieve() {
        $land = $this->loadLand($_REQUEST['gid']);
        $fileName = $_REQUEST['fileName'];
        if (empty($land) || empty($fileName)) {
            echo 'parameters have not been set.';
            var_dump($land, $fileName);
            return;
        }
        $folder = $this->getUploadFolder($land);
        $filePath = $folder . $fileName;
        $tempArr = explode('.', $filePath);
        $ext = end($tempArr);

        if (!empty($filePath) && file_exists($filePath)) {
            header('Content-Type:image/' . $ext);
            header('Content-Length: ' . filesize($filePath));
            readfile($filePath);
        } else {
            echo 'not found: ' . $filePath;
        }
    }

    public function actionDelete(){
        
        $gid = $_REQUEST['gid'];
        $land = $this->loadLand($gid);
        $shop = $land->shop;
        $land->shopId = null;
        
        if($land->update() && $shop->delete()){
            echo Yii::t('global','Successfully deleted!');
        }else{
            throw new CHttpException(404,Yii::t('global','An error occured!'));
        }
        
    }
    protected function loadLand($gid) {
        $land = Land::model()->with('shop')->findByPk($gid * 1);
        return $land;
    }

    protected function performAjaxValidation($model) {
        if (isset($_POST['ajax']) && $_POST['ajax'] === 'land-form') {
            echo CActiveForm::validate($model);
            Yii::app()->end();
        }
    }

}

//        $fi = new FilesystemIterator($folder, FilesystemIterator::SKIP_DOTS);
//        $sanadCount = iterator_count($fi);

        //var_dump($sanadCount);
        /*         * --------------------------------------------------------------
         * help for glob function: It lists all of files within a directory
         *      foreach(glob('./images/*.*') as $filename){
         *          echo $filename;
         *      }
         *      //It lists all of files with png and jpg extensions
         *      foreach(glob('./images/*.{png,jpg}',GLOB_BRACE) as $filename){
         *          echo $filename;
         *      }
         */
//        $filesInFolder = glob($folder . '*.{' . implode(',', self::$allowedExts) . '}', GLOB_BRACE);
//        foreach ($filesInFolder as $filePath) {
//            $tempArr = explode(DIRECTORY_SEPARATOR, $filePath);
//            $fileName = $tempArr[count($tempArr) - 1];
//            $images[] = array(
//                'name' => $fileName,
//                'size' => filesize($filePath),
//                'lastmod' => $lastmod,
//                'url' => Yii::app()->createUrl('business/retrieve', array('gid' => $gid, 'fileName' => $fileName))
//            );
//        }
