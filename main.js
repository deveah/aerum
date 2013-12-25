"use strict";

var mainSurface;

var colorscheme =
[
	{ fg: "#ffffff", bg: "#000000" }	/* white */
];

function init()
{
	mainSurface = cursjs.initCanvas( "mainCanvas" );
	cursjs.setFont( mainSurface, "Consolas", cursjs.getMaxFontHeight( 30 ) );
	cursjs.surfaceSize( mainSurface, 80, 30 );
	cursjs.populateCache( mainSurface, colorscheme,
		-Math.floor( mainSurface.charHeight/5 ) );

	var m = map.new( 80, 25 );
	map.generate( m, 10000 );
	map.postProcess( m );
	ui.drawMap( m );

	var d = map.getDensity( m );
	cursjs.write( mainSurface, 0, 0, 25, "map density: " + d.toString() );

	cursjs.refresh( mainSurface );
}

function getInput( e )
{
	/* too lazy to support IE */
	var keycode = e.which;
}

