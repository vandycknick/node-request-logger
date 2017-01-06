let loggerProps = new WeakMap();

class AsyncLoggerZone extends Zone {

    constructor(options, props = {}) {
        super(options);
        loggerProps.set(this, Object.assign({}, props))
    }

    onHandleError(parent, curent, target,error) {
        let logger = AsyncLogger.instance();
        logger.dump();
        console.log(error);
    }

    get(key) {
        const props = loggerProps.get(this);

        if (key in props) {
            return props[key];
        }

        if (this.parent instanceof ZoneWithStorage) {
            return this.parent.get(key);
        }
    }

}

class AsyncLogger {

    static middleware(options = {}) {
        return function(req, res, next) {
            let logger = new AsyncLogger(req);
            let loggerZone = new AsyncLoggerZone(
                {
                    parent: Zone.current,
                    name: `request zone for ${req.url} at time ${Date.now()}`,
                },
                { req, res, logger }
            )

            loggerZone.run(() => next())
            res.on('finish', () => logger.dump())
        };
    }

    static instance() {
        return Zone.current.get('logger');
    }
    
    constructor(req) {
        this.json = {};

        this.json.request = {
            id: req.id,
            url: req.url
        };
    }

    log(msg) {
        let req = Zone.current.get('req');
        this.json.messages = this.json.messages || [];
        this.json.messages.push(`[Log message for reqId(${req.id})]${msg}`);
    }

    api(msg) {
        this.json.api = this.json.api || [];
        this.json.api.push(msg);
    }

    dump() {
        console.log(this.json);
    }
}

module.exports = AsyncLogger;
