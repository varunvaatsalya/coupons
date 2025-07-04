export function GET(request) {
  const country = request.headers.get('x-vercel-ip-country');
  const region = request.headers.get('x-vercel-ip-country-region');
  const continent = request.headers.get('x-vercel-ip-continent');
  return new Response(`Continent: ${continent}, Country: ${country}, Region: ${region}`);
}