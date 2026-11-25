import {createReadStream} from 'node:fs';
import {stat} from 'node:fs/promises';
import {createServer} from 'node:http';
import {extname,relative,resolve,sep,isAbsolute} from 'node:path';
import {fileURLToPath} from 'node:url';

const repositoryRoot=resolve(fileURLToPath(new URL('..',import.meta.url)));
const port=Number(process.env.WONDERVALE_ALPHA_PORT||4174);
const contentTypes={
  '.css':'text/css; charset=utf-8',
  '.html':'text/html; charset=utf-8',
  '.js':'text/javascript; charset=utf-8',
  '.json':'application/json; charset=utf-8',
  '.mjs':'text/javascript; charset=utf-8',
  '.svg':'image/svg+xml',
  '.webmanifest':'application/manifest+json; charset=utf-8',
  '.webp':'image/webp',
  '.png':'image/png'
};

const server=createServer(async(request,response)=>{
  if(request.method!=='GET'&&request.method!=='HEAD'){
    response.writeHead(405,{'Allow':'GET, HEAD'}).end('Method not allowed');
    return;
  }
  let target;
  try{
    const pathname=decodeURIComponent(new URL(request.url||'/',`http://127.0.0.1:${port}`).pathname);
    target=resolve(repositoryRoot,`.${pathname}`);
    const pathFromRoot=relative(repositoryRoot,target);
    if(pathFromRoot==='..'||pathFromRoot.startsWith(`..${sep}`)||isAbsolute(pathFromRoot)){
      response.writeHead(403).end('Forbidden');
      return;
    }
    const info=await stat(target);
    if(info.isDirectory())target=resolve(target,'index.html');
    const fileInfo=await stat(target);
    if(!fileInfo.isFile())throw new Error('Not a file');
  }catch{
    response.writeHead(404,{'Cache-Control':'no-store'}).end('Not found');
    return;
  }
  response.writeHead(200,{
    'Cache-Control':'no-store',
    'Content-Length':String((await stat(target)).size),
    'Content-Type':contentTypes[extname(target).toLowerCase()]||'application/octet-stream',
    'X-Content-Type-Options':'nosniff'
  });
  if(request.method==='HEAD')response.end();
  else createReadStream(target).pipe(response);
});

server.listen(port,'127.0.0.1',()=>{
  console.log(`Noncanonical Season 1 Alpha: http://127.0.0.1:${port}/season-alpha/`);
  console.log('This loopback-only server uses a separate origin from the production save.');
});
