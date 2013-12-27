"use strict";

var ui = ui || {};

var tileset = {};

ui.initTiles = function()
{
	tileset.void = mainSurface.emptyGlyph;

	tileset.lit = {};

	tileset.lit.wall = cursjs.makeGlyph( "#", mainSurface.font, "#a29260",
		"#000000", mainSurface.charWidth, mainSurface.charHeight, -5 );
	tileset.lit.floor = cursjs.makeGlyph( ".", mainSurface.font, "#867e36",
		"#000000", mainSurface.charWidth, mainSurface.charHeight, -5 );
	tileset.lit.openDoor = cursjs.makeGlyph( "/", mainSurface.font, "#fada5e",
		"#000000", mainSurface.charWidth, mainSurface.charHeight, -5 );
	tileset.lit.closedDoor = cursjs.makeGlyph( "+", mainSurface.font, "#fada5e",
		"#000000", mainSurface.charWidth, mainSurface.charHeight, -5 );
	tileset.lit.pillar = cursjs.makeGlyph( "#", mainSurface.font, "#fada5e",
		"#000000", mainSurface.charWidth, mainSurface.charHeight, -5 );
	tileset.lit.grass = cursjs.makeGlyph( ";", mainSurface.font, "#8db600",
		"#001000", mainSurface.charWidth, mainSurface.charHeight, -5 );
	tileset.lit.waterA = cursjs.makeGlyph( "~", mainSurface.font, "#007ba7",
		"#000017", mainSurface.charWidth, mainSurface.charHeight, -5 );
	tileset.lit.waterB = cursjs.makeGlyph( "~", mainSurface.font, "#436b95",
		"#000017", mainSurface.charWidth, mainSurface.charHeight, -5 );
	
	tileset.dark = {};

	var darkColor = "#333333";

	tileset.dark.wall = cursjs.makeGlyph( "#", mainSurface.font, darkColor,
		"#000000", mainSurface.charWidth, mainSurface.charHeight, -5 );
	tileset.dark.floor = cursjs.makeGlyph( ".", mainSurface.font, darkColor,
		"#000000", mainSurface.charWidth, mainSurface.charHeight, -5 );
	tileset.dark.closedDoor = cursjs.makeGlyph( "+", mainSurface.font, darkColor,
		"#000000", mainSurface.charWidth, mainSurface.charHeight, -5 );
	tileset.dark.openDoor = cursjs.makeGlyph( "/", mainSurface.font, darkColor,
		"#000000", mainSurface.charWidth, mainSurface.charHeight, -5 );
	tileset.dark.pillar = cursjs.makeGlyph( "#", mainSurface.font, darkColor,
		"#000000", mainSurface.charWidth, mainSurface.charHeight, -5 );
	tileset.dark.grass = cursjs.makeGlyph( ";", mainSurface.font, darkColor,
		"#000000", mainSurface.charWidth, mainSurface.charHeight, -5 );
	tileset.dark.water = cursjs.makeGlyph( "~", mainSurface.font, darkColor,
		"#000000", mainSurface.charWidth, mainSurface.charHeight, -5 );

	tileset.entity = {};

	tileset.entity.player = cursjs.makeGlyph( "@", mainSurface.font, "#ffffff",
		"#000000", mainSurface.charWidth, mainSurface.charHeight, -5 );
};

ui.getTileImage = function( t, l )
{
	if( l )
	{
		switch( t )
		{
		case tiletype.void:
			return tileset.void;
		case tiletype.wall:
			return tileset.lit.wall;
		case tiletype.floor:
			return tileset.lit.floor;
		case tiletype.openDoor:
			return tileset.lit.openDoor;
		case tiletype.closedDoor:
			return tileset.lit.closedDoor;
		case tiletype.pillar:
			return tileset.lit.pillar;
		case tiletype.grass:
			return tileset.lit.grass;
		case tiletype.water:
			if( rand( 1, 100 ) < 50 )
				return tileset.lit.waterA;
			else
				return tileset.lit.waterB;
		default:
			return tileset.void;
		}
	}
	else
	{
		switch( t )
		{
		case tiletype.void:
			return tileset.void;
		case tiletype.wall:
			return tileset.dark.wall;
		case tiletype.floor:
			return tileset.dark.floor;
		case tiletype.openDoor:
			return tileset.dark.openDoor;
		case tiletype.closedDoor:
			return tileset.dark.closedDoor;
		case tiletype.pillar:
			return tileset.dark.pillar;
		case tiletype.grass:
			return tileset.dark.grass;
		case tiletype.water:
			return tileset.dark.water;
		default:
			return tileset.void;
		}
	}
};

ui.drawMainScreen = function()
{
	var m = game.player.map;

	fov.doFov( game.player, 10 );

	for( var i = 0; i < m.width; i++ )
	{
		for( var j = 0; j < m.height; j++ )
		{
			var t = mainSurface.emptyGlyph;

			t = ui.getTileImage( m.tile[i][j], m.light[i][j] );

			cursjs.putchar( mainSurface, i, j, t );
		}
	}

	for( var i = 0; i < game.entityList.length; i++ )
	{
		var e = game.entityList[i];
		cursjs.putchar( mainSurface, e.x, e.y, tileset.entity.player );
	}

	cursjs.refresh( mainSurface );
};

