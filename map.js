"use strict";

var map = map || {};

var tiletype =
{
	void:	0,
	floor:	1,
	wall:	2,
	door:	3,
	pillar:	4
};

map.new = function( width, height )
{
	var m = {};
	
	m.width = width;
	m.height = height;

	m.tile = new Array( width );
	for( var i = 0; i < width; i++ )
	{
		m.tile[i] = new Array( height );
		for( var j = 0; j < height; j++ )
		{
			m.tile[i][j] = tiletype.void;
		}
	}

	return m;
};

map.isLegal = function( m, x, y )
{
	return(
		( x >= 0 ) &&
		( y >= 0 ) &&
		( x < m.width ) &&
		( y < m.height )
	);
};

map.isFree = function( m, x, y, w, h )
{
	for( var i = x-1; i <= x+w+1; i++ )
	{
		for( var j = y-1; j <= y+h+1; j++ )
		{
			if( map.isLegal( m, i, j ) )
			{
				if( m.tile[i][j] != tiletype.void )
				{
					return false;
				}
			}
			else
			{
				return false;
			}
		}
	}

	return true;
};

map.makeRoom = function( m, x, y, w, h )
{
	for( var i = x-1; i <= x+w+1; i++ )
	{
		for( var j = y-1; j <= y+h+1; j++ )
		{
			if( map.isLegal( m, i, j ) )
			{
				if( ( i == x-1 ) || ( j == y-1 ) ||
					( i == x+w+1 ) || ( j == y+h+1 ) )
				{
					m.tile[i][j] = tiletype.wall;
				}
				else
				{
					m.tile[i][j] = tiletype.floor;
				}
			}
		}
	}
};

map.makeLink = function( m, x1, y1, x2, y2 )
{
	var cx = x1, cy = y1;
	var sx = 0, sy = 0;

	if( x2 > x1 )
		sx = 1;
	else
		sx = -1;
	
	if( y2 > y1 )
		sy = 1;
	else
		sy = -1;

	while( cx != x2 )
	{
		if( map.isLegal( m, cx, cy ) )
		{
			m.tile[cx][cy] = tiletype.floor;
		}
		else
		{
			return;
		}
	
		cx += sx;
	}

	while( cy != y2 )
	{
		if( map.isLegal( m, cx, cy ) )
		{
			m.tile[cx][cy] = tiletype.floor;
		}
		else
		{
			return;
		}
	
		cy += sy;
	}
};

map.countDoors = function( m, x, y, w, h )
{
	var n = 0;
	
	for( var i = x-1; i <= x+w+1; i++ )
	{
		for( var j = y-1; j <= y+h+1; j++ )
		{
			if( map.isLegal( m, i, j ) )
			{
				if( ( i == x-1 ) || ( j == y-1 ) ||
					( i == x+w+1 ) || ( j == y+h+1 ) )
				{
					if( m.tile[i][j] == tiletype.floor )
						n++;
				}
			}
		}
	}

	return n;
};

map.placeDoors = function( m, x, y, w, h )
{
	for( var i = x-1; i <= x+w+1; i++ )
	{
		for( var j = y-1; j <= y+h+1; j++ )
		{
			if( map.isLegal( m, i, j ) )
			{
				if( ( i == x-1 ) || ( j == y-1 ) ||
					( i == x+w+1 ) || ( j == y+h+1 ) )
				{
					if( m.tile[i][j] == tiletype.floor )
					{
						m.tile[i][j] = tiletype.door;
					}
				}
			}
		}
	}
};

map.generate = function( m, nrooms )
{
	var rx = 0, ry = 0, rw = 0, rh = 0;
	var cx = 0, cy = 0;
	var d = 0;
	var tries = 0;
	var actualRooms = 0;

	var rooms = new Array( nrooms );

	for( var i = 0; i < nrooms; i++ )
	{
		do
		{
			tries++;
			if( tries > 1000 )
				break;

			rx = rand( 1, m.width-1 );
			ry = rand( 1, m.height-1 );
			rw = rand( 3, 6 );
			rh = rand( 3, 6 );

			if( i == 0 )
			{
				d = 0;
			}
			else
			{
				d = distance( rx, ry, rooms[i-1].x, rooms[i-1].y );
			}
		}
		while(	( !map.isLegal( m, rx+rw+1, ry+rh+1 ) ) ||
				( !map.isFree( m, rx, ry, rw, rh ) ) ||
				( d > 20 ) );

		if( tries > 1000 )
			break;
		
		map.makeRoom( m, rx, ry, rw, rh );

		actualRooms++;

		if( i > 0 )
		{
			map.makeLink( m, cx, cy, rx + Math.floor( rw/2 ),
				ry + Math.floor( rh/2 ) );
		}

		rooms[i] = {};
		rooms[i].x = rx;
		rooms[i].y = ry;
		rooms[i].w = rw;
		rooms[i].h = rh;

		cx = Math.floor( ( rx*2 + rw ) / 2 );
		cy = Math.floor( ( ry*2 + rh ) / 2 );
	}

	for( var i = 0; i < actualRooms; i++ )
	{
		if( map.countDoors( m, rooms[i].x, rooms[i].y, rooms[i].w, rooms[i].h ) < 3 )
		{
			map.placeDoors( m, rooms[i].x, rooms[i].y, rooms[i].w, rooms[i].h );
		}
	}
};

map.countNeighbours = function( m, x, y, w )
{
	var n = 0;

	for( var i = x-1; i <= x+1; i++ )
	{
		for( var j = y-1; j <= y+1; j++ )
		{
			if( map.isLegal( m, i, j ) && ( m.tile[i][j] == w ) )
			{
				n++;
			}
		}
	}

	return n;
};

map.postProcess = function( m )
{
	for( var i = 0; i < m.width; i++ )
	{
		for( var j = 0; j < m.height; j++ )
		{
			if( ( m.tile[i][j] == tiletype.void ) &&
				( map.countNeighbours( m, i, j, tiletype.floor ) > 0 ) )
			{
				m.tile[i][j] = tiletype.wall;
			}
		}
	}
	
	for( var i = 0; i < m.width; i++ )
	{
		for( var j = 0; j < m.height; j++ )
		{
			if( ( map.countNeighbours( m, i, j, tiletype.floor ) == 9 ) &&
				( rand( 0, 100 ) < 5 ) )
			{
				m.tile[i][j] = tiletype.pillar;
			}
		}
	}
};

map.getDensity = function( m )
{
	var n = 0;

	for( var i = 0; i < m.width; i++ )
	{
		for( var j = 0; j < m.height; j++ )
		{
			if( m.tile[i][j] == tiletype.floor )
				n++;
		}
	}

	return( n / ( m.width * m.height ) );
};

