<?php

class OwnersController extends Controller
{
	public $layout='//layouts/column2';
        
	public function filters()
	{
		return array(
			'accessControl', // perform access control for CRUD operations
			'postOnly + delete', // we only allow deletion via POST request
		);
	}
        
	public function accessRules()
	{
		return array(
			array('allow',  // allow all users to perform 'index' and 'view' actions
				'actions'=>array('index','view', 'getOwners'),
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
        
        public function actionGetOwners(){
            $allOwners = Owners::model()->findAll();
            $returnedArray = array();
            foreach($allOwners as $row){
                $returnedArray[] = array('firstName'=>$row->firstName, 'lastName'=>$row->lastName); 
            }
            echo json_encode(array('owners'=>$returnedArray));
        }
        
	public function actionView($id)
	{
		$this->render('view',array(
			'model'=>$this->loadModel($id),
		));
	}
        
	public function actionCreate()
	{
		$model=new Owners;

		// Uncomment the following line if AJAX validation is needed
		// $this->performAjaxValidation($model);

		if(isset($_POST['Owners']))
		{
			$model->attributes=$_POST['Owners'];
			if($model->save())
				$this->redirect(array('view','id'=>$model->id));
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

		if(isset($_POST['Owners']))
		{
			$model->attributes=$_POST['Owners'];
			if($model->save())
				$this->redirect(array('view','id'=>$model->id));
		}

		$this->render('update',array(
			'model'=>$model,
		));
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
		$dataProvider=new CActiveDataProvider('Owners');
		$this->render('index',array(
			'dataProvider'=>$dataProvider,
		));
	}
        
	public function actionAdmin()
	{
		$model=new Owners('search');
		$model->unsetAttributes();  // clear any default values
		if(isset($_GET['Owners']))
			$model->attributes=$_GET['Owners'];

		$this->render('admin',array(
			'model'=>$model,
		));
	}
        
	public function loadModel($id)
	{
		$model=Owners::model()->findByPk($id);
		if($model===null)
			throw new CHttpException(404,'The requested page does not exist.');
		return $model;
	}
        
	protected function performAjaxValidation($model)
	{
		if(isset($_POST['ajax']) && $_POST['ajax']==='owners-form')
		{
			echo CActiveForm::validate($model);
			Yii::app()->end();
		}
	}
}
