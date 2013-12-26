"use strict";

/*	TODO:
	* should only cache used tiles, such as pale aqua '~'s etc.,
		and not the whole charset
	* save whole charset only for text used in messages etc.
*/

var mainSurface;

var colorscheme =
[
	{ fg: "#ffffff", bg: "#000000" },	/* white */
	{ fg: "#666666", bg: "#000000" },	/* gray */
	{ fg: "#3b444b", bg: "#000000" },	/* reversed arsenic */
	{ fg: "#8DB600", bg: "#000000" },	/* apple green */
	{ fg: "#BCD4E6", bg: "#000000" },	/* pale aqua */
	{ fg: "#007BA7", bg: "#000000" }	/* cerulean */
];

var game = game || {};

function init()
{
	mainSurface = cursjs.initCanvas( "mainCanvas" );
	cursjs.setFont( mainSurface, "Consolas", cursjs.getMaxFontHeight( 30 ) );
	cursjs.surfaceSize( mainSurface, 80, 30 );
	cursjs.populateCache( mainSurface, colorscheme,
		-Math.floor( mainSurface.charHeight/5 ) );

	var m = new Map( 80, 25 );
	m.generate( 10000 );
	m.postProcess();

	cursjs.refresh( mainSurface );

	game.entityList = [];

	game.player = new Entity( "Player" );
	game.entityList.push( game.player );

	game.player.map = m;

	while( !game.player.map.isPassable( game.player.x, game.player.y ) )
	{
		game.player.x = rand( 1, game.player.map.width-1 );
		game.player.y = rand( 1, game.player.map.height-1 );
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
	cursjs.write( mainSurface, 1, 0, 0, "press: " + keycode );

	cursjs.refresh( mainSurface );

}

