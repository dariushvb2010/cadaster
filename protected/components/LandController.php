<?php

class LandController extends Controller{

    public $layout='//layouts/column2';

    public function filters(){
            return array(
                    'accessControl', // perform access control for CRUD operations
                    'postOnly + delete', // we only allow deletion via POST request
            );
    }

    public function accessRules(){
        return array(
                array('allow',  // allow all users to perform 'index' and 'view' actions
                        'actions'=>array('index','view', 'master', 'features'),
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
    
    public function actionMaster(){
        if(Yii::app()->request->isPostRequest){
        	
        }else{
        	$LinkCode = $_GET['LinkCode'];
        	$relation_models = Land::model()->findAllByAttributes(array(
        	            'LinkCode'=>$LinkCode
        	));
        	$i = 0;
        	$returnedArray = array();
        	foreach ($relation_models as $row){
        		//echo $row->Price;
        		$returnedArray[] = $this->landClassToArray($row);
        	}
        	echo json_encode(array('LandDetail'=>$returnedArray));
        }
        
    }
    public function actionFeatures(){
    	
    		
    		$LinkCode = $_REQUEST['LinkCode'];
    		
    		$relation_models = Land::model()->findAllByAttributes(array(
            	            'LinkCode'=>$LinkCode
    		));
    		$i = 0;
    		
    		$content = file_get_contents('desktop/data/Ostan.json');
    		$jArr = json_decode($content);
    		$features = $jArr->features;
    		
    		
    		
    		$f = array('type'=>'FeatureCollection');
    		foreach ($relation_models as $row){
    			
    			$geom = $features[rand(0, 29)]->geometry;
    			$new = array('type'=>'feature','properties'=>$row->attributes);
    			$new['geometry']=$geom;//array('type'=>'Polygon','coordinates'=>array());
        		$f['features'][] = $new;
        		//var_dump($row->attributes);
        	}
    		//echo json_encode($f);
    		
    		echo (json_encode($f));
    	
    
    }
    public function actionView(){
        $success_stories = Yii::app()->db->createCommand()
            ->select('*')
            ->from('land')
            ->limit(10,0)
            ->queryAll();
        $i = 0;
        foreach ($success_stories as $me){
            $i++;
            //echo "i: ".$i." -- help me ya Allah";
            echo "i: ".$me['ID']."<br>";
            //echo " -- ID: ".$me->ID."<br>";
        }
        //$countQuery = clone$query;
        //echo "countQuery: ".$countQuery;
        //$pages = new Pagination(['totalCount' => $countQuery->count()]);
        //$models = $query->offset($pages->offset)->limit($pages->limit)->all();

    }
    
    public function actionCreate(){
            $model=new Land;

            // Uncomment the following line if AJAX validation is needed
            // $this->performAjaxValidation($model);

            if(isset($_POST['Land']))
            {
                    $model->attributes=$_POST['Land'];
                    if($model->save())
                            $this->redirect(array('view','id'=>$model->PlatCode));
            }

            $this->render('create',array(
                    'model'=>$model,
            ));
    }
    
    public function actionUpdate($id){
            $model=$this->loadModel($id);

            // Uncomment the following line if AJAX validation is needed
            // $this->performAjaxValidation($model);

            if(isset($_POST['Land']))
            {
                    $model->attributes=$_POST['Land'];
                    if($model->save())
                            $this->redirect(array('view','id'=>$model->PlatCode));
            }

            $this->render('update',array(
                    'model'=>$model,
            ));
    }
    
    public function actionDelete($id){
            $this->loadModel($id)->delete();

            // if AJAX request (triggered by deletion via admin grid view), we should not redirect the browser
            if(!isset($_GET['ajax']))
                    $this->redirect(isset($_POST['returnUrl']) ? $_POST['returnUrl'] : array('admin'));
    }
    
    public function actionIndex(){
            $dataProvider=new CActiveDataProvider('Land');
            $this->render('index',array(
                    'dataProvider'=>$dataProvider,
            ));
    }
    
    public function actionAdmin(){
            $model=new Land('search');
            $model->unsetAttributes();  // clear any default values
            if(isset($_GET['Land']))
                    $model->attributes=$_GET['Land'];

            $this->render('admin',array(
                    'model'=>$model,
            ));
    }
    
    public function loadModel($id){
            $model=Land::model()->findByPk($id);
            if($model===null)
                    throw new CHttpException(404,'The requested page does not exist.');
            return $model;
    }
    public function landClassToArray($row){
    	return array(
                'PlatCode'=>$row->PlatCode,
                'AreaPlat'=>$row->AreaPlat,
                'Price'=>$row->Price,
                'WaterType'=>$row->WaterType,
                'PlantType'=>$row->PlantType,
                'VillageName'=>$row->VillageName,
                'X'=>$row->X,
                'Y'=>$row->Y,
                'SheetNo'=>$row->SheetNO,
                'VillageCode'=>$row->VillageCode,
                'WithDocument'=>$row->WithDocument,
                'WithoutDocument'=>$row->WithoutDocument,
                'NasaghiAcre'=>$row->NasaghiAcre,
                'HeaatiAcre'=>$row->HeaatiAcre,
                'PublicSource'=>$row->PublicSource,
                'AcreStatus'=>$row->CodeEvent,
            );   	
    }
    protected function performAjaxValidation($model){
        if(isset($_POST['ajax']) && $_POST['ajax']==='land-form')
        {
            echo CActiveForm::validate($model);
            Yii::app()->end();
        }
    }
}
