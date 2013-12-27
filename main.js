"use strict";

/* TODO: some artifacts appear on the player's trail */

var mainSurface;

var colorscheme =
[
	{ fg: "#ffffff", bg: "#000000" },	/* white */
	{ fg: "#666666", bg: "#000000" }	/* gray */
];

var game = game || {};

function init()
{
	mainSurface = cursjs.initCanvas( "mainCanvas" );
	cursjs.setFont( mainSurface, "Consolas", cursjs.getMaxFontHeight( 30 ) );
	cursjs.surfaceSize( mainSurface, 80, 30 );
	cursjs.populateCache( mainSurface, colorscheme,
		-Math.floor( mainSurface.charHeight/5 ) );

	ui.initTiles();

	var m = new Map( 80, 25 );
	m.generate( 10000 );
	m.postProcess();

	cursjs.refresh( mainSurface );

	game.entityList = [];

	game.player = new Entity( "Player" );
	game.entityList.push( game.player );

	game.player.map = m;
	game.player.face = tileset.entity.player;

	while( !game.player.map.isPassable( game.player.x, game.player.y ) )
	{
		game.player.x = rand( 1, game.player.map.width-1 );
		game.player.y = rand( 1, game.player.map.height-1 );
	}

	for( var i = 0; i < 10; i++ )
	{
		var e;
		
		if( rand( 1, 100 ) < 50 )
		{
			e = new Entity( "Mutant Fly" );
			e.face = tileset.entity.mutantFly;
		}
		else
		{
			e = new Entity( "Sludge Worm" );
			e.face = tileset.entity.sludgeWorm;
		}

		e.map = m;

		while( !e.map.isPassable( e.x, e.y ) )
		{
			e.x = rand( 1, e.map.width-1 );
			e.y = rand( 1, e.map.height-1 );
		}

		game.entityList.push( e );
	}

	ui.drawMainScreen();
}

function getInput( e )
{
	/* too lazy to support IE */
	var keycode = e.which;

	if( keycode == 76 )
		game.player.move( { x:  1, y:  0 } ); 
	if( keycode == 72 )
		game.player.move( { x: -1, y:  0 } ); 
	if( keycode == 74 )
		game.player.move( { x:  0, y:  1 } ); 
	if( keycode == 75 )
		game.player.move( { x:  0, y: -1 } ); 
	
	ui.drawMainScreen();
}

