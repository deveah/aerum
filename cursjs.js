"use strict";

var cursjs = cursjs || {};

cursjs.getMaxFontHeight = function( rows )
{
	var sizes = [ 8, 12, 18, 24, 36, 48, 72, 144 ];

	for( var i = sizes.length-1; i >= 0; i-- )
	{
		if( rows * sizes[i] < window.innerHeight )
		{
			return sizes[i];
		}
	}
};

cursjs.makeGlyph = function( glyph, font, fg, bg, width, height, deltaY )
{
	var buf = document.createElement( "canvas" );
	buf.width = width;
	buf.height = height;

	var ctx = buf.getContext( "2d" );
	ctx.font = font;
	
	ctx.fillStyle = bg;
	ctx.fillRect( 0, 0, width, height );

	ctx.fillStyle = fg;
	ctx.fillText( glyph, 0, height + deltaY );

	return buf;
};

cursjs.makeCharset = function( font, fg, bg, width, height, deltaY )
{
	var charset = {};

	/* a charset means characters 32(space) -> 126(~) (printable) */
	for( var i = 32; i < 127; i++ )
	{
		charset[i-32] = cursjs.makeGlyph( String.fromCharCode( i ), font, fg,
			bg, width, height, deltaY );
	}

	return charset;
};

cursjs.initCanvas = function( canvasId )
{
	var surface = {};

	surface.canvas = document.getElementById( canvasId );
	surface.context = surface.canvas.getContext( "2d" );

	return surface;
};

cursjs.setFont = function( surface, fontName, fontSize )
{
	surface.font = fontSize + "px " + fontName;

	surface.context.font = surface.font;
	surface.charWidth = surface.context.measureText( "#" ).width;
	surface.charHeight = fontSize;
};

cursjs.surfaceSize = function( surface, cols, rows )
{
	surface.cols = cols;
	surface.rows = rows;

	surface.canvas.width = cols * surface.charWidth;
	surface.canvas.height = rows * surface.charHeight;
	
	surface.emptyGlyph = cursjs.makeGlyph( " ", surface.font, "#ffffff",
		"#000000", surface.charWidth, surface.charHeight, 0 );
	
	surface.data = new Array( surface.cols );
	for( var i = 0; i < surface.cols; i++ )
	{
		surface.data[i] = new Array( surface.rows );
		for( var j = 0; j < surface.rows; j++ )
		{
			surface.data[i][j] =
			{
				glyph: surface.emptyGlyph,
				updated: false
			};
		}
	}
};

cursjs.populateCache = function( surface, colorscheme, deltaY )
{
	surface.charset = new Array( colorscheme.length );
	for( var i = 0; i < colorscheme.length; i++ )
	{
		surface.charset[i] = cursjs.makeCharset( surface.font,
			colorscheme[i].fg, colorscheme[i].bg, surface.charWidth,
			surface.charHeight, deltaY );
	}
};

cursjs.init = function( canvasId, fontName, fontSize, cols, rows, colorscheme )
{
	return surface;
};

cursjs.refresh = function( surface )
{
	for( var i = 0; i < surface.cols; i++ )
	{
		for( var j = 0; j < surface.rows; j++ )
		{
			if( surface.data[i][j].updated === false )
			{
				surface.context.drawImage( surface.data[i][j].glyph,
					i*surface.charWidth, j*surface.charHeight );
				surface.data[i][j].updated = true;
			}
		}
	}
};

cursjs.clear = function( surface )
{
	for( var i = 0; i < surface.cols; i++ )
	{
		for( var j = 0; j < surface.rows; j++ )
		{
			surface.data[i][j].glyph = surface.emptyGlyph;
			surface.data[i][j].updated = false;
		}
	}
};

cursjs.isVisible = function( surface, x, y )
{
	return(
		( x >= 0 ) &&
		( y >= 0 ) &&
		( x < surface.cols ) &&
		( y < surface.rows ) );
};

cursjs.write = function( surface, charsetId, x, y, text )
{
	var length = text.length;

	for( var i = 0; i < length; i++ )
	{
		if( cursjs.isVisible( surface, i+x, y ) )
		{
			surface.data[i+x][y].glyph = surface.charset[charsetId]
				[ text.charCodeAt( i ) - 32 ];
			surface.data[i+x][y].updated = false;
		}
	}
};

