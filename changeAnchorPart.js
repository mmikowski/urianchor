/*
 * changeAnchorPart
 * Example code for changeAnchorPart.
 *
 * I plan to incorporate much of this into
 * the core uriAnchor plugin in the future.
*/

/*jslint         browser : true, continue : true,
  devel  : true, indent  : 2,    maxerr   : 50,
  newcap : true, nomen   : true, plusplus : true,
  regexp : true, sloppy  : true, vars     : false,
  white  : true
*/
/*global $, spa */

var stateMap  = { anchor_map : {} },

  copyAnchorMap, changeAnchorPart,
  onHashchange
  ;

// Begin utility method /copyAnchorMap/
// Returns copy of stored anchor map; minimizes overhead
copyAnchorMap = function () {
  return $.extend( true, {}, stateMap.anchor_map );
};
// End utility method /copyAnchorMap/

// Begin DOM method /changeAnchorPart/
// Purpose    : Changes part of the URI anchor component
// Arguments  :
//   * arg_map - The map describing what part of the URI anchor
//     we want changed.
// Returns    :
//   * true  - the Anchor portion of the URI was updated
//   * false - the Anchor portion of the URI could not be updated
// Actions    :
//   The current anchor rep stored in stateMap.anchor_map.
//   See uriAnchor for a discussion of encoding.
//   This method
//     * Creates a copy of this map using copyAnchorMap().
//     * Modifies the key-values using arg_map.
//     * Manages the distinction between independent
//       and dependent values in the encoding.
//     * Attempts to change the URI using uriAnchor.
//     * Returns true on success, and false on failure.
//
changeAnchorPart = function ( arg_map ) {
  var
    anchor_map_revise = copyAnchorMap(),
    bool_return       = true,
    key_name, key_name_dep;

  // Begin merge changes into anchor map
  KEYVAL:
  for ( key_name in arg_map ) {
    if ( arg_map.hasOwnProperty( key_name ) ) {

      // skip dependent keys during iteration
      if ( key_name.indexOf( '_' ) === 0 ) { continue KEYVAL; }

      // update independent key value
      anchor_map_revise[key_name] = arg_map[key_name];

      // update matching dependent key
      key_name_dep = '_' + key_name;
      if ( arg_map[key_name_dep] ) {
        anchor_map_revise[key_name_dep] = arg_map[key_name_dep];
      }
      else {
        delete anchor_map_revise[key_name_dep];
        delete anchor_map_revise['_s' + key_name_dep];
      }
    }
  }
  // End merge changes into anchor map

  // Begin attempt to update URI; revert if not successful
  try {
    $.uriAnchor.setAnchor( anchor_map_revise );
  }
  catch ( error ) {
    // replace URI with existing state
    $.uriAnchor.setAnchor( stateMap.anchor_map,null,true );
    bool_return = false;
  }
  // End attempt to update URI...

  return bool_return;
};
// End DOM method /changeAnchorPart/

// Begin Event handler /onHashchange/
// Purpose    : Handles the hashchange event
// Arguments  :
//   * event - jQuery event object.
// Settings   : none
// Returns    : false
// Actions    :
//   * Parses the URI anchor component
//   * Compares proposed application state with current
//   * Adjust the application only where proposed state
//     differs from existing and is allowed by anchor schema
//
onHashchange = function ( /*event*/ ) {
  var anchor_prior_map, anchor_proposed_map;
  anchor_prior_map = copyAnchorMap();

  // attempt to parse anchor
  try { anchor_proposed_map = $.uriAnchor.makeAnchorMap(); }
  catch ( error ) {
    $.uriAnchor.setAnchor( anchor_prior_map, null, true );
    return false;
  }
  stateMap.anchor_map = anchor_proposed_map;
};

$('body').on('hashchange', onHashchange );

