const serve = require('koa-static-server');
const koaBody = require('koa-body');
const Koa = require('koa');
const app = new Koa();
const router = require('koa-router')();
const multer = require('koa-multer');
const upload = multer({ dest: 'public/files/' });
const fs = require('fs');
const db = require('./dbs.js');

app.use(koaBody({ multipart: true }));
app
    .use(router.routes())
    .use(router.allowedMethods());
app.use(serve({ rootDir: './public' }));

router.post('/upload', async (ctx) => {
    let p=upload.array();
    let r=await p(ctx);
    console.log(r.request.body);
    let files=r.request.body.files;
    let results=await Promise.all(Object.keys(files).map(x=>{
        let file=files[x];
        let reader = fs.createReadStream(file.path);
        let fPath=`${Date.now()}_${file.name}`;
        let stream = fs.createWriteStream(`public/files/${fPath}`);
        reader.pipe(stream);
        return new Promise((resolve, reject)=>{
            stream.on('finish', ()=>resolve({
                index: x.replace('file_', ''),
                path: fPath
            }));
        });
    }));
    let produced={};
    /*results.forEach(x=>{
        produced[x.index]={
            path: x.path,
            desc: r.request.body.fields['desc_'+x.index]
        };
    });*/


    let fields=r.request.body.fields;
    let keys=Object.keys(r.request.body.fields);
    let descs={};
    keys.filter(x=>x.startsWith('descs')).map(x=>{
        descs[x.replace('descs[','').replace(']','')]=fields[x];
    });
    produced={
        path: results[0].path,
        descs: descs
    }

    db.addNewImage(produced);
    //fs.appendFileSync('results.txt', JSON.stringify(produced)+'\n');
    ctx.body=produced;
});

router.get('/all', async (ctx)=>{
    /*let data=fs.readFileSync('results.txt', 'utf8').trim().split('\n');
    let result=data.filter(x=>x).map(x=>JSON.parse(x));*/
    ctx.body=await db.getAllImages();
});
router.post('/update', async (ctx)=>{
    ctx.request.body=JSON.parse(ctx.request.body);
    console.log(ctx.request.body, ctx.request.body.id);
    ctx.body=await db.updateImageByID(ctx.request.body.produced, ctx.request.body.id);
});

const cfenv = require('cfenv');
const appEnv = cfenv.getAppEnv();
app.listen(appEnv.port, appEnv.bind);