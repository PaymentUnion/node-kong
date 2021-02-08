const KongOption = {
  KongHOST: 'http://10.13.16.42:8001',
  service: {
    name: 'svc-oems-view',
    protocol: 'http',
    port: 80,
    connect_timeout: 60000,
    write_timeout: 60000,
    host: 'ups-oems-view'
  },
  route: {
    name: 'oems-view',
    hosts: ['a.b.com'],
    // paths: ['/oems/(?i)'],
    methods: ['POST', 'GET', 'PUT', 'DELETE', 'OPTIONS', 'HEAD', 'TRACE', 'CONNECT'],
    protocols: ['http', 'https'],
    service: {name: 'svc-oems-view'},
    https_redirect_status_code: 302
  },
  upstream: {
    name: 'ups-oems-view',
    'healthchecks': {
      'active': {
        'https_verify_certificate': true,
        'unhealthy': {
          'http_statuses': [429, 404, 500, 501, 502, 503, 504, 505],
          'tcp_failures': 0,
          'timeouts': 0,
          'http_failures': 0,
          'interval': 0
        },
        'http_path': '/server/kong/checkHealth',
        'timeout': 1,
        'healthy': {
          'http_statuses': [200, 302],
          'interval': 0,
          'successes': 0
        },
        'concurrency': 10,
        'type': 'http'
      },
      'passive': {
        'unhealthy': {
          'http_failures': 0,
          'http_statuses': [429, 500, 503],
          'tcp_failures': 0,
          'timeouts': 0
        },
        'type': 'http',
        'healthy': {
          'successes': 0,
          'http_statuses': [200, 201, 202, 203, 204, 205, 206, 207, 208, 226, 300, 301, 302, 303, 304, 305, 306, 307, 308]
        }
      },
      'threshold': 0
    }
  },
  target: {
    target: 'svc-oems-view.payfun:1424',
    weight: 100,
    upstream: ''
  }
}

// import {KongRegister} from '../dist/payfun.ops'
const {KongRegister} = require('../dist/payfun.kong.min')

KongRegister(KongOption)
