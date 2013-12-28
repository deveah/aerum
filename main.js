"use strict";

/* TODO: some artifacts appear on the player's trail */

var mainSurface;

var colorscheme =
[
	{ fg: "#ffffff", bg: "#000000" },	/* white */
	{ fg: "#666666", bg: "#000000" }	/* gray */
];

var game = game || {};

var expect = [];

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

	/*	TODO: asynchronous input scheme - how to request for a response?
		ex. fire in which direction? */

	var res = 0; /* response to an awaited keystroke */

	if( expect.length > 0 )
	{
		for( var i = 0; i < expect.length; i++ )
		{
			if( expect[i] == keycode )
			{
				expect = [];
				res = keycode;
				break;
			}
		}
		/* ignore any other input */
		if( res == 0 )
			return;
	}

	for( var i = 0; i < game.entityList.length; i++ )
	{
		var e = game.entityList[i];

		if( e == game.player )
		{
			switch( keycode )
			{
			case 76:
				e.move( { x:  1, y:  0 } );
				break;
			case 72:
				e.move( { x: -1, y:  0 } ); 
				break;
			case 74:
				e.move( { x:  0, y:  1 } );
				break;
			case 75:
				e.move( { x:  0, y: -1 } );
				break;
			case 70: /* f - fire */
				expect = [ 76, 72, 74, 75 ]; /* expect hjkl - fire direction */
				if( res != 0 )
				{
					console.log( "firing at " + res );
					res = 0;
				}
				break;
			default:
				console.log( "unknown keypress: " + keycode.toString() );
			}
		}
		else
		{
			if( e.active )
			{
				/* TODO ai */
			}
		}
	}
	
	ui.drawMainScreen();
}

