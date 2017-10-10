let currImageIndex=0;
const LOAD_API_PLACEHOLDER=(elem)=>{
    let galleria=$('#galleria').data('galleria');
    let index=galleria.getIndex();
    galleria._data[index].description=`Let's make new<br>
    multiline
    description from API!`;
    galleria.setInfo(index);
    console.log(elem.src);
}

fetch('/all').then(x=>x.json()).then(data=>{
    console.log(data);

    document.querySelector('#galleria').innerHTML='';
    let source=[];

    Object.keys(data).map(y=>{
        let item=data[y];
        source.push({
            image: `files/${item.path}`,
            title: `${item.path}`,
            descs: item.descs,
            id: item._id
        });
    });
    
    /*data.map(x=>{
        Object.keys(x).map(y=>{
            let item=x[y];
            //let template=`<img class="imageBlock" src="files/${item.path}" data-title="${item.path}" data-description="${item.desc}">`;
            source.push({
                image: `files/${item.path}`,
                title: `${item.path}`,
                description: `${item.desc}`
            })
            //document.querySelector('#galleria').innerHTML+=template;
        });
    }) */




    
    Galleria.loadTheme('js/themes/classic/galleria.classic.min.js');
    Galleria.configure({ _toggleInfo: false });
    Galleria.run('#galleria', {
        dataSource: source
    });
   
    Galleria.on('image', function(e) {
        let index=this.getIndex();
        let descs=this._data[index].descs;
        let keys=Object.keys(descs);
        keys.forEach(x=>{
            let desc=descs[x];
            document.querySelector(`[data-name="${x}"]`).value=desc;
        })
        descsWrapper
    });
    

    $('#updateFields').on('click', function(){
        let galleria=$('#galleria').data('galleria');
        let index=galleria.getIndex();

        
        let descs={};
        let textareas=Array.from(document.querySelectorAll('.customArea'));
        textareas.forEach((x,i)=>descs[`${x.getAttribute('data-name')}`]=x.value);
        galleria._data[index].descs=descs;
        fetch('/update', {
            method: 'POST',
            body: JSON.stringify({
                produced: {
                    path: galleria._data[index].title,
                    descs: galleria._data[index].descs
                },
                id: galleria._data[index].id
            })
        }).then(x=>x.json()).then(x=>{
            console.log(x);
        });
        console.log(galleria._data[index].id);
    });
    $('body').on('click', '.galleria-image img', function(){
        LOAD_API_PLACEHOLDER(this);
    });
});