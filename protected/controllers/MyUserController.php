<?php
class MyUserController extends Controller{
	
	public function accessRules()
	{
		return array(
			array('allow',  // allow all users to perform 'index' and 'view' actions
				'actions'=>array('index','changePass'),
				'users'=>array('@'),
			),
			array('deny',  // deny all users
				'users'=>array('*'),
			),
		);
	}
	public function actionInfo(){
            $userId = $_REQUEST['userId'];
            $user = MyUser::model()->findByPk($userId);
            $userAttrs = $user->getAttributes();
            echo json_encode($userAttrs);
        }
	public function actionChangePass(){
		$newPass = $_REQUEST['newPass'];
		$currentPass = $_REQUEST['currentPass'];
		$reNewPass = $_REQUEST['reNewPass'];
		$newPassEnc = Yii::app()->getModule('user')->encrypting($newPass);
		$currentPassEnc = Yii::app()->getModule('user')->encrypting($currentPass);
		if($newPass==$reNewPass){
			$userModel = User::model()->notsafe()->findByPk(Yii::app()->user->id);
			if($currentPassEnc==$userModel->password){
				$userModel->password = $newPassEnc;
				if($userModel->save())
					$res=array('success'=>Msg::success_add);
				else
					$res = array('failure'=>Msg::fail_add);
			}else{
				$res = array('failure'=>Msg::fail_pass_current);
			}
			
		}
		else 
			$res = array('failure'=>Msg::fail_pass_retype);
		echo json_encode($res);
		Yii::app()->end();
		
// 		if ($user->password!=$model->password) {
// 			$model->password=Yii::app()->getModule('user')->encrypting($model->password);
// 			$model->activkey=Yii::app()->getModule('user')->encrypting(microtime().$model->password);
// 		}
// 		$model->save();
	}
}