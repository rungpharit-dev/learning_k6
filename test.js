import http from 'k6/http';
import { sleep,check } from 'k6';
import { Rate } from 'k6/metrics'; 

const failure = new Rate('failed request');

export const options = {
  vus:10,
  duration:'10s',
  thresholds : {
    failed_requests:['rate<=0'],
    http_req_duration : ['p(95)<500']
  }
}

export default function () {
  const result = http.get('http://test.k6.io');
  check(result,{
    'http response status code is 200' : r => r.status === 200, 
  })
  failure.add(result.status !== 200);
}
