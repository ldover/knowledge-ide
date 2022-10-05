const corsProxy = require('@isomorphic-git/cors-proxy/middleware.js')

const options = {
  insecure_origins: ['http://localhost:1234'] // Dev path
}

const proxy = corsProxy(options)

// Expose the proxy on the "/api/*" endpoint.
export default function (req, res) {
  // Cut off api from url, so we redirect to gitlab not /api/gitlab
  req.url = req.url.replace('/api', '')
  return proxy(req, res);
};
