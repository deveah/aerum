"use strict";

var tiletype =
{
	void:		0,
	floor:		1,
	wall:		2,
	openDoor:	3,
	closedDoor:	4,
	pillar:		5,
	grass:		6,
	water:		7
};

var Map = function( width, height )
{
	this.width = width;
	this.height = height;

	this.tile = new Array( width );
	this.light = new Array( width );
	for( var i = 0; i < width; i++ )
	{
		this.tile[i] = new Array( height );
		this.light[i] = new Array( height );
		for( var j = 0; j < height; j++ )
		{
			this.tile[i][j] = tiletype.void;
			this.light[i][j] = true;
		}
	}
};

Map.prototype.clearLight = function()
{
	for( var i = 0; i < this.width; i++ )
	{
		for( var j = 0; j < this.height; j++ )
		{
			this.light[i][j] = false;
		}
	}
};

Map.prototype.isLegal = function( x, y )
{
	return(
		( x >= 0 ) &&
		( y >= 0 ) &&
		( x < this.width ) &&
		( y < this.height )
	);
};

Map.prototype.isFree = function( x, y, w, h )
{
	for( var i = x-1; i <= x+w+1; i++ )
	{
		for( var j = y-1; j <= y+h+1; j++ )
		{
			if( this.isLegal( i, j ) )
			{
				if( this.tile[i][j] != tiletype.void )
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

Map.prototype.isPassable = function( x, y )
{
	return(
		this.isLegal( x, y ) &&
		(	( this.tile[x][y] == tiletype.floor ) ||
			( this.tile[x][y] == tiletype.openDoor ) ||
			( this.tile[x][y] == tiletype.grass ) ||
			( this.tile[x][y] == tiletype.water ) ) );
};

Map.prototype.makeRoom = function( x, y, w, h )
{
	for( var i = x-1; i <= x+w+1; i++ )
	{
		for( var j = y-1; j <= y+h+1; j++ )
		{
			if( this.isLegal( i, j ) )
			{
				if( ( i == x-1 ) || ( j == y-1 ) ||
					( i == x+w+1 ) || ( j == y+h+1 ) )
				{
					this.tile[i][j] = tiletype.wall;
				}
				else
				{
					this.tile[i][j] = tiletype.floor;
				}
			}
		}
	}
};

Map.prototype.makeLink = function( x1, y1, x2, y2 )
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
		if( this.isLegal( cx, cy ) )
		{
			this.tile[cx][cy] = tiletype.floor;
		}
		else
		{
			return;
		}
	
		cx += sx;
	}

	while( cy != y2 )
	{
		if( this.isLegal( cx, cy ) )
		{
			this.tile[cx][cy] = tiletype.floor;
		}
		else
		{
			return;
		}
	
		cy += sy;
	}
};

Map.prototype.countDoors = function( x, y, w, h )
{
	var n = 0;
	
	for( var i = x-1; i <= x+w+1; i++ )
	{
		for( var j = y-1; j <= y+h+1; j++ )
		{
			if( this.isLegal( i, j ) )
			{
				if( ( i == x-1 ) || ( j == y-1 ) ||
					( i == x+w+1 ) || ( j == y+h+1 ) )
				{
					if( this.tile[i][j] == tiletype.floor )
						n++;
				}
			}
		}
	}

	return n;
};

Map.prototype.placeDoors = function( x, y, w, h )
{
	for( var i = x-1; i <= x+w+1; i++ )
	{
		for( var j = y-1; j <= y+h+1; j++ )
		{
			if( this.isLegal( i, j ) )
			{
				if( ( i == x-1 ) || ( j == y-1 ) ||
					( i == x+w+1 ) || ( j == y+h+1 ) )
				{
					if( this.tile[i][j] == tiletype.floor )
					{
						this.tile[i][j] = tiletype.closedDoor;
					}
				}
			}
		}
	}
};

Map.prototype.generate = function( nrooms )
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

			rx = rand( 1, this.width-1 );
			ry = rand( 1, this.height-1 );
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
		while(	( !this.isLegal( rx+rw+1, ry+rh+1 ) ) ||
				( !this.isFree( rx, ry, rw, rh ) ) ||
				( d > 20 ) );

		if( tries > 1000 )
			break;
		
		this.makeRoom( rx, ry, rw, rh );

		actualRooms++;

		if( i > 0 )
		{
			this.makeLink( cx, cy, rx + Math.floor( rw/2 ),
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
		if( this.countDoors( rooms[i].x, rooms[i].y, rooms[i].w, rooms[i].h ) < 3 )
		{
			this.placeDoors( rooms[i].x, rooms[i].y, rooms[i].w, rooms[i].h );
		}
	}
};

Map.prototype.countNeighbours = function( x, y, w )
{
	var n = 0;

	for( var i = x-1; i <= x+1; i++ )
	{
		for( var j = y-1; j <= y+1; j++ )
		{
			if( this.isLegal( i, j ) && ( this.tile[i][j] == w ) )
			{
				n++;
			}
		}
	}

	return n;
};

Map.prototype.postProcess = function()
{
	for( var i = 0; i < this.width; i++ )
	{
		for( var j = 0; j < this.height; j++ )
		{
			if( ( this.tile[i][j] == tiletype.void ) &&
				( this.countNeighbours( i, j, tiletype.floor ) > 0 ) )
			{
				this.tile[i][j] = tiletype.wall;
			}
		}
	}

	/* 5% chance of spawning grass */
	for( var i = 0; i < this.width; i++ )
	{
		for( var j = 0; j < this.height; j++ )
		{
			if( ( this.tile[i][j] == tiletype.floor ) &&
				( rand( 1, 100 ) < 5 ) )
			{
				this.tile[i][j] = tiletype.grass;
			}
		}
	}

	/* 10x 10% chance of extending grass patches */
	for( var k = 0; k < 10; k++ )
	{
		for( var i = 0; i < this.width; i++ )
		{
			for( var j = 0; j < this.height; j++ )
			{
				if( ( this.tile[i][j] == tiletype.floor ) &&
					( this.countNeighbours( i, j, tiletype.grass ) > 0 ) &&
					( rand( 1, 100 ) < 10 ) )
				{
					this.tile[i][j] = tiletype.grass;
				}
			}
		}
	}
	
	/* 5% chance of spawning water */
	for( var i = 0; i < this.width; i++ )
	{
		for( var j = 0; j < this.height; j++ )
		{
			if( ( this.tile[i][j] == tiletype.floor ) &&
				( rand( 1, 100 ) < 5 ) )
			{
				this.tile[i][j] = tiletype.water;
			}
		}
	}

	/* 10x 10% chance of extending water patches */
	for( var k = 0; k < 10; k++ )
	{
		for( var i = 0; i < this.width; i++ )
		{
			for( var j = 0; j < this.height; j++ )
			{
				if( ( this.tile[i][j] == tiletype.floor ) &&
					( this.countNeighbours( i, j, tiletype.water ) > 0 ) &&
					( rand( 1, 100 ) < 10 ) )
				{
					this.tile[i][j] = tiletype.water;
				}
			}
		}
	}
};

Map.prototype.getDensity = function()
{
	var n = 0;

	for( var i = 0; i < this.width; i++ )
	{
		for( var j = 0; j < this.height; j++ )
		{
			if( this.tile[i][j] == tiletype.floor )
				n++;
		}
	}

	return( n / ( this.width * this.height ) );
};

