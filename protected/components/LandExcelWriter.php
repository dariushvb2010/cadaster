<?php

Yii::import('ext.excel.ExcelWriter');
//Yii::import('ext.excelwriter.inc.php');
class LandExcelWriter extends CApplicationComponent{
	private $writer;
	
	function __construct(){
		$file = Yii::app()->params['excel.writer.file'];
		$this->writer = new ExcelWriter();
		$this->writer->open($file);
	}
	public function close(){
		$this->writer->close();
	}
	public function writeLine($line_arr){
		$this->writer->writeLine($line_arr);
	}



}