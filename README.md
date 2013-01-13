# uriAnchor 
## a jquery plugin for management of the uri hash component

Michael S. Mikowski - Posted 2013-01-12

## method: setAnchor

### Purpose

Sets Anchor component of the URI from a Map
(The Anchor component is also known as the
'hash fragment' or 'bookmark component')

### Arguments

Arguments are positional:

* 1 ( anchor_map )   The map to be encoded to the URI anchor
* 2 ( option_map )   : map of options
* 3 ( replace_flag )  : boolean flag to replace the URI When true, the URI is replaced, which means the prior URI is not entered into the browser history

### Environment

Expects the document.location browser object

### Settings

none

### Settings

none

### Returns

boolean: true on success, false on failure

### Throws

none

### Details

The first positional argument, anchor_map, may be a simple map:

    $.uriAnchor.setAnchor({
      page   : 'profile',
      slider : 'confirm',
      color  : 'red'
    });

This changes the URI anchor to:

    #!page=profile&slider=confirm&color=red

All these arguments are independent, that is, they can vary
independent of each other. We also support dependent values -
values that depend on others.

An independent argument key has no '_' prefix.  The same key name,
prefixed by an '_', holds the arguments that are dependent on
an independent argument.  The dependent key always points
to a map.  Consider:

    $.uriAnchor.setAnchor({
      page   : 'profile',
      _page  : {
        uname   : 'wendy',
        online  : 'today'
      }
    });

This changes the URI Anchor to:

    #!page=profile:uname,wendy|online,today

Only independent keys and their matching dependent keys are
processed.  All other keys are ignored.  Importantly, this includes
keys of the form _s_/key/ ( e.g. '_s_page' ) returned by makeAnchorMap

Setting a more complex anchor map is illustrated below:

    $.uriAnchor.setAnchor({
      page : 'profile',
      _page : {
        uname   : 'wendy',
        online  : 'today'
      },
      slider  : 'confirm',
      _slider : {
       text   : 'hello',
       pretty : false
      },
      color : 'red'
    });

This sets the URI Anchor to:

     #!page=profile:uname,wendy|online,today&slider=confirm:text,hello\
       |pretty,false&color=red

Options: The second positional argument tp this method, option_map,
provides a number of options for delimiters:

* delimit_char     : delimiter independent args
  Defaults to '&'
* delimit_kv_char  : delimiter key-value of independent args
  Defaults to '='
* sub_delimit_char : delimiter independent and dependent args
  Defaults to ':'
* dep_delimit_char : delimiter between key-value of dependent args
  Defaults to '|'
* dep_kv_delimit_char : key-value delimiter for dependent args.
  Defaults to ','

Boolean values ( as part of a key-value pair ) are convert into the stings 'true' or 'false'.

Validation:

As of 1.0, the ability to optionally check the validity of the
Anchor against a schema has been included.  Since we don't expect
the allowable schema to change during run-time, we use a
module configuration to set the schema, like so:

  $uriAnchor.configModule({
    schema_map : {
      page    : { profile : true, pdf : true },
      _page   : {
        uname   : true,
        online  : { 'today','yesterday','earlier' }
      },
      slider  : { confirm : 'deny' },
      _slider : { text : 'goodbye' },
      color   : { red : true, green : true, blue : true }
    }
  });

This check occurs only during setting of the Anchor, not
during its parsing ( See makeAnchorMap )

The replace_flag instructs the routine to replace the uri,
discarding browser history


## method: makeAnchorMap

### Purpose

 Parses URI anchor and returns as map

### Arguments

 none

### Environment

 Expects the document.location browser object

### Settings

 none

### Returns

 Map

### Throws

 none


### Details

Parses the browser URI anchor into a map using the same
rules used to set the anchor in the method setAnchor
( see above ).

This method creates an additional key type, _s_<indendent_arg>
for each independent argument with dependent arguments.

These keys point to a string representation of the independent
argument along with all its dependent arguments.

These values are ignored by setAnchor, but they are useful
for routines using setAnchor to check if a part of the anchor
has changed.

### Example
If the browser URI Anchor looks like this:

    #!page=profile:uname,wendy|online,true&slider=confirm:text,hello\
    |pretty,false&color=red

Then calling $.uriAnchor.makeAnchorMap(); will return a map that looks like so:

    { page : 'profile',
      _page : {
        uname   : 'wendy',
        online  : 'today'
      },
      _s_page : 'profile:uname,wendy|online,today',
      slider  : 'confirm',
      _slider : {
       text   : 'hello',
       pretty : false
      },
      _s_slider : 'confirm:text,hello|pretty,false',
      color : 'red'
    };

