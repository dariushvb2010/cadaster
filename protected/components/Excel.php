<?php

Yii::import('ext.excel.Spreadsheet_Excel_Reader');
//Yii::import('ext.excelwriter.inc.php');
class Excel extends CApplicationComponent{
	private $reader=NULL;
 	private $row_cnt=NULL;
 	
 	public function xls_to_array($file_name)
 	{
 		$array_rows=array();
 		$this->prepare_for_read($file_name);
 		$t=$this->read_One_rowexcel();
 		while($t)
 		{
 			$t=$this->read_One_rowexcel();
 			if(empty($t[0]) &&empty($t[1])&&empty($t[2]));
 			else $array_rows[]=$t;
 		}
 		return  $array_rows ;
 	}
	private function prepare_for_read($url)
	{
// 	  global $reader;
		 $this->reader = new Spreadsheet_Excel_Reader();
		$this->reader->setOutputEncoding("UTF-8");
		
		$this->reader->read($url);
		$this->row_cnt=0;
	
	}

	private function read_One_rowexcel($right_toleft=0)
	{
		  //global $row_cnt,$reader;
		  if(   $this->row_cnt>$this->reader->sheets[0]["numRows"]) return NULL;
		$one_row=array();
		if($right_toleft==0)
		{
		for ($j = 1; $j <= $this->reader->sheets[0]["numCols"]; $j++)
			{
				 $one_row[]= $this->reader->sheets[0]["cells"][$this->row_cnt][$j];
			}
		 }
		 else
		 {
		    for ($j = $this->reader->sheets[0]["numCols"]; $j >=1 ; $j--)
			{
				 $one_row[]= $this->reader->sheets[0]["cells"][$this->row_cnt][$j];
			}
		 }
		
		
		 $this->row_cnt++;
		return $one_row;
	 }
	 private function write_excel_on_the_fly($array)
	 {
		   	$excel=new ExcelWriter("xls.xls");
		
			if($excel==false)
				return FALSE;
		  header('Content-type: application/xls');
		
		// It will be called downloaded.pdf
		header('Content-Disposition: attachment; filename="downloaded.xls"');
		
		// The PDF source is in original.pdf
		
		
		     foreach($array as $row)
		     {
		       $excel->writeRow();
		       foreach($row as $col)
		       $excel->writeCol($col);
		     }
		
		      	$excel->close();
		     return TRUE;
		
	 }
}
?>
