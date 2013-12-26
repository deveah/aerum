"use strict";

var Entity = function( name )
{
	this.name = name;
	this.face = "z";

	this.agility = 0;
	this.ap = 0;

	this.x = 0;
	this.y = 0;
	this.map = {};
};

Entity.prototype.act = function()
{
	this.ap += this.agility;

	while( this.ap > 0 )
	{
		/* TODO something */
		this.ap -= 10;
	}
};

Entity.prototype.move = function( d )
{
	if( this.map.isPassable( this.x+d.x, this.y+d.y ) )
	{
		this.x += d.x;
		this.y += d.y;
	}
	else if( this.map.isLegal( this.x+d.x, this.y+d.y ) &&
		( this.map.tile[this.x+d.x][this.y+d.y] == tiletype.closedDoor ) )
	{
		this.map.tile[this.x+d.x][this.y+d.y] = tiletype.openDoor;
	}
};

