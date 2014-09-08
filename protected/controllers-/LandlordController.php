<?php

class LandlordController extends Controller
{
    public $layout='//layouts/column2';

    public function filters(){
        return array(
                'accessControl', // perform access control for CRUD operations
                'postOnly + delete', // we only allow deletion via POST request
        );
    }

    public function accessRules()
    {
            return array(
                    array('allow',  // allow all users to perform 'index' and 'view' actions
                            'actions'=>array('index','view', 'AllLandlord', 'register', 'print', 'printTest'),
                            'users'=>array('*'),
                    ),
                    array('allow', // allow authenticated user to perform 'create' and 'update' actions
                            'actions'=>array('create','update'),
                            'users'=>array('@'),
                    ),
                    array('allow', // allow admin user to perform 'admin' and 'delete' actions
                            'actions'=>array('admin','delete'),
                            'users'=>array('admin'),
                    ),
                    array('deny',  // deny all users
                            'users'=>array('*'),
                    ),
            );
    }
    public function actionPrintTest(){
        // right side
        $rightSide = array();
        $segment1 = array();
        $segment1[] = array(35, 45);
        $segment1[] = array(38, 42);
        $segment1[] = array(40, 50);
        $segment2[] = array(55, 45);
        $segment2[] = array(38, 45);
        $segment2[] = array(45, 55);
        
        $landInfo = array("name"=>"مرتضی(از سمت سرور میخوانم)",
            "family"=>"ملوندی",
            "fatherName"=>"عباسعلی"
            );
        
        $rightSide[] = $segment1;
        $rightSide[] = $segment2;
        
        
        // left side
        $leftSide = array();
        $segment1 = array();
        $segment1[] = array(35, 45);
        $segment1[] = array(38, 42);
        $segment1[] = array(40, 50);
        $segment2 = array();
        $segment2[] = array(55, 45);
        $segment2[] = array(38, 45);
        $segment2[] = array(45, 55);
        $leftSide[] = $segment1;
        $leftSide[] = $segment2;
        
        
        // range
        $range = array();
        $segment1 = array();
        $segment1[] = array(35, 45);
        $segment1[] = array(38, 42);
        $segment1[] = array(40, 50);
        $segment2 = array();
        $segment2[] = array(55, 45);
        $segment2[] = array(38, 45);
        $segment2[] = array(45, 55);
        $range[] = $segment1;
        $range[] = $segment2;
        
        echo json_encode(array('right'=>$rightSide,
            'left'=>$leftSide,
            'range'=>$range,
            'landInfo'=>$landInfo
        ));
    	
    }
    
    public function actionAllLandlord(){
    	
        if(Yii::app()->request->isPostRequest){// request for update or create of landlord
        	/*
        	 * this request sends data as json file, so we use file_get_contents()
        	 * if one landlord has to be updated or created, the $inputLords will be an instance of stdClass
        	 * if more than one landlord has to be updated or created, the $inputLords will be array of stdClass
        	 */
        	
        	$inputLords = json_decode(file_get_contents('php://input'));//$inputLords is array of stdClass
        	if($inputLords instanceof stdClass)
        		$inputLords = array($inputLords);
        	$this->manageNewLords($inputLords);	
        }else{
        	$page = $_REQUEST['page'];
        	$start = $_REQUEST['start'];
        	$limit = $_REQUEST['limit'];
        	
        	$returnedArray = array();
        	$filters=array();
        	
        	if(isset($_GET['filter']))
				$filters = json_decode($_REQUEST['filter']);
        	$q = new CDbCriteria();
        	$q->limit = $limit;
        	$q->offset = $start;
        	
        	$landLords = MyUser::model()->byFilter($filters)->findAll($q);
        	foreach ($landLords as $lord){
        		$returnedArray[] = $this->lordClassToArray($lord);
        	}

        	$count = MyUser::model()->byFilter($filters)->count($q);
        	echo json_encode(array('totalCount'=>$count,'LandLordsDetail'=>$returnedArray));
        }
    	
    }
    
    
    public function actionRegister(){
        $array = array('failure'=>'failed');
        $model=new Landlord;
        
        // Uncomment the following line if AJAX validation is needed
        // $this->performAjaxValidation($model);
        
        if(isset($_POST['FirstName']))
        {
        	$_POST['LinkCode'] = $this->getNewLinkCode();
        	$model->attributes=$_POST;
        	//echo json_encode($model->attributes);
        	if($model->save())
        		$array = array("success"=>"we recive Data");
        }
        echo json_encode($array);
    }
    
    public function actionView($id){
            $this->render('view',array(
                    'model'=>$this->loadModel($id),
            ));
    }

    public function actionCreate()
    {
            $model=new Landlord;

            // Uncomment the following line if AJAX validation is needed
            // $this->performAjaxValidation($model);

            if(isset($_POST['Landlord']))
            {
                    $model->attributes=$_POST['Landlord'];
                    if($model->save())
                            $this->redirect(array('view','id'=>$model->LinkCode));
            }

            $this->render('create',array(
                    'model'=>$model,
            ));
    }

    public function actionUpdate($id)
    {
            $model=$this->loadModel($id);

            // Uncomment the following line if AJAX validation is needed
            // $this->performAjaxValidation($model);

            if(isset($_POST['Landlord']))
            {
                    $model->attributes=$_POST['Landlord'];
                    if($model->save())
                            $this->redirect(array('view','id'=>$model->LinkCode));
            }

            $this->render('update',array(
                    'model'=>$model,
            ));
    }

    public function actionPrint(){
        $layout=null;
		//$this->render('print',array());
		$this->renderPartial('print');
		
    }

    
    public function actionDelete($id)
    {
            $this->loadModel($id)->delete();

            // if AJAX request (triggered by deletion via admin grid view), we should not redirect the browser
            if(!isset($_GET['ajax']))
                    $this->redirect(isset($_POST['returnUrl']) ? $_POST['returnUrl'] : array('admin'));
    }

    public function actionIndex()
    {
            $dataProvider=new CActiveDataProvider('Landlord');
            $this->render('index',array(
                    'dataProvider'=>$dataProvider,
            ));
    }

    public function actionAdmin()
    {
            $model=new Landlord('search');
            $model->unsetAttributes();  // clear any default values
            if(isset($_GET['Landlord']))
                    $model->attributes=$_GET['Landlord'];

            $this->render('admin',array(
                    'model'=>$model,
            ));
    }
    /**
     * 
     * 
     * @param array_of_stdClass $lords
     */
    public function manageNewLords($lords){
//     	echo 'manageNewLords'.count($lords);
    	foreach ($lords as $lord){
    		 if($lord->LinkCode==0){
    		 	$this->createLandLord($lord);
    		 }
    		 else{
    		 	$this->updateLandLord($lord);
    		 }
    	}
    }
	public function updateLandLord($lord){
		
		$linkCode = $lord->LinkCode*1;
		echo $linkCode;
		$model=Landlord::model()->findByPk($linkCode);
		
		if($model===null)
			throw new CHttpException(404,'The requested page does not exist.');
		$model->attributes = $this->lordClassToArray($lord);
		if($model->save())
			echo json_encode(array('success'=>'updated'));
		else
			echo json_encode(array('failure'=>'failed to update'));
	}
	public function createLandLord($lord){
		$linkCode = $this->getNewLinkCode();
		$lord->LinkCode = $linkCode;
		$model = new Landlord;
		$model->attributes = $this->lordClassToArray($lord);
		var_dump($model->attributes);
		if($model->save())
			echo json_encode(array('success'=>'created'));
		else
			echo json_encode(array('failure'=>'failed to create'));
	}
    public function loadModel($id)
    {
            $model=Landlord::model()->findByPk($id);
            if($model===null)
                    throw new CHttpException(404,'The requested page does not exist.');
            return $model;
    }
    /**
     * 
     * 
     * @param stdClass $lord
     */
    public function lordClassToArray($lord){
    	return array('id'=>$lord->id,
        	         'FirstName'=>$lord->FirstName,
        	         'LastName'=>$lord->LastName,
        	         'DadName'=>$lord->DadName,
        	         'Address'=>$lord->Address,
        	         'Description'=>$lord->Description,
        	         'Sharers'=>$lord->Sharers);
    }
    /**
     * 
     * returns max(LinkCode)+1 from database
     * @return number
     */
    public function getNewLinkCode(){
    	$res = Yii::app()->db->createCommand()
    	->select('max(linkCode)')
    	->from('landlord')
    	->queryAll();
    	return $res[0]['max(linkCode)']+1;
    }
    protected function performAjaxValidation($model)
    {
            if(isset($_POST['ajax']) && $_POST['ajax']==='landlord-form')
            {
                    echo CActiveForm::validate($model);
                    Yii::app()->end();
            }
    }
}
