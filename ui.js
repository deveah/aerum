"use strict";

var ui = ui || {};

ui.drawMap = function( m )
{
	for( var i = 0; i < m.width; i++ )
	{
		for( var j = 0; j < m.height; j++ )
		{
			var c = " ";

			if( m.tile[i][j] == tiletype.void )
				c = " ";
			if( m.tile[i][j] == tiletype.floor )
				c = ".";
			if( m.tile[i][j] == tiletype.wall )
				c = "#";
			if( m.tile[i][j] == tiletype.door )
				c = "+";
			if( m.tile[i][j] == tiletype.pillar )
				c = "%";

			cursjs.write( mainSurface, 0, i, j, c );
		}
	}
};

