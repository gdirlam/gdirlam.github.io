(function StringUtilities(){
	    if (! String.prototype.format ) 
	        String.prototype.format = function(){
	            var txt = this;
	            for ( var i = 0; i < arguments.length; i++ ) {
	                var exp = new RegExp( '\\{' + (i) + '\\}', 'gm' )
	                txt = txt.replace(exp, arguments[i])
	            }
	            return txt   
	        };
	
	    if (! String.format ) 
	        String.format = function(){
	        for( var i = 1; i < arguments.length; i++ ) {
	            var exp = new RegExp( '\\{' + (i - 1) + '\\}', 'gm' )
	            arguments[0] = arguments[0].replace( exp, arguments[i] )
	        }
	        return arguments[0]
	        };
	        
	    if (! String.write )
	        String.write = function(){
	            if( arguments.length === 0 ) {
	                document.write( this  + '<br />' )
	                return ''
	            }
	            var txt = ''          
	            for( var i = 0; i < arguments.length; i++ )
	                txt += arguments[i]  + '<br />'
	        
	            document.write(txt)
	            return ''        
	        };
	
	    if (! String.prototype.write ) 
	        String.prototype.write =  String.write;            
	            
	})()
	        
