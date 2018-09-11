var express = require('express');
var router = express.Router();

router.put('/foo', function(req, res) {
    /* 
      do stuff to update the foo resource 
      ...
     */

    // now broadcast the updated foo..
    req.io.sockets.emit('update', foo); 
});

module.exports = router;