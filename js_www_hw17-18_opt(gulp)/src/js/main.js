/*!
 * jQuery Color Animations v@VERSION
 * https://github.com/jquery/jquery-color
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * Date: @DATE
 */

(function( root, factory ) {
	if ( typeof define === "function" && define.amd) {

		// AMD. Register as an anonymous module.
		define( [ "jquery" ], factory);
	} else if ( typeof exports === "object" ) {
		module.exports = factory( require( "jquery" ) );
	} else {
		factory( root.jQuery );
	}
})( this, function( jQuery, undefined ) {

	var stepHooks = "backgroundColor borderBottomColor borderLeftColor borderRightColor borderTopColor color columnRuleColor outlineColor textDecorationColor textEmphasisColor",

	// plusequals test for += 100 -= 100
	rplusequals = /^([\-+])=\s*(\d+\.?\d*)/,
	// a set of RE's that can match strings and generate color tuples.
	stringParsers = [{
			re: /rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*(?:,\s*(\d?(?:\.\d+)?)\s*)?\)/,
			parse: function( execResult ) {
				return [
					execResult[ 1 ],
					execResult[ 2 ],
					execResult[ 3 ],
					execResult[ 4 ]
				];
			}
		}, {
			re: /rgba?\(\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*(?:,\s*(\d?(?:\.\d+)?)\s*)?\)/,
			parse: function( execResult ) {
				return [
					execResult[ 1 ] * 2.55,
					execResult[ 2 ] * 2.55,
					execResult[ 3 ] * 2.55,
					execResult[ 4 ]
				];
			}
		}, {
			// this regex ignores A-F because it's compared against an already lowercased string
			re: /#([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})/,
			parse: function( execResult ) {
				return [
					parseInt( execResult[ 1 ], 16 ),
					parseInt( execResult[ 2 ], 16 ),
					parseInt( execResult[ 3 ], 16 )
				];
			}
		}, {
			// this regex ignores A-F because it's compared against an already lowercased string
			re: /#([a-f0-9])([a-f0-9])([a-f0-9])/,
			parse: function( execResult ) {
				return [
					parseInt( execResult[ 1 ] + execResult[ 1 ], 16 ),
					parseInt( execResult[ 2 ] + execResult[ 2 ], 16 ),
					parseInt( execResult[ 3 ] + execResult[ 3 ], 16 )
				];
			}
		}, {
			re: /hsla?\(\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*(?:,\s*(\d?(?:\.\d+)?)\s*)?\)/,
			space: "hsla",
			parse: function( execResult ) {
				return [
					execResult[ 1 ],
					execResult[ 2 ] / 100,
					execResult[ 3 ] / 100,
					execResult[ 4 ]
				];
			}
		}],

	// jQuery.Color( )
	color = jQuery.Color = function( color, green, blue, alpha ) {
		return new jQuery.Color.fn.parse( color, green, blue, alpha );
	},
	spaces = {
		rgba: {
			props: {
				red: {
					idx: 0,
					type: "byte"
				},
				green: {
					idx: 1,
					type: "byte"
				},
				blue: {
					idx: 2,
					type: "byte"
				}
			}
		},

		hsla: {
			props: {
				hue: {
					idx: 0,
					type: "degrees"
				},
				saturation: {
					idx: 1,
					type: "percent"
				},
				lightness: {
					idx: 2,
					type: "percent"
				}
			}
		}
	},
	propTypes = {
		"byte": {
			floor: true,
			max: 255
		},
		"percent": {
			max: 1
		},
		"degrees": {
			mod: 360,
			floor: true
		}
	},
	support = color.support = {},

	// element for support tests
	supportElem = jQuery( "<p>" )[ 0 ],

	// colors = jQuery.Color.names
	colors,

	// local aliases of functions called often
	each = jQuery.each;

// determine rgba support immediately
supportElem.style.cssText = "background-color:rgba(1,1,1,.5)";
support.rgba = supportElem.style.backgroundColor.indexOf( "rgba" ) > -1;

// define cache name and alpha properties
// for rgba and hsla spaces
each( spaces, function( spaceName, space ) {
	space.cache = "_" + spaceName;
	space.props.alpha = {
		idx: 3,
		type: "percent",
		def: 1
	};
});

function clamp( value, prop, allowEmpty ) {
	var type = propTypes[ prop.type ] || {};

	if ( value == null ) {
		return (allowEmpty || !prop.def) ? null : prop.def;
	}

	// ~~ is an short way of doing floor for positive numbers
	value = type.floor ? ~~value : parseFloat( value );

	// IE will pass in empty strings as value for alpha,
	// which will hit this case
	if ( isNaN( value ) ) {
		return prop.def;
	}

	if ( type.mod ) {
		// we add mod before modding to make sure that negatives values
		// get converted properly: -10 -> 350
		return (value + type.mod) % type.mod;
	}

	// for now all property types without mod have min and max
	return 0 > value ? 0 : type.max < value ? type.max : value;
}

function stringParse( string ) {
	var inst = color(),
		rgba = inst._rgba = [];

	string = string.toLowerCase();

	each( stringParsers, function( i, parser ) {
		var parsed,
			match = parser.re.exec( string ),
			values = match && parser.parse( match ),
			spaceName = parser.space || "rgba";

		if ( values ) {
			parsed = inst[ spaceName ]( values );

			// if this was an rgba parse the assignment might happen twice
			// oh well....
			inst[ spaces[ spaceName ].cache ] = parsed[ spaces[ spaceName ].cache ];
			rgba = inst._rgba = parsed._rgba;

			// exit each( stringParsers ) here because we matched
			return false;
		}
	});

	// Found a stringParser that handled it
	if ( rgba.length ) {

		// if this came from a parsed string, force "transparent" when alpha is 0
		// chrome, (and maybe others) return "transparent" as rgba(0,0,0,0)
		if ( rgba.join() === "0,0,0,0" ) {
			jQuery.extend( rgba, colors.transparent );
		}
		return inst;
	}

	// named colors
	return colors[ string ];
}

color.fn = jQuery.extend( color.prototype, {
	parse: function( red, green, blue, alpha ) {
		if ( red === undefined ) {
			this._rgba = [ null, null, null, null ];
			return this;
		}
		if ( red.jquery || red.nodeType ) {
			red = jQuery( red ).css( green );
			green = undefined;
		}

		var inst = this,
			type = jQuery.type( red ),
			rgba = this._rgba = [];

		// more than 1 argument specified - assume ( red, green, blue, alpha )
		if ( green !== undefined ) {
			red = [ red, green, blue, alpha ];
			type = "array";
		}

		if ( type === "string" ) {
			return this.parse( stringParse( red ) || colors._default );
		}

		if ( type === "array" ) {
			each( spaces.rgba.props, function( key, prop ) {
				rgba[ prop.idx ] = clamp( red[ prop.idx ], prop );
			});
			return this;
		}

		if ( type === "object" ) {
			if ( red instanceof color ) {
				each( spaces, function( spaceName, space ) {
					if ( red[ space.cache ] ) {
						inst[ space.cache ] = red[ space.cache ].slice();
					}
				});
			} else {
				each( spaces, function( spaceName, space ) {
					var cache = space.cache;
					each( space.props, function( key, prop ) {

						// if the cache doesn't exist, and we know how to convert
						if ( !inst[ cache ] && space.to ) {

							// if the value was null, we don't need to copy it
							// if the key was alpha, we don't need to copy it either
							if ( key === "alpha" || red[ key ] == null ) {
								return;
							}
							inst[ cache ] = space.to( inst._rgba );
						}

						// this is the only case where we allow nulls for ALL properties.
						// call clamp with alwaysAllowEmpty
						inst[ cache ][ prop.idx ] = clamp( red[ key ], prop, true );
					});

					// everything defined but alpha?
					if ( inst[ cache ] && jQuery.inArray( null, inst[ cache ].slice( 0, 3 ) ) < 0 ) {
						// use the default of 1
						inst[ cache ][ 3 ] = 1;
						if ( space.from ) {
							inst._rgba = space.from( inst[ cache ] );
						}
					}
				});
			}
			return this;
		}
	},
	is: function( compare ) {
		var is = color( compare ),
			same = true,
			inst = this;

		each( spaces, function( _, space ) {
			var localCache,
				isCache = is[ space.cache ];
			if (isCache) {
				localCache = inst[ space.cache ] || space.to && space.to( inst._rgba ) || [];
				each( space.props, function( _, prop ) {
					if ( isCache[ prop.idx ] != null ) {
						same = ( isCache[ prop.idx ] === localCache[ prop.idx ] );
						return same;
					}
				});
			}
			return same;
		});
		return same;
	},
	_space: function() {
		var used = [],
			inst = this;
		each( spaces, function( spaceName, space ) {
			if ( inst[ space.cache ] ) {
				used.push( spaceName );
			}
		});
		return used.pop();
	},
	transition: function( other, distance ) {
		var end = color( other ),
			spaceName = end._space(),
			space = spaces[ spaceName ],
			startColor = this.alpha() === 0 ? color( "transparent" ) : this,
			start = startColor[ space.cache ] || space.to( startColor._rgba ),
			result = start.slice();

		end = end[ space.cache ];
		each( space.props, function( key, prop ) {
			var index = prop.idx,
				startValue = start[ index ],
				endValue = end[ index ],
				type = propTypes[ prop.type ] || {};

			// if null, don't override start value
			if ( endValue === null ) {
				return;
			}
			// if null - use end
			if ( startValue === null ) {
				result[ index ] = endValue;
			} else {
				if ( type.mod ) {
					if ( endValue - startValue > type.mod / 2 ) {
						startValue += type.mod;
					} else if ( startValue - endValue > type.mod / 2 ) {
						startValue -= type.mod;
					}
				}
				result[ index ] = clamp( ( endValue - startValue ) * distance + startValue, prop );
			}
		});
		return this[ spaceName ]( result );
	},
	blend: function( opaque ) {
		// if we are already opaque - return ourself
		if ( this._rgba[ 3 ] === 1 ) {
			return this;
		}

		var rgb = this._rgba.slice(),
			a = rgb.pop(),
			blend = color( opaque )._rgba;

		return color( jQuery.map( rgb, function( v, i ) {
			return ( 1 - a ) * blend[ i ] + a * v;
		}));
	},
	toRgbaString: function() {
		var prefix = "rgba(",
			rgba = jQuery.map( this._rgba, function( v, i ) {
				return v == null ? ( i > 2 ? 1 : 0 ) : v;
			});

		if ( rgba[ 3 ] === 1 ) {
			rgba.pop();
			prefix = "rgb(";
		}

		return prefix + rgba.join() + ")";
	},
	toHslaString: function() {
		var prefix = "hsla(",
			hsla = jQuery.map( this.hsla(), function( v, i ) {
				if ( v == null ) {
					v = i > 2 ? 1 : 0;
				}

				// catch 1 and 2
				if ( i && i < 3 ) {
					v = Math.round( v * 100 ) + "%";
				}
				return v;
			});

		if ( hsla[ 3 ] === 1 ) {
			hsla.pop();
			prefix = "hsl(";
		}
		return prefix + hsla.join() + ")";
	},
	toHexString: function( includeAlpha ) {
		var rgba = this._rgba.slice(),
			alpha = rgba.pop();

		if ( includeAlpha ) {
			rgba.push( ~~( alpha * 255 ) );
		}

		return "#" + jQuery.map( rgba, function( v ) {

			// default to 0 when nulls exist
			v = ( v || 0 ).toString( 16 );
			return v.length === 1 ? "0" + v : v;
		}).join("");
	},
	toString: function() {
		return this._rgba[ 3 ] === 0 ? "transparent" : this.toRgbaString();
	}
});
color.fn.parse.prototype = color.fn;

// hsla conversions adapted from:
// https://code.google.com/p/maashaack/source/browse/packages/graphics/trunk/src/graphics/colors/HUE2RGB.as?r=5021

function hue2rgb( p, q, h ) {
	h = ( h + 1 ) % 1;
	if ( h * 6 < 1 ) {
		return p + (q - p) * h * 6;
	}
	if ( h * 2 < 1) {
		return q;
	}
	if ( h * 3 < 2 ) {
		return p + (q - p) * ((2/3) - h) * 6;
	}
	return p;
}

spaces.hsla.to = function ( rgba ) {
	if ( rgba[ 0 ] == null || rgba[ 1 ] == null || rgba[ 2 ] == null ) {
		return [ null, null, null, rgba[ 3 ] ];
	}
	var r = rgba[ 0 ] / 255,
		g = rgba[ 1 ] / 255,
		b = rgba[ 2 ] / 255,
		a = rgba[ 3 ],
		max = Math.max( r, g, b ),
		min = Math.min( r, g, b ),
		diff = max - min,
		add = max + min,
		l = add * 0.5,
		h, s;

	if ( min === max ) {
		h = 0;
	} else if ( r === max ) {
		h = ( 60 * ( g - b ) / diff ) + 360;
	} else if ( g === max ) {
		h = ( 60 * ( b - r ) / diff ) + 120;
	} else {
		h = ( 60 * ( r - g ) / diff ) + 240;
	}

	// chroma (diff) == 0 means greyscale which, by definition, saturation = 0%
	// otherwise, saturation is based on the ratio of chroma (diff) to lightness (add)
	if ( diff === 0 ) {
		s = 0;
	} else if ( l <= 0.5 ) {
		s = diff / add;
	} else {
		s = diff / ( 2 - add );
	}
	return [ Math.round(h) % 360, s, l, a == null ? 1 : a ];
};

spaces.hsla.from = function ( hsla ) {
	if ( hsla[ 0 ] == null || hsla[ 1 ] == null || hsla[ 2 ] == null ) {
		return [ null, null, null, hsla[ 3 ] ];
	}
	var h = hsla[ 0 ] / 360,
		s = hsla[ 1 ],
		l = hsla[ 2 ],
		a = hsla[ 3 ],
		q = l <= 0.5 ? l * ( 1 + s ) : l + s - l * s,
		p = 2 * l - q;

	return [
		Math.round( hue2rgb( p, q, h + ( 1 / 3 ) ) * 255 ),
		Math.round( hue2rgb( p, q, h ) * 255 ),
		Math.round( hue2rgb( p, q, h - ( 1 / 3 ) ) * 255 ),
		a
	];
};


each( spaces, function( spaceName, space ) {
	var props = space.props,
		cache = space.cache,
		to = space.to,
		from = space.from;

	// makes rgba() and hsla()
	color.fn[ spaceName ] = function( value ) {

		// generate a cache for this space if it doesn't exist
		if ( to && !this[ cache ] ) {
			this[ cache ] = to( this._rgba );
		}
		if ( value === undefined ) {
			return this[ cache ].slice();
		}

		var ret,
			type = jQuery.type( value ),
			arr = ( type === "array" || type === "object" ) ? value : arguments,
			local = this[ cache ].slice();

		each( props, function( key, prop ) {
			var val = arr[ type === "object" ? key : prop.idx ];
			if ( val == null ) {
				val = local[ prop.idx ];
			}
			local[ prop.idx ] = clamp( val, prop );
		});

		if ( from ) {
			ret = color( from( local ) );
			ret[ cache ] = local;
			return ret;
		} else {
			return color( local );
		}
	};

	// makes red() green() blue() alpha() hue() saturation() lightness()
	each( props, function( key, prop ) {
		// alpha is included in more than one space
		if ( color.fn[ key ] ) {
			return;
		}
		color.fn[ key ] = function( value ) {
			var vtype = jQuery.type( value ),
				fn = ( key === "alpha" ? ( this._hsla ? "hsla" : "rgba" ) : spaceName ),
				local = this[ fn ](),
				cur = local[ prop.idx ],
				match;

			if ( vtype === "undefined" ) {
				return cur;
			}

			if ( vtype === "function" ) {
				value = value.call( this, cur );
				vtype = jQuery.type( value );
			}
			if ( value == null && prop.empty ) {
				return this;
			}
			if ( vtype === "string" ) {
				match = rplusequals.exec( value );
				if ( match ) {
					value = cur + parseFloat( match[ 2 ] ) * ( match[ 1 ] === "+" ? 1 : -1 );
				}
			}
			local[ prop.idx ] = value;
			return this[ fn ]( local );
		};
	});
});

// add cssHook and .fx.step function for each named hook.
// accept a space separated string of properties
color.hook = function( hook ) {
	var hooks = hook.split( " " );
	each( hooks, function( i, hook ) {
		jQuery.cssHooks[ hook ] = {
			set: function( elem, value ) {
				var parsed, curElem,
					backgroundColor = "";

				if ( value !== "transparent" && ( jQuery.type( value ) !== "string" || ( parsed = stringParse( value ) ) ) ) {
					value = color( parsed || value );
					if ( !support.rgba && value._rgba[ 3 ] !== 1 ) {
						curElem = hook === "backgroundColor" ? elem.parentNode : elem;
						while (
							(backgroundColor === "" || backgroundColor === "transparent") &&
							curElem && curElem.style
						) {
							try {
								backgroundColor = jQuery.css( curElem, "backgroundColor" );
								curElem = curElem.parentNode;
							} catch ( e ) {
							}
						}

						value = value.blend( backgroundColor && backgroundColor !== "transparent" ?
							backgroundColor :
							"_default" );
					}

					value = value.toRgbaString();
				}
				try {
					elem.style[ hook ] = value;
				} catch( e ) {
					// wrapped to prevent IE from throwing errors on "invalid" values like 'auto' or 'inherit'
				}
			}
		};
		jQuery.fx.step[ hook ] = function( fx ) {
			if ( !fx.colorInit ) {
				fx.start = color( fx.elem, hook );
				fx.end = color( fx.end );
				fx.colorInit = true;
			}
			jQuery.cssHooks[ hook ].set( fx.elem, fx.start.transition( fx.end, fx.pos ) );
		};
	});

};

color.hook( stepHooks );

jQuery.cssHooks.borderColor = {
	expand: function( value ) {
		var expanded = {};

		each( [ "Top", "Right", "Bottom", "Left" ], function( i, part ) {
			expanded[ "border" + part + "Color" ] = value;
		});
		return expanded;
	}
};

// Basic color names only.
// Usage of any of the other color names requires adding yourself or including
// jquery.color.svg-names.js.
colors = jQuery.Color.names = {
	// 4.1. Basic color keywords
	aqua: "#00ffff",
	black: "#000000",
	blue: "#0000ff",
	fuchsia: "#ff00ff",
	gray: "#808080",
	green: "#008000",
	lime: "#00ff00",
	maroon: "#800000",
	navy: "#000080",
	olive: "#808000",
	purple: "#800080",
	red: "#ff0000",
	silver: "#c0c0c0",
	teal: "#008080",
	white: "#ffffff",
	yellow: "#ffff00",

	// 4.2.3. "transparent" color keyword
	transparent: [ null, null, null, 0 ],

	_default: "#ffffff"
};

});

/*
HeapBox 0.9.4
(c) 2013 Filip Bartos
*/

;(function ( $, window, document, undefined ) {

    var pluginName = "heapbox",
        defaults = {
	    effect: {
		  "type": "slide",
		  "speed": "slow"
        },
        insert: "before",
		heapsize: undefined,
        emptyMessage: 'Empty',
        tabindex: 'undefined',
        title: undefined,
        showFirst: true,
        inheritVisibility: true,
	    openStart: function(){},
	    openComplete: function(){},
	    closeStart: function(){},
	    closeComplete: function(){},
	    onChange: function(){}
        };

    function Plugin( element, options ) {

	    /* Settings */
	    this.element = element;
        this.options = $.extend( {}, defaults, options );
        this._defaults = defaults;
        this._name = pluginName;
	    this.instance;
	    this.callbackManager = new Array();
		this.elem_isVisible = '';
        this.init();
    }

    Plugin.prototype = {

    /*
	 * Heapbox init
	*/
    init: function() {
		this._hideSourceElement();
    	this._isSourceSelectbox();
		this.instance = this.createInstance();
		this._createElements();
		this._setDefaultValues();
	},

	/*
    *  Generate new ID for selectbox
	*/
	createInstance: function() {

         return {
	          heapId: $(this.element).attr('id') || Math.round(Math.random() * 99999999),
		      state: false
		 };
	 },

	/*
	 * Set events
	*/
	_setEvents: function() {
		var self = this;
		this._setControlsEvents();

		$(document).on("click", "html", function(e){ e.stopPropagation();self._closeheap(true,function(){},function(){});});
	},

	_setSliderEvents: function() {

	    var self = this;
	    this.scrollingStatus = false;

	    heap = $("#heapbox_"+this.instance.heapId+" .heap");

	 	// Slider Down
	    heap.find(".sliderDown").click(function(e){e.preventDefault();e.stopPropagation();self._setHeapboxFocus();});

	    heap.find(".sliderDown").mousedown(function(e){
		   self.scrollingStatus = true;
		   self._keyArrowHandler($("#heapbox_"+self.instance.heapId),"down");
		   self.interval = setInterval(function(){self._keyArrowHandler($("#heapbox_"+self.instance.heapId),"down");},300);
	    }).mouseup(function(e){
	    	clearInterval(self.interval);
		    self.scrollingStatus = false;
	    }).mouseout(function(e){
	    	clearInterval(self.interval);
		    self.scrollingStatus = false;
	    });

		// Slider Up
	    heap.find(".sliderUp").click(function(e){e.preventDefault();e.stopPropagation();self._setHeapboxFocus();});

	    heap.find(".sliderUp").mousedown(function(e){
		   self.scrollingStatus = true;
		   self._keyArrowHandler($("#heapbox_"+self.instance.heapId),"up");
		   self.interval = setInterval(function(){self._keyArrowHandler($("#heapbox_"+self.instance.heapId),"up");},300);
	    }).mouseup(function(e){
			clearInterval(self.interval);
		    self.scrollingStatus = false;
	    }).mouseout(function(e){
	    	clearInterval(self.interval);
		    self.scrollingStatus = false;
	    });

	},

	_setViewPosition: function(heapbox) {

		heap = $("div#heapbox_"+this.instance.heapId+" .heap");
		heap.show();
		var self = this;
		selected = heapbox.find(".heapOptions li a.selected");
		firstTop = heapbox.find(".heapOptions li a").first().offset().top;
		actTop = $(selected).offset().top;
		newTop = firstTop - actTop + this.sliderUpHeight;
		heapHeight = $("div#heapbox_"+this.instance.heapId+" .heapOptions").height();
		maxPosition = heapHeight-parseInt(this.options.heapsize,10)+this.sliderDownHeight;
		minPosition = 0+this.sliderUpHeight;

		if((-1*newTop) > maxPosition) newTop = -1*(maxPosition);
		heapbox.find(".heapOptions").css("top",newTop);

		if(!this.instance.state) heap.hide();
	},

	_setKeyboardEvents: function() {

		var self = this;

		heapbox = $("#heapbox_"+this.instance.heapId);

		heapbox.keydown(function(e) {

			switch(e.which)
			{
				case 13: self._handlerClicked();
						 return false;
						 break;
				case 27: self._closeheap();
						 break;
				case 37: self._keyArrowHandler($("#heapbox_"+self.instance.heapId),"up");
						 e.preventDefault();
						 break;
				case 39: self._keyArrowHandler($("#heapbox_"+self.instance.heapId),"down");
						 e.preventDefault();
						 break;
				case 38: self._keyArrowHandler($("#heapbox_"+self.instance.heapId),"up");
						 e.preventDefault();
						 break;
				case 40: self._keyArrowHandler($("#heapbox_"+self.instance.heapId),"down");
					     e.preventDefault();
						 break;
			}
		});

	},

	/*
	 *	Adds mouse wheel events
	 *	@require	jquery-mousewheel
	 *	@see 		https://github.com/brandonaaron/jquery-mousewheel
	 */
	_setMouseWheelEvents:function() {

		var self = this,
			heapBoxEl = $("div#heapbox_"+this.instance.heapId+" .handler"),
			heap = heapBoxEl.find('div.heap');

		heapBoxEl.on('mousewheel',function(event,delta){

			event.preventDefault();
			if ( delta == -1 ) {
				heap.find(".sliderDown")
					.mousedown()
					.mouseup();
			} else {
				heap.find(".sliderUp")
					.mousedown()
					.mouseup();
			}

		});
	},

	_keyArrowHandler:function(heapboxEl,direction){
		var self = this;
		var selected = false;

		heapboxEl.find("div.heap ul li").each(function(){
			if(($(this).find("a").hasClass("selected")))
			{
				selected = true;

				selectItem = direction == "down" ? self._findNext($(this)):self._findPrev($(this));

				if(selectItem) {
					self._heapChanged(self,selectItem,true);
					return false;
				}
			}
		});

		if(selected == false) {
			selectItem = $("div#heapbox_"+self.instance.heapId+" .heapOptions .heapOption").first().find("a").addClass("selected");
			self._heapChanged(self,selectItem,true);
		}

		self._setViewPosition($("#heapbox_"+self.instance.heapId));
	},

	/*
	 *	Adds mouse wheel events
	 *	@require	jquery-mousewheel
	 *	@see 		https://github.com/brandonaaron/jquery-mousewheel
	 */
	_setMouseWheelEvents: function() {
		var self = this,
			heapBoxEl = $("div#heapbox_"+this.instance.heapId),
			heap = heapBoxEl.find('div.heap');

		heapBoxEl.on('mousewheel',function(event,delta){
			event.preventDefault();
			if ( delta == -1 ) {
				heap.find(".sliderDown")
					.mousedown()
					.mouseup();
			} else {
				heap.find(".sliderUp")
					.mousedown()
					.mouseup();
			}

		});
	},

	/*
	 * Find prev selectable heapbox option (ignore disabled)
	 */
	_findPrev:function(startItem){
		if(startItem.prev().length > 0){
			if(!startItem.prev().find("a").hasClass("disabled")) {
				return startItem.prev().find("a");
			}else{
				return this._findPrev(startItem.prev());
			}
		}
	},

	/*
	 * Find next selectable heapbox option (ignore disabled)
	 */
	_findNext:function(startItem){
		if(startItem.next().length > 0){
			if(!startItem.next().find("a").hasClass("disabled")) {
				return startItem.next().find("a");
			}else{
				return this._findNext(startItem.next());
			}
		}
	},
	/*
	 * Create heapbox html structure
	*/
    _createElements: function() {

		var self = this;
		heapBoxEl = $('<div/>', {
			id: 'heapbox_'+this.instance.heapId,
			'class': 'heapBox',
			data: {'sourceElement':this.element}
		});

		// Set visibility according to original <select> element
		if ( self.options.inheritVisibility == true && self.elem_isVisible == false ) {
			heapBoxEl.css('display','none');
		}

		heapBoxHolderEl = $('<a/>', {
	       	href: '',
			'class': 'holder'
		});

		heapBoxHandlerEl = $('<a/>', {
	       	href: '',
			'class': 'handler'
		});

		heapBoxheapEl = $('<div/>', {
			'class': 'heap'
		});

		heapBoxEl.append(heapBoxHolderEl);
		heapBoxEl.append(heapBoxHandlerEl);

		heapBoxEl.append(heapBoxheapEl);
		this.heapBoxEl = heapBoxEl;
		this._insertHeapbox(this.heapBoxEl);

    },

	/*
	 * Insert heapbox
	*/
    _insertHeapbox: function(heapbox) {

    if(this.isSourceElementSelect && this.options.insert == "inside")
    	this.options.insert = "before";

	switch(this.options.insert) {

		  case "before":
			$(this.element).before(heapbox);
			break;
		  case "after":
			$(this.element).after(heapbox);
			break;
		  case "inside":
			$(this.element).html(heapbox);
			this._showSourceElement();
			break;
		  default:
			$(this.element).before(heapbox);
			break;
		}
    },

    /*
     * Fill heapbox with init data
     */
    _setDefaultValues: function()
    {
		this._initHeap();

		this._initView(heapBoxEl);
		this._setHolderTitle();
		this._setTabindex();
		this._setEvents();
		this._handleFirst();
    },

    _setHeapboxFocus: function()
    {
    	heapbox = $("div#heapbox_"+this.instance.heapId+" .handler");
    	heapbox.focus();
    },

    _setHeapSize: function() {
		if(this.options.heapsize) {
			if(heapBoxheapEl.height() < parseInt(this.options.heapsize,10)) {
				delete this.options.heapsize;
				return;
			} else {
				heapBoxheapEl.css("height",this.options.heapsize);
			}
		}

    },

    /*
     * Fill heapbox with init data
     */
     _initHeap: function(){

     	var initData;

     	if(this.isSourceElementSelect){
     		initData = this._optionsToJson();
     		this._setData(initData);
     	}
    },

    /*
     * Init view with right position
     */
     _initView: function(heapbox){

		if(this._isHeapEmpty()){
			return;
		}else{
			this._setViewPosition(heapbox);
		}
    },

    /*
     * Show or hide first option?
     */
     _handleFirst: function(){

     	if(!this.options.showFirst){
     		$("div#heapbox_"+this.instance.heapId+" .heapOptions .heapOption").first().remove();
     	}
    },

    /*
     * Set title of holder
     */
    _setHolderTitle: function()
    {
    	var self = this;

		holderEl = $("#heapbox_"+this.instance.heapId).find(".holder");
		selectedEl = $("#heapbox_"+this.instance.heapId).find(".heap ul li a.selected").last();

    	if(selectedEl.length != 0)
    	{
    		if(this.options.title){
    			holderEl.text(this.options.title);
    		}else{
    			holderEl.text(selectedEl.text());
    		}

    		holderEl.attr("rel",selectedEl.attr("rel"));

    		if(selectedEl.attr("data-icon-src")) {
				iconEl = this._createIconElement(selectedEl.attr("data-icon-src"));
				holderEl.append(iconEl);
			}
    	}
    	else
    	{
    		holderEl.text(this.options.emptyMessage);
    		this._removeHeapboxHolderEvents();
    		this._removeHeapboxHandlerEvents();
    	}
    },

    /*
     * Set tabindex to heapbox element
     */
    _setTabindex: function(){
    	var tabindex;

		tabindex = this.options.tabindex != "undefined" ? this.options.tabindex : $(this.element).attr("tabindex");

		if(tabindex != "undefined") {
			$("#heapbox_"+this.instance.heapId).attr("tabindex",tabindex);
		}
    },

    /*
     * Set data to heap
     */
    _setData: function(data)
    {
    	var self = this;
		var _data = jQuery.parseJSON(data);
		var selected = false;


		// No need to refresh the Select box
		// if(this.isSourceElementSelect) this._refreshSourceSelectbox(_data);

		heapBoxheapOptionsEl = $('<ul/>', {
			'class': 'heapOptions'
		});

    	$.each(_data,function(){

    		if(this.selected) { selected = true; }
    		heapBoxOptionLiEl = $('<li/>', {
				'class': 'heapOption'
			});

			heapBoxheapOptionAEl = $('<a/>', {
				href: '',
				rel: this.value,
				title: this.text,
				text: this.text,
				'class': this.selected ? 'selected':'',
				 click: function(e){
			   	    e.preventDefault();
			        e.stopPropagation();
				    self._heapChanged(self,this);
				}
			});

			if(this.disabled) {
				heapBoxheapOptionAEl.unbind("click");
				heapBoxheapOptionAEl.addClass("disabled");
				heapBoxheapOptionAEl.click(function(e){
					e.preventDefault();
					e.stopPropagation();
				});
			}

			if(this.icon)
			{
				heapBoxheapOptionAEl.attr('data-icon-src',this.icon);
				heapBoxOptionIcon = self._createIconElement(this.icon);

				heapBoxheapOptionAEl.append(heapBoxOptionIcon);
			}

			heapBoxOptionLiEl.append(heapBoxheapOptionAEl);
			heapBoxheapOptionsEl.append(heapBoxOptionLiEl);
		});

		$("div#heapbox_"+this.instance.heapId+" .heap ul").remove();
		$("div#heapbox_"+this.instance.heapId+" .heap").append(heapBoxheapOptionsEl);



		this._setHeapSize();

		if(this._isHeapsizeSet()) {
			this._createSliderUpElement();
			this._createSliderDownElement();
		}

		if(selected != true){
			$("div#heapbox_"+this.instance.heapId+" .heap ul li a").first().addClass("selected");
		}

    },

   /*
     * Create sliderUp element
     */
    _createSliderUpElement: function() {

		slideUp = $('<a/>', {
				'class': 'sliderUp',
				'href': ''
		});

		$("div#heapbox_"+this.instance.heapId+" .heap .heapOptions").before(slideUp);

		sliderUp = $("#heapbox_"+this.instance.heapId+" .sliderUp");
	    this.sliderUpHeight = parseInt(sliderUp.css("height"),10)+parseInt(sliderUp.css("border-top-width"),10)+parseInt(sliderUp.css("border-bottom-width"),10);

	    $("#heapbox_"+this.instance.heapId+" .heapOptions").css("top",this.sliderUpHeight);

    },

    /*
     * Create sliderDown element
     */
    _createSliderDownElement: function() {

		slideDown = $('<a/>', {
				'class': 'sliderDown',
				'href': ''
		});

		$("div#heapbox_"+this.instance.heapId+" .heap .heapOptions").after(slideDown);

	    sliderDown = $("#heapbox_"+this.instance.heapId+" .sliderDown");
	    this.sliderDownHeight = parseInt(sliderDown.css("height"),10)+parseInt(sliderDown.css("border-top-width"))+parseInt(sliderDown.css("border-bottom-width"));
    },

    /*
     * Creat img element for icon
     */
    _createIconElement: function(iconSrc) {

		heapBoxOptionIcon = $('<img/>', {
			src: iconSrc,
			alt: iconSrc
		});

		return heapBoxOptionIcon;
    },

    /*
     * If source element is <select>, get options as json
     */

    _optionsToJson: function(){

    	var options = [];

    	$(this.element).find("option").each(function(){

    		options.push({
    			'value'		: $(this).attr("value"),
    			'text'		: $(this).text(),
    			'icon'		: $(this).attr("data-icon-src"),
    			'disabled'	: $(this).attr("disabled"),
    			'selected'	: $(this).is(":selected") ? "selected":''
    		});

    	});

    	var jsonText = JSON.stringify(options);

    	return jsonText;
    },

    /*
     * Get actual heapbox state as json
     */
    _heapboxToJson: function() {
		var options = [];

		$("div#heapbox_"+this.instance.heapId+" .heap ul li a").each(function(){

			options.push({
    			'value': $(this).attr("rel"),
    			'text': $(this).text(),
    			'selected': $(this).is(":selected") ? "selected":''
    		});
		});

		var jsonText = JSON.stringify(options);
    	return jsonText;
    },
	/*
	 * Check if heap is empty
	*/
	_isHeapEmpty: function() {
		var length = $("div#heapbox_"+this.instance.heapId+" .heap ul li").length;

		return length == 0;
	},

	/*
	 * Set events for heapbox controls
	*/
	_setControlsEvents: function() {

		if(!this._isHeapEmpty())
		{
			this._setHeapboxHolderEvents();
			this._setHeapboxHandlerEvents();
			this._setKeyboardEvents();
			this._setSliderEvents();

			// Mouse Wheel events
			if ( typeof( $.event.special.mousewheel ) == 'object' ) {
				this._setMouseWheelEvents();
			}
		}
	},
	/*
	 * Check if source element is selectbox
	 */
	_isSourceSelectbox: function() {
		this.isSourceElementSelect = $(this.element).is("select");
	},

	/*
	 * Check if user defined heap size
	 */
	_isHeapsizeSet: function() {
		return this.options.heapsize ? true : false;
	},

	/*
	 * Refresh source selectbox
	 */
	_refreshSourceSelectbox: function(data) {
		var self = this;
		var selected = false;

		$(this.element).find("option").remove();

		$.each(data,function(){

			option = $('<option/>',{
              value: this.value,
			  text: this.text,
			});

			if(this.selected){
				option.attr("selected","selected");
				selected = true;
			}

			$(self.element).append(option);
		});

		if(selected != true) $(self.element).find("option").first().attr("selected","selected");
	},

	/*
	 * Change selected option
	 */
	_setSelectedOption: function(value) {
		var self = this;
		this._deselectSelectedOptions();

		$(this.element).val(value);
		$(this.element).find("option[value='"+value+"']").attr("selected","selected");

	},

	/*
	 * Remove selected attribute from all options in source selectbox
	 */
	_deselectSelectedOptions: function() {
		select = $(this.element).find("option");

		select.each(function(){
			$(this).removeAttr("selected");
		});
	},

	/*
	 * Set events to heapbox holder control
	*/
	_setHeapboxHolderEvents: function() {

		var self = this;
		heapBoxEl = $("div#heapbox_"+this.instance.heapId);

		heapBoxEl.find(".holder").click(function(e){
			e.preventDefault();
			e.stopPropagation();
			self._setHeapboxFocus();
			self._handlerClicked();
		});
	},

	/*
	 * Set events to heapbox handler control
	*/
	_setHeapboxHandlerEvents: function() {

		var self = this;
		heapBoxEl = $("div#heapbox_"+this.instance.heapId);

		heapBoxEl.find(".handler").click(function(e){
			e.preventDefault();
			e.stopPropagation();
			//$(this).focus();
			self._setHeapboxFocus();
			self._handlerClicked();
		});
	},

	/*
	 * Remove events from heapbox holder control
	*/
	_removeHeapboxHolderEvents: function() {

		var self = this;
		heapBoxEl = $("div#heapbox_"+this.instance.heapId);

		heapBoxEl.find(".holder").unbind('click');
		heapBoxEl.find(".holder").click(function(e){e.preventDefault();})
		heapBoxEl.unbind("keydown");

	},

	/*
	 * Remove events from heapbox handler control
	*/
	_removeHeapboxHandlerEvents: function() {

		var self = this;
		heapBoxEl = $("div#heapbox_"+this.instance.heapId);

		heapBoxEl.find(".handler").unbind('click');
		heapBoxEl.find(".handler").click(function(e){e.preventDefault();})
	},

	/*
	 * Selectbox open-close handler
	*/
	_handlerClicked: function(stageReady) {

		if(this.instance.state)
		{
	       this._closeheap();
		}
		else
		{
		  if(!stageReady)
		  	this._closeOthers();
		  else this._openheap();
		}
	},

	/*
	 * Selectbox change handler
	*/
	_heapChanged: function(self,clickedEl,keepOpened) {

		if(!keepOpened) this._closeheap(true,function(){},function(){});
		this._setSelected($(clickedEl));
		this._setHolderTitle();
		this._setHeapboxFocus();
		this._setSelectedOption($(clickedEl).attr("rel"));

		this.options.onChange( $(clickedEl).attr("rel"), $(this.element) );

	},


	/*
	 * Add class "selected" to selected option in heapbox
	 */
	_setSelected: function(selectedEl) {
		this._deselectAll();
		selectedEl.addClass("selected");
	},

	_deselectAll: function(self) {
		heapLinks = $("#heapbox_"+this.instance.heapId).find(".heap ul li a");
		heapLinks.each(function(){
			$(this).removeClass("selected");
		});
	},

	/*
	 * Close opened selectbox
	*/
	_closeheap: function(internal,closeStartEvent,closeCompleteEvent) {

		heapEl = $("#heapbox_"+this.instance.heapId).removeClass('open').find(".heap");
		if(heapEl.is(":animated") && !internal) return false;
		this.instance.state = false;

		if(internal){
		  closeStartEvent = closeStartEvent;
		  closeCompleteEvent = closeCompleteEvent;
		}else{
		  closeStartEvent = this.options.closeStart;
		  closeCompleteEvent = this.options.closeComplete;
		}

		closeStartEvent.call();

		switch(this.options.effect.type) {

		  case "fade":
			heapEl.fadeOut(this.options.effect.speed,closeCompleteEvent);
			break;
		  case "slide":

			heapEl.slideUp(this.options.effect.speed,closeCompleteEvent);
			break;
		  case "standard":
			heapEl.css("display","none");
 			closeCompleteEvent.call();
			break;
		  default:
			heapEl.slideUp(this.options.effect.speed,closeCompleteEvent);
			break;

		}
	},

	/*
	 * Open selectbox
	*/
	_openheap: function() {

		if(this._isHeapsizeSet()) {
			this._setViewPosition($("div#heapbox_"+this.instance.heapId));
		}

		heapEl = $("#heapbox_"+this.instance.heapId).addClass('open').find(".heap");
		if(heapEl.is(":animated")) return false;
		this.instance.state = true;

		this.options.openStart.call();

		switch(this.options.effect.type) {

		  case "fade":
			heapEl.fadeIn(this.options.effect.speed,this.options.openComplete);
			break;
		  case "slide":
			heapEl.slideDown(this.options.effect.speed,this.options.openComplete);
			break;
		  case "standard":
			heapEl.css("display","block");
 			this.options.openComplete.call();
			break;
		  default:
			heapEl.slideDown(this.options.effect.speed,this.options.openComplete);
			break;
		}
	},

	/*
	 * Close other selectboxes
	*/
	_closeOthers: function() {

		var self = this;

		$('div[id^=heapbox_]').each(function(index){

			 el = $("div#"+$(this).attr("id"));

			 if(el.data("sourceElement"))
			 {
				sourceEl = $.data(this, "sourceElement");
				heapBoxInst = $.data(sourceEl, "plugin_" + pluginName);

				if(self.instance.heapId != heapBoxInst.instance.heapId)
				{
				     if(heapBoxInst.instance.state)
				     {
				       self._callbackManager('change','_closeOthers',true);
				       heapBoxInst._closeheap(true,function(){},function(){self._callbackManager('change','_closeOthers',false);});
				     }
				}
			 }
		});

		 self._callbackManager('test','_closeOthers');
	},

	/*
	 * Manager of callback queue
	*/
	_callbackManager: function(type,identificator,state)
	{
		if(!this.callbackManager[identificator])
			this.callbackManager[identificator] = 0;

		if(type == "change")
		{
			state ? this.callbackManager[identificator]++ : this.callbackManager[identificator]--;
			this._callbackManager('test',identificator);

		}else if(type == "test"){
			if(this.callbackManager[identificator] == 0) this._handlerClicked(true);
		}
	},

	/*
	 * Set own data to heap
	 */
	set: function(data) {
		this._setData(data);
		this._setHolderTitle();
		this._setEvents();
	},

	select: function(value) {
		heapBoxEl = $("div#heapbox_"+this.instance.heapId);
		this._heapChanged( this, heapBoxEl.find('.heapOptions [rel="'+ value +'"]') );
	},
	update: function() {
		this._setDefaultValues();
	},
	_hideSourceElement: function() {

		// preserve original visibility of the element
		this.elem_isVisible = $(this.element).is(':visible');
		$(this.element).css("display","none");
	},
	_showSourceElement: function() {
		$(this.element).css("display","block");
	},
	hide: function() {
		$("div#heapbox_"+this.instance.heapId).css("visibility","hidden");
	},
	show: function() {
		$("div#heapbox_"+this.instance.heapId).css("visibility","visible");
	},
	disable: function() {
		heapBoxEl = $("div#heapbox_"+this.instance.heapId);
		heapBoxEl.addClass("disabled");

		this._removeHeapboxHandlerEvents();
		this._removeHeapboxHolderEvents();

		return this;
	},
	enable: function() {
		heapBoxEl = $("div#heapbox_"+this.instance.heapId);
		heapBoxEl.removeClass("disabled");
		this._setEvents();

		return this;
	},
	_remove: function() {
		heapBoxEl = $("div#heapbox_"+this.instance.heapId);
		heapBoxEl.remove();

		this._showSourceElement();
	}
    };

    $.fn[pluginName] = function ( options, optional ) {

        return this.each(function () {

            if (!$.data(this, "plugin_" + pluginName)) {
                $.data(this, "plugin_" + pluginName, new Plugin( this, options ));
	    }
	    else
	    {
		heapBoxInst = $.data(this, "plugin_" + pluginName);

			switch(options)
			{
			case "select":
				heapBoxInst.select(optional);
			    break;
			case "update":
				heapBoxInst.update();
			    break;
			case "set":
				heapBoxInst.set(optional);
				break;
			case "hide":
				heapBoxInst.hide();
				break;
			case "show":
				heapBoxInst.show();
				break;
			case "disable":
				heapBoxInst.disable();
				break;
			case "enable":
				heapBoxInst.enable();
				break;
			case "remove":
				heapBoxInst._remove();
				break;
			}

	    }
        });
    };

})( jQuery, window, document );

/*! jCarousel - v0.3.4 - 2015-09-23
* http://sorgalla.com/jcarousel/
* Copyright (c) 2006-2015 Jan Sorgalla; Licensed MIT */
(function($) {
    'use strict';

    var jCarousel = $.jCarousel = {};

    jCarousel.version = '0.3.4';

    var rRelativeTarget = /^([+\-]=)?(.+)$/;

    jCarousel.parseTarget = function(target) {
        var relative = false,
            parts    = typeof target !== 'object' ?
                           rRelativeTarget.exec(target) :
                           null;

        if (parts) {
            target = parseInt(parts[2], 10) || 0;

            if (parts[1]) {
                relative = true;
                if (parts[1] === '-=') {
                    target *= -1;
                }
            }
        } else if (typeof target !== 'object') {
            target = parseInt(target, 10) || 0;
        }

        return {
            target: target,
            relative: relative
        };
    };

    jCarousel.detectCarousel = function(element) {
        var carousel;

        while (element.length > 0) {
            carousel = element.filter('[data-jcarousel]');

            if (carousel.length > 0) {
                return carousel;
            }

            carousel = element.find('[data-jcarousel]');

            if (carousel.length > 0) {
                return carousel;
            }

            element = element.parent();
        }

        return null;
    };

    jCarousel.base = function(pluginName) {
        return {
            version:  jCarousel.version,
            _options:  {},
            _element:  null,
            _carousel: null,
            _init:     $.noop,
            _create:   $.noop,
            _destroy:  $.noop,
            _reload:   $.noop,
            create: function() {
                this._element
                    .attr('data-' + pluginName.toLowerCase(), true)
                    .data(pluginName, this);

                if (false === this._trigger('create')) {
                    return this;
                }

                this._create();

                this._trigger('createend');

                return this;
            },
            destroy: function() {
                if (false === this._trigger('destroy')) {
                    return this;
                }

                this._destroy();

                this._trigger('destroyend');

                this._element
                    .removeData(pluginName)
                    .removeAttr('data-' + pluginName.toLowerCase());

                return this;
            },
            reload: function(options) {
                if (false === this._trigger('reload')) {
                    return this;
                }

                if (options) {
                    this.options(options);
                }

                this._reload();

                this._trigger('reloadend');

                return this;
            },
            element: function() {
                return this._element;
            },
            options: function(key, value) {
                if (arguments.length === 0) {
                    return $.extend({}, this._options);
                }

                if (typeof key === 'string') {
                    if (typeof value === 'undefined') {
                        return typeof this._options[key] === 'undefined' ?
                                null :
                                this._options[key];
                    }

                    this._options[key] = value;
                } else {
                    this._options = $.extend({}, this._options, key);
                }

                return this;
            },
            carousel: function() {
                if (!this._carousel) {
                    this._carousel = jCarousel.detectCarousel(this.options('carousel') || this._element);

                    if (!this._carousel) {
                        $.error('Could not detect carousel for plugin "' + pluginName + '"');
                    }
                }

                return this._carousel;
            },
            _trigger: function(type, element, data) {
                var event,
                    defaultPrevented = false;

                data = [this].concat(data || []);

                (element || this._element).each(function() {
                    event = $.Event((pluginName + ':' + type).toLowerCase());

                    $(this).trigger(event, data);

                    if (event.isDefaultPrevented()) {
                        defaultPrevented = true;
                    }
                });

                return !defaultPrevented;
            }
        };
    };

    jCarousel.plugin = function(pluginName, pluginPrototype) {
        var Plugin = $[pluginName] = function(element, options) {
            this._element = $(element);
            this.options(options);

            this._init();
            this.create();
        };

        Plugin.fn = Plugin.prototype = $.extend(
            {},
            jCarousel.base(pluginName),
            pluginPrototype
        );

        $.fn[pluginName] = function(options) {
            var args        = Array.prototype.slice.call(arguments, 1),
                returnValue = this;

            if (typeof options === 'string') {
                this.each(function() {
                    var instance = $(this).data(pluginName);

                    if (!instance) {
                        return $.error(
                            'Cannot call methods on ' + pluginName + ' prior to initialization; ' +
                            'attempted to call method "' + options + '"'
                        );
                    }

                    if (!$.isFunction(instance[options]) || options.charAt(0) === '_') {
                        return $.error(
                            'No such method "' + options + '" for ' + pluginName + ' instance'
                        );
                    }

                    var methodValue = instance[options].apply(instance, args);

                    if (methodValue !== instance && typeof methodValue !== 'undefined') {
                        returnValue = methodValue;
                        return false;
                    }
                });
            } else {
                this.each(function() {
                    var instance = $(this).data(pluginName);

                    if (instance instanceof Plugin) {
                        instance.reload(options);
                    } else {
                        new Plugin(this, options);
                    }
                });
            }

            return returnValue;
        };

        return Plugin;
    };
}(jQuery));

(function($, window) {
    'use strict';

    var toFloat = function(val) {
        return parseFloat(val) || 0;
    };

    $.jCarousel.plugin('jcarousel', {
        animating:   false,
        tail:        0,
        inTail:      false,
        resizeTimer: null,
        lt:          null,
        vertical:    false,
        rtl:         false,
        circular:    false,
        underflow:   false,
        relative:    false,

        _options: {
            list: function() {
                return this.element().children().eq(0);
            },
            items: function() {
                return this.list().children();
            },
            animation:   400,
            transitions: false,
            wrap:        null,
            vertical:    null,
            rtl:         null,
            center:      false
        },

        // Protected, don't access directly
        _list:         null,
        _items:        null,
        _target:       $(),
        _first:        $(),
        _last:         $(),
        _visible:      $(),
        _fullyvisible: $(),
        _init: function() {
            var self = this;

            this.onWindowResize = function() {
                if (self.resizeTimer) {
                    clearTimeout(self.resizeTimer);
                }

                self.resizeTimer = setTimeout(function() {
                    self.reload();
                }, 100);
            };

            return this;
        },
        _create: function() {
            this._reload();

            $(window).on('resize.jcarousel', this.onWindowResize);
        },
        _destroy: function() {
            $(window).off('resize.jcarousel', this.onWindowResize);
        },
        _reload: function() {
            this.vertical = this.options('vertical');

            if (this.vertical == null) {
                this.vertical = this.list().height() > this.list().width();
            }

            this.rtl = this.options('rtl');

            if (this.rtl == null) {
                this.rtl = (function(element) {
                    if (('' + element.attr('dir')).toLowerCase() === 'rtl') {
                        return true;
                    }

                    var found = false;

                    element.parents('[dir]').each(function() {
                        if ((/rtl/i).test($(this).attr('dir'))) {
                            found = true;
                            return false;
                        }
                    });

                    return found;
                }(this._element));
            }

            this.lt = this.vertical ? 'top' : 'left';

            // Ensure before closest() call
            this.relative = this.list().css('position') === 'relative';

            // Force list and items reload
            this._list  = null;
            this._items = null;

            var item = this.index(this._target) >= 0 ?
                           this._target :
                           this.closest();

            // _prepare() needs this here
            this.circular  = this.options('wrap') === 'circular';
            this.underflow = false;

            var props = {'left': 0, 'top': 0};

            if (item.length > 0) {
                this._prepare(item);
                this.list().find('[data-jcarousel-clone]').remove();

                // Force items reload
                this._items = null;

                this.underflow = this._fullyvisible.length >= this.items().length;
                this.circular  = this.circular && !this.underflow;

                props[this.lt] = this._position(item) + 'px';
            }

            this.move(props);

            return this;
        },
        list: function() {
            if (this._list === null) {
                var option = this.options('list');
                this._list = $.isFunction(option) ? option.call(this) : this._element.find(option);
            }

            return this._list;
        },
        items: function() {
            if (this._items === null) {
                var option = this.options('items');
                this._items = ($.isFunction(option) ? option.call(this) : this.list().find(option)).not('[data-jcarousel-clone]');
            }

            return this._items;
        },
        index: function(item) {
            return this.items().index(item);
        },
        closest: function() {
            var self    = this,
                pos     = this.list().position()[this.lt],
                closest = $(), // Ensure we're returning a jQuery instance
                stop    = false,
                lrb     = this.vertical ? 'bottom' : (this.rtl && !this.relative ? 'left' : 'right'),
                width;

            if (this.rtl && this.relative && !this.vertical) {
                pos += this.list().width() - this.clipping();
            }

            this.items().each(function() {
                closest = $(this);

                if (stop) {
                    return false;
                }

                var dim = self.dimension(closest);

                pos += dim;

                if (pos >= 0) {
                    width = dim - toFloat(closest.css('margin-' + lrb));

                    if ((Math.abs(pos) - dim + (width / 2)) <= 0) {
                        stop = true;
                    } else {
                        return false;
                    }
                }
            });


            return closest;
        },
        target: function() {
            return this._target;
        },
        first: function() {
            return this._first;
        },
        last: function() {
            return this._last;
        },
        visible: function() {
            return this._visible;
        },
        fullyvisible: function() {
            return this._fullyvisible;
        },
        hasNext: function() {
            if (false === this._trigger('hasnext')) {
                return true;
            }

            var wrap = this.options('wrap'),
                end = this.items().length - 1,
                check = this.options('center') ? this._target : this._last;

            return end >= 0 && !this.underflow &&
                ((wrap && wrap !== 'first') ||
                    (this.index(check) < end) ||
                    (this.tail && !this.inTail)) ? true : false;
        },
        hasPrev: function() {
            if (false === this._trigger('hasprev')) {
                return true;
            }

            var wrap = this.options('wrap');

            return this.items().length > 0 && !this.underflow &&
                ((wrap && wrap !== 'last') ||
                    (this.index(this._first) > 0) ||
                    (this.tail && this.inTail)) ? true : false;
        },
        clipping: function() {
            return this._element['inner' + (this.vertical ? 'Height' : 'Width')]();
        },
        dimension: function(element) {
            return element['outer' + (this.vertical ? 'Height' : 'Width')](true);
        },
        scroll: function(target, animate, callback) {
            if (this.animating) {
                return this;
            }

            if (false === this._trigger('scroll', null, [target, animate])) {
                return this;
            }

            if ($.isFunction(animate)) {
                callback = animate;
                animate  = true;
            }

            var parsed = $.jCarousel.parseTarget(target);

            if (parsed.relative) {
                var end    = this.items().length - 1,
                    scroll = Math.abs(parsed.target),
                    wrap   = this.options('wrap'),
                    current,
                    first,
                    index,
                    start,
                    curr,
                    isVisible,
                    props,
                    i;

                if (parsed.target > 0) {
                    var last = this.index(this._last);

                    if (last >= end && this.tail) {
                        if (!this.inTail) {
                            this._scrollTail(animate, callback);
                        } else {
                            if (wrap === 'both' || wrap === 'last') {
                                this._scroll(0, animate, callback);
                            } else {
                                if ($.isFunction(callback)) {
                                    callback.call(this, false);
                                }
                            }
                        }
                    } else {
                        current = this.index(this._target);

                        if ((this.underflow && current === end && (wrap === 'circular' || wrap === 'both' || wrap === 'last')) ||
                            (!this.underflow && last === end && (wrap === 'both' || wrap === 'last'))) {
                            this._scroll(0, animate, callback);
                        } else {
                            index = current + scroll;

                            if (this.circular && index > end) {
                                i = end;
                                curr = this.items().get(-1);

                                while (i++ < index) {
                                    curr = this.items().eq(0);
                                    isVisible = this._visible.index(curr) >= 0;

                                    if (isVisible) {
                                        curr.after(curr.clone(true).attr('data-jcarousel-clone', true));
                                    }

                                    this.list().append(curr);

                                    if (!isVisible) {
                                        props = {};
                                        props[this.lt] = this.dimension(curr);
                                        this.moveBy(props);
                                    }

                                    // Force items reload
                                    this._items = null;
                                }

                                this._scroll(curr, animate, callback);
                            } else {
                                this._scroll(Math.min(index, end), animate, callback);
                            }
                        }
                    }
                } else {
                    if (this.inTail) {
                        this._scroll(Math.max((this.index(this._first) - scroll) + 1, 0), animate, callback);
                    } else {
                        first  = this.index(this._first);
                        current = this.index(this._target);
                        start  = this.underflow ? current : first;
                        index  = start - scroll;

                        if (start <= 0 && ((this.underflow && wrap === 'circular') || wrap === 'both' || wrap === 'first')) {
                            this._scroll(end, animate, callback);
                        } else {
                            if (this.circular && index < 0) {
                                i    = index;
                                curr = this.items().get(0);

                                while (i++ < 0) {
                                    curr = this.items().eq(-1);
                                    isVisible = this._visible.index(curr) >= 0;

                                    if (isVisible) {
                                        curr.after(curr.clone(true).attr('data-jcarousel-clone', true));
                                    }

                                    this.list().prepend(curr);

                                    // Force items reload
                                    this._items = null;

                                    var dim = this.dimension(curr);

                                    props = {};
                                    props[this.lt] = -dim;
                                    this.moveBy(props);

                                }

                                this._scroll(curr, animate, callback);
                            } else {
                                this._scroll(Math.max(index, 0), animate, callback);
                            }
                        }
                    }
                }
            } else {
                this._scroll(parsed.target, animate, callback);
            }

            this._trigger('scrollend');

            return this;
        },
        moveBy: function(properties, opts) {
            var position = this.list().position(),
                multiplier = 1,
                correction = 0;

            if (this.rtl && !this.vertical) {
                multiplier = -1;

                if (this.relative) {
                    correction = this.list().width() - this.clipping();
                }
            }

            if (properties.left) {
                properties.left = (position.left + correction + toFloat(properties.left) * multiplier) + 'px';
            }

            if (properties.top) {
                properties.top = (position.top + correction + toFloat(properties.top) * multiplier) + 'px';
            }

            return this.move(properties, opts);
        },
        move: function(properties, opts) {
            opts = opts || {};

            var option       = this.options('transitions'),
                transitions  = !!option,
                transforms   = !!option.transforms,
                transforms3d = !!option.transforms3d,
                duration     = opts.duration || 0,
                list         = this.list();

            if (!transitions && duration > 0) {
                list.animate(properties, opts);
                return;
            }

            var complete = opts.complete || $.noop,
                css = {};

            if (transitions) {
                var backup = {
                        transitionDuration: list.css('transitionDuration'),
                        transitionTimingFunction: list.css('transitionTimingFunction'),
                        transitionProperty: list.css('transitionProperty')
                    },
                    oldComplete = complete;

                complete = function() {
                    $(this).css(backup);
                    oldComplete.call(this);
                };
                css = {
                    transitionDuration: (duration > 0 ? duration / 1000 : 0) + 's',
                    transitionTimingFunction: option.easing || opts.easing,
                    transitionProperty: duration > 0 ? (function() {
                        if (transforms || transforms3d) {
                            // We have to use 'all' because jQuery doesn't prefix
                            // css values, like transition-property: transform;
                            return 'all';
                        }

                        return properties.left ? 'left' : 'top';
                    })() : 'none',
                    transform: 'none'
                };
            }

            if (transforms3d) {
                css.transform = 'translate3d(' + (properties.left || 0) + ',' + (properties.top || 0) + ',0)';
            } else if (transforms) {
                css.transform = 'translate(' + (properties.left || 0) + ',' + (properties.top || 0) + ')';
            } else {
                $.extend(css, properties);
            }

            if (transitions && duration > 0) {
                list.one('transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd', complete);
            }

            list.css(css);

            if (duration <= 0) {
                list.each(function() {
                    complete.call(this);
                });
            }
        },
        _scroll: function(item, animate, callback) {
            if (this.animating) {
                if ($.isFunction(callback)) {
                    callback.call(this, false);
                }

                return this;
            }

            if (typeof item !== 'object') {
                item = this.items().eq(item);
            } else if (typeof item.jquery === 'undefined') {
                item = $(item);
            }

            if (item.length === 0) {
                if ($.isFunction(callback)) {
                    callback.call(this, false);
                }

                return this;
            }

            this.inTail = false;

            this._prepare(item);

            var pos     = this._position(item),
                currPos = this.list().position()[this.lt];

            if (pos === currPos) {
                if ($.isFunction(callback)) {
                    callback.call(this, false);
                }

                return this;
            }

            var properties = {};
            properties[this.lt] = pos + 'px';

            this._animate(properties, animate, callback);

            return this;
        },
        _scrollTail: function(animate, callback) {
            if (this.animating || !this.tail) {
                if ($.isFunction(callback)) {
                    callback.call(this, false);
                }

                return this;
            }

            var pos = this.list().position()[this.lt];

            if (this.rtl && this.relative && !this.vertical) {
                pos += this.list().width() - this.clipping();
            }

            if (this.rtl && !this.vertical) {
                pos += this.tail;
            } else {
                pos -= this.tail;
            }

            this.inTail = true;

            var properties = {};
            properties[this.lt] = pos + 'px';

            this._update({
                target:       this._target.next(),
                fullyvisible: this._fullyvisible.slice(1).add(this._visible.last())
            });

            this._animate(properties, animate, callback);

            return this;
        },
        _animate: function(properties, animate, callback) {
            callback = callback || $.noop;

            if (false === this._trigger('animate')) {
                callback.call(this, false);
                return this;
            }

            this.animating = true;

            var animation = this.options('animation'),
                complete  = $.proxy(function() {
                    this.animating = false;

                    var c = this.list().find('[data-jcarousel-clone]');

                    if (c.length > 0) {
                        c.remove();
                        this._reload();
                    }

                    this._trigger('animateend');

                    callback.call(this, true);
                }, this);

            var opts = typeof animation === 'object' ?
                           $.extend({}, animation) :
                           {duration: animation},
                oldComplete = opts.complete || $.noop;

            if (animate === false) {
                opts.duration = 0;
            } else if (typeof $.fx.speeds[opts.duration] !== 'undefined') {
                opts.duration = $.fx.speeds[opts.duration];
            }

            opts.complete = function() {
                complete();
                oldComplete.call(this);
            };

            this.move(properties, opts);

            return this;
        },
        _prepare: function(item) {
            var index  = this.index(item),
                idx    = index,
                wh     = this.dimension(item),
                clip   = this.clipping(),
                lrb    = this.vertical ? 'bottom' : (this.rtl ? 'left'  : 'right'),
                center = this.options('center'),
                update = {
                    target:       item,
                    first:        item,
                    last:         item,
                    visible:      item,
                    fullyvisible: wh <= clip ? item : $()
                },
                curr,
                isVisible,
                margin,
                dim;

            if (center) {
                wh /= 2;
                clip /= 2;
            }

            if (wh < clip) {
                while (true) {
                    curr = this.items().eq(++idx);

                    if (curr.length === 0) {
                        if (!this.circular) {
                            break;
                        }

                        curr = this.items().eq(0);

                        if (item.get(0) === curr.get(0)) {
                            break;
                        }

                        isVisible = this._visible.index(curr) >= 0;

                        if (isVisible) {
                            curr.after(curr.clone(true).attr('data-jcarousel-clone', true));
                        }

                        this.list().append(curr);

                        if (!isVisible) {
                            var props = {};
                            props[this.lt] = this.dimension(curr);
                            this.moveBy(props);
                        }

                        // Force items reload
                        this._items = null;
                    }

                    dim = this.dimension(curr);

                    if (dim === 0) {
                        break;
                    }

                    wh += dim;

                    update.last    = curr;
                    update.visible = update.visible.add(curr);

                    // Remove right/bottom margin from total width
                    margin = toFloat(curr.css('margin-' + lrb));

                    if ((wh - margin) <= clip) {
                        update.fullyvisible = update.fullyvisible.add(curr);
                    }

                    if (wh >= clip) {
                        break;
                    }
                }
            }

            if (!this.circular && !center && wh < clip) {
                idx = index;

                while (true) {
                    if (--idx < 0) {
                        break;
                    }

                    curr = this.items().eq(idx);

                    if (curr.length === 0) {
                        break;
                    }

                    dim = this.dimension(curr);

                    if (dim === 0) {
                        break;
                    }

                    wh += dim;

                    update.first   = curr;
                    update.visible = update.visible.add(curr);

                    // Remove right/bottom margin from total width
                    margin = toFloat(curr.css('margin-' + lrb));

                    if ((wh - margin) <= clip) {
                        update.fullyvisible = update.fullyvisible.add(curr);
                    }

                    if (wh >= clip) {
                        break;
                    }
                }
            }

            this._update(update);

            this.tail = 0;

            if (!center &&
                this.options('wrap') !== 'circular' &&
                this.options('wrap') !== 'custom' &&
                this.index(update.last) === (this.items().length - 1)) {

                // Remove right/bottom margin from total width
                wh -= toFloat(update.last.css('margin-' + lrb));

                if (wh > clip) {
                    this.tail = wh - clip;
                }
            }

            return this;
        },
        _position: function(item) {
            var first  = this._first,
                pos    = first.position()[this.lt],
                center = this.options('center'),
                centerOffset = center ? (this.clipping() / 2) - (this.dimension(first) / 2) : 0;

            if (this.rtl && !this.vertical) {
                if (this.relative) {
                    pos -= this.list().width() - this.dimension(first);
                } else {
                    pos -= this.clipping() - this.dimension(first);
                }

                pos += centerOffset;
            } else {
                pos -= centerOffset;
            }

            if (!center &&
                (this.index(item) > this.index(first) || this.inTail) &&
                this.tail) {
                pos = this.rtl && !this.vertical ? pos - this.tail : pos + this.tail;
                this.inTail = true;
            } else {
                this.inTail = false;
            }

            return -pos;
        },
        _update: function(update) {
            var self = this,
                current = {
                    target:       this._target,
                    first:        this._first,
                    last:         this._last,
                    visible:      this._visible,
                    fullyvisible: this._fullyvisible
                },
                back = this.index(update.first || current.first) < this.index(current.first),
                key,
                doUpdate = function(key) {
                    var elIn  = [],
                        elOut = [];

                    update[key].each(function() {
                        if (current[key].index(this) < 0) {
                            elIn.push(this);
                        }
                    });

                    current[key].each(function() {
                        if (update[key].index(this) < 0) {
                            elOut.push(this);
                        }
                    });

                    if (back) {
                        elIn = elIn.reverse();
                    } else {
                        elOut = elOut.reverse();
                    }

                    self._trigger(key + 'in', $(elIn));
                    self._trigger(key + 'out', $(elOut));

                    self['_' + key] = update[key];
                };

            for (key in update) {
                doUpdate(key);
            }

            return this;
        }
    });
}(jQuery, window));

(function($) {
    'use strict';

    $.jcarousel.fn.scrollIntoView = function(target, animate, callback) {
        var parsed = $.jCarousel.parseTarget(target),
            first  = this.index(this._fullyvisible.first()),
            last   = this.index(this._fullyvisible.last()),
            index;

        if (parsed.relative) {
            index = parsed.target < 0 ? Math.max(0, first + parsed.target) : last + parsed.target;
        } else {
            index = typeof parsed.target !== 'object' ? parsed.target : this.index(parsed.target);
        }

        if (index < first) {
            return this.scroll(index, animate, callback);
        }

        if (index >= first && index <= last) {
            if ($.isFunction(callback)) {
                callback.call(this, false);
            }

            return this;
        }

        var items = this.items(),
            clip = this.clipping(),
            lrb  = this.vertical ? 'bottom' : (this.rtl ? 'left'  : 'right'),
            wh   = 0,
            curr;

        while (true) {
            curr = items.eq(index);

            if (curr.length === 0) {
                break;
            }

            wh += this.dimension(curr);

            if (wh >= clip) {
                var margin = parseFloat(curr.css('margin-' + lrb)) || 0;
                if ((wh - margin) !== clip) {
                    index++;
                }
                break;
            }

            if (index <= 0) {
                break;
            }

            index--;
        }

        return this.scroll(index, animate, callback);
    };
}(jQuery));

(function($) {
    'use strict';

    $.jCarousel.plugin('jcarouselControl', {
        _options: {
            target: '+=1',
            event:  'click',
            method: 'scroll'
        },
        _active: null,
        _init: function() {
            this.onDestroy = $.proxy(function() {
                this._destroy();
                this.carousel()
                    .one('jcarousel:createend', $.proxy(this._create, this));
            }, this);
            this.onReload = $.proxy(this._reload, this);
            this.onEvent = $.proxy(function(e) {
                e.preventDefault();

                var method = this.options('method');

                if ($.isFunction(method)) {
                    method.call(this);
                } else {
                    this.carousel()
                        .jcarousel(this.options('method'), this.options('target'));
                }
            }, this);
        },
        _create: function() {
            this.carousel()
                .one('jcarousel:destroy', this.onDestroy)
                .on('jcarousel:reloadend jcarousel:scrollend', this.onReload);

            this._element
                .on(this.options('event') + '.jcarouselcontrol', this.onEvent);

            this._reload();
        },
        _destroy: function() {
            this._element
                .off('.jcarouselcontrol', this.onEvent);

            this.carousel()
                .off('jcarousel:destroy', this.onDestroy)
                .off('jcarousel:reloadend jcarousel:scrollend', this.onReload);
        },
        _reload: function() {
            var parsed   = $.jCarousel.parseTarget(this.options('target')),
                carousel = this.carousel(),
                active;

            if (parsed.relative) {
                active = carousel
                    .jcarousel(parsed.target > 0 ? 'hasNext' : 'hasPrev');
            } else {
                var target = typeof parsed.target !== 'object' ?
                                carousel.jcarousel('items').eq(parsed.target) :
                                parsed.target;

                active = carousel.jcarousel('target').index(target) >= 0;
            }

            if (this._active !== active) {
                this._trigger(active ? 'active' : 'inactive');
                this._active = active;
            }

            return this;
        }
    });
}(jQuery));

(function($) {
    'use strict';

    $.jCarousel.plugin('jcarouselPagination', {
        _options: {
            perPage: null,
            item: function(page) {
                return '<a href="#' + page + '">' + page + '</a>';
            },
            event:  'click',
            method: 'scroll'
        },
        _carouselItems: null,
        _pages: {},
        _items: {},
        _currentPage: null,
        _init: function() {
            this.onDestroy = $.proxy(function() {
                this._destroy();
                this.carousel()
                    .one('jcarousel:createend', $.proxy(this._create, this));
            }, this);
            this.onReload = $.proxy(this._reload, this);
            this.onScroll = $.proxy(this._update, this);
        },
        _create: function() {
            this.carousel()
                .one('jcarousel:destroy', this.onDestroy)
                .on('jcarousel:reloadend', this.onReload)
                .on('jcarousel:scrollend', this.onScroll);

            this._reload();
        },
        _destroy: function() {
            this._clear();

            this.carousel()
                .off('jcarousel:destroy', this.onDestroy)
                .off('jcarousel:reloadend', this.onReload)
                .off('jcarousel:scrollend', this.onScroll);

            this._carouselItems = null;
        },
        _reload: function() {
            var perPage = this.options('perPage');

            this._pages = {};
            this._items = {};

            // Calculate pages
            if ($.isFunction(perPage)) {
                perPage = perPage.call(this);
            }

            if (perPage == null) {
                this._pages = this._calculatePages();
            } else {
                var pp    = parseInt(perPage, 10) || 0,
                    items = this._getCarouselItems(),
                    page  = 1,
                    i     = 0,
                    curr;

                while (true) {
                    curr = items.eq(i++);

                    if (curr.length === 0) {
                        break;
                    }

                    if (!this._pages[page]) {
                        this._pages[page] = curr;
                    } else {
                        this._pages[page] = this._pages[page].add(curr);
                    }

                    if (i % pp === 0) {
                        page++;
                    }
                }
            }

            this._clear();

            var self     = this,
                carousel = this.carousel().data('jcarousel'),
                element  = this._element,
                item     = this.options('item'),
                numCarouselItems = this._getCarouselItems().length;

            $.each(this._pages, function(page, carouselItems) {
                var currItem = self._items[page] = $(item.call(self, page, carouselItems));

                currItem.on(self.options('event') + '.jcarouselpagination', $.proxy(function() {
                    var target = carouselItems.eq(0);

                    // If circular wrapping enabled, ensure correct scrolling direction
                    if (carousel.circular) {
                        var currentIndex = carousel.index(carousel.target()),
                            newIndex     = carousel.index(target);

                        if (parseFloat(page) > parseFloat(self._currentPage)) {
                            if (newIndex < currentIndex) {
                                target = '+=' + (numCarouselItems - currentIndex + newIndex);
                            }
                        } else {
                            if (newIndex > currentIndex) {
                                target = '-=' + (currentIndex + (numCarouselItems - newIndex));
                            }
                        }
                    }

                    carousel[this.options('method')](target);
                }, self));

                element.append(currItem);
            });

            this._update();
        },
        _update: function() {
            var target = this.carousel().jcarousel('target'),
                currentPage;

            $.each(this._pages, function(page, carouselItems) {
                carouselItems.each(function() {
                    if (target.is(this)) {
                        currentPage = page;
                        return false;
                    }
                });

                if (currentPage) {
                    return false;
                }
            });

            if (this._currentPage !== currentPage) {
                this._trigger('inactive', this._items[this._currentPage]);
                this._trigger('active', this._items[currentPage]);
            }

            this._currentPage = currentPage;
        },
        items: function() {
            return this._items;
        },
        reloadCarouselItems: function() {
            this._carouselItems = null;
            return this;
        },
        _clear: function() {
            this._element.empty();
            this._currentPage = null;
        },
        _calculatePages: function() {
            var carousel = this.carousel().data('jcarousel'),
                items    = this._getCarouselItems(),
                clip     = carousel.clipping(),
                wh       = 0,
                idx      = 0,
                page     = 1,
                pages    = {},
                curr,
                dim;

            while (true) {
                curr = items.eq(idx++);

                if (curr.length === 0) {
                    break;
                }

                dim = carousel.dimension(curr);

                if ((wh + dim) > clip) {
                    page++;
                    wh = 0;
                }

                wh += dim;

                if (!pages[page]) {
                    pages[page] = curr;
                } else {
                    pages[page] = pages[page].add(curr);
                }
            }

            return pages;
        },
        _getCarouselItems: function() {
            if (!this._carouselItems) {
                this._carouselItems = this.carousel().jcarousel('items');
            }

            return this._carouselItems;
        }
    });
}(jQuery));

(function($, document) {
    'use strict';

    var hiddenProp,
        visibilityChangeEvent,
        visibilityChangeEventNames = {
            hidden: 'visibilitychange',
            mozHidden: 'mozvisibilitychange',
            msHidden: 'msvisibilitychange',
            webkitHidden: 'webkitvisibilitychange'
        }
    ;

    $.each(visibilityChangeEventNames, function(key, val) {
        if (typeof document[key] !== 'undefined') {
            hiddenProp = key;
            visibilityChangeEvent = val;
            return false;
        }
    });

    $.jCarousel.plugin('jcarouselAutoscroll', {
        _options: {
            target:    '+=1',
            interval:  3000,
            autostart: true
        },
        _timer: null,
        _started: false,
        _init: function () {
            this.onDestroy = $.proxy(function() {
                this._destroy();
                this.carousel()
                    .one('jcarousel:createend', $.proxy(this._create, this));
            }, this);

            this.onAnimateEnd = $.proxy(this._start, this);

            this.onVisibilityChange = $.proxy(function() {
                if (document[hiddenProp]) {
                    this._stop();
                } else {
                    this._start();
                }
            }, this);
        },
        _create: function() {
            this.carousel()
                .one('jcarousel:destroy', this.onDestroy);

            $(document)
                .on(visibilityChangeEvent, this.onVisibilityChange);

            if (this.options('autostart')) {
                this.start();
            }
        },
        _destroy: function() {
            this._stop();

            this.carousel()
                .off('jcarousel:destroy', this.onDestroy);

            $(document)
                .off(visibilityChangeEvent, this.onVisibilityChange);
        },
        _start: function() {
            this._stop();

            if (!this._started) {
                return;
            }

            this.carousel()
                .one('jcarousel:animateend', this.onAnimateEnd);

            this._timer = setTimeout($.proxy(function() {
                this.carousel().jcarousel('scroll', this.options('target'));
            }, this), this.options('interval'));

            return this;
        },
        _stop: function() {
            if (this._timer) {
                this._timer = clearTimeout(this._timer);
            }

            this.carousel()
                .off('jcarousel:animateend', this.onAnimateEnd);

            return this;
        },
        start: function() {
            this._started = true;
            this._start();

            return this;
        },
        stop: function() {
            this._started = false;
            this._stop();

            return this;
        }
    });
}(jQuery, document));

$(function() {
  // Carousel
    $('.jcarousel').jcarousel();

    $('.jcarousel-prev')
            .on('jcarouselcontrol:active', function() {
                $(this).removeClass('inactive');
            })
            .on('jcarouselcontrol:inactive', function() {
                $(this).addClass('inactive');
            })
            .jcarouselControl({
                target: '-=1'
            });

    $('.jcarousel-next')
            .on('jcarouselcontrol:active', function() {
                $(this).removeClass('inactive');
            })
            .on('jcarouselcontrol:inactive', function() {
                $(this).addClass('inactive');
            })
            .jcarouselControl({
                target: '+=1'
            });

    $('.jcarousel-pagination')
            .on('jcarouselpagination:active', 'a', function() {
                $(this).addClass('active');
            })
            .on('jcarouselpagination:inactive', 'a', function() {
                $(this).removeClass('active');
            })
            .jcarouselPagination();

// Select plagin inicialisation
    $(document).ready(function(){
            $("#styledSelect").heapbox();
        });

// alternative select plagin
        // $(document).ready(function(){
        //     $('#styledSelect').customSelect();
        // });

    $('.niceCheck').each(
      function() {
        changeCheckStart($(this));
      });

// slide down menu + changing color with jquery.color plagin
    $('.dropdown').hover(function() {
      $(this).children('.sub-menu')
         .slideDown(200)
         .animate({backgroundColor:'#464443',}, 500);
      },
      function(){
        $(this).children('.sub-menu')
          .slideUp(200)
          .animate({backgroundColor:'#6a6766',}, 500);
      });
});

function changeCheck(el) {
  var el = el,
      input = el.find('input').eq(0);
  if(el.attr('class').indexOf('niceCheckDisabled') == -1) {

    if(!input.attr('checked')) {
      el.addClass('niceChecked');
      input.attr('checked', true);
    } else {
      el.removeClass('niceChecked');
      input.attr('checked', false).focus();
    }
  }
  return true;
}

function changeVisualCheck(input) {
  var wrapInput = input.parent();

  if(!input.attr('checked')) {
    wrapInput.removeClass('niceChecked');
  }
  else {
    wrapInput.addClass('niceChecked');
  }
}

function changeCheckStart (el) {
  try {
    var el = el,
        checkName = el.attr('name'),
        checkId = el.attr('id'),
        checkChecked = el.attr('checked'),
        checkDisabled = el.attr('disabled'),
        checkTab = el.attr('tabindex'),
        checkValue = el.attr('value');

    if(checkChecked)
        el.after('<span class="niceCheck niceChecked">' +
                 '<input type="checkbox"' +
                 'name="' + checkName + '"' +
                 'id="' + checkId + '"' +
                 'checked="' + checkChecked + '"' +
                 'value="' + checkValue + '"' +
                 'tabindex="' + checkTab + '" /></span>');
    else
        el.after('<span class="niceCheck">' +
                 '<input type="checkbox"' +
                 'name="' + checkName + '"' +
                 'id="' + checkId + '"' +
                 'value="' + checkValue + '"' +
                 'tabindex="' + checkTab + '" /></span>');
    if(checkDisabled) {
      el.next().addClass('niceCheckDisabled');
      el.next().find('input').eq(0).attr('disabled','disabled');
    }

    el.next().bind('mousedown', function(e) {
      changeCheck($(this))
    });
    el.next().find('input').eq(0).bind('change', function(e) {
      changeVisualCheck($(this))
    });

    if($.browser.msie) {
      el.next().find('input').eq(0).bind('click', function(e) {
        changeVisualCheck($(this))
      });
    }
    el.remove();
  }
  catch(e) {

  }
  return true;
  }
