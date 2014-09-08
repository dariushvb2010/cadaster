<?php
class Msg{
	const success_add = 'با موفقیت ثبت شد';
	
	const fail_add = 'مشکلی در ثبت داده به وجود آمد!';
	const fail_pass_retype = 'تکرار رمز اشتباه است';
	const fail_pass_current='رمز عبور فعلی اشتباه است';
	const fail_params = 'پارامترها درست تنظیم نشده است';
	
	
	
	public static function get($key){
		$mess = array(
			'successfully added'=>'',
		
		);
		return $mess[$key];
	}
}