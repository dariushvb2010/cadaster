<?php

//Yii::import('application.modules.user.models.User');
/**
 * the old name of this class was "landlord".
 *
 * The followings are the available columns in table 'landlord':
 * @property integer $id
 * @property integer $LinkCode
 * @property integer $UserID
 * @property string $FirstName
 * @property string $LastName
 * @property string $DadName
 * @property string $Address
 * @property string $Description
 * @property string $Sharers
 */
class MyUser extends CActiveRecord
{
	/**
	 * @return string the associated database table name
	 */
	public function tableName()
	{
		return 'my_user';
	}

	/**
	 * @return array validation rules for model attributes.
	 */
	public function rules()
	{
		// NOTE: you should only define rules for those attributes that
		// will receive user inputs.
		return array(
// 			array('LinkCode', 'required'),
// 			array('LinkCode', 'numerical', 'integerOnly'=>true),
			array('FirstName, LastName, DadName, Address, Description, Sharers', 'length', 'max'=>255),
			// The following rule is used by search().
			// @todo Please remove those attributes that should not be searched.
			array('id, LinkCode, FirstName, LastName, DadName, Address, Description, Sharers', 'safe', 'on'=>'search'),
		);
	}

	/**
	 * @return array relational rules.
	 */
	public function relations()
	{
		// NOTE: you may need to adjust the relation name and the related
		// class name for the relations automatically generated below.
		return array(
			'user'=>array(self::BELONGS_TO, 'User', 'UserID'),
		);
	}

	public function byFilter($filters){
		$q = new CDbCriteria();
		if($filters)
		foreach($filters as $filter){
			$q->addSearchCondition(Yii::app()->db->quoteColumnName($filter->property),$filter->value);
		}
		$this->getDbCriteria()->mergeWith($q);
		return $this;
	}
	
	/**
	 * @return array customized attribute labels (name=>label)
	 */
	public function attributeLabels()
	{
		return array(
			'id' => 'id',
			'UserID'=>'User ID',
			'LinkCode' => 'Link Code',
			'FirstName' => 'First Name',
			'LastName' => 'Last Name',
			'DadName' => 'Dad Name',
			'Address' => 'Address',
			'Description' => 'Description',
			'Sharers' => 'Sharers',
		);
	}

	/**
	 * Retrieves a list of models based on the current search/filter conditions.
	 *
	 * Typical usecase:
	 * - Initialize the model fields with values from filter form.
	 * - Execute this method to get CActiveDataProvider instance which will filter
	 * models according to data in model fields.
	 * - Pass data provider to CGridView, CListView or any similar widget.
	 *
	 * @return CActiveDataProvider the data provider that can return the models
	 * based on the search/filter conditions.
	 */
	public function search()
	{
		// @todo Please modify the following code to remove attributes that should not be searched.

		$criteria=new CDbCriteria;

		$criteria->compare('id',$this->id);
		$criteria->compare('UserID',$this->UserID);
		$criteria->compare('LinkCode',$this->LinkCode);
		$criteria->compare('FirstName',$this->FirstName,true);
		$criteria->compare('LastName',$this->LastName,true);
		$criteria->compare('DadName',$this->DadName,true);
		$criteria->compare('Address',$this->Address,true);
		$criteria->compare('Description',$this->Description,true);
		$criteria->compare('Sharers',$this->Sharers,true);

		return new CActiveDataProvider($this, array(
			'criteria'=>$criteria,
		));
	}

	/**
	 * Returns the static model of the specified AR class.
	 * Please note that you should have this exact method in all your CActiveRecord descendants!
	 * @param string $className active record class name.
	 * @return Landlord the static model class
	 */
	public static function model($className=__CLASS__)
	{
		return parent::model($className);
	}
}
