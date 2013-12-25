"use strict";

function rand( min, max )
{
	return( Math.floor( Math.random() * ( max-min+1 ) ) ) + min;
}

function distance( x1, y1, x2, y2 )
{
	return( Math.floor( Math.sqrt( (x1-x2)*(x1-x2) + (y1-y2)*(y1-y2) ) ) );
}

