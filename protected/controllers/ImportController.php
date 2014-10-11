<?php
//require_once(Yii::app()->baseUrl.'/extensions/excel.php');
//require_once Yii::getPathOfAlias('application.extensions.excel.excel').'.php';
class ImportController extends Controller{

    public $layout='//layouts/column2';

    public function filters(){
            return array(
                    //'accessControl', // perform access control for CRUD operations
                    'postOnly + delete', // we only allow deletion via POST request
            );
    }

    public function accessRules(){
        return array(
                array('allow',  // allow all users to perform 'index' and 'view' actions
                        'actions'=>array('index','excel', 'file'),
                        'users'=>array('*'),
                ),
                array('allow', // allow authenticated user to perform 'create' and 'update' actions
                        'actions'=>array('create','update'),
                        'users'=>array('@'),
                ),
                array('allow', // allow admin user to perform 'admin' and 'delete' actions
                        'actions'=>array('admin','delete','features'),
                        'users'=>array('admin'),
                ),
                array('deny',  // deny all users
                        'users'=>array('*'),
                ),
        );
    }
    
    public function actionExcel(){
		
		if(strlen(isset($_FILES['excel_file']['tmp_name'])))
		{
		 	$file_name = $_FILES['excel_file']['tmp_name'];
		  	if(@file_exists($file_name))
		  		$rows=Yii::app()->excel->xls_to_array($file_name);
		}
		else
			$error="فايل موجود نيست";
		echo $error;
		//var_dump( $rows);
		//$lands = Land::model()->findAll();
		
		//var_dump($lands);
		$savedCount=0;
		$unsavedCount=0;
		$newUserCount = 0;
		$newUserFailedCount=0;
		foreach($rows as $row){
			$code = $row[0];
			
			$firstName = $row[1];
			$lastName = $row[2];
			$dadName = $row[3];
			$myUser = MyUser::model()->findByAttributes(array('FirstName'=>$firstName,'LastName'=>$lastName,'DadName'=>$dadName));
			
			if($myUser==null){
				$myUser = new MyUser;
				$myUser->attributes = array(
					'FirstName'=>$firstName,
					'LastName'=>$lastName,
					'DadName'=>$dadName,
					'codeMelli'=>$row[4],
					'ostan'=>$row[16],
					'shahrestan'=>$row[15],
					'villageName'=>$row[13],
					'phone'=>$row[14],
				);
			}
			if($myUser->save()){
				$newuserCount++; 
			}
			else{
				$newUserFailedCount++;
				continue;
				
			}
			
			$userId = $myUser->id;
			
			$land = Land::model()->findByAttributes(array('name'=>$code));
			if($land!=null){
				$land->waterType = $row[6];
				$land->plantType = $row[5];
				//$land->price = $row[];
				$land->position = $row[8];
				$land->numAdjacent = $row[9]*1;
				$land->usingType = $row[17];
				$land->docStatus = $row[18];
				$land->userId = $userId;
				if($land->save())
					$savedCount++;
				else 
					$unsavedCount++;
			}
			
			//var_dump($row);
		}
		echo 'number of all lands updated: '.$savedCount.'<br>';
		echo 'number of not updated: '.$unsavedCount.'<br/>';
		echo 'number of all new users: '.$newUserCount.'<br/>';
		echo 'number of failed users: '.$newUserFailedCount.'<br/>';
		
	}
	public function actionIndex(){
		$lands = Land::model()->findAll();
		var_dump($lands);
	}
	public function actionView(){
		$this->render('view');
	}
    
    
}
