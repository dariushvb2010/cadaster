<?php

/**
 * This is the model class for table "landShop".
 *
 * The followings are the available columns in table 'landShop':
 * @property integer $id
 * @property integer $sellerUserId
 * @property string $plateCode
 * @property string $state
 * @property string $suggestPrice
 * @property string $finalPrice
 * @property integer $buyerUserId
 * @property string $buyDate
 * @property string $suggestDate
 * @property string $description
 *
 * The followings are the available model relations:
 * @property SuggestShop[] $suggestShops
 * @property MyUser $sellerUser
 * @property MyUser $buyerUser
 * @property Land $land
 */
class LandShop extends CActiveRecord {

    const STATE_FIRST = 'پیشنهاد اولیه';
    const STATE_FINAL = 'فروخته شده';

    /**
     * @return string the associated database table name
     */
    public function tableName() {
        return 'landShop';
    }

    /**
     * @return array validation rules for model attributes.
     */
    public function rules() {
        // NOTE: you should only define rules for those attributes that
        // will receive user inputs.
        return array(
            array('createrUserId,createDate', 'required'),
            array('createrUserId', 'numerical', 'integerOnly' => true),
            array('area, pricePerMeter', 'numerical'),
            array('state,mobayeNo,committeeNo', 'length', 'max' => 50),
            array('description', 'length', 'max' => 1000),
            array('finalPrice', 'safe'),
            // The following rule is used by search().
            // @todo Please remove those attributes that should not be searched.
            array('id, state, finalPrice', 'safe', 'on' => 'search'),
            //array('committeeDate,mobayeDate', 'type', 'type' => 'date', 'message' => '{attribute}: is not a date!')
            array('committeeDate,mobayeDate', 'safe')
        );
    }

    /**
     * @return array relational rules.
     */
    public function relations() {
        // NOTE: you may need to adjust the relation name and the related
        // class name for the relations automatically generated below.
        return array(
            'suggestShops' => array(self::HAS_MANY, 'SuggestShop', 'landShopId'),
            'sellerUser' => array(self::BELONGS_TO, 'MyUser', 'sellerUserId'),
            'createrUser'=>array(self::BELONGS_TO,'User','createrUserId'),
        );
    }

    /**
     * @return array customized attribute labels (name=>label)
     */
    public function attributeLabels() {
        return array(
            'id' => 'ID',
            'sellerUserId' => 'Seller User',
            'plateCode' => 'Plate Code',
            'state' => 'State',
            'suggestPrice' => 'Suggest Price',
            'finalPrice' => 'Final Price',
            'buyerUserId' => 'Buyer User',
            'buyDate' => 'Buy Date',
            'suggestDate' => 'Suggest Date',
            'description' => 'description'
        );
    }

    public static function states() {
        return array(
            1 => ''
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
    public function search() {
        // @todo Please modify the following code to remove attributes that should not be searched.

        $criteria = new CDbCriteria;

        $criteria->compare('id', $this->id);
        $criteria->compare('sellerUserId', $this->sellerUserId);
        $criteria->compare('plateCode', $this->plateCode, true);
        $criteria->compare('state', $this->state, true);
        $criteria->compare('suggestPrice', $this->suggestPrice, true);
        $criteria->compare('finalPrice', $this->finalPrice, true);
        $criteria->compare('buyerUserId', $this->buyerUserId);
        $criteria->compare('buyDate', $this->buyDate, true);
        $criteria->compare('suggestDate', $this->suggestDate, true);

        return new CActiveDataProvider($this, array(
            'criteria' => $criteria,
        ));
    }

    public function scopes() {
        return array(
            'list' => array(
                'with' => array(
                    'land',
                    'sellerUser',
                    'buyerUser'
                ),
// 				'condition'=>'state=:state',
// 				'params'=>array(':state'=>LandShop::STATE_FIRST)
            ),
        );
    }

    public function toSaleArray() {
        return array('id' => $this->id,
            'sellerFirstName' => $this->sellerUser->FirstName,
            'sellerLastName' => $this->sellerUser->LastName,
            'buyerFirstName' => $this->buyerUser->FirstName,
            'buyerLastName' => $this->buyerUser->LastName,
            'finalPrice' => $this->finalPrice,
            'suggestPrice' => $this->suggestPrice,
            'suggestDate' => $this->suggestDate,
            'buyDate' => $this->buyDate,
            'state' => $this->state,
            'description' => $this->description
        );
    }

    public function toSaleFeature() {
        return array(
            'geometry' => $this->land->geojson,
            'properties' => $this->toSaleArray()
        );
    }

// 	public static function loadAsSaleList(){
// 		$landShops = self::model()->with(
// 			array('land'=>array('select'=>'ST_AsGeoJson(geom) as geojson'),
// 			array('sellerUser')
// 		))->findAllByAttributes(array('state'=>LandShop::STATE_FIRST));
// 		return $landShops;
// 	}
    /**
     * Returns the static model of the specified AR class.
     * Please note that you should have this exact method in all your CActiveRecord descendants!
     * @param string $className active record class name.
     * @return LandShop the static model class
     */
    public static function model($className = __CLASS__) {
        return parent::model($className);
    }

}
