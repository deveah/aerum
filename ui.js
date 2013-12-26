"use strict";

var ui = ui || {};

ui.getTileFace = function( t )
{
	switch( t )
	{
	case tiletype.void:
		return " ";
	case tiletype.floor:
		return ".";
	case tiletype.wall:
		return "#";
	case tiletype.closedDoor:
		return "+";
	case tiletype.openDoor:
		return "/";
	case tiletype.pillar:
		return "#";
	case tiletype.grass:
		return ";";
	case tiletype.water:
		return "~";
	default:
		return "?";
	}
};

ui.getTileColor = function( t )
{
	switch( t )
	{
	case tiletype.void:
		return 0;
	case tiletype.floor:
		return 2;
	case tiletype.wall:
		return 2;
	case tiletype.closedDoor:
		return 2;
	case tiletype.openDoor:
		return 2;
	case tiletype.pillar:
		return 2;
	case tiletype.grass:
		return 3;
	case tiletype.water:
		if( rand( 1, 100 ) < 50 )
			return 4;
		else
			return 5;
	default:
		return 0;
	}
};

ui.drawMainScreen = function()
{
	var m = game.player.map;

	for( var i = 0; i < m.width; i++ )
	{
		for( var j = 0; j < m.height; j++ )
		{
			var t = m.tile[i][j];
			var c = 0;

			if( m.light[i][j] )
				c = ui.getTileColor( t );
			else
				c = 1;

			cursjs.write( mainSurface, c, i, j, ui.getTileFace( t ) );
		}
	}

	for( var i = 0; i < game.entityList.length; i++ )
	{
		var e = game.entityList[i];
		cursjs.write( mainSurface, 0, e.x, e.y, e.face );
	}
};

