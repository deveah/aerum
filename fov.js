"use strict";

/* TODO */

var fov = fov || {};

fov.doRay = function( m, x1, y1, x2, y2 )
{
	var cx = x1, cy = y1;
	var dx, dy, sx, sy;
	var err, e2;

	dx = Math.abs( x2-x1 );
	dy = Math.abs( y2-y1 );

	if( x1 < x2 ) sx = 1; else sx = -1;
	if( y1 < y2 ) sy = 1; else sy = -1;
	err = dx - dy;

	while( true )
	{
		if( ( cx == x2 ) && ( cy == y2 ) )
		{
			return true;
		}

		if( !m.isPassable( cx, cy ) )
		{
			return false;
		}

		e2 = 2 * err;

		if( e2 > -dy )
		{
			err -= dy;
			cx += sx;
		}

		if( e2 < dx )
		{
			err += dx;
			cy += sy;
		}
	}

	return true;
};

fov.doFov = function( e, rad )
{
	e.map.clearLight();

	for( var i = e.x-rad; i <= e.x+rad; i++ )
	{
		for( var j = e.y-rad; j <= e.y+rad; j++ )
		{
			if( e.map.isLegal( i, j ) &&
				( distance( e.x, e.y, i, j ) <= rad ) &&
				fov.doRay( e.map, e.x, e.y, i, j ) )
				e.map.light[i][j] = true;
		}
	}
};
