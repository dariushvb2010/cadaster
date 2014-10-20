<?php

class Gis {

    /**
     * 
     * -----input--------
     *  array(
     *    0=>array('properties'=>... , 'geometry'=>geoJsonString )
     *    1=>array('properties'=>... , 'geometry'=>geoJsonString )
     *    ...
     *  )
     * @param array $features
     */
    public static function makeGeoJson($features) {
        foreach ($features as $f) {
            $properties = $f['properties'];
            $geom = $f['geometry'];
            if ($geom == null) {
                throw Exception('hey json');
            }
            //$geometry = array('geomery'=>$geom);

            $fstr = '{"type":"feature","properties":' . json_encode($properties) . ',"geometry":' . $geom . '},';
            $all.=$fstr;
        }
        $all = rtrim($all, ",");  // removes the last camma of the string

        $json = '{"type":"FeatureCollection","features":[' . $all . ']}';
        return $json;
    }

    public static function makeGeoJson2($features) {
        $main = self::makeGeoArray($features);
        return json_encode($main);
    }

    public static function makeGeoArray($features) {
        $main = array('type' => 'FeatureCollection');
        $all = array();
        foreach ($features as $f) {
            $properties = $f['properties'];
            $geom = $f['geometry'];
            $fnew = array('type' => 'feature');
            $fnew['properties'] = $properties;
            $fnew['geometry'] = json_decode($geom);
            $all[] = $fnew;
        }


        $main['features'] = $all;
        return $main;
    }

    
    

}
