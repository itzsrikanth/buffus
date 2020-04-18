# Buffus
When data is read from the filesystem, a copy is cached as Javascript object. The data is served from the cached copy from then on. The data we intend to write is also stored in object memory until explicitly asked by us to save it in disk.

## Usage
### Initialize
```javascript
var _fs = require('buffus').fs;
var fs = new _fs();
```

### API
- existsSync
- readFileSync
- mkdirSync
- writeFileSync
- flushSync:\
  Saves all the write data to disk
- flush:\
  Same functionality as above except in does the work asynchronusly and returns a promise
- clear:\
  Empties the cache
