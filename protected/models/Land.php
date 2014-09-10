<?php

/**
 * This is the model class for table "land".
 * 
 * FeatureArray is array of this:
 * return array(
 *          'geometry' => $this->geojson,
 *          'properties' => array_merge(
 *                  $this->attributes, array('area' => $this->area, 'perimeter' => $this->perimeter)
 *          )
 *      );
 *
 * The followings are the available columns in table 'land':
 * @property integer $ID
 * @property integer $LordCode
 * @property string $PlatCode
 * @property string $RegistrationNO
 * @property double $AreaPlat
 * @property double $WithDocument
 * @property double $WithoutDocument
 * @property string $NasaghiAcre
 * @property string $HeaatiAcre
 * @property string $PublicSource
 * @property string $VillageName
 * @property string $VillageCode
 * @property string $WaterType
 * @property string $PlantType
 * @property string $X
 * @property string $Y
 * @property string $SheetNO
 * @property double $Price
 * @property integer $CodeEvent
 * @property String $Geometry
 */
class Land extends CActiveRecord {

    /**
     * 
     * ST_AsJeoJson(geom)
     * @var string
     */
    public $geojson;
    public $area;
    public $perimeter;

    const SRID = 32640;
    const SRID_4326 = 4326;

    /**
     *  ST_simplify(geom,value)
     * the values must be sorted in descending order (nozooli)
     * we simplify the geoms with $simplifyValues[0] and if it returned 0 points, we would try $simplifyValues[1] and ...
     * @var type 
     */
    private static $simplifyValues = array(2, 1, 0.2);

    const DEFAULT_SIMPLIFY_VALUE = 1;

    /**
     * @return string the associated database table name
     */
    public function tableName() {
        return 'morteza2';
    }

//    public function relateions() {
//        return array(
//            'user' => array(self::BELONGS_TO, 'MyUser', 'userId'),
//        );
//    }

    /**
     * @return array validation rules for model attributes.
     */
    public function rules() {
        // NOTE: you should only define rules for those attributes that
        // will receive user inputs.
        return array(
// 			array('plateCode', 'required'),
            array('userId, numAdjacent', 'numerical', 'integerOnly' => true),
            array('price', 'numerical'),
            array('', 'length', 'max' => 50),
            array(' villageCode, waterType, plantType, usingType, position sheetNo', 'length', 'max' => 255),
            // The following rule is used by search().
            // @todo Please remove those attributes that should not be searched.
            array('ID, userId, waterType, SheetNO, Price', 'safe', 'on' => 'search'),
        );
    }

    /**
     * @return array relational rules.
     */
    public function relations() {
        // NOTE: you may need to adjust the relation name and the related
        // class name for the relations automatically generated below.
        return array(
            'lord' => array(self::BELONGS_TO, 'MyUser', 'userId'),
        );
    }

    public function scopes() {
        return array(
            'simplified' => array(
                'select' => array('ST_AsGeoJson(ST_Transform(ST_Simplify(geom,' . self::DEFAULT_SIMPLIFY_VALUE . '),4326)) as geojson'
                    , 'ST_Area(geom) as area'
                    , 'ST_Perimeter(geom) as perimeter')
            )
        );
    }

    public function defaultScope() {
        return array(
            'select' => array('gid', '"waterType"', '"villageCode"', '"plantType"',
                '"price"', '"userId"', '"position"', '"numAdjacent"', '"usingType"', '"docStatus"',
                'ST_AsGeoJson(ST_Transform(geom,4326)) as geojson'
                , 'ST_Area(geom) as area'
                , 'ST_Perimeter(geom) as perimeter')
        );
    }

    public function simplifiedBy($value) {
        $criteria = new CDbCriteria();
        $criteria->select = array('ST_AsGeoJson(ST_Transform(ST_Simplify(geom,' . $value . '),4326)) as geojson'
            , 'ST_Area(geom) as area'
            , 'ST_Perimeter(geom) as perimeter');
        $this->getDbCriteria()->mergeWith($criteria);
        return $this;
    }

    public function byIntersectionWith($geoText) {
        $criteria = new CDbCriteria();
        $criteria->condition = "ST_Area(ST_intersection(ST_Transform(geom," . self::SRID_4326 . "),ST_GeomFromText('" . $geoText . "'," . self::SRID_4326 . ")))>0";
        $this->getDbCriteria()->mergeWith($criteria);
        return $this;
    }

    public function byUserId($userId) {
        $lordCodeCol = Yii::app()->db->quoteColumnName("userId");
        $criteria = new CDbCriteria;
        $criteria->select = '*,ST_AsGeoJson(geom) as geojson';
        $criteria->condition = " $lordCodeCol=:lc";
        $criteria->params = array(':lc' => $userId);

        $this->getDbCriteria()->mergeWith($criteria);
        return $this;
    }

    /**
     * @return array customized attribute labels (name=>label)
     */
    public function attributeLabels() {
        return array(
            'gid' => 'ID',
            'userId' => 'user id',
            'platCode' => 'Plat Code',
            'waterType' => 'Water Type',
            'plantType' => 'Plant Type',
            'sheetNO' => 'Sheet No',
            'price' => 'Price',
            'codeEvent' => 'Code Event',
        );
    }

    /**
     * 
     * keys of array are important
     */
    public function attrsForCreate() {
        return array(
            'userId' => 'user id',
            'waterType' => 'Water Type',
            'plantType' => 'Plant Type',
            'usingType' => 'using type',
            'numAdjacent' => 'number of adjacents',
            'price' => 'Price',
            'position' => 'موقعیت',
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

        $criteria->compare('ID', $this->ID);
        $criteria->compare('LordCode', $this->LordCode);
        $criteria->compare('PlatCode', $this->PlatCode, true);
        $criteria->compare('RegistrationNO', $this->RegistrationNO, true);
        $criteria->compare('AreaPlat', $this->AreaPlat);
        $criteria->compare('WithDocument', $this->WithDocument);
        $criteria->compare('WithoutDocument', $this->WithoutDocument);
        $criteria->compare('NasaghiAcre', $this->NasaghiAcre, true);
        $criteria->compare('HeaatiAcre', $this->HeaatiAcre, true);
        $criteria->compare('PublicSource', $this->PublicSource, true);
        $criteria->compare('VillageName', $this->VillageName, true);
        $criteria->compare('VillageCode', $this->VillageCode, true);
        $criteria->compare('WaterType', $this->WaterType, true);
        $criteria->compare('PlantType', $this->PlantType, true);
        $criteria->compare('X', $this->X, true);
        $criteria->compare('Y', $this->Y, true);
        $criteria->compare('SheetNO', $this->SheetNO, true);
        $criteria->compare('Price', $this->Price);
        $criteria->compare('CodeEvent', $this->CodeEvent);

        return new CActiveDataProvider($this, array(
            'criteria' => $criteria,
        ));
    }

    public function toFeature() {
        return array(
            'geometry' => $this->geojson,
            'properties' => array_merge(
                    $this->attributes, array('area' => $this->area, 'perimeter' => $this->perimeter)
            )
        );
    }

// 	private static function loadAllByLinkCode($linkCode){
// 		$lordCodeCol = Yii::app()->db->quoteColumnName("LordCode");
// 		$criteria = new CDbCriteria;
// 		$criteria->select = '*,ST_AsGeoJson(geom) as geojson';
// 		$criteria->condition = "$lordCodeCol=:lc";
// 		$criteria->params = array(':lc'=>$linkCode);
// 		$data = self::model()->findAll($criteria);
// 		return $data;
// 	}
    /**
     * 
     * @param number $userId
     * @param mixed(bool,float) $simplifyValue
     * @return type
     */
    private static function loadAsFeaturesByUserId($userId, $simplifyValue) {

        if ($simplifyValue === true) {
            $m = self::model()->simplified();
        } elseif (!empty($simplifyValue)) {
            $m = self::model()->simplifiedBy($simplifyValue);
        } else {
            $m = self::model();
        }
        $lands = $m->findAllByAttributes(array('userId' => $userId * 1));
        $res = array();
        if (count($lands) > 0) {
            foreach ($lands as $land) {
                $res[] = $land->toFeature();
            }
        }
        return $res;
    }

    /**
     * 
     * @param type $userId
     * @param mixed(boolean,float) $simplifyValue : get the simplified features or acurate features?
     * @return type
     */
    public static function loadAsGeoJsonByUserId($userId, $simplifyValue = false) {
        if ($simplifyValue === true) {
            foreach (self::$simplifyValues as $val) {
                /* @var $features FeatureArray, @see $this->toFeature() */
                $features = self::loadAsFeaturesByUserId($userId, $val);
                $hasEmptyCoord = self::hasEmptyCoordinates($features);
                if (!$hasEmptyCoord) { // it is good features
                    break;
                }
            }
        } else {
            $features = self::loadAsFeaturesByUserId($userId, $simplifyValue);
        }
        return Gis::makeGeoJson2($features);
    }

    /**
     * some of features simplified by ST_Simplify had empty coordinates []. so we decided to use this functions
     * @param FeatureArray $features
     */
    private static function hasEmptyCoordinates($features) {
        $hasEmptyCoord = false;
        foreach ($features as $f) {
            $geom = json_decode($f['geometry']);
            if (empty($geom->coordinates)) {
                $hasEmptyCoord = true;
                break;
            }
        }
        return $hasEmptyCoord;
    }

    /**
     * Returns the static model of the specified AR class.
     * Please note that you should have this exact method in all your CActiveRecord descendants!
     * @param string $className active record class name.
     * @return Land the static model class
     */
    public static function model($className = __CLASS__) {
        return parent::model($className);
    }

    /**
     * returns number of points of this land
     * @param type $id
     * @return null
     */
    public static function nPoints($id) {
        $dataReader = Yii::app()->db->createCommand()
                ->select('ST_NPoints(geom) as npoints')
                ->from(Land::model()->tableSchema->rawName)
                ->where('gid=:id', array(':id' => $id))
                ->queryRow();
        if (isset($dataReader['npoints']))
            return $dataReader['npoints'];
        else
            return null;
    }

}
