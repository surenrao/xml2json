var xmlSample = '<?xml version="1.0" encoding="UTF-8" ?>'+
        '<Results>'+
        '    <show>'+
        '        <name>One Piece (JP)</name>'+
        '        <link>http://www.tvrage.com/One_Piece_JP</link>'+
        '        <country>JP</country>'+
        '        <started>Oct/20/1999</started>'+
        '        <ended></ended>'+
        '        <genres><genre>Anime</genre><genre>Action</genre><genre>Adventure</genre><genre>Comedy</genre><genre>Fantasy</genre></genres>'+
        '        <network country="JP">Fuji TV</network>'+
        '        <akas><aka country="JP">&#12527;&#12531;&#12500;&#12540;&#12473;</aka></akas>'+
        '    </show>'+
        '    <show>'+
        '        <name>One Piece (US)</name>'+
        '        <link>http://www.tvrage.com/One_Piece_US</link>'+
        '        <country>AJ</country>'+
        '        <started>Sep/18/2004</started>'+
        '        <ended>Mar/15/2008</ended>'+
        '        <genres><genre>Anime</genre><genre>Children</genre></genres>'+
        '        <network country="US">Cartoon Network</network>'+
        '    </show>'+
        '</Results>';

test( "version test", function() {
  ok( X2J.VERSION == "1.1", "version is 1.1!" );
});
        
module( "parseXml" );

test( "default test", function() {    
    var x2jObjRoot = X2J.parseXml(xmlSample, '/');
    var x2jObjDefault = X2J.parseXml(xmlSample);
    var x2jObjEmpty = X2J.parseXml('');
    ok( x2jObjRoot, "returned root object!" );
    ok( x2jObjDefault, "returned default object!" );
    ok( !x2jObjEmpty, "returned empty!" );
    deepEqual( x2jObjRoot, x2jObjDefault ,'Root is equal to default' );
});

test( "testing sample default", function() {
    var x2jObj = X2J.parseXml(xmlSample);    
    ok( x2jObj, "returned object!" );    
    equal( x2jObj.length , 1, "default has one obj in array" );
    equal( x2jObj[0].jName, "#document", "default has #document as jName" );
    equal(x2jObj[0].Results[0].jIndex.length, 2, 'Results should have two elements');
    
    equal(x2jObj[0].Results[0].show[1].name[0].jValue,'One Piece (US)','To get name "One Piece (US)"');
    var div = document.createElement('div');
    div.innerHTML = '&#12527;&#12531;&#12500;&#12540;&#12473;';    
    equal(x2jObj[0].Results[0].show[0].akas[0].aka[0].jValue,div.firstChild.nodeValue,'Get aka for country="JP"');
    
    equal(x2jObj[0].Results[0].show[0].genres[0].genre[2].jValue,'Adventure','Get genre for Adventure');
    equal(x2jObj[0].Results[0].show[1].network[0].jAttr["country"],'US','Get country US attribute for network ');
});

test( "testing sample xpathExpression", function() {
    var x2jObj = X2J.parseXml(xmlSample, '/Results/show');
    //console.log(x2jObj);
    ok( x2jObj, "returned object!" );    
    ok( x2jObj.length == 2, "there are two show objects!" );
    ok( x2jObj[0].jIndex.length == 8 && x2jObj[1].jIndex.length == 7, "show element counts are ok" );
    equal(x2jObj[1].jName, 'show', 'is the 2nd x2jObj named show ?');
    equal(x2jObj[1].jIndex[1][0], 'link', 'is the 2nd element name under 2nd x2jObj = link?');
    equal(x2jObj[1].name[0].jValue,'One Piece (US)', 'Get 2nd show\'s name'); 
    equal(x2jObj[0].ended[0].jValue,'', 'ended: checking empty element');     
    
    var x2jObj2 = X2J.parseXml(xmlSample, '/Results/show/network');
    //console.log(x2jObj2);
    ok( x2jObj2, "returned object!" );    
    ok( x2jObj2.length == 2, "there are two network objects!" );
    equal(x2jObj2[1].jName, 'network', 'is the 2nd element name network?');
    equal(x2jObj2[1].jValue,'Cartoon Network', 'Get 2nd network\'s name');
    equal(x2jObj2[1].jAttr['country'],'US', 'Get 2nd network\'s name');
    equal(x2jObj2[1].jAttr.jIndex[0],'country', 'Get 2nd network\'s name');    
});

test( "test for TVWatchList", function() {    
    var naruto = document.getElementById("full_show_info-movie-14748").textContent;
    var x2jObj = X2J.parseXml(naruto,'/Show');
    equal( x2jObj.length , 1, "there is only 1 show element" );
    var x2jShow = x2jObj[0];
    console.log(x2jShow);    
    ok( x2jShow, "returned x2jShow!" );    
    equal(x2jShow.jName,'Show', 'Testing first element\'s jName');
    equal(x2jShow.image[0].jValue,'http://images.tvrage.com/shows/15/14748.jpg', 'Testing url inside element');
    equal(x2jShow.ended[0].jValue,'', 'checking empty element');    
    equal(x2jShow.network[0].jAttr["country"],'JP','Testing attribute for element with text jValue');
    equal(x2jShow.network[0].jValue,'TV Tokyo','Testing text for element with attribute');
    
    var expected_element = 'name totalseasons showid showlink started ended image origin_country status classification genres runtime network airtime airday timezone akas Episodelist'.split(' ');
    var actual_element = []
    for(var i=0;i<x2jShow.jIndex.length;i++)
        actual_element.push(x2jShow.jIndex[i][0]);
        
    deepEqual(actual_element,expected_element,'Testing element order');
    
    var expected_element_value = 'Anime Action Adventure Comedy Drama Fantasy Mystery'.split(' ');
    var actual_element_value = []
    for(var i=0;i<x2jShow.genres[0].jIndex.length;i++)
        actual_element_value.push( x2jShow.genres[0].genre[x2jShow.genres[0].jIndex[i][1]].jValue);
        
    deepEqual(actual_element_value,expected_element_value,'Testing element value order. genre');
    
    var expected_attr = 'country attr attr country'.split(' '); 
    var actual_attr = [];
    for(var i=0;i<x2jShow.akas[0].aka[0].jAttr.jIndex.length;i++)
        actual_attr.push(x2jShow.akas[0].aka[0].jAttr.jIndex[i]);
    
    for(var i=0;i<x2jShow.akas[0].aka[1].jAttr.jIndex.length;i++)
        actual_attr.push(x2jShow.akas[0].aka[1].jAttr.jIndex[i]);
    
    deepEqual(actual_attr,expected_attr,'Testing attribute order');   

    equal(x2jShow.Episodelist[0].Season[1].jAttr['no'],'2','2nd Season number');
    equal(x2jShow.Episodelist[0].Movie[0].episode.length,6,'Movie episodes');
    equal(x2jShow.Episodelist[0].Special[0].episode.length,3,'Special episodes');
});

//raises(function() { _.reduceRight([], function(){}); }, TypeError, 'throws an error for empty arrays with no initial value');

module( "getValue" );

test( "default test", function() {        
    var x2jObjSample = X2J.parseXml(xmlSample);    
    
    equal(X2J.getValue(x2jObjSample[0].Results[0].show[1], 'name', 0, ''),'One Piece (US)', 'To get name "One Piece (US)"');
    var div = document.createElement('div');
    div.innerHTML = '&#12527;&#12531;&#12500;&#12540;&#12473;';    
    equal(X2J.getValue(x2jObjSample[0].Results[0].show[0].akas[0], 'aka'),div.firstChild.nodeValue, 'Get aka for country="JP"');
    equal(X2J.getValue(x2jObjSample[0].Results[0].show[0].genres[0], 'genre',2),'Adventure', 'Get genre for Adventure');

});

module( "getAttr" );
module( "getXml" );
module( "getJson" );
