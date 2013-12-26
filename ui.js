"use strict";

var ui = ui || {};

ui.drawMainScreen = function()
{
	var m = game.player.map;

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

			cursjs.write( mainSurface, 1, i, j, c );
		}
	}

	for( var i = 0; i < game.entityList.length; i++ )
	{
		var e = game.entityList[i];
		cursjs.write( mainSurface, 0, e.x, e.y, e.face );
	}
};

