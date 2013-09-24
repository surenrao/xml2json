# xml2json Usage and UseCases #
For my Google chrome extension [TV WatchList](https://chrome.google.com/webstore/detail/tv-watchlist/mkjcjbkackpifmmpmhjfojjindefnffk), I needed to save [TVRage](http://www.tvrage.com/)'s xml feed in indexedDB. Since it only takes json object, I decided to make a small library which can convert XML to json. Existing solutions did not work for me due various reasons. i.e. nodes with URL were giving me blank values, console.log would throw circular exceptions during debugging, and couple of other things i don't remember right now. This library is 100% JavaScript with no third party library dependency. 

**xml2json** is tested in chrome and firefox browser. For other browsers, if /test/index.html runs with all passed tests, then it will work there too ;)

### Sample XML - shows.xml ###

	<?xml version="1.0" encoding="UTF-8" ?>
	<Results>
	    <show>
	        <name>One Piece (JP)</name>
	        <link>http://www.tvrage.com/One_Piece_JP</link>
	        <country>JP</country>
	        <started>Oct/20/1999</started>
	        <ended></ended>
	        <genres><genre>Anime</genre><genre>Action</genre><genre>Adventure</genre><genre>Comedy</genre><genre>Fantasy</genre></genres>
	        <network country="JP">Fuji TV</network>
	        <akas><aka country="JP">&#12527;&#12531;&#12500;&#12540;&#12473;</aka></akas>
	    </show>
	    <show>
	        <name>One Piece (US)</name>
	        <link>http://www.tvrage.com/One_Piece_US</link>
	        <country>AJ</country>
	        <started>Sep/18/2004</started>
	        <ended>Mar/15/2008</ended>
	        <genres><genre>Anime</genre><genre>Children</genre></genres>
	        <network country="US">Cartoon Network</network>
	    </show>
	</Results>

### Usage: ###

    var x2jObj = null;
    $.get('shows.xml', function (xmlDocument) {
        x2jObj = X2J.parseXml(xmlDocument); //X2J.parseXml(xmlDocument, '/');         
        //x2jObj is called jNode   
        console.log('x2jObj populated', x2jObj);
        //...
    });

Above code will read and parse xml into X2J object or jNode. Note: here I am just using jquery to read xml. (You can use your favourite method/framework to read xml). Under chrome open console (press F12 key), You should be able to see the object after 'x2jObj populated'. expand it to see in full details. its usefull in debugging. In subsequent examples i will work on x2jObj object.

### UseCase: get value/attribute part 1 ###

    console.log('To get name "One Piece (US)"', x2jObj[0].Results[0].show[1].name[0].jValue);
    console.log('Get aka for country="JP"', x2jObj[0].Results[0].show[0].akas[0].aka[0].jValue);
    console.log('Get genre for Adventure', X2J.getValue(x2jObj[0].Results[0].show[0].genres[0].genre[2].jValue));

    console.log('Get country US attribute for network ', x2jObj[0].Results[0].show[1].network[0].jAttr["country"]);
### UseCase: get value/attribute part 2 ###

    console.log('To get name "One Piece (US)"', X2J.getValue(x2jObj[0].Results[0].show[1], 'name', 0, ''));
    console.log('Get aka for country="JP"', X2J.getValue(x2jObj[0].Results[0].show[0].akas[0], 'aka'));
    console.log('Get genre for Adventure', X2J.getValue(x2jObj[0].Results[0].show[0].genres[0], 'genre',2));

    console.log('Get country US attribute for network ', X2J.getAttr(x2jObj[0].Results[0].show[1].network[0], 'country'));
In part 2 getValue can be used when unsure of an element existance, so its a safe way to get value

### UseCase: convert xml to json ###

    console.log('X2J Object in json string:\n' + X2J.getJson(x2jObj));
You will notice, there are some extra fields(not part of original xml). Those are X2J meta data to preserve order, attributes, indexes etc

### UseCase: convert X2J object back to xml ###

    console.log('X2J Object to xml string:\n' + X2J.getXml(x2jObj));
This should recreate the xml exactly as the original(with order) except for whitespaces

### UseCase: print jNode to console ###

    X2J.printJNode(x2jObject[0], function (name, value, attr, level) {
        var strAttr = X2J.printJAttribute(attr);
        console.log(spaces(level), name, typeof value === 'string' ? value : '', strAttr ? ', ' + strAttr : '');
    });
    function spaces(no) {
            if (no === 0) {
                return '';
            }
            var space = ' ';
            for (var i = 0; i < no; i++) {
                space += ' ';
            }
            return space;
    }