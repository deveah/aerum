"use strict";

var Entity = function( name )
{
	this.name = name;
	this.face = {};

	this.agility = 0;
	this.ap = 0;

	this.hp = 1;

	this.x = 0;
	this.y = 0;
	this.map = {};

	this.active = true;
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
		var e = entityAt( this.map, this.x+d.x, this.y+d.y );

		if( e == null )
		{
			this.x += d.x;
			this.y += d.y;
		}
		else
		{
			e.hp -= 1;
			
			if( e.hp <= 0 )
			{
				e.die();
			}
		}
	}
	else if( this.map.isLegal( this.x+d.x, this.y+d.y ) &&
		( this.map.tile[this.x+d.x][this.y+d.y] == tiletype.closedDoor ) )
	{
		this.map.tile[this.x+d.x][this.y+d.y] = tiletype.openDoor;
	}
};

Entity.prototype.die = function()
{
	this.active = false;
};

